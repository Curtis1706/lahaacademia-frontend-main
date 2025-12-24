"""
Modèles Django pour les nouvelles fonctionnalités
À intégrer dans votre application Django existante
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid


# ============================================================================
# 1. SYSTÈME DE SIGNALEMENT D'INCIDENTS
# ============================================================================

class IncidentReport(models.Model):
    """Modèle pour les signalements d'incidents"""
    
    INCIDENT_TYPES = [
        ('absence', 'Absence non justifiée'),
        ('late', 'Retard répété'),
        ('behavior', 'Comportement inapproprié'),
        ('content', 'Contenu inapproprié'),
        ('quality', 'Qualité du cours'),
        ('technical', 'Problèmes techniques'),
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
        ('investigating', 'En investigation'),
        ('resolved', 'Résolu'),
        ('dismissed', 'Rejeté'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_incidents')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='incident_reports')
    booking = models.ForeignKey('bookings.Booking', on_delete=models.SET_NULL, null=True, blank=True)
    
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    description = models.TextField()
    evidence = models.JSONField(default=list, blank=True)  # Liste d'URLs de fichiers
    
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    resolution = models.CharField(max_length=50, blank=True)
    action_taken = models.TextField(blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_incidents')
    
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['teacher', 'status']),
            models.Index(fields=['reporter', 'status']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"Signalement #{self.id.hex[:8]} - {self.get_incident_type_display()}"


# ============================================================================
# 2. RÉMUNÉRATION ENSEIGNANTS + COMMISSION
# ============================================================================

class CommissionRate(models.Model):
    """Configuration des taux de commission"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    default_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=10.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Taux de commission par défaut en pourcentage"
    )
    individual_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Taux pour cours individuels (si différent du défaut)"
    )
    group_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Taux pour cours en groupe (si différent du défaut)"
    )
    
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        verbose_name = "Taux de commission"
        verbose_name_plural = "Taux de commission"
    
    def save(self, *args, **kwargs):
        # S'assurer qu'il n'y a qu'une seule instance
        if not self.pk:
            CommissionRate.objects.all().delete()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Commission: {self.default_rate}%"


class TeacherEarning(models.Model):
    """Revenus des enseignants par réservation"""
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('ready', 'Prêt à payer'),
        ('paid', 'Payé'),
        ('disputed', 'Litige'),
    ]
    
    PAYMENT_METHODS = [
        ('mtn', 'MTN Money'),
        ('orange', 'Orange Money'),
        ('bank', 'Virement bancaire'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='earnings')
    booking = models.OneToOneField('bookings.Booking', on_delete=models.CASCADE, related_name='teacher_earning')
    
    # Montants
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Montant brut du cours")
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, help_text="Taux de commission appliqué")
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Montant de la commission LAHA")
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Montant net pour l'enseignant")
    
    # Statut et paiement
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    payment_date = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, blank=True)
    payment_proof = models.URLField(blank=True)
    payment_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['teacher', 'status']),
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.teacher.user.get_full_name()} - {self.net_amount} FCFA"
    
    def calculate_amounts(self, commission_rate=None):
        """Calcule les montants basés sur le taux de commission"""
        if commission_rate is None:
            commission_config = CommissionRate.objects.first()
            if commission_config:
                commission_rate = commission_config.default_rate
            else:
                commission_rate = 10.0
        
        self.commission_rate = commission_rate
        self.commission_amount = (self.gross_amount * commission_rate) / 100
        self.net_amount = self.gross_amount - self.commission_amount
        return self


class TeacherPayment(models.Model):
    """Historique des paiements effectués aux enseignants"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='payments')
    earnings = models.ManyToManyField(TeacherEarning, related_name='payment_batches')
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=TeacherEarning.PAYMENT_METHODS)
    payment_proof = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='processed_payments')
    processed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-processed_at']
    
    def __str__(self):
        return f"Paiement {self.teacher.user.get_full_name()} - {self.total_amount} FCFA"


# ============================================================================
# 3. DÉTECTION ANNULATIONS FRÉQUENTES
# ============================================================================

class TeacherWarning(models.Model):
    """Avertissements émis aux enseignants"""
    
    WARNING_TYPES = [
        ('cancellation_rate', 'Taux d\'annulation élevé'),
        ('late_cancellations', 'Annulations de dernière minute'),
        ('quality', 'Qualité des cours'),
        ('behavior', 'Comportement'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Faible'),
        ('medium', 'Moyen'),
        ('high', 'Élevé'),
    ]
    
    ACTION_TAKEN_CHOICES = [
        ('warning', 'Avertissement simple'),
        ('temporary_suspension', 'Suspension temporaire'),
        ('permanent_ban', 'Bannissement permanent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='warnings')
    
    warning_type = models.CharField(max_length=30, choices=WARNING_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    message = models.TextField()
    action_taken = models.CharField(max_length=30, choices=ACTION_TAKEN_CHOICES)
    metadata = models.JSONField(default=dict, blank=True)
    
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='issued_warnings')
    issued_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-issued_at']
    
    def __str__(self):
        return f"Avertissement {self.teacher.user.get_full_name()} - {self.get_warning_type_display()}"


# ============================================================================
# 4. SÉCURITÉ ANTI-FRAUDE
# ============================================================================

class FraudDetection(models.Model):
    """Détection de fraude lors des inscriptions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fraud_detections', null=True, blank=True)
    
    # Données de l'inscription
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=255, blank=True)
    device_fingerprint = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Facteurs de risque
    risk_score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Score de risque de 0 à 100"
    )
    risk_factors = models.JSONField(default=dict, blank=True)
    # Exemple: {
    #   "duplicate_email": true,
    #   "duplicate_phone": true,
    #   "duplicate_device": false,
    #   "vpn_detected": true,
    #   "suspicious_activity": false,
    #   "previously_banned": false
    # }
    
    # Action prise
    action = models.CharField(
        max_length=10,
        choices=[('allow', 'Autoriser'), ('review', 'Réviser'), ('block', 'Bloquer')],
        default='allow'
    )
    status = models.CharField(
        max_length=10,
        choices=[('pending', 'En attente'), ('reviewed', 'Révisé'), ('banned', 'Banni')],
        default='pending'
    )
    
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_frauds')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
            models.Index(fields=['device_fingerprint']),
            models.Index(fields=['risk_score', '-created_at']),
        ]
    
    def __str__(self):
        return f"Fraud Detection - {self.email} (Score: {self.risk_score}%)"


class BannedUser(models.Model):
    """Utilisateurs bannis"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ban_info')
    
    ban_reason = models.TextField()
    permanent = models.BooleanField(default=False)
    banned_until = models.DateTimeField(null=True, blank=True, help_text="Si non permanent, date de fin du bannissement")
    
    banned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='banned_users')
    banned_at = models.DateTimeField(auto_now_add=True)
    
    # Informations de détection
    fraud_detection = models.ForeignKey(FraudDetection, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-banned_at']
    
    def __str__(self):
        return f"Banni: {self.user.email}"
    
    def is_banned(self):
        """Vérifie si l'utilisateur est actuellement banni"""
        if self.permanent:
            return True
        if self.banned_until:
            return timezone.now() < self.banned_until
        return False


# ============================================================================
# 5. PROFIL ENSEIGNANT ENRICHI (Extension du modèle Teacher existant)
# ============================================================================
# Note: Ces champs doivent être ajoutés au modèle Teacher existant
# ou créés dans un modèle séparé avec OneToOneField vers Teacher

class TeacherProfile(models.Model):
    """Profil enrichi de l'enseignant"""
    
    teacher = models.OneToOneField('teachers.Teacher', on_delete=models.CASCADE, related_name='profile')
    
    # Photo et documents
    photo = models.ImageField(upload_to='teachers/photos/', null=True, blank=True)
    cv_file = models.FileField(upload_to='teachers/cvs/', null=True, blank=True)
    diploma_files = models.JSONField(default=list, blank=True)  # Liste d'URLs
    
    # Localisation
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    
    # Expérience
    experience_start_year = models.IntegerField(null=True, blank=True)
    bio = models.TextField(blank=True)
    certifications = models.JSONField(default=list, blank=True)  # Liste de certifications
    
    # Langues
    languages = models.JSONField(default=list, blank=True)  # ['fr', 'en', 'ar']
    
    # Disponibilité
    available_days = models.JSONField(default=list, blank=True)  # ['monday', 'tuesday', ...]
    available_hours = models.CharField(max_length=200, blank=True)  # "9h-17h"
    
    # Métadonnées
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Profil {self.teacher.user.get_full_name()}"
    
    @property
    def years_of_experience(self):
        """Calcule les années d'expérience"""
        if self.experience_start_year:
            return timezone.now().year - self.experience_start_year
        return 0

