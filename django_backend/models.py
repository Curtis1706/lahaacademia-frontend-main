from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid

class User(AbstractUser):
    """Modèle utilisateur étendu avec tous les rôles"""
    ROLE_CHOICES = [
        ('student', 'Élève'),
        ('teacher', 'Professeur'),
        ('author', 'Auteur'),
        ('parent', 'Parent'),
        ('admin', 'Administrateur'),
        ('super_admin', 'Super Administrateur'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Champs pour la double authentification
    two_factor_enabled = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_expires_at = models.DateTimeField(blank=True, null=True)
    
    # Système de parrainage
    referral_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True)
    
    # Badges et réputation
    reputation_score = models.IntegerField(default=0)
    badges = models.JSONField(default=list)
    
    class Meta:
        db_table = 'users'

class StudentProfile(models.Model):
    """Profil spécifique aux élèves"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    date_of_birth = models.DateField()
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    school_level = models.CharField(max_length=20, choices=[
        ('primary', 'Primaire'),
        ('secondary', 'Secondaire'),
    ])
    current_grade = models.CharField(max_length=20)
    school_name = models.CharField(max_length=200, blank=True)
    
    # Suivi pédagogique
    study_time_total = models.IntegerField(default=0)  # en minutes
    courses_completed = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    last_activity = models.DateTimeField(blank=True, null=True)
    
    # Restrictions parentales
    screen_time_limit = models.IntegerField(default=0)  # en minutes par jour
    is_blocked = models.BooleanField(default=False)
    blocked_until = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'student_profiles'

class TeacherProfile(models.Model):
    """Profil spécifique aux professeurs"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    
    # Documents de validation
    diploma_file = models.FileField(upload_to='teacher_diplomas/')
    criminal_record_file = models.FileField(upload_to='teacher_criminal_records/')
    identity_document_file = models.FileField(upload_to='teacher_identity/')
    proof_of_address_file = models.FileField(upload_to='teacher_address/')
    profile_photo = models.ImageField(upload_to='teacher_photos/')
    
    # Statut de validation
    is_validated = models.BooleanField(default=False)
    validation_date = models.DateTimeField(blank=True, null=True)
    validated_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='validated_teachers')
    
    # Informations professionnelles
    subjects = models.JSONField(default=list)  # Liste des matières enseignées
    experience_years = models.IntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=20000)
    bio = models.TextField(blank=True)
    
    # Statistiques
    total_sessions = models.IntegerField(default=0)
    total_students = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'teacher_profiles'

class AuthorProfile(models.Model):
    """Profil spécifique aux auteurs"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='author_profile')
    bio = models.TextField(blank=True)
    expertise_areas = models.JSONField(default=list)
    total_answers = models.IntegerField(default=0)
    total_content_published = models.IntegerField(default=0)
    is_also_teacher = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'author_profiles'

class ParentProfile(models.Model):
    """Profil spécifique aux parents"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    children = models.ManyToManyField(StudentProfile, related_name='parents')
    notification_preferences = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'parent_profiles'

class Course(models.Model):
    """Modèle pour les cours"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    duration = models.IntegerField()  # en minutes
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'

class Session(models.Model):
    """Modèle pour les sessions de cours"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='enrolled_sessions')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[
        ('scheduled', 'Programmé'),
        ('ongoing', 'En cours'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
    ], default='scheduled')
    meeting_link = models.URLField(blank=True, null=True)
    meeting_password = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'sessions'

class Booking(models.Model):
    """Modèle pour les réservations"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    booking_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ], default='pending')
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('paid', 'Payé'),
        ('failed', 'Échoué'),
        ('refunded', 'Remboursé'),
    ], default='pending')
    
    class Meta:
        db_table = 'bookings'

class Payment(models.Model):
    """Modèle pour les paiements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'En attente'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
        ('refunded', 'Remboursé'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payments'

class Subscription(models.Model):
    """Modèle pour les abonnements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_type = models.CharField(max_length=50)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'subscriptions'

class Progress(models.Model):
    """Modèle pour le suivi de progression"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress_percentage = models.FloatField(default=0.0)
    time_spent = models.IntegerField(default=0)  # en minutes
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'progress'

class Notification(models.Model):
    """Modèle pour les notifications"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'

class Message(models.Model):
    """Modèle pour la messagerie interne"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'messages'

class Forum(models.Model):
    """Modèle pour les forums"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    is_international = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'forums'

class ForumPost(models.Model):
    """Modèle pour les posts de forum"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'forum_posts'

class Exam(models.Model):
    """Modèle pour les examens blancs"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    duration = models.IntegerField()  # en minutes
    total_questions = models.IntegerField()
    passing_score = models.FloatField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'exams'

class ExamResult(models.Model):
    """Modèle pour les résultats d'examens"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    time_taken = models.IntegerField()  # en minutes
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'exam_results'
