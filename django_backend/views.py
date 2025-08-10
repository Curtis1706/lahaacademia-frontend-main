from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import *
from .serializers import *
import uuid

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'])
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

    @action(detail=False, methods=['post'])
    def login(self, request):
        """Connexion utilisateur"""
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        
        if user:
            # Générer un token JWT ou session
            return Response({'message': 'Connexion réussie', 'user': UserSerializer(user).data})
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        subject = self.request.query_params.get('subject', None)
        level = self.request.query_params.get('level', None)
        country = self.request.query_params.get('country', None)
        
        if subject:
            queryset = queryset.filter(subject=subject)
        if level:
            queryset = queryset.filter(level=level)
        if country:
            queryset = queryset.filter(country=country)
            
        return queryset

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Rejoindre une session"""
        session = self.get_object()
        user = request.user
        
        if user in session.students.all():
            return Response({'error': 'Déjà inscrit'}, status=status.HTTP_400_BAD_REQUEST)
        
        session.students.add(user)
        return Response({'message': 'Inscription réussie'})

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler une réservation"""
        booking = self.get_object()
        if booking.student != request.user:
            return Response({'error': 'Non autorisé'}, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = 'cancelled'
        booking.save()
        return Response({'message': 'Réservation annulée'})

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(student=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        """Mettre à jour la progression d'un cours"""
        course_id = request.data.get('course_id')
        progress_percentage = request.data.get('progress_percentage')
        time_spent = request.data.get('time_spent', 0)
        
        progress, created = Progress.objects.get_or_create(
            student=request.user,
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

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(
            models.Q(sender=self.request.user) | models.Q(recipient=self.request.user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
