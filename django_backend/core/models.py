from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    """Modèle utilisateur de base avec rôles multiples"""
    ROLE_CHOICES = [
        ('student', 'Élève'),
        ('teacher', 'Enseignant'),
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
        ('adult', 'Adulte'),
    ])
    current_grade = models.CharField(max_length=20, blank=True)  # Optionnel pour les adultes
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
    
    # Champs spécifiques aux adultes
    is_adult = models.BooleanField(default=False)
    occupation = models.CharField(max_length=200, blank=True)
    education_level = models.CharField(max_length=100, blank=True)
    professional_experience = models.TextField(blank=True)
    learning_objectives = models.TextField(blank=True)
    preferred_schedule = models.JSONField(default=dict)  # Disponibilités préférées
    budget_range = models.CharField(max_length=50, blank=True)
    certification_needed = models.BooleanField(default=False)

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
    
    # Informations supplémentaires pour consultation parentale
    location = models.CharField(max_length=200, blank=True)  # Ville/Pays
    languages_spoken = models.JSONField(default=list)
    teaching_style = models.CharField(max_length=100, blank=True)
    availability_for_adults = models.BooleanField(default=False)
    
    # Statistiques de fiabilité
    total_cancellations = models.IntegerField(default=0)
    cancellation_rate = models.FloatField(default=0.0)
    last_cancellation_date = models.DateTimeField(blank=True, null=True)
    reliability_score = models.FloatField(default=5.0)  # Score de fiabilité 1-5
    
    # Informations de paiement
    bank_account_info = models.JSONField(default=dict, blank=True)
    payment_preferences = models.JSONField(default=dict, blank=True)
    is_payment_verified = models.BooleanField(default=False)

    class Meta:
        db_table = 'teachers'

    def __str__(self) -> str:
        return f"Enseignant {self.user.first_name} {self.user.last_name}"


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


# =============================================================================
# MODÈLES DE CONTENU PÉDAGOGIQUE
# =============================================================================

class EducationalContent(models.Model):
    """Contenu pédagogique de base"""
    
    CONTENT_TYPE_CHOICES = [
        ('course', 'Cours'),
        ('video', 'Capsule Vidéo'),
        ('pdf', 'Document PDF'),
        ('manual', 'Manuel'),
        ('qcm', 'QCM/Quiz'),
        ('exercise', 'Exercice'),
        ('lesson', 'Leçon'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]
    
    SUBJECTS = [
        ('mathematics', 'Mathématiques'),
        ('physics', 'Physique'),
        ('chemistry', 'Chimie'),
        ('biology', 'Biologie'),
        ('french', 'Français'),
        ('english', 'Anglais'),
        ('history', 'Histoire'),
        ('geography', 'Géographie'),
        ('philosophy', 'Philosophie'),
        ('computer_science', 'Informatique'),
        ('economics', 'Économie'),
        ('sports', 'Éducation Physique'),
    ]
    
    CLASS_LEVELS = [
        ('6eme', '6ème'),
        ('5eme', '5ème'),
        ('4eme', '4ème'),
        ('3eme', '3ème'),
        ('2nde', '2nde'),
        ('1ere', '1ère'),
        ('terminale', 'Terminale'),
        ('university', 'Université'),
    ]
    
    COUNTRIES = [
        ('cameroon', 'Cameroun'),
        ('france', 'France'),
        ('senegal', 'Sénégal'),
        ('ivory_coast', 'Côte d\'Ivoire'),
        ('mali', 'Mali'),
        ('burkina_faso', 'Burkina Faso'),
        ('niger', 'Niger'),
        ('chad', 'Tchad'),
        ('gabon', 'Gabon'),
        ('congo', 'Congo'),
        ('dr_congo', 'RDC'),
        ('central_africa', 'Centrafrique'),
        ('benin', 'Bénin'),
        ('togo', 'Togo'),
        ('guinea', 'Guinée'),
        ('madagascar', 'Madagascar'),
        ('mauritius', 'Maurice'),
        ('morocco', 'Maroc'),
        ('algeria', 'Algérie'),
        ('tunisia', 'Tunisie'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('review', 'En révision'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, verbose_name="Type de contenu")
    subject = models.CharField(max_length=50, choices=SUBJECTS, verbose_name="Matière")
    class_level = models.CharField(max_length=20, choices=CLASS_LEVELS, verbose_name="Classe")
    country = models.CharField(max_length=50, choices=COUNTRIES, verbose_name="Pays")
    difficulty_level = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='beginner', verbose_name="Niveau de difficulté")
    
    # Métadonnées
    duration_minutes = models.IntegerField(null=True, blank=True, verbose_name="Durée (minutes)")
    file_size_mb = models.FloatField(null=True, blank=True, verbose_name="Taille du fichier (MB)")
    file_format = models.CharField(max_length=20, blank=True, verbose_name="Format du fichier")
    
    # Contenu
    content_file = models.FileField(upload_to='educational_content/', null=True, blank=True, verbose_name="Fichier de contenu")
    video_url = models.URLField(blank=True, verbose_name="URL vidéo")
    thumbnail = models.ImageField(upload_to='content_thumbnails/', null=True, blank=True, verbose_name="Miniature")
    
    # Relations
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_contents', verbose_name="Créé par")
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_contents', verbose_name="Approuvé par")
    
    # Statut et dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Statut")
    is_featured = models.BooleanField(default=False, verbose_name="Contenu en vedette")
    is_free = models.BooleanField(default=True, verbose_name="Gratuit")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix")
    
    # Statistiques
    view_count = models.IntegerField(default=0, verbose_name="Nombre de vues")
    download_count = models.IntegerField(default=0, verbose_name="Nombre de téléchargements")
    rating_average = models.FloatField(default=0.0, verbose_name="Note moyenne")
    rating_count = models.IntegerField(default=0, verbose_name="Nombre d'évaluations")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de publication")
    
    # Tags et mots-clés
    tags = models.JSONField(default=list, verbose_name="Tags")
    keywords = models.JSONField(default=list, verbose_name="Mots-clés")
    
    # Objectifs pédagogiques
    learning_objectives = models.JSONField(default=list, verbose_name="Objectifs d'apprentissage")
    prerequisites = models.JSONField(default=list, verbose_name="Prérequis")
    
    class Meta:
        db_table = 'educational_content'
        ordering = ['-created_at']
        verbose_name = "Contenu pédagogique"
        verbose_name_plural = "Contenus pédagogiques"
        indexes = [
            models.Index(fields=['content_type']),
            models.Index(fields=['subject']),
            models.Index(fields=['class_level']),
            models.Index(fields=['country']),
            models.Index(fields=['status']),
            models.Index(fields=['created_by']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_content_type_display()})"


class QCM(models.Model):
    """Questionnaire à Choix Multiples"""
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Facile'),
        ('medium', 'Moyen'),
        ('hard', 'Difficile'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name="Titre du QCM")
    description = models.TextField(verbose_name="Description")
    content = models.ForeignKey(EducationalContent, on_delete=models.CASCADE, related_name='qcm_sets', verbose_name="Contenu associé")
    
    # Configuration
    time_limit_minutes = models.IntegerField(null=True, blank=True, verbose_name="Limite de temps (minutes)")
    max_attempts = models.IntegerField(default=3, verbose_name="Nombre maximum de tentatives")
    passing_score = models.IntegerField(default=70, verbose_name="Score de réussite (%)")
    show_correct_answers = models.BooleanField(default=True, verbose_name="Afficher les bonnes réponses")
    randomize_questions = models.BooleanField(default=False, verbose_name="Mélanger les questions")
    
    # Statistiques
    total_attempts = models.IntegerField(default=0, verbose_name="Total des tentatives")
    average_score = models.FloatField(default=0.0, verbose_name="Score moyen")
    completion_rate = models.FloatField(default=0.0, verbose_name="Taux de réussite")
    
    # Statut
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Créé par")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        db_table = 'qcm_sets'
        ordering = ['-created_at']
        verbose_name = "QCM"
        verbose_name_plural = "QCMs"
    
    def __str__(self):
        return f"{self.title} - {self.content.title}"


class QCMQuestion(models.Model):
    """Question d'un QCM"""
    
    QUESTION_TYPES = [
        ('single_choice', 'Choix unique'),
        ('multiple_choice', 'Choix multiple'),
        ('true_false', 'Vrai/Faux'),
        ('text', 'Réponse libre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    qcm = models.ForeignKey(QCM, on_delete=models.CASCADE, related_name='questions', verbose_name="QCM")
    question_text = models.TextField(verbose_name="Texte de la question")
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='single_choice', verbose_name="Type de question")
    explanation = models.TextField(blank=True, verbose_name="Explication")
    
    # Points et difficulté
    points = models.IntegerField(default=1, verbose_name="Points")
    difficulty = models.CharField(max_length=20, choices=QCM.DIFFICULTY_LEVELS, default='medium', verbose_name="Difficulté")
    
    # Ordre d'affichage
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    # Images et médias
    image = models.ImageField(upload_to='qcm_images/', null=True, blank=True, verbose_name="Image")
    audio_file = models.FileField(upload_to='qcm_audio/', null=True, blank=True, verbose_name="Fichier audio")
    
    class Meta:
        db_table = 'qcm_questions'
        ordering = ['order']
        verbose_name = "Question QCM"
        verbose_name_plural = "Questions QCM"
    
    def __str__(self):
        return f"Q{self.order}: {self.question_text[:50]}..."


class QCMAnswer(models.Model):
    """Réponse d'une question QCM"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(QCMQuestion, on_delete=models.CASCADE, related_name='answers', verbose_name="Question")
    answer_text = models.TextField(verbose_name="Texte de la réponse")
    is_correct = models.BooleanField(default=False, verbose_name="Réponse correcte")
    
    # Ordre d'affichage
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    class Meta:
        db_table = 'qcm_answers'
        ordering = ['order']
        verbose_name = "Réponse QCM"
        verbose_name_plural = "Réponses QCM"
    
    def __str__(self):
        return f"{self.question.question_text[:30]}... - {self.answer_text[:30]}..."


class ContentRating(models.Model):
    """Évaluation d'un contenu pédagogique"""
    
    RATING_CHOICES = [
        (1, '1 étoile'),
        (2, '2 étoiles'),
        (3, '3 étoiles'),
        (4, '4 étoiles'),
        (5, '5 étoiles'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.ForeignKey(EducationalContent, on_delete=models.CASCADE, related_name='ratings', verbose_name="Contenu")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='content_ratings', verbose_name="Utilisateur")
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name="Note")
    comment = models.TextField(blank=True, verbose_name="Commentaire")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    class Meta:
        db_table = 'content_ratings'
        unique_together = ['content', 'user']
        ordering = ['-created_at']
        verbose_name = "Évaluation de contenu"
        verbose_name_plural = "Évaluations de contenu"
    
    def __str__(self):
        return f"{self.content.title} - {self.user.email} ({self.rating}/5)"


class ContentTag(models.Model):
    """Tags pour les contenus pédagogiques"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True, verbose_name="Nom du tag")
    description = models.TextField(blank=True, verbose_name="Description")
    color = models.CharField(max_length=7, default='#3B82F6', verbose_name="Couleur (hex)")
    
    # Statistiques
    usage_count = models.IntegerField(default=0, verbose_name="Nombre d'utilisations")
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    
    class Meta:
        db_table = 'content_tags'
        ordering = ['name']
        verbose_name = "Tag de contenu"
        verbose_name_plural = "Tags de contenu"
    
    def __str__(self):
        return self.name


# =============================================================================
# MODÈLES POUR LES NOUVELLES FONCTIONNALITÉS
# =============================================================================

class IncidentReport(models.Model):
    """Signalement d'incidents avec les enseignants"""
    
    INCIDENT_TYPES = [
        ('inappropriate_behavior', 'Comportement inapproprié'),
        ('professional_misconduct', 'Faute professionnelle'),
        ('cancellation_issues', 'Problèmes d\'annulation'),
        ('payment_dispute', 'Litige de paiement'),
        ('safety_concern', 'Préoccupation de sécurité'),
        ('other', 'Autre'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
        ('critical', 'Critique'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('investigating', 'En cours d\'enquête'),
        ('resolved', 'Résolu'),
        ('dismissed', 'Rejeté'),
        ('escalated', 'Escaladé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incident_reports')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='incident_reports')
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='medium')
    description = models.TextField()
    evidence_files = models.JSONField(default=list, blank=True)  # URLs des fichiers de preuve
    session_related = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True)
    booking_related = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Gestion administrative
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_incidents')
    admin_notes = models.TextField(blank=True)
    resolution_notes = models.TextField(blank=True)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'incident_reports'
        ordering = ['-created_at']
        verbose_name = "Signalement d'incident"
        verbose_name_plural = "Signalements d'incidents"
    
    def __str__(self):
        return f"Incident #{self.id} - {self.get_incident_type_display()}"


class PaymentConfiguration(models.Model):
    """Configuration des paiements et commissions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher_commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    platform_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=90.00)
    minimum_payout_amount = models.DecimalField(max_digits=10, decimal_places=2, default=100.00)
    payout_frequency = models.CharField(max_length=20, choices=[
        ('weekly', 'Hebdomadaire'),
        ('monthly', 'Mensuel'),
        ('on_demand', 'À la demande'),
    ], default='monthly')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_configurations'
        verbose_name = "Configuration de paiement"
        verbose_name_plural = "Configurations de paiement"
    
    def __str__(self):
        return f"Config Paiement - {self.teacher_commission_percentage}% enseignant"


class TeacherPayout(models.Model):
    """Paiements aux enseignants"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('processing', 'En cours de traitement'),
        ('completed', 'Terminé'),
        ('failed', 'Échoué'),
        ('cancelled', 'Annulé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Informations de paiement
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    bank_details = models.JSONField(default=dict, blank=True)
    
    # Suivi
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'teacher_payouts'
        ordering = ['-created_at']
        verbose_name = "Paiement enseignant"
        verbose_name_plural = "Paiements enseignants"
    
    def __str__(self):
        return f"Paiement {self.teacher.user.first_name} - {self.amount} FCFA"


class SecurityAlert(models.Model):
    """Alertes de sécurité pour détecter les inscriptions frauduleuses"""
    
    ALERT_TYPES = [
        ('duplicate_email', 'Email dupliqué'),
        ('suspicious_ip', 'Adresse IP suspecte'),
        ('banned_user_return', 'Utilisateur banni qui revient'),
        ('multiple_accounts', 'Comptes multiples'),
        ('suspicious_behavior', 'Comportement suspect'),
        ('payment_fraud', 'Fraude de paiement'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
        ('critical', 'Critique'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('investigating', 'En cours d\'enquête'),
        ('resolved', 'Résolu'),
        ('false_positive', 'Faux positif'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='security_alerts')
    description = models.TextField()
    evidence_data = models.JSONField(default=dict)
    
    # Gestion administrative
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_alerts')
    admin_notes = models.TextField(blank=True)
    action_taken = models.TextField(blank=True)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'security_alerts'
        ordering = ['-created_at']
        verbose_name = "Alerte de sécurité"
        verbose_name_plural = "Alertes de sécurité"
    
    def __str__(self):
        return f"Alerte {self.get_alert_type_display()} - {self.user.email}"


class BannedUser(models.Model):
    """Utilisateurs bannis du système"""
    
    BAN_REASONS = [
        ('fraud', 'Fraude'),
        ('inappropriate_behavior', 'Comportement inapproprié'),
        ('payment_issues', 'Problèmes de paiement'),
        ('safety_violation', 'Violation de sécurité'),
        ('terms_violation', 'Violation des conditions'),
        ('other', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ban_records')
    ban_reason = models.CharField(max_length=50, choices=BAN_REASONS)
    description = models.TextField()
    banned_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='banned_users')
    banned_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # None = bannissement permanent
    is_active = models.BooleanField(default=True)
    
    # Informations pour la détection
    ip_addresses = models.JSONField(default=list)
    email_patterns = models.JSONField(default=list)
    device_fingerprints = models.JSONField(default=list)
    
    class Meta:
        db_table = 'banned_users'
        ordering = ['-banned_at']
        verbose_name = "Utilisateur banni"
        verbose_name_plural = "Utilisateurs bannis"
    
    def __str__(self):
        return f"Bannissement {self.user.email} - {self.get_ban_reason_display()}"


class TeacherRating(models.Model):
    """Évaluations des enseignants par les élèves/parents"""
    
    RATING_CHOICES = [
        (1, '1 étoile'),
        (2, '2 étoiles'),
        (3, '3 étoiles'),
        (4, '4 étoiles'),
        (5, '5 étoiles'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='ratings')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='teacher_ratings')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    
    # Critères spécifiques
    teaching_quality = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    punctuality = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    communication = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    professionalism = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True)
    
    # Métadonnées
    is_anonymous = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'teacher_ratings'
        unique_together = ['teacher', 'student', 'session']
        ordering = ['-created_at']
        verbose_name = "Évaluation enseignant"
        verbose_name_plural = "Évaluations enseignants"
    
    def __str__(self):
        return f"{self.teacher.user.first_name} - {self.rating}/5 étoiles"

