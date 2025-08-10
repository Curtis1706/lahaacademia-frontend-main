from rest_framework import serializers
from . import models as m
import uuid


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

    class Meta:
        model = m.Teacher
        fields = '__all__'


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


class SessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    students = StudentSerializer(many=True, read_only=True)

    class Meta:
        model = m.Session
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    teacher = TeacherSerializer(read_only=True)
    session = SessionSerializer(read_only=True)

    class Meta:
        model = m.Booking
        fields = '__all__'


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
    parent = ParentSerializer(read_only=True)
    student = StudentSerializer(read_only=True)

    class Meta:
        model = m.ParentChildLinkRequest
        fields = '__all__'


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

    class Meta:
        model = m.Teacher
        fields = ['email', 'password', 'first_name', 'last_name', 'subjects', 'experience_years', 'hourly_rate', 'bio']

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


