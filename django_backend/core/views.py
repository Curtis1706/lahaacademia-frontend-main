from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from django.utils import timezone as dj_timezone
from datetime import timedelta
import secrets
from .models import *
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from .serializers import *
import uuid
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from datetime import datetime
from django.utils.timezone import make_aware
from django.utils import timezone as dj_timezone
from datetime import timedelta
import secrets

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouvel utilisateur"""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data.get('password'))
            user.referral_code = str(uuid.uuid4())[:8].upper()
            user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Connexion utilisateur"""
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'message': 'Connexion réussie', 'user': UserSerializer(user).data, 'token': token.key})
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retourne l'utilisateur authentifié"""
        return Response(UserSerializer(request.user).data)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouvel élève"""
        serializer = StudentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        """Obtenir la progression d'un élève"""
        student = self.get_object()
        progress = Progress.objects.filter(student=student)
        return Response(ProgressSerializer(progress, many=True).data)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouvel enseignant"""
        serializer = TeacherRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            teacher = serializer.save()
            return Response(TeacherSerializer(teacher).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public_list(self, request):
        """Liste publique des professeurs pour réservation"""
        # Pour le développement, incluons tous les professeurs
        # En production, on filtrera par is_validated=True
        teachers = Teacher.objects.all()
        return Response(TeacherSerializer(teachers, many=True).data)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer les informations du professeur connecté"""
        try:
            teacher = Teacher.objects.get(user=request.user)
            return Response(TeacherSerializer(teacher).data)
        except Teacher.DoesNotExist:
            return Response({'error': 'Professeur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def courses(self, request, pk=None):
        """Récupérer les cours d'un professeur"""
        teacher = self.get_object()
        courses = Course.objects.filter(created_by=teacher.user, is_active=True)
        return Response(CourseSerializer(courses, many=True).data)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def availability(self, request, pk=None):
        """Renvoie les créneaux de disponibilité normalisés"""
        teacher = self.get_object()
        schedule = teacher.availability_schedule or {}
        normalized = []
        if isinstance(schedule, dict):
            for day, slots in schedule.items():
                norm_slots = []
                if isinstance(slots, list):
                    for slot in slots:
                        start = slot.get('start')
                        end = slot.get('end')
                        if start and end:
                            norm_slots.append({'start': start, 'end': end})
                normalized.append({'day': day, 'slots': norm_slots})
        return Response({'availability': normalized})

    @action(detail=True, methods=['get'])
    def sessions(self, request, pk=None):
        """Obtenir les sessions d'un enseignant"""
        teacher = self.get_object()
        sessions = Session.objects.filter(teacher=teacher)
        return Response(SessionSerializer(sessions, many=True).data)

    @action(detail=True, methods=['get'])
    def earnings(self, request, pk=None):
        """Obtenir les revenus d'un enseignant"""
        teacher = self.get_object()
        return Response({
            'total_earnings': teacher.total_earnings,
            'total_sessions': teacher.total_sessions,
            'average_rating': teacher.average_rating
        })

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouvel auteur"""
        serializer = AuthorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            author = serializer.save()
            return Response(AuthorSerializer(author).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def content(self, request, pk=None):
        """Obtenir le contenu d'un auteur"""
        author = self.get_object()
        return Response({
            'total_content_published': author.total_content_published,
            'total_answers': author.total_answers,
            'average_rating': author.average_rating,
            'featured_content': author.featured_content
        })

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _get_parent_or_none(self, user):
        try:
            # Utiliser le bon nom de relation selon votre modèle
            return Parent.objects.get(user=user)
        except Parent.DoesNotExist:
            return None

    def _get_student_or_none(self, user):
        try:
            return Student.objects.get(user=user)
        except Student.DoesNotExist:
            return None

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        """Retourne le parent courant avec ses enfants."""
        parent = self._get_parent_or_none(request.user)
        if parent is None:
            return Response({'error': 'Aucun profil parent pour cet utilisateur'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ParentSerializer(parent).data)

    @action(detail=False, methods=['post'])
    def invite(self, request):
        """Parent -> créer une invitation de liaison pour un enfant (email)."""
        try:
            parent = self._get_parent_or_none(request.user)
            if parent is None:
                return Response({'error': 'Profil parent requis'}, status=status.HTTP_403_FORBIDDEN)
            
            child_email = request.data.get('child_email')
            if not child_email:
                return Response({'error': 'child_email est requis'}, status=status.HTTP_400_BAD_REQUEST)
            
            code = secrets.token_hex(4).upper()  # 8 chars
            expires_at = dj_timezone.now() + timedelta(days=7)
            
            req = ParentChildLinkRequest.objects.create(
                parent=parent, 
                child_email=child_email, 
                code=code, 
                expires_at=expires_at
            )
            
            return Response(ParentChildLinkRequestSerializer(req).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'error': f'Erreur interne: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def student_accept(self, request):
        """Élève -> saisir un code d'invitation reçu et accepter."""
        code = request.data.get('code')
        if not code:
            return Response({'error': 'code requis'}, status=status.HTTP_400_BAD_REQUEST)
        student = self._get_student_or_none(request.user)
        if student is None:
            return Response({'error': 'Profil élève requis'}, status=status.HTTP_403_FORBIDDEN)
        try:
            req = ParentChildLinkRequest.objects.get(code=code)
        except ParentChildLinkRequest.DoesNotExist:
            return Response({'error': 'Invitation introuvable'}, status=status.HTTP_404_NOT_FOUND)
        if req.status not in ['pending']:
            return Response({'error': 'Invitation déjà utilisée ou invalide'}, status=status.HTTP_400_BAD_REQUEST)
        if req.expires_at < dj_timezone.now():
            req.status = 'expired'
            req.save()
            return Response({'error': 'Invitation expirée'}, status=status.HTTP_400_BAD_REQUEST)
        req.student = student
        req.status = 'accepted'  # Approbation automatique
        req.save()
        
        # Ajouter l'élève automatiquement à la liste des enfants du parent
        req.parent.children.add(student)
        
        return Response({
            'message': 'Liaison parent-enfant confirmée automatiquement',
            'parent_name': f"{req.parent.user.first_name} {req.parent.user.last_name}",
            'status': 'accepted'
        })

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Parent -> approuver une invitation après acceptation par l'élève."""
        parent = self._get_parent_or_none(request.user)
        if parent is None:
            return Response({'error': 'Profil parent requis'}, status=status.HTTP_403_FORBIDDEN)
        try:
            req = ParentChildLinkRequest.objects.get(id=pk, parent=parent)
        except ParentChildLinkRequest.DoesNotExist:
            return Response({'error': 'Invitation introuvable'}, status=status.HTTP_404_NOT_FOUND)
        if req.status != 'student_accepted' or req.student is None:
            return Response({'error': "L'élève n'a pas encore accepté"}, status=status.HTTP_400_BAD_REQUEST)
        parent.children.add(req.student)
        req.status = 'accepted'
        req.save()
        return Response({'message': "Il est maintenant considéré comme votre enfant sur Lahacadémia"})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        parent = self._get_parent_or_none(request.user)
        if parent is None:
            return Response({'error': 'Profil parent requis'}, status=status.HTTP_403_FORBIDDEN)
        try:
            req = ParentChildLinkRequest.objects.get(id=pk, parent=parent)
        except ParentChildLinkRequest.DoesNotExist:
            return Response({'error': 'Invitation introuvable'}, status=status.HTTP_404_NOT_FOUND)
        req.status = 'rejected'
        req.save()
        return Response({'message': 'Invitation rejetée'})

    # Endpoints conviviaux: /parents/invitations/{id}/approve|reject
    @action(detail=False, methods=['post'], url_path=r'invitations/(?P<inv_id>[^/.]+)/approve')
    def invitation_approve(self, request, inv_id=None):
        try:
            parent = self._get_parent_or_none(request.user)
            if parent is None:
                return Response({'error': 'Profil parent requis'}, status=status.HTTP_403_FORBIDDEN)
            req = ParentChildLinkRequest.objects.get(id=inv_id, parent=parent)
            if req.status != 'student_accepted' or req.student is None:
                return Response({'error': "L'élève n'a pas encore accepté"}, status=status.HTTP_400_BAD_REQUEST)
            parent.children.add(req.student)
            req.status = 'accepted'
            req.save()
            return Response({'message': "Il est maintenant considéré comme votre enfant sur Lahacadémia"})
        except ParentChildLinkRequest.DoesNotExist:
            return Response({'error': 'Invitation introuvable'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Erreur interne: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path=r'invitations/(?P<inv_id>[^/.]+)/reject')
    def invitation_reject(self, request, inv_id=None):
        try:
            parent = self._get_parent_or_none(request.user)
            if parent is None:
                return Response({'error': 'Profil parent requis'}, status=status.HTTP_403_FORBIDDEN)
            req = ParentChildLinkRequest.objects.get(id=inv_id, parent=parent)
            req.status = 'rejected'
            req.save()
            return Response({'message': 'Invitation rejetée'})
        except ParentChildLinkRequest.DoesNotExist:
            return Response({'error': 'Invitation introuvable'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Erreur interne: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouveau parent"""
        serializer = ParentRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            parent = serializer.save()
            return Response(ParentSerializer(parent).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def children_progress(self, request, pk=None):
        """Obtenir la progression des enfants d'un parent"""
        parent = self.get_object()
        children = parent.children.all()
        progress_data = []
        
        for child in children:
            progress = Progress.objects.filter(student=child)
            progress_data.append({
                'child': StudentSerializer(child).data,
                'progress': ProgressSerializer(progress, many=True).data
            })
        
        return Response(progress_data)

    @action(detail=True, methods=['post'])
    def add_child(self, request, pk=None):
        """Ajouter un enfant à un parent"""
        parent = self.get_object()
        student_id = request.data.get('student_id')
        
        try:
            student = Student.objects.get(id=student_id)
            parent.children.add(student)
            return Response({'message': 'Enfant ajouté avec succès'})
        except Student.DoesNotExist:
            return Response({'error': 'Élève non trouvé'}, status=status.HTTP_404_NOT_FOUND)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Automatiquement assigner l'utilisateur connecté comme créateur du cours"""
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        """Vérifier que seul le créateur peut modifier le cours"""
        course = self.get_object()
        if course.created_by != self.request.user:
            raise PermissionDenied("Vous ne pouvez modifier que vos propres cours")
        serializer.save()

    def perform_destroy(self, instance):
        """Vérifier que seul le créateur peut supprimer le cours"""
        if instance.created_by != self.request.user:
            raise PermissionDenied("Vous ne pouvez supprimer que vos propres cours")
        instance.delete()

    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        subject = self.request.query_params.get('subject', None)
        level = self.request.query_params.get('level', None)
        country = self.request.query_params.get('country', None)
        difficulty = self.request.query_params.get('difficulty', None)
        
        if subject:
            queryset = queryset.filter(subject=subject)
        if level:
            queryset = queryset.filter(level=level)
        if country:
            queryset = queryset.filter(country=country)
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
            
        return queryset

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def availabilities(self, request, pk=None):
        """Récupérer les disponibilités d'un cours"""
        course = self.get_object()
        availabilities = CourseAvailability.objects.filter(course=course, is_active=True)
        return Response(CourseAvailabilitySerializer(availabilities, many=True).data)


class CourseAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = CourseAvailability.objects.all()
    serializer_class = CourseAvailabilitySerializer
    permission_classes = [permissions.AllowAny]  # Temporaire pour debug

    def create(self, request, *args, **kwargs):
        """Créer un créneau de disponibilité pour un cours.
        Nous validons explicitement le rôle utilisateur et assignons
        le cours et le professeur pour éviter les erreurs 500.
        """
        try:
            if not request.user.is_authenticated:
                return Response({'error': 'Authentification requise'}, status=status.HTTP_401_UNAUTHORIZED)

            if getattr(request.user, 'role', None) != 'teacher':
                return Response({'error': 'Seuls les professeurs peuvent créer des disponibilités'}, status=status.HTTP_403_FORBIDDEN)

            try:
                teacher = Teacher.objects.get(user=request.user)
            except Teacher.DoesNotExist:
                return Response({'error': 'Profil professeur introuvable'}, status=status.HTTP_403_FORBIDDEN)

            course_id = request.data.get('course') or request.query_params.get('course')
            if not course_id:
                return Response({'error': 'Champ "course" requis'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)

            # Normaliser les données d'entrée (éviter '' sur DateField)
            incoming = request.data.copy()
            if 'specific_date' in incoming and (incoming.get('specific_date') is None or str(incoming.get('specific_date')).strip() == ''):
                incoming['specific_date'] = None

            # Si une date spécifique est fournie, on autorise n'importe quel day_of_week
            serializer = self.get_serializer(data=incoming)
            try:
                serializer.is_valid(raise_exception=True)
            except ValidationError as ve:
                return Response({'error': 'Données invalides', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            try:
                availability = serializer.save(teacher=teacher, course=course)
            except IntegrityError:
                return Response({'error': 'Un créneau identique existe déjà pour ce jour/heure'}, status=status.HTTP_409_CONFLICT)

            # Retourner la donnée complète (avec cours et professeur sérialisés)
            output = self.get_serializer(availability).data
            headers = self.get_success_headers(output)
            return Response(output, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as exc:
            # S'assurer qu'une erreur inattendue ne devient pas silencieuse
            return Response({'error': f'Erreur interne: {str(exc)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        """Automatiquement assigner le professeur connecté"""
        print(f"🔍 Utilisateur connecté: {self.request.user}")
        print(f"🔍 User authenticated: {self.request.user.is_authenticated}")
        print(f"🔍 User role: {self.request.user.role if hasattr(self.request.user, 'role') else 'Unknown'}")
        
        # Récupérer le professeur connecté
        try:
            if not self.request.user.is_authenticated:
                print("❌ Utilisateur non authentifié")
                raise PermissionDenied("Authentification requise")
            
            # Vérifier que l'utilisateur a le rôle professeur
            if hasattr(self.request.user, 'role') and self.request.user.role != 'teacher':
                print(f"❌ Utilisateur avec rôle '{self.request.user.role}' tente de créer une disponibilité")
                raise PermissionDenied(f"Seuls les professeurs peuvent créer des disponibilités. Votre rôle actuel: {self.request.user.role}")
                
            teacher = Teacher.objects.get(user=self.request.user)
            print(f"✅ Professeur trouvé: {teacher}")
            # NB: le champ course est injecté dans create() pour garantir la validité
            serializer.save(teacher=teacher)
        except Teacher.DoesNotExist:
            print(f"❌ Aucun profil professeur pour l'utilisateur: {self.request.user}")
            raise PermissionDenied("Seuls les professeurs peuvent créer des disponibilités")

    def perform_update(self, serializer):
        """Vérifier que seul le créateur peut modifier la disponibilité"""
        availability = self.get_object()
        if availability.teacher.user != self.request.user:
            raise PermissionDenied("Vous ne pouvez modifier que vos propres disponibilités")
        serializer.save()

    def perform_destroy(self, instance):
        """Vérifier que seul le créateur peut supprimer la disponibilité"""
        if instance.teacher.user != self.request.user:
            raise PermissionDenied("Vous ne pouvez supprimer que vos propres disponibilités")
        instance.delete()

    def get_queryset(self):
        """Filtrer les disponibilités selon les paramètres"""
        queryset = CourseAvailability.objects.filter(is_active=True)
        course_id = self.request.query_params.get('course', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['get'])
    def enrollments(self, request, pk=None):
        """Obtenir les inscriptions à un cours"""
        course = self.get_object()
        enrollments = Progress.objects.filter(course=course)
        return Response(ProgressSerializer(enrollments, many=True).data)

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre une session"""
        session = self.get_object()
        student_id = request.data.get('student_id')
        
        try:
            student = Student.objects.get(id=student_id)
            if student in session.students.all():
                return Response({'error': 'Déjà inscrit'}, status=status.HTTP_400_BAD_REQUEST)
            
            session.students.add(student)
            session.current_enrollment += 1
            session.save()
            return Response({'message': 'Inscription réussie'})
        except Student.DoesNotExist:
            return Response({'error': 'Élève non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """Obtenir les participants d'une session"""
        session = self.get_object()
        return Response(StudentSerializer(session.students.all(), many=True).data)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student)

    @action(detail=False, methods=['post'], url_path='reserve', permission_classes=[IsAuthenticated])
    def reserve(self, request):
        """Réserver une session pour un élève (étudiant lui-même ou enfant d'un parent)."""
        print(f"🔍 Données reçues pour réservation: {request.data}")
        
        teacher_id = request.data.get('teacher_id')
        course_id = request.data.get('course_id')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        student_id = request.data.get('student_id')
        
        print(f"📋 Paramètres extraits:")
        print(f"  - teacher_id: {teacher_id} (type: {type(teacher_id)})")
        print(f"  - course_id: {course_id} (type: {type(course_id)})")  
        print(f"  - start_time: {start_time} (type: {type(start_time)})")
        print(f"  - end_time: {end_time} (type: {type(end_time)})")
        print(f"  - student_id: {student_id} (type: {type(student_id)})")

        if not all([teacher_id, start_time, end_time]):
            return Response({'error': 'teacher_id, start_time et end_time sont requis'}, status=status.HTTP_400_BAD_REQUEST)

        # Déterminer l'élève
        user = request.user
        if hasattr(user, 'student') and user.student:
            student = user.student
        elif hasattr(user, 'parent') and user.parent:
            if not student_id:
                return Response({'error': 'student_id est requis pour les parents'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                s = Student.objects.get(id=student_id)
                if s not in user.parent.children.all():
                    return Response({'error': "Cet élève n'est pas associé à ce parent"}, status=status.HTTP_403_FORBIDDEN)
                student = s
            except Student.DoesNotExist:
                return Response({'error': 'Élève introuvable'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)

        # Récupérer teacher & course
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Response({'error': 'Professeur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        course = None
        if course_id:
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return Response({'error': 'Cours introuvable'}, status=status.HTTP_404_NOT_FOUND)

        # Parse datetime ISO avec support des différents formats
        try:
            if isinstance(start_time, str):
                # Supporter les formats avec et sans 'Z'
                start_clean = start_time.replace('Z', '+00:00') if start_time.endswith('Z') else start_time
                st = datetime.fromisoformat(start_clean)
                if st.tzinfo is None:
                    st = make_aware(st)
            else:
                st = start_time
                
            if isinstance(end_time, str):
                end_clean = end_time.replace('Z', '+00:00') if end_time.endswith('Z') else end_time
                et = datetime.fromisoformat(end_clean)
                if et.tzinfo is None:
                    et = make_aware(et)
            else:
                et = end_time
                
            print(f"🕐 Dates parsées: {st} → {et}")
            
        except Exception as e:
            print(f"❌ Erreur parsing dates: {e}")
            print(f"📅 start_time reçu: {start_time}")
            print(f"📅 end_time reçu: {end_time}")
            return Response({
                'error': 'Format de date invalide (ISO requis)', 
                'received_start': str(start_time),
                'received_end': str(end_time),
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Collision simple
        overlap = Session.objects.filter(teacher=teacher, start_time__lt=et, end_time__gt=st, status__in=['scheduled','ongoing']).first()
        if overlap and overlap.current_enrollment >= overlap.max_capacity:
            return Response({'error': 'Créneau déjà complet'}, status=status.HTTP_409_CONFLICT)

        session = overlap
        if session is None:
            session = Session.objects.create(
                course=course,
                teacher=teacher,
                start_time=st,
                end_time=et,
                status='scheduled',
                session_type='group',
                max_capacity=getattr(teacher, 'max_students_per_session', 10) or 10,
                current_enrollment=0,
            )

        if student in session.students.all():
            return Response({'error': 'Déjà inscrit'}, status=status.HTTP_400_BAD_REQUEST)

        session.students.add(student)
        session.current_enrollment += 1
        session.save()

        booking = Booking.objects.create(
            student=student,
            teacher=teacher,
            session=session,
            status='confirmed',
            payment_status='pending',
        )

        Notification.objects.create(user=user, title='Réservation confirmée', message=f'Session avec {teacher.user.first_name}', notification_type='booking')
        Notification.objects.create(user=teacher.user, title='Nouvelle réservation', message=f'{student.user.first_name} a réservé une session', notification_type='booking')

        # Réponse enrichie avec tous les détails de la réservation
        response_data = {
            'booking_id': str(booking.id),
            'session_id': str(session.id),
            'booking_reference': f'REF-{str(booking.id)[:8].upper()}',
            'status': 'confirmed',
            'student': {
                'id': student.id,
                'name': f'{student.user.first_name} {student.user.last_name}',
                'email': student.user.email
            },
            'teacher': {
                'id': teacher.id,
                'name': f'{teacher.user.first_name} {teacher.user.last_name}',
                'email': teacher.user.email
            },
            'course': {
                'id': course.id if course else None,
                'name': course.title if course else 'Session individuelle',
                'description': course.description if course else None
            },
            'session': {
                'start_time': session.start_time.isoformat(),
                'end_time': session.end_time.isoformat(),
                'type': session.session_type,
                'max_capacity': session.max_capacity,
                'current_enrollment': session.current_enrollment
            },
            'message': 'Réservation confirmée avec succès'
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler une réservation"""
        booking = self.get_object()
        if booking.student.user != request.user:
            return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Réservation annulée'})

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if hasattr(self.request.user, 'student'):
            return Progress.objects.filter(student=self.request.user.student)
        return Progress.objects.none()

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        """Mettre à jour la progression d'un cours"""
        course_id = request.data.get('course_id')
        progress_percentage = request.data.get('progress_percentage')
        time_spent = request.data.get('time_spent', 0)
        
        if not hasattr(self.request.user, 'student'):
            return Response({'error': 'Utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        progress, created = Progress.objects.get_or_create(
            student=self.request.user.student,
            course_id=course_id,
            defaults={'progress_percentage': progress_percentage, 'time_spent': time_spent}
        )
        
        if not created:
            progress.progress_percentage = progress_percentage
            progress.time_spent += time_spent
            progress.save()
        
        return Response(ProgressSerializer(progress).data)

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marquer une notification comme lue"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marquée comme lue'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Obtenir le nombre de notifications non lues"""
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})



