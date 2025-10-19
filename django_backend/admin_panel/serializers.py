from rest_framework import serializers
from .models import ContentReport, ActivityLog, BannedKeyword
from core.serializers import UserSerializer

class ContentReportSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)
    reviewed_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ContentReport
        fields = [
            'id', 'reported_by', 'content_type', 'content_id', 'reason',
            'severity', 'status', 'reviewed_by', 'reviewed_at', 
            'admin_notes', 'action_taken', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'action', 'entity_type', 'entity_id',
            'ip_address', 'user_agent', 'timestamp', 'details'
        ]

class BannedKeywordSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = BannedKeyword
        fields = [
            'id', 'keyword', 'severity', 'action', 'is_active',
            'created_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

