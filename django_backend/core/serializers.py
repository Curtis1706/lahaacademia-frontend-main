from rest_framework import serializers
from . import models as m
import uuid
import json


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'phone', 'role',
            'is_verified', 'is_active', 'created_at', 'reputation_score', 'badges'
        ]
        read_only_fields = ['id', 'created_at', 'reputation_score', 'badges']


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = m.Student
        fields = '__all__'


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    # Méthodes pour obtenir les URLs complètes des documents
    diploma_file_url = serializers.SerializerMethodField()
    criminal_record_file_url = serializers.SerializerMethodField()
    identity_document_file_url = serializers.SerializerMethodField()
    proof_of_address_file_url = serializers.SerializerMethodField()
    profile_photo_url = serializers.SerializerMethodField()
    cv_file_url = serializers.SerializerMethodField()
    
    def get_diploma_file_url(self, obj):
        if obj.diploma_file:
            return obj.diploma_file.url
        return None
    
    def get_criminal_record_file_url(self, obj):
        if obj.criminal_record_file:
            return obj.criminal_record_file.url
        return None
    
    def get_identity_document_file_url(self, obj):
        if obj.identity_document_file:
            return obj.identity_document_file.url
        return None
    
    def get_proof_of_address_file_url(self, obj):
        if obj.proof_of_address_file:
            return obj.proof_of_address_file.url
        return None
    
    def get_profile_photo_url(self, obj):
        if obj.profile_photo:
            return obj.profile_photo.url
        return None
    
    def get_cv_file_url(self, obj):
        if obj.cv_file:
            return obj.cv_file.url
        return None

    class Meta:
        model = m.Teacher
        fields = [
            'id', 'user', 'diploma_file', 'criminal_record_file', 'identity_document_file',
            'proof_of_address_file', 'profile_photo', 'cv_file', 'is_validated',
            'validation_date', 'validated_by', 'subjects', 'experience_years',
            'hourly_rate', 'bio', 'availability_schedule', 'max_students_per_session',
            'total_sessions', 'total_students', 'average_rating', 'total_earnings',
            'total_hours_taught', 'specializations', 'certifications',
            'diploma_file_url', 'criminal_record_file_url', 'identity_document_file_url',
            'proof_of_address_file_url', 'profile_photo_url', 'cv_file_url'
        ]


class AuthorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = m.Author
        fields = '__all__'


class ParentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    children = StudentSerializer(many=True, read_only=True)
    link_requests = serializers.SerializerMethodField()

    def get_link_requests(self, obj: m.Parent):
        reqs = m.ParentChildLinkRequest.objects.filter(parent=obj).order_by('-created_at')
        return ParentChildLinkRequestSerializer(reqs, many=True).data

    class Meta:
        model = m.Parent
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = m.Course
        fields = '__all__'


class CourseAvailabilitySerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = m.CourseAvailability
        fields = '__all__'

    def get_day_name(self, obj):
        days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        return days[obj.day_of_week]


class SessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    students = StudentSerializer(many=True, read_only=True)
    
    # Champs calculés
    is_full = serializers.SerializerMethodField()
    available_spots = serializers.SerializerMethodField()
    time_until_start = serializers.SerializerMethodField()
    duration_minutes = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    can_join = serializers.SerializerMethodField()

    class Meta:
        model = m.Session
        fields = [
            'id', 'course', 'teacher', 'students', 'start_time', 'end_time', 
            'status', 'meeting_link', 'meeting_password', 'max_capacity', 
            'current_enrollment', 'session_type', 'agenda', 'materials',
            'is_full', 'available_spots', 'time_until_start', 'duration_minutes',
            'status_display', 'can_join'
        ]

    def get_is_full(self, obj):
        """Vérifier si la session est complète"""
        return obj.current_enrollment >= obj.max_capacity

    def get_available_spots(self, obj):
        """Calculer le nombre de places disponibles"""
        return max(0, obj.max_capacity - obj.current_enrollment)

    def get_time_until_start(self, obj):
        """Calculer le temps restant jusqu'au début de la session"""
        from django.utils import timezone
        if obj.start_time:
            delta = obj.start_time - timezone.now()
            if delta.total_seconds() > 0:
                days = delta.days
                hours = delta.seconds // 3600
                minutes = (delta.seconds % 3600) // 60
                
                if days > 0:
                    return f"{days} jour(s), {hours}h {minutes}min"
                elif hours > 0:
                    return f"{hours}h {minutes}min"
                else:
                    return f"{minutes}min"
            else:
                return "Session en cours ou terminée"
        return None

    def get_duration_minutes(self, obj):
        """Calculer la durée de la session en minutes"""
        if obj.start_time and obj.end_time:
            delta = obj.end_time - obj.start_time
            return int(delta.total_seconds() / 60)
        return None

    def get_status_display(self, obj):
        """Obtenir le statut traduit"""
        status_map = {
            'scheduled': 'Programmée',
            'ongoing': 'En cours',
            'completed': 'Terminée',
            'cancelled': 'Annulée'
        }
        return status_map.get(obj.status, obj.status)

    def get_can_join(self, obj):
        """Vérifier si l'utilisateur peut rejoindre cette session"""
        from django.utils import timezone
        user = self.context.get('request').user if self.context.get('request') else None
        
        if not user:
            return False
            
        # Vérifier si l'utilisateur est déjà inscrit
        if hasattr(user, 'student') and user.student in obj.students.all():
            return False
            
        # Vérifier si la session est complète
        if obj.current_enrollment >= obj.max_capacity:
            return False
            
        # Vérifier si la session n'a pas encore commencé
        if obj.start_time <= timezone.now():
            return False
            
        return True


class BookingSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    session = SessionSerializer(read_only=True)
    
    # Champs calculés pour une meilleure expérience utilisateur
    booking_reference = serializers.SerializerMethodField()
    days_until_session = serializers.SerializerMethodField()
    session_status_display = serializers.SerializerMethodField()
    payment_status_display = serializers.SerializerMethodField()

    class Meta:
        model = m.Booking
        fields = [
            'id', 'student', 'teacher', 'session', 'booking_date', 'status', 
            'payment_status', 'special_requirements', 'cancellation_reason', 
            'refund_amount', 'booking_reference', 'days_until_session',
            'session_status_display', 'payment_status_display'
        ]

    def get_booking_reference(self, obj):
        """Générer une référence de réservation lisible"""
        return f"REF-{str(obj.id)[:8].upper()}"

    def get_days_until_session(self, obj):
        """Calculer le nombre de jours jusqu'à la session"""
        from django.utils import timezone
        if obj.session.start_time:
            delta = obj.session.start_time - timezone.now()
            return max(0, delta.days)
        return None

    def get_session_status_display(self, obj):
        """Obtenir le statut de session traduit"""
        status_map = {
            'scheduled': 'Programmée',
            'ongoing': 'En cours',
            'completed': 'Terminée',
            'cancelled': 'Annulée'
        }
        return status_map.get(obj.session.status, obj.session.status)

    def get_payment_status_display(self, obj):
        """Obtenir le statut de paiement traduit"""
        status_map = {
            'pending': 'En attente',
            'paid': 'Payé',
            'failed': 'Échoué',
            'refunded': 'Remboursé'
        }
        return status_map.get(obj.payment_status, obj.payment_status)


class ProgressSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    course = CourseSerializer(read_only=True)

    class Meta:
        model = m.Progress
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = m.Notification
        fields = '__all__'


class ParentChildLinkRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.ParentChildLinkRequest
        fields = ['id', 'parent', 'student', 'child_email', 'code', 'status', 'expires_at', 'created_at']
        read_only_fields = ['id', 'created_at']


# Registration serializers used in views
class StudentRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = m.Student
        fields = [
            'email', 'password', 'first_name', 'last_name',
            'date_of_birth', 'country', 'city', 'school_level', 'current_grade', 'school_name'
        ]

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = m.User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            role='student',
            referral_code=str(uuid.uuid4())[:8].upper(),
        )
        user.set_password(password)
        user.save()

        student = m.Student.objects.create(user=user, **validated_data)
        return student


class TeacherRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    subjects = serializers.CharField(write_only=True)  # Accepter comme chaîne

    class Meta:
        model = m.Teacher
        fields = [
            'email', 'password', 'first_name', 'last_name', 
            'subjects', 'experience_years', 'hourly_rate', 'bio',
            'diploma_file', 'criminal_record_file', 'identity_document_file',
            'proof_of_address_file', 'profile_photo', 'cv_file'
        ]

    def validate_subjects(self, value):
        """Convertir la chaîne subjects en tableau JSON"""
        if isinstance(value, str):
            try:
                # Essayer de parser comme JSON
                return json.loads(value)
            except json.JSONDecodeError:
                # Si ce n'est pas du JSON, créer un tableau avec la valeur
                return [value]
        return value

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = m.User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            role='teacher',
        )
        user.set_password(password)
        user.save()

        teacher = m.Teacher.objects.create(user=user, **validated_data)
        return teacher


class AuthorRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = m.Author
        fields = ['email', 'password', 'first_name', 'last_name', 'bio']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = m.User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            role='author',
        )
        user.set_password(password)
        user.save()

        author = m.Author.objects.create(user=user, **validated_data)
        return author


class ParentRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    class Meta:
        model = m.Parent
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')

        user = m.User.objects.create(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            role='parent',
        )
        user.set_password(password)
        user.save()

        parent = m.Parent.objects.create(user=user)
        return parent


# =============================================================================
# SÉRIALISEURS POUR LES NOUVELLES FONCTIONNALITÉS
# =============================================================================

class IncidentReportSerializer(serializers.ModelSerializer):
    reporter_name = serializers.SerializerMethodField()
    teacher_name = serializers.SerializerMethodField()
    
    def get_reporter_name(self, obj):
        return f"{obj.reporter.first_name} {obj.reporter.last_name}"
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
    
    class Meta:
        model = m.IncidentReport
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = m.PaymentConfiguration
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class TeacherPayoutSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
    
    class Meta:
        model = m.TeacherPayout
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SecurityAlertSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    
    def get_user_email(self, obj):
        return obj.user.email
    
    class Meta:
        model = m.SecurityAlert
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class BannedUserSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    banned_by_name = serializers.SerializerMethodField()
    
    def get_user_email(self, obj):
        return obj.user.email
    
    def get_banned_by_name(self, obj):
        return f"{obj.banned_by.first_name} {obj.banned_by.last_name}"
    
    class Meta:
        model = m.BannedUser
        fields = '__all__'
        read_only_fields = ['id', 'banned_at']


class TeacherRatingSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    
    def get_teacher_name(self, obj):
        return f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}"
    
    def get_student_name(self, obj):
        return f"{obj.student.user.first_name} {obj.student.user.last_name}"
    
    class Meta:
        model = m.TeacherRating
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdultStudentSerializer(serializers.ModelSerializer):
    """Sérialiseur spécialisé pour les étudiants adultes"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = m.Student
        fields = [
            'id', 'user', 'date_of_birth', 'country', 'city', 'school_level',
            'current_grade', 'school_name', 'is_adult', 'occupation', 
            'education_level', 'professional_experience', 'learning_objectives',
            'preferred_schedule', 'budget_range', 'certification_needed',
            'preferred_subjects', 'learning_style', 'goals'
        ]
        read_only_fields = ['id']


class EnhancedTeacherSerializer(serializers.ModelSerializer):
    """Sérialiseur enrichi pour les enseignants avec toutes les nouvelles informations"""
    user = UserSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()
    
    def get_average_rating(self, obj):
        ratings = m.TeacherRating.objects.filter(teacher=obj)
        if ratings.exists():
            return round(sum(r.rating for r in ratings) / ratings.count(), 1)
        return 0.0
    
    def get_total_ratings(self, obj):
        return m.TeacherRating.objects.filter(teacher=obj).count()
    
    class Meta:
        model = m.Teacher
        fields = [
            'id', 'user', 'profile_photo', 'is_validated', 'subjects', 
            'experience_years', 'hourly_rate', 'bio', 'location', 
            'languages_spoken', 'teaching_style', 'availability_for_adults',
            'reliability_score', 'average_rating', 'total_ratings',
            'total_sessions', 'total_students', 'total_hours_taught',
            'specializations', 'certifications'
        ]
        read_only_fields = ['id', 'average_rating', 'total_ratings']



