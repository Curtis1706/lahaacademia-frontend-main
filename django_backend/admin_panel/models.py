from django.db import models
from core.models import User
import uuid

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

