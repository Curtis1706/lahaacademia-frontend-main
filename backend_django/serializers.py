"""
Serializers Django REST Framework pour les nouvelles fonctionnalités
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    IncidentReport, CommissionRate, TeacherEarning, TeacherPayment,
    TeacherWarning, FraudDetection, BannedUser, TeacherProfile
)


# ============================================================================
# 1. SYSTÈME DE SIGNALEMENT D'INCIDENTS
# ============================================================================

class IncidentReportSerializer(serializers.ModelSerializer):
    """Serializer pour les signalements d'incidents"""
    
    reporter_name = serializers.SerializerMethodField()
    reporter_role = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    booking_title = serializers.SerializerMethodField()
    
    class Meta:
        model = IncidentReport
        fields = [
            'id', 'reporter', 'reporter_name', 'reporter_role',
            'teacher', 'teacher_name', 'booking', 'booking_title',
            'incident_type', 'severity', 'description', 'evidence',
            'status', 'admin_notes', 'resolution', 'action_taken',
            'resolution_date', 'resolved_by', 'metadata',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolution_date']
    
    def get_reporter_name(self, obj):
        return f"{obj.reporter.first_name} {obj.reporter.last_name}".strip() or obj.reporter.email
    
    def get_reporter_role(self, obj):
        # Déterminer le rôle (student, parent, etc.)
        if hasattr(obj.reporter, 'student'):
            return 'student'
        elif hasattr(obj.reporter, 'parent'):
            return 'parent'
        return 'other'
    
    def get_teacher_name(self, obj):
        if obj.teacher and hasattr(obj.teacher, 'user'):
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}".strip()
        return "Enseignant inconnu"
    
    def get_booking_title(self, obj):
        if obj.booking:
            return str(obj.booking)
        return None


class IncidentReportCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un signalement"""
    
    class Meta:
        model = IncidentReport
        fields = [
            'teacher_id', 'booking_id', 'incident_type', 'severity',
            'description', 'evidence', 'metadata'
        ]
    
    teacher_id = serializers.UUIDField(write_only=True)
    booking_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    
    def create(self, validated_data):
        teacher_id = validated_data.pop('teacher_id')
        booking_id = validated_data.pop('booking_id', None)
        
        from teachers.models import Teacher
        from bookings.models import Booking
        
        teacher = Teacher.objects.get(id=teacher_id)
        booking = Booking.objects.get(id=booking_id) if booking_id else None
        
        validated_data['teacher'] = teacher
        validated_data['booking'] = booking
        validated_data['reporter'] = self.context['request'].user
        
        return super().create(validated_data)


# ============================================================================
# 2. RÉMUNÉRATION ENSEIGNANTS + COMMISSION
# ============================================================================

class CommissionRateSerializer(serializers.ModelSerializer):
    """Serializer pour les taux de commission"""
    
    class Meta:
        model = CommissionRate
        fields = ['id', 'default_rate', 'individual_rate', 'group_rate', 'updated_at', 'updated_by']
        read_only_fields = ['id', 'updated_at']


class TeacherEarningSerializer(serializers.ModelSerializer):
    """Serializer pour les revenus des enseignants"""
    
    teacher_name = serializers.SerializerMethodField()
    course_title = serializers.SerializerMethodField()
    
    class Meta:
        model = TeacherEarning
        fields = [
            'id', 'teacher', 'teacher_name', 'booking', 'course_title',
            'gross_amount', 'commission_rate', 'commission_amount', 'net_amount',
            'status', 'payment_date', 'payment_method', 'payment_proof',
            'payment_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_teacher_name(self, obj):
        if obj.teacher and hasattr(obj.teacher, 'user'):
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}".strip()
        return "Enseignant inconnu"
    
    def get_course_title(self, obj):
        if obj.booking and hasattr(obj.booking, 'course'):
            return obj.booking.course.title
        return "Cours inconnu"


class TeacherEarningSummarySerializer(serializers.Serializer):
    """Serializer pour le résumé des revenus"""
    
    total_earnings = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    ready_to_pay = serializers.DecimalField(max_digits=10, decimal_places=2)
    this_month = serializers.DecimalField(max_digits=10, decimal_places=2)
    this_week = serializers.DecimalField(max_digits=10, decimal_places=2)


class TeacherPaymentSerializer(serializers.ModelSerializer):
    """Serializer pour les paiements aux enseignants"""
    
    teacher_name = serializers.SerializerMethodField()
    processed_by_name = serializers.SerializerMethodField()
    earnings_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TeacherPayment
        fields = [
            'id', 'teacher', 'teacher_name', 'earnings', 'earnings_count',
            'total_amount', 'payment_method', 'payment_proof', 'notes',
            'processed_by', 'processed_by_name', 'processed_at'
        ]
        read_only_fields = ['id', 'processed_at']
    
    def get_teacher_name(self, obj):
        if obj.teacher and hasattr(obj.teacher, 'user'):
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}".strip()
        return "Enseignant inconnu"
    
    def get_processed_by_name(self, obj):
        if obj.processed_by:
            return f"{obj.processed_by.first_name} {obj.processed_by.last_name}".strip()
        return None
    
    def get_earnings_count(self, obj):
        return obj.earnings.count()


# ============================================================================
# 3. DÉTECTION ANNULATIONS FRÉQUENTES
# ============================================================================

class TeacherWarningSerializer(serializers.ModelSerializer):
    """Serializer pour les avertissements enseignants"""
    
    teacher_name = serializers.SerializerMethodField()
    issued_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TeacherWarning
        fields = [
            'id', 'teacher', 'teacher_name', 'warning_type', 'severity',
            'message', 'action_taken', 'metadata', 'issued_by',
            'issued_by_name', 'issued_at'
        ]
        read_only_fields = ['id', 'issued_at']
    
    def get_teacher_name(self, obj):
        if obj.teacher and hasattr(obj.teacher, 'user'):
            return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}".strip()
        return "Enseignant inconnu"
    
    def get_issued_by_name(self, obj):
        if obj.issued_by:
            return f"{obj.issued_by.first_name} {obj.issued_by.last_name}".strip()
        return None


class TeacherMetricsSerializer(serializers.Serializer):
    """Serializer pour les métriques d'un enseignant"""
    
    teacher_id = serializers.UUIDField()
    teacher_name = serializers.CharField()
    total_bookings = serializers.IntegerField()
    completed = serializers.IntegerField()
    cancelled_by_teacher = serializers.IntegerField()
    cancelled_by_student = serializers.IntegerField()
    cancellation_rate = serializers.FloatField()
    last_minute_cancellations = serializers.IntegerField()
    average_rating = serializers.FloatField()
    warnings_issued = serializers.IntegerField()
    last_warning_date = serializers.DateTimeField(allow_null=True)
    is_suspended = serializers.BooleanField()
    status = serializers.CharField()


# ============================================================================
# 4. SÉCURITÉ ANTI-FRAUDE
# ============================================================================

class FraudDetectionSerializer(serializers.ModelSerializer):
    """Serializer pour la détection de fraude"""
    
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    reviewed_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = FraudDetection
        fields = [
            'id', 'user', 'user_email', 'user_name', 'email', 'phone',
            'device_fingerprint', 'ip_address', 'user_agent',
            'risk_score', 'risk_factors', 'action', 'status',
            'reviewed_by', 'reviewed_by_name', 'reviewed_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'reviewed_at']
    
    def get_user_email(self, obj):
        return obj.user.email if obj.user else obj.email
    
    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return None
    
    def get_reviewed_by_name(self, obj):
        if obj.reviewed_by:
            return f"{obj.reviewed_by.first_name} {obj.reviewed_by.last_name}".strip()
        return None


class FraudCheckRequestSerializer(serializers.Serializer):
    """Serializer pour la requête de vérification de fraude"""
    
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password_hash = serializers.CharField(required=False)
    device_fingerprint = serializers.CharField(required=False)
    ip_address = serializers.IPAddressField(required=False)
    user_agent = serializers.CharField(required=False)


class FraudCheckResponseSerializer(serializers.Serializer):
    """Serializer pour la réponse de vérification de fraude"""
    
    risk_score = serializers.IntegerField()
    risk_factors = serializers.DictField()
    action = serializers.ChoiceField(choices=['allow', 'review', 'block'])
    message = serializers.CharField(required=False)
    requires_manual_review = serializers.BooleanField()


class BannedUserSerializer(serializers.ModelSerializer):
    """Serializer pour les utilisateurs bannis"""
    
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    banned_by_name = serializers.SerializerMethodField()
    is_currently_banned = serializers.SerializerMethodField()
    
    class Meta:
        model = BannedUser
        fields = [
            'id', 'user', 'user_email', 'user_name', 'ban_reason',
            'permanent', 'banned_until', 'banned_by', 'banned_by_name',
            'banned_at', 'is_currently_banned'
        ]
        read_only_fields = ['id', 'banned_at']
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()
    
    def get_banned_by_name(self, obj):
        if obj.banned_by:
            return f"{obj.banned_by.first_name} {obj.banned_by.last_name}".strip()
        return None
    
    def get_is_currently_banned(self, obj):
        return obj.is_banned()


# ============================================================================
# 5. PROFIL ENSEIGNANT ENRICHI
# ============================================================================

class TeacherPublicProfileSerializer(serializers.ModelSerializer):
    """Serializer pour le profil public d'un enseignant"""
    
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()
    diploma_urls = serializers.SerializerMethodField()
    
    # Statistiques calculées
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    total_hours = serializers.SerializerMethodField()
    completed_bookings_count = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    years_of_experience = serializers.SerializerMethodField()
    is_verified = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    # Matières enseignées
    subjects = serializers.SerializerMethodField()
    
    class Meta:
        model = TeacherProfile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'photo_url', 'cv_url', 'diploma_urls', 'bio',
            'country', 'city', 'timezone',
            'years_of_experience', 'experience_start_year',
            'languages', 'certifications',
            'available_days', 'available_hours',
            'average_rating', 'total_reviews', 'total_hours',
            'completed_bookings_count', 'completion_rate',
            'is_verified', 'status', 'subjects'
        ]
    
    def get_first_name(self, obj):
        return obj.teacher.user.first_name if obj.teacher.user else ''
    
    def get_last_name(self, obj):
        return obj.teacher.user.last_name if obj.teacher.user else ''
    
    def get_email(self, obj):
        return obj.teacher.user.email if obj.teacher.user else ''
    
    def get_phone(self, obj):
        # Récupérer depuis le profil utilisateur si disponible
        return getattr(obj.teacher.user, 'phone', '') if obj.teacher.user else ''
    
    def get_photo_url(self, obj):
        if obj.photo:
            return obj.photo.url
        return None
    
    def get_cv_url(self, obj):
        if obj.cv_file:
            return obj.cv_file.url
        return None
    
    def get_diploma_urls(self, obj):
        # Retourner les URLs des diplômes
        return obj.diploma_files if obj.diploma_files else []
    
    def get_average_rating(self, obj):
        # Calculer depuis les avis
        from reviews.models import Review
        reviews = Review.objects.filter(teacher=obj.teacher)
        if reviews.exists():
            return reviews.aggregate(avg=models.Avg('rating'))['avg'] or 0.0
        return 0.0
    
    def get_total_reviews(self, obj):
        from reviews.models import Review
        return Review.objects.filter(teacher=obj.teacher).count()
    
    def get_total_hours(self, obj):
        # Calculer depuis les réservations complétées
        from bookings.models import Booking
        bookings = Booking.objects.filter(
            teacher=obj.teacher,
            status='completed'
        )
        total = sum(booking.duration for booking in bookings if hasattr(booking, 'duration'))
        return total
    
    def get_completed_bookings_count(self, obj):
        from bookings.models import Booking
        return Booking.objects.filter(
            teacher=obj.teacher,
            status='completed'
        ).count()
    
    def get_completion_rate(self, obj):
        from bookings.models import Booking
        total = Booking.objects.filter(teacher=obj.teacher).count()
        completed = Booking.objects.filter(
            teacher=obj.teacher,
            status='completed'
        ).count()
        if total > 0:
            return round((completed / total) * 100, 2)
        return 0.0
    
    def get_years_of_experience(self, obj):
        return obj.years_of_experience
    
    def get_is_verified(self, obj):
        return obj.is_verified or (obj.teacher.status == 'approved' if hasattr(obj.teacher, 'status') else False)
    
    def get_status(self, obj):
        return getattr(obj.teacher, 'status', 'unknown')
    
    def get_subjects(self, obj):
        # Récupérer les matières enseignées
        from courses.models import Course
        courses = Course.objects.filter(teacher=obj.teacher).distinct()
        subjects = []
        for course in courses:
            subjects.append({
                'id': str(course.id),
                'name': course.subject if hasattr(course, 'subject') else 'Matière',
                'level': course.level if hasattr(course, 'level') else 'Niveau',
                'price_per_hour': float(course.price) if hasattr(course, 'price') else 0.0
            })
        return subjects

