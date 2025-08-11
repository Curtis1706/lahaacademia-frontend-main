from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    """Modèle utilisateur de base avec rôles multiples"""
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
    referral_code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    referred_by = models.ForeignKey('self', on_delete=models.SET_NULL, blank=True, null=True)
    reputation_score = models.IntegerField(default=0)
    badges = models.JSONField(default=list)

    class Meta:
        db_table = 'users'


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    date_of_birth = models.DateField()
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    school_level = models.CharField(max_length=20, choices=[
        ('primary', 'Primaire'),
        ('secondary', 'Secondaire'),
    ])
    current_grade = models.CharField(max_length=20)
    school_name = models.CharField(max_length=200, blank=True)
    study_time_total = models.IntegerField(default=0)
    courses_completed = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    last_activity = models.DateTimeField(blank=True, null=True)
    screen_time_limit = models.IntegerField(default=0)
    is_blocked = models.BooleanField(default=False)
    blocked_until = models.DateTimeField(blank=True, null=True)
    preferred_subjects = models.JSONField(default=list)
    learning_style = models.CharField(max_length=50, blank=True)
    goals = models.TextField(blank=True)
    total_exams_taken = models.IntegerField(default=0)
    average_exam_score = models.FloatField(default=0.0)
    streak_days = models.IntegerField(default=0)

    class Meta:
        db_table = 'students'

    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name} - {self.current_grade}"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher')
    diploma_file = models.FileField(upload_to='teacher_diplomas/', blank=True)
    criminal_record_file = models.FileField(upload_to='teacher_criminal_records/', blank=True)
    identity_document_file = models.FileField(upload_to='teacher_identity/', blank=True)
    proof_of_address_file = models.FileField(upload_to='teacher_address/', blank=True)
    profile_photo = models.ImageField(upload_to='teacher_photos/', blank=True)
    is_validated = models.BooleanField(default=False)
    validation_date = models.DateTimeField(blank=True, null=True)
    validated_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='validated_teachers')
    subjects = models.JSONField(default=list)
    experience_years = models.IntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=20000)
    bio = models.TextField(blank=True)
    cv_file = models.FileField(upload_to='teacher_cvs/', blank=True)
    availability_schedule = models.JSONField(default=dict)
    max_students_per_session = models.IntegerField(default=10)
    total_sessions = models.IntegerField(default=0)
    total_students = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    total_earnings = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_hours_taught = models.IntegerField(default=0)
    specializations = models.JSONField(default=list)
    certifications = models.JSONField(default=list)

    class Meta:
        db_table = 'teachers'

    def __str__(self) -> str:
        return f"Prof. {self.user.first_name} {self.user.last_name}"


class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='author')
    bio = models.TextField(blank=True)
    expertise_areas = models.JSONField(default=list)
    total_answers = models.IntegerField(default=0)
    total_content_published = models.IntegerField(default=0)
    is_also_teacher = models.BooleanField(default=False)
    education_background = models.TextField(blank=True)
    publications = models.JSONField(default=list)
    awards = models.JSONField(default=list)
    writing_style = models.CharField(max_length=100, blank=True)
    target_audience = models.JSONField(default=list)
    total_views = models.IntegerField(default=0)
    total_likes = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    featured_content = models.JSONField(default=list)
    recent_publications = models.JSONField(default=list)

    class Meta:
        db_table = 'authors'

    def __str__(self) -> str:
        return f"Auteur {self.user.first_name} {self.user.last_name}"


class Parent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent')
    children = models.ManyToManyField(Student, related_name='parents')
    notification_preferences = models.JSONField(default=dict)
    occupation = models.CharField(max_length=200, blank=True)
    education_level = models.CharField(max_length=100, blank=True)
    preferred_contact_method = models.CharField(max_length=20, choices=[
        ('email', 'Email'),
        ('phone', 'Téléphone'),
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
    ], default='email')
    monitoring_enabled = models.BooleanField(default=True)
    weekly_reports = models.BooleanField(default=True)
    exam_notifications = models.BooleanField(default=True)
    total_children = models.IntegerField(default=0)
    total_payments = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_login = models.DateTimeField(blank=True, null=True)
    alert_preferences = models.JSONField(default=dict)
    communication_history = models.JSONField(default=list)

    class Meta:
        db_table = 'parents'

    def __str__(self) -> str:
        return f"Parent {self.user.first_name} {self.user.last_name}"


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    subject = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    duration = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    difficulty_level = models.CharField(max_length=20, choices=[
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ], default='beginner')
    prerequisites = models.JSONField(default=list)
    learning_objectives = models.JSONField(default=list)
    materials_needed = models.JSONField(default=list)
    total_enrollments = models.IntegerField(default=0)
    average_rating = models.FloatField(default=0.0)
    total_reviews = models.IntegerField(default=0)

    class Meta:
        db_table = 'courses'

    def __str__(self) -> str:
        return self.title


class CourseAvailability(models.Model):
    """Créneaux de disponibilité définis par le professeur pour un cours spécifique"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='availabilities')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    
    # Jour de la semaine (0=Lundi, 6=Dimanche)
    day_of_week = models.IntegerField(choices=[
        (0, 'Lundi'), (1, 'Mardi'), (2, 'Mercredi'), (3, 'Jeudi'),
        (4, 'Vendredi'), (5, 'Samedi'), (6, 'Dimanche')
    ])
    
    # Heures de début et fin
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    # Statut
    is_active = models.BooleanField(default=True)
    
    # Date spécifique (optionnel). Si défini, remplace le jour de la semaine
    specific_date = models.DateField(null=True, blank=True)

    # Dates limites (optionnel)
    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'course_availabilities'
        unique_together = ['course', 'day_of_week', 'start_time']

    def __str__(self) -> str:
        days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        return f"{self.course.title} - {days[self.day_of_week]} {self.start_time}-{self.end_time}"


class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField(Student, related_name='enrolled_sessions')
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
    max_capacity = models.IntegerField(default=10)
    current_enrollment = models.IntegerField(default=0)
    session_type = models.CharField(max_length=20, choices=[
        ('individual', 'Individuel'),
        ('group', 'Groupe'),
        ('workshop', 'Atelier'),
    ], default='group')
    agenda = models.TextField(blank=True)
    materials = models.JSONField(default=list)
    homework_assigned = models.TextField(blank=True)

    class Meta:
        db_table = 'sessions'

    def __str__(self) -> str:
        return f"{self.course.title} - {self.start_time.strftime('%d/%m/%Y %H:%M')}"


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
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
    special_requirements = models.TextField(blank=True)
    cancellation_reason = models.TextField(blank=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'bookings'

    def __str__(self) -> str:
        return f"Réservation {self.id} - {self.student.user.first_name}"


class Progress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress_percentage = models.FloatField(default=0.0)
    time_spent = models.IntegerField(default=0)
    last_accessed = models.DateTimeField(auto_now=True)
    completed_modules = models.JSONField(default=list)
    quiz_scores = models.JSONField(default=list)
    assignments_completed = models.IntegerField(default=0)
    certificates_earned = models.JSONField(default=list)

    class Meta:
        db_table = 'progress'

    def __str__(self) -> str:
        return f"{self.student.user.first_name} - {self.course.title} ({self.progress_percentage}%)"


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('urgent', 'Urgente'),
    ], default='medium')
    action_required = models.BooleanField(default=False)
    action_url = models.URLField(blank=True, null=True)

    class Meta:
        db_table = 'notifications'

    def __str__(self) -> str:
        return f"{self.title} - {self.user.first_name}"


class ParentChildLinkRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('student_accepted', 'Student Accepted'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='link_requests')
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='link_requests')
    child_email = models.EmailField()
    code = models.CharField(max_length=16, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'parent_child_link_requests'

    def __str__(self) -> str:
        return f"LinkRequest {self.code} ({self.status})"

