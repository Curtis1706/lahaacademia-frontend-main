from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAdminUser
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
        """Liste publique des enseignants pour réservation"""
        # Pour le développement, incluons tous les enseignants
        # En production, on filtrera par is_validated=True
        teachers = Teacher.objects.all()
        return Response(TeacherSerializer(teachers, many=True).data)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer les informations de l'enseignant connecté"""
        try:
            teacher = Teacher.objects.get(user=request.user)
            return Response(TeacherSerializer(teacher).data)
        except Teacher.DoesNotExist:
            return Response({'error': 'Enseignant non trouvé'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='available-for-booking', permission_classes=[AllowAny])
    def available_for_booking(self, request):
        """Récupérer les enseignants disponibles pour la réservation"""
        from django.db import models
        
        # Récupérer TOUS les enseignants actifs (temporairement sans validation)
        teachers = Teacher.objects.filter(
            user__is_active=True
        )
        
        # Appliquer des filtres
        subject = request.query_params.get('subject')
        country = request.query_params.get('country')
        search = request.query_params.get('search')
        min_rating = request.query_params.get('min_rating')
        max_price = request.query_params.get('max_price')
        
        if subject and subject != 'all':
            teachers = teachers.filter(subjects__contains=[subject])
        if country and country != 'all':
            teachers = teachers.filter(user__student__country__icontains=country)
        if search:
            teachers = teachers.filter(
                models.Q(user__first_name__icontains=search) |
                models.Q(user__last_name__icontains=search) |
                models.Q(bio__icontains=search)
            )
        if min_rating:
            try:
                min_rating = float(min_rating)
                teachers = teachers.filter(average_rating__gte=min_rating)
            except ValueError:
                pass
        if max_price:
            try:
                max_price = float(max_price)
                teachers = teachers.filter(hourly_rate__lte=max_price)
            except ValueError:
                pass
        
        # Optimisation des requêtes
        teachers = teachers.select_related('user').prefetch_related('user__course_set')
        
        # Préparer les données enrichies
        enriched_teachers = []
        for teacher in teachers:
            teacher_data = {
                'id': teacher.id,
                'name': f"{teacher.user.first_name} {teacher.user.last_name}",
                'avatar': teacher.profile_photo.url if teacher.profile_photo else None,
                'subjects': teacher.subjects,
                'rating': teacher.average_rating,
                'experience': f"{teacher.experience_years} ans",
                'hourly_rate': float(teacher.hourly_rate),
                'country': getattr(teacher.user.student, 'country', 'Non spécifié') if hasattr(teacher.user, 'student') else 'Non spécifié',
                'total_students': teacher.total_students,
                'total_sessions': teacher.total_sessions,
                'bio': teacher.bio,
                'specializations': teacher.specializations,
                'certifications': teacher.certifications
            }
            enriched_teachers.append(teacher_data)
        
        return Response({
            'teachers': enriched_teachers,
            'total': len(enriched_teachers),
            'filters_applied': {
                'subject': subject,
                'country': country,
                'search': search,
                'min_rating': min_rating,
                'max_price': max_price
            }
        })

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
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def validate(self, request, pk=None):
        """Valider un professeur"""
        teacher = self.get_object()
        
        if teacher.is_validated:
            return Response(
                {'error': 'Ce professeur est déjà validé'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        teacher.is_validated = True
        teacher.validation_date = dj_timezone.now()
        teacher.validated_by = request.user
        teacher.save()
        
        # Créer notification
        Notification.objects.create(
            user=teacher.user,
            title='Compte validé ✅',
            message='Félicitations ! Votre compte professeur a été validé. Vous pouvez maintenant créer des cours et accepter des réservations.',
            notification_type='validation',
            priority='high'
        )
        
        # Log de l'action
        try:
            from admin_panel.models import ActivityLog
            ActivityLog.objects.create(
                user=request.user,
                action='validate_teacher',
                entity_type='Teacher',
                entity_id=teacher.id,
                details={
                    'teacher_name': f"{teacher.user.first_name} {teacher.user.last_name}",
                    'teacher_email': teacher.user.email
                }
            )
        except ImportError:
            pass  # Si admin_panel n'est pas encore migré
        
        return Response({
            'status': 'validated',
            'teacher': TeacherSerializer(teacher).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """Rejeter un professeur"""
        teacher = self.get_object()
        reason = request.data.get('reason', 'Non spécifié')
        
        # Créer notification
        Notification.objects.create(
            user=teacher.user,
            title='Compte rejeté',
            message=f'Votre demande de compte professeur a été rejetée. Raison: {reason}',
            notification_type='validation',
            priority='high'
        )
        
        # Log
        try:
            from admin_panel.models import ActivityLog
            ActivityLog.objects.create(
                user=request.user,
                action='reject_teacher',
                entity_type='Teacher',
                entity_id=teacher.id,
                details={
                    'reason': reason,
                    'teacher_email': teacher.user.email
                }
            )
        except ImportError:
            pass
        
        # Optionnel: désactiver le compte
        teacher.user.is_active = False
        teacher.user.save()
        
        return Response({'status': 'rejected'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """Liste des professeurs en attente de validation"""
        teachers = Teacher.objects.filter(is_validated=False, user__is_active=True)
        return Response({
            'count': teachers.count(),
            'teachers': TeacherSerializer(teachers, many=True).data
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

    @action(detail=False, methods=['get'], url_path='available-courses')
    def available_courses(self, request):
        """Obtenir les cours disponibles pour les élèves"""
        # Filtrer les cours actifs
        courses = Course.objects.filter(is_active=True)
        
        # Appliquer des filtres optionnels
        subject = request.query_params.get('subject')
        level = request.query_params.get('level')
        country = request.query_params.get('country')
        difficulty = request.query_params.get('difficulty')
        
        if subject:
            courses = courses.filter(subject__icontains=subject)
        if level:
            courses = courses.filter(level__icontains=level)
        if country:
            courses = courses.filter(country__icontains=country)
        if difficulty:
            courses = courses.filter(difficulty_level=difficulty)
        
        # Inclure les informations sur les professeurs et disponibilités
        courses = courses.select_related('created_by').prefetch_related('availabilities')
        
        # Sérialiser avec des informations enrichies
        from .serializers import CourseSerializer
        serializer = CourseSerializer(courses, many=True, context={'request': request})
        
        return Response({
            'courses': serializer.data,
            'total': courses.count(),
            'filters_applied': {
                'subject': subject,
                'level': level,
                'country': country,
                'difficulty': difficulty
            }
        })

    @action(detail=True, methods=['get'], url_path='availabilities')
    def course_availabilities(self, request, pk=None):
        """Récupérer les disponibilités d'un cours"""
        course = self.get_object()
        availabilities = CourseAvailability.objects.filter(course=course, is_active=True)
        return Response(CourseAvailabilitySerializer(availabilities, many=True).data)

    @action(detail=False, methods=['get'], url_path='courses-with-teachers', permission_classes=[AllowAny])
    def courses_with_teachers(self, request):
        """Récupérer les cours avec les détails des professeurs pour la réservation"""
        from django.db import models
        
        # Récupérer les cours actifs
        courses = Course.objects.filter(is_active=True)
        
        # Appliquer des filtres
        subject = request.query_params.get('subject')
        level = request.query_params.get('level')
        country = request.query_params.get('country')
        search = request.query_params.get('search')
        
        if subject and subject != 'all':
            courses = courses.filter(subject=subject)
        if level and level != 'all':
            courses = courses.filter(level=level)
        if country and country != 'all':
            courses = courses.filter(country=country)
        if search:
            courses = courses.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search)
            )
        
        # Optimisation des requêtes
        courses = courses.select_related('created_by').prefetch_related(
            'availabilities__teacher__user'
        )
        
        # Préparer les données enrichies
        enriched_courses = []
        for course in courses:
            course_data = CourseSerializer(course).data
            
            # Récupérer les professeurs disponibles pour ce cours
            availabilities = CourseAvailability.objects.filter(
                course=course, 
                is_active=True
            ).select_related('teacher', 'teacher__user')
            
            teachers = []
            for availability in availabilities:
                teacher = availability.teacher
                teacher_data = {
                    'id': teacher.id,
                    'name': f"{teacher.user.first_name} {teacher.user.last_name}",
                    'avatar': teacher.profile_photo.url if teacher.profile_photo else None,
                    'rating': teacher.average_rating,
                    'experience': f"{teacher.experience_years} ans",
                    'hourly_rate': float(teacher.hourly_rate),
                    'subjects': teacher.subjects,
                    'country': getattr(teacher.user.student, 'country', 'Non spécifié') if hasattr(teacher.user, 'student') else 'Non spécifié',
                    'total_students': teacher.total_students,
                    'total_sessions': teacher.total_sessions,
                    'bio': teacher.bio,
                    'availability_id': availability.id,
                    'day_of_week': availability.day_of_week,
                    'start_time': availability.start_time,
                    'end_time': availability.end_time
                }
                teachers.append(teacher_data)
            
            # Ajouter les informations du professeur principal (créateur du cours)
            if course.created_by and hasattr(course.created_by, 'teacher'):
                main_teacher = course.created_by.teacher
                main_teacher_data = {
                    'id': main_teacher.id,
                    'name': f"{main_teacher.user.first_name} {main_teacher.user.last_name}",
                    'avatar': main_teacher.profile_photo.url if main_teacher.profile_photo else None,
                    'rating': main_teacher.average_rating,
                    'experience': f"{main_teacher.experience_years} ans",
                    'hourly_rate': float(main_teacher.hourly_rate),
                    'subjects': main_teacher.subjects,
                    'country': getattr(main_teacher.user.student, 'country', 'Non spécifié') if hasattr(main_teacher.user, 'student') else 'Non spécifié',
                    'total_students': main_teacher.total_students,
                    'total_sessions': main_teacher.total_sessions,
                    'bio': main_teacher.bio,
                    'is_main_teacher': True
                }
                
                # Éviter les doublons
                if not any(t['id'] == main_teacher.id for t in teachers):
                    teachers.append(main_teacher_data)
            
            course_data['teachers'] = teachers
            course_data['available_spots'] = 10  # Valeur par défaut, à adapter selon la logique métier
            course_data['max_capacity'] = 15     # Valeur par défaut, à adapter selon la logique métier
            course_data['next_session'] = None   # À calculer selon les disponibilités
            
            enriched_courses.append(course_data)
        
        return Response({
            'courses': enriched_courses,
            'total': len(enriched_courses),
            'filters_applied': {
                'subject': subject,
                'level': level,
                'country': country,
                'search': search
            }
        })


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

        # Déterminer l'élève et vérifier les permissions
        user = request.user
        student = None
        
        # Cas 1: L'utilisateur est un élève qui réserve pour lui-même
        if hasattr(user, 'student') and user.student:
            student = user.student
            print(f"🎓 Élève réservant pour lui-même: {student.user.first_name}")
            
        # Cas 2: L'utilisateur est un parent qui réserve pour son enfant
        elif hasattr(user, 'parent') and user.parent:
            if not student_id:
                return Response({'error': 'student_id est requis pour les parents'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                s = Student.objects.get(id=student_id)
                if s not in user.parent.children.all():
                    return Response({'error': "Cet élève n'est pas associé à ce parent"}, status=status.HTTP_403_FORBIDDEN)
                student = s
                print(f"👨‍👩‍👧‍👦 Parent réservant pour son enfant: {student.user.first_name}")
            except Student.DoesNotExist:
                return Response({'error': 'Élève introuvable'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Utilisateur non autorisé. Seuls les élèves et parents peuvent réserver des cours.'}, status=status.HTTP_403_FORBIDDEN)

        # Vérifier que l'élève n'est pas bloqué
        if student.is_blocked:
            if student.blocked_until and student.blocked_until > dj_timezone.now():
                return Response({
                    'error': f'Cet élève est temporairement bloqué jusqu\'au {student.blocked_until.strftime("%d/%m/%Y %H:%M")}'
                }, status=status.HTTP_403_FORBIDDEN)
            else:
                # Débloquer automatiquement si la date de blocage est passée
                student.is_blocked = False
                student.save()

        # Récupérer teacher & course
        try:
            teacher = Teacher.objects.get(id=teacher_id)
            if not teacher.is_validated:
                return Response({'error': 'Ce professeur n\'est pas encore validé'}, status=status.HTTP_400_BAD_REQUEST)
        except Teacher.DoesNotExist:
            return Response({'error': 'Professeur introuvable'}, status=status.HTTP_404_NOT_FOUND)

        course = None
        if course_id:
            try:
                course = Course.objects.get(id=course_id)
                if not course.is_active:
                    return Response({'error': 'Ce cours n\'est plus disponible'}, status=status.HTTP_400_BAD_REQUEST)
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
            
            # Vérifier que la date n'est pas dans le passé
            if st <= dj_timezone.now():
                return Response({'error': 'Impossible de réserver une session dans le passé'}, status=status.HTTP_400_BAD_REQUEST)
                
            # Vérifier que la durée est raisonnable (entre 30 min et 4h)
            duration = (et - st).total_seconds() / 60
            if duration < 30 or duration > 240:
                return Response({'error': 'La durée de la session doit être entre 30 minutes et 4 heures'}, status=status.HTTP_400_BAD_REQUEST)
            
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

        # Vérifier les conflits de disponibilité
        overlap = Session.objects.filter(
            teacher=teacher, 
            start_time__lt=et, 
            end_time__gt=st, 
            status__in=['scheduled','ongoing']
        ).first()
        
        if overlap:
            if overlap.current_enrollment >= overlap.max_capacity:
                return Response({'error': 'Créneau déjà complet'}, status=status.HTTP_409_CONFLICT)
            
            # Vérifier que l'élève n'est pas déjà inscrit à cette session
            if student in overlap.students.all():
                return Response({'error': 'Vous êtes déjà inscrit à cette session'}, status=status.HTTP_400_BAD_REQUEST)
            
            session = overlap
        else:
            # Créer une nouvelle session
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

        # Vérifier la capacité de la session
        if session.current_enrollment >= session.max_capacity:
            return Response({'error': 'Cette session est complète'}, status=status.HTTP_409_CONFLICT)

        # Ajouter l'élève à la session
        session.students.add(student)
        session.current_enrollment += 1
        session.save()

        # Créer la réservation
        booking = Booking.objects.create(
            student=student,
            teacher=teacher,
            session=session,
            status='confirmed',
            payment_status='pending',
        )

        # Créer les notifications
        Notification.objects.create(
            user=user, 
            title='Réservation confirmée', 
            message=f'Votre session avec {teacher.user.first_name} a été confirmée pour le {st.strftime("%d/%m/%Y à %H:%M")}', 
            notification_type='booking'
        )
        
        Notification.objects.create(
            user=teacher.user, 
            title='Nouvelle réservation', 
            message=f'{student.user.first_name} a réservé une session pour le {st.strftime("%d/%m/%Y à %H:%M")}', 
            notification_type='booking'
        )

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
    @action(detail=False, methods=['get'], url_path='my-bookings')
    def my_bookings(self, request):
        """Obtenir les réservations de l'utilisateur connecté (élève ou parent)"""
        user = request.user
        bookings = []
        
        # Cas 1: L'utilisateur est un élève
        if hasattr(user, 'student') and user.student:
            bookings = Booking.objects.filter(student=user.student).order_by('-booking_date')
            print(f"🎓 Récupération des réservations pour l'élève: {user.student.user.first_name}")
            
        # Cas 2: L'utilisateur est un parent
        elif hasattr(user, 'parent') and user.parent:
            # Récupérer toutes les réservations des enfants du parent
            children_students = user.parent.children.all()
            bookings = Booking.objects.filter(student__in=children_students).order_by('-booking_date')
            print(f"👨‍👩‍👧‍👦 Récupération des réservations pour les enfants du parent: {user.parent.user.first_name}")
        else:
            return Response({'error': 'Utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        # Sérialiser les réservations avec les détails
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='upcoming-sessions')
    def upcoming_sessions(self, request):
        """Obtenir les sessions à venir pour l'utilisateur connecté"""
        user = request.user
        sessions = []
        
        # Cas 1: L'utilisateur est un élève
        if hasattr(user, 'student') and user.student:
            sessions = Session.objects.filter(
                students=user.student,
                start_time__gte=dj_timezone.now(),
                status='scheduled'
            ).order_by('start_time')
            
        # Cas 2: L'utilisateur est un parent
        elif hasattr(user, 'parent') and user.parent:
            children_students = user.parent.children.all()
            sessions = Session.objects.filter(
                students__in=children_students,
                start_time__gte=dj_timezone.now(),
                status='scheduled'
            ).order_by('start_time')
        else:
            return Response({'error': 'Utilisateur non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        # Sérialiser les sessions
        from .serializers import SessionSerializer
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)

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

    @action(detail=False, methods=['get'], url_path='available-teachers')
    def available_teachers(self, request):
        """Obtenir les professeurs disponibles pour les élèves"""
        # Filtrer les professeurs validés et actifs
        teachers = Teacher.objects.filter(
            is_validated=True,
            user__is_active=True
        )
        
        # Appliquer des filtres optionnels
        subject = request.query_params.get('subject')
        country = request.query_params.get('country')
        min_rating = request.query_params.get('min_rating')
        max_price = request.query_params.get('max_price')
        
        if subject:
            teachers = teachers.filter(subjects__contains=[subject])
        if country:
            teachers = teachers.filter(user__country__icontains=country)
        if min_rating:
            try:
                min_rating = float(min_rating)
                teachers = teachers.filter(average_rating__gte=min_rating)
            except ValueError:
                pass
        if max_price:
            try:
                max_price = float(max_price)
                teachers = teachers.filter(hourly_rate__lte=max_price)
            except ValueError:
                pass
        
        # Inclure les informations sur l'utilisateur et les cours
        teachers = teachers.select_related('user').prefetch_related('user__teacher__courses')
        
        # Sérialiser avec des informations enrichies
        from .serializers import TeacherSerializer
        serializer = TeacherSerializer(teachers, many=True, context={'request': request})
        
        return Response({
            'teachers': serializer.data,
            'total': teachers.count(),
            'filters_applied': {
                'subject': subject,
                'country': country,
                'min_rating': min_rating,
                'max_price': max_price
            }
        })

    @action(detail=True, methods=['get'], url_path='schedule')
    def teacher_schedule(self, request, pk=None):
        """Obtenir l'emploi du temps d'un enseignant"""
        # Placeholder pour l'emploi du temps
        return Response({'message': 'Fonctionnalité à implémenter'})


# =============================================================================
# VUES POUR LES NOUVELLES FONCTIONNALITÉS
# =============================================================================

class IncidentReportViewSet(viewsets.ModelViewSet):
    """Gestion des signalements d'incidents"""
    queryset = IncidentReport.objects.all()
    serializer_class = IncidentReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'super_admin']:
            return IncidentReport.objects.all()
        else:
            return IncidentReport.objects.filter(reporter=user)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def report_incident(self, request):
        """Signaler un incident avec un enseignant"""
        serializer = IncidentReportSerializer(data=request.data)
        if serializer.is_valid():
            incident = serializer.save(reporter=request.user)
            return Response(IncidentReportSerializer(incident).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def assign_to_admin(self, request, pk=None):
        """Assigner un incident à un administrateur"""
        incident = self.get_object()
        admin_id = request.data.get('admin_id')
        if admin_id:
            try:
                admin = User.objects.get(id=admin_id, role__in=['admin', 'super_admin'])
                incident.assigned_to = admin
                incident.status = 'investigating'
                incident.save()
                return Response({'message': 'Incident assigné avec succès'})
            except User.DoesNotExist:
                return Response({'error': 'Administrateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'ID administrateur requis'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentConfigurationViewSet(viewsets.ModelViewSet):
    """Configuration des paiements"""
    queryset = PaymentConfiguration.objects.all()
    serializer_class = PaymentConfigurationSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def current_config(self, request):
        """Obtenir la configuration actuelle des paiements"""
        config = PaymentConfiguration.objects.filter(is_active=True).first()
        if config:
            return Response(PaymentConfigurationSerializer(config).data)
        return Response({'error': 'Aucune configuration active'}, status=status.HTTP_404_NOT_FOUND)


class TeacherPayoutViewSet(viewsets.ModelViewSet):
    """Gestion des paiements aux enseignants"""
    queryset = TeacherPayout.objects.all()
    serializer_class = TeacherPayoutSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['post'])
    def process_payouts(self, request):
        """Traiter les paiements des enseignants"""
        period_start = request.data.get('period_start')
        period_end = request.data.get('period_end')
        
        if not period_start or not period_end:
            return Response({'error': 'Période requise'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Logique pour calculer et créer les paiements
        # Cette fonctionnalité sera implémentée plus tard
        return Response({'message': 'Traitement des paiements en cours'})


class SecurityAlertViewSet(viewsets.ModelViewSet):
    """Gestion des alertes de sécurité"""
    queryset = SecurityAlert.objects.all()
    serializer_class = SecurityAlertSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['post'])
    def create_alert(self, request):
        """Créer une alerte de sécurité"""
        serializer = SecurityAlertSerializer(data=request.data)
        if serializer.is_valid():
            alert = serializer.save()
            return Response(SecurityAlertSerializer(alert).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherRatingViewSet(viewsets.ModelViewSet):
    """Gestion des évaluations des enseignants"""
    queryset = TeacherRating.objects.all()
    serializer_class = TeacherRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def rate_teacher(self, request):
        """Évaluer un enseignant"""
        serializer = TeacherRatingSerializer(data=request.data)
        if serializer.is_valid():
            rating = serializer.save(student=request.user.student)
            return Response(TeacherRatingSerializer(rating).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def teacher_ratings(self, request):
        """Obtenir les évaluations d'un enseignant"""
        teacher_id = request.query_params.get('teacher_id')
        if teacher_id:
            ratings = TeacherRating.objects.filter(teacher_id=teacher_id)
            return Response(TeacherRatingSerializer(ratings, many=True).data)
        return Response({'error': 'ID enseignant requis'}, status=status.HTTP_400_BAD_REQUEST)


class AdultStudentViewSet(viewsets.ModelViewSet):
    """Gestion des étudiants adultes"""
    queryset = Student.objects.filter(is_adult=True)
    serializer_class = AdultStudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def register_adult(self, request):
        """Inscription d'un étudiant adulte"""
        serializer = AdultStudentSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save(is_adult=True, school_level='adult')
            return Response(AdultStudentSerializer(student).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EnhancedTeacherViewSet(viewsets.ModelViewSet):
    """Vue enrichie pour les enseignants avec toutes les informations"""
    queryset = Teacher.objects.all()
    serializer_class = EnhancedTeacherSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public_profiles(self, request):
        """Profils publics des enseignants pour consultation parentale"""
        teachers = Teacher.objects.filter(
            is_validated=True,
            user__is_active=True
        ).select_related('user')
        
        # Appliquer des filtres
        subject = request.query_params.get('subject')
        country = request.query_params.get('country')
        location = request.query_params.get('location')
        min_rating = request.query_params.get('min_rating')
        availability_for_adults = request.query_params.get('availability_for_adults')
        
        if subject:
            teachers = teachers.filter(subjects__contains=[subject])
        if country:
            teachers = teachers.filter(user__country__icontains=country)
        if location:
            teachers = teachers.filter(location__icontains=location)
        if min_rating:
            try:
                min_rating = float(min_rating)
                teachers = teachers.filter(average_rating__gte=min_rating)
            except ValueError:
                pass
        if availability_for_adults == 'true':
            teachers = teachers.filter(availability_for_adults=True)
        
        serializer = EnhancedTeacherSerializer(teachers, many=True, context={'request': request})
        return Response({
            'teachers': serializer.data,
            'total': teachers.count(),
            'filters_applied': {
                'subject': subject,
                'country': country,
                'location': location,
                'min_rating': min_rating,
                'availability_for_adults': availability_for_adults
            }
        })



