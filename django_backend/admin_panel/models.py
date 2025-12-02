from django.db import models
from core.models import User
import uuid
from django.utils import timezone

class ContentReport(models.Model):
    """Signalement de contenu inapproprié"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('reviewing', 'En cours d\'examen'),
        ('action_taken', 'Action prise'),
        ('dismissed', 'Rejeté'),
    ]
    
    CONTENT_TYPE_CHOICES = [
        ('course', 'Cours'),
        ('forum_post', 'Message de forum'),
        ('message', 'Message privé'),
        ('user_profile', 'Profil utilisateur'),
        ('comment', 'Commentaire'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
        ('critical', 'Critique'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content_id = models.UUIDField()
    reason = models.TextField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reports_reviewed')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    action_taken = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'content_reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Report {self.id} - {self.content_type} by {self.reported_by.email}"


class ActivityLog(models.Model):
    """Historique des actions utilisateurs"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    action = models.CharField(max_length=100)
    entity_type = models.CharField(max_length=50, blank=True)
    entity_id = models.UUIDField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'activity_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        user_email = self.user.email if self.user else 'Anonymous'
        return f"{user_email} - {self.action} at {self.timestamp}"


class BannedKeyword(models.Model):
    """Mots-clés interdits pour la modération automatique"""
    
    SEVERITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
    ]
    
    ACTION_CHOICES = [
        ('warn', 'Avertir'),
        ('auto_hide', 'Masquer automatiquement'),
        ('auto_block', 'Bloquer automatiquement'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    keyword = models.CharField(max_length=100, unique=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, default='warn')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'banned_keywords'
    
    def __str__(self):
        return f"{self.keyword} ({self.severity})"


# Modèles pour le contrôle d'accès aux vidéos
class VideoAccessLevel(models.Model):
    """Niveaux d'accès aux vidéos"""
    
    LEVEL_CHOICES = [
        ('free', 'Gratuit'),
        ('premium', 'Premium'),
        ('subscription', 'Abonnement'),
        ('purchase', 'Achat individuel'),
    ]
    
    name = models.CharField(max_length=50, unique=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_days = models.IntegerField(null=True, blank=True, help_text="Durée en jours (null = permanent)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'video_access_levels'
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} ({self.level})"


class VideoAccessRule(models.Model):
    """Règles d'accès spécifiques aux vidéos"""
    
    RULE_TYPE_CHOICES = [
        ('level_required', 'Niveau scolaire requis'),
        ('subject_required', 'Matière requise'),
        ('prerequisite_video', 'Vidéo prérequise'),
        ('prerequisite_qcm', 'QCM prérequis'),
        ('subscription_required', 'Abonnement requis'),
        ('purchase_required', 'Achat requis'),
        ('time_limited', 'Accès limité dans le temps'),
    ]
    
    video = models.ForeignKey('core.EducationalContent', on_delete=models.CASCADE, related_name='access_rules')
    rule_type = models.CharField(max_length=30, choices=RULE_TYPE_CHOICES)
    required_value = models.CharField(max_length=200, help_text="Valeur requise (niveau, matière, ID vidéo, etc.)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'video_access_rules'
        unique_together = ['video', 'rule_type', 'required_value']
    
    def __str__(self):
        return f"{self.video.title} - {self.rule_type}: {self.required_value}"


class UserVideoAccess(models.Model):
    """Accès utilisateur aux vidéos"""
    
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('expired', 'Expiré'),
        ('revoked', 'Révoqué'),
        ('pending', 'En attente'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_accesses')
    video = models.ForeignKey('core.EducationalContent', on_delete=models.CASCADE, related_name='user_accesses')
    access_level = models.ForeignKey(VideoAccessLevel, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accesses_granted')
    
    class Meta:
        db_table = 'user_video_accesses'
        unique_together = ['user', 'video']
        ordering = ['-granted_at']
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.video.title}"
    
    @property
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def is_active_access(self):
        return self.status == 'active' and not self.is_expired


class UserProgress(models.Model):
    """Progression de l'utilisateur dans les vidéos"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='video_progress')
    video = models.ForeignKey('core.EducationalContent', on_delete=models.CASCADE, related_name='user_progress')
    watch_time_seconds = models.IntegerField(default=0)
    completion_percentage = models.FloatField(default=0.0)
    is_completed = models.BooleanField(default=False)
    last_watched_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_video_progress'
        unique_together = ['user', 'video']
        ordering = ['-last_watched_at']
    
    def __str__(self):
        return f"{self.user.first_name} - {self.video.title} ({self.completion_percentage}%)"


class UserSubscription(models.Model):
    """Abonnements utilisateur"""
    
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('expired', 'Expiré'),
        ('cancelled', 'Annulé'),
        ('pending', 'En attente'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    access_level = models.ForeignKey(VideoAccessLevel, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    auto_renew = models.BooleanField(default=False)
    payment_reference = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'user_subscriptions'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.user.first_name} - {self.access_level.name}"
    
    @property
    def is_active(self):
        return self.status == 'active' and timezone.now() <= self.end_date

