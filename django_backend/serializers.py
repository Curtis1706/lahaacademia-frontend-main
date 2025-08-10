from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'is_verified', 'is_active', 
                  'created_at', 'reputation_score', 'badges']
        read_only_fields = ['id', 'created_at', 'reputation_score', 'badges']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'

class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TeacherProfile
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    students = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Session
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    teacher = UserSerializer(read_only=True)
    session = SessionSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

class ProgressSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Progress
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = '__all__'
