from django.db import models
from django.contrib.auth import get_user_model
import uuid

# Obtenir le modèle User dynamiquement pour éviter l'import circulaire
User = get_user_model()


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
        ordering = ['order', 'created_at']
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
