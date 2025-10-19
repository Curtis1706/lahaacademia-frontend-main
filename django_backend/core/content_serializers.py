from rest_framework import serializers
from .models import (
    EducationalContent, QCM, QCMQuestion, QCMAnswer, 
    ContentRating, ContentTag, User
)


class ContentTagSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les tags de contenu"""
    
    class Meta:
        model = ContentTag
        fields = ['id', 'name', 'description', 'color', 'usage_count', 'created_at']


class EducationalContentSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le contenu pédagogique"""
    
    created_by_name = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    content_type_display = serializers.CharField(source='get_content_type_display', read_only=True)
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    class_level_display = serializers.CharField(source='get_class_level_display', read_only=True)
    country_display = serializers.CharField(source='get_country_display', read_only=True)
    difficulty_level_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # URLs des fichiers
    content_file_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    
    # Statistiques
    has_qcm = serializers.SerializerMethodField()
    qcm_count = serializers.SerializerMethodField()
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}" if obj.created_by else None
    
    def get_approved_by_name(self, obj):
        return f"{obj.approved_by.first_name} {obj.approved_by.last_name}" if obj.approved_by else None
    
    def get_content_file_url(self, obj):
        if obj.content_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.content_file.url)
            return obj.content_file.url
        return None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    def get_has_qcm(self, obj):
        return obj.qcm_sets.exists()
    
    def get_qcm_count(self, obj):
        return obj.qcm_sets.count()
    
    class Meta:
        model = EducationalContent
        fields = [
            'id', 'title', 'description', 'content_type', 'content_type_display',
            'subject', 'subject_display', 'class_level', 'class_level_display',
            'country', 'country_display', 'difficulty_level', 'difficulty_level_display',
            'duration_minutes', 'file_size_mb', 'file_format', 'content_file', 'content_file_url',
            'video_url', 'thumbnail', 'thumbnail_url', 'created_by', 'created_by_name',
            'approved_by', 'approved_by_name', 'status', 'status_display',
            'is_featured', 'is_free', 'price', 'view_count', 'download_count',
            'rating_average', 'rating_count', 'created_at', 'updated_at', 'published_at',
            'tags', 'keywords', 'learning_objectives', 'prerequisites',
            'has_qcm', 'qcm_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'view_count', 'download_count',
            'rating_average', 'rating_count', 'created_by', 'approved_by'
        ]


class EducationalContentCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de contenu pédagogique"""
    
    class Meta:
        model = EducationalContent
        fields = [
            'title', 'description', 'content_type', 'subject', 'class_level', 'country',
            'difficulty_level', 'duration_minutes', 'content_file', 'video_url',
            'thumbnail', 'is_featured', 'is_free', 'price', 'tags', 'keywords',
            'learning_objectives', 'prerequisites'
        ]
    
    def create(self, validated_data):
        # Ajouter l'utilisateur créateur
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class QCMAnswerSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les réponses QCM"""
    
    class Meta:
        model = QCMAnswer
        fields = ['id', 'answer_text', 'is_correct', 'order']


class QCMQuestionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les questions QCM"""
    
    answers = QCMAnswerSerializer(many=True, read_only=True)
    question_type_display = serializers.CharField(source='get_question_type_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    
    class Meta:
        model = QCMQuestion
        fields = [
            'id', 'question_text', 'question_type', 'question_type_display',
            'explanation', 'points', 'difficulty', 'difficulty_display',
            'order', 'image', 'audio_file', 'answers'
        ]


class QCMSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les QCM"""
    
    questions = QCMQuestionSerializer(many=True, read_only=True)
    created_by_name = serializers.SerializerMethodField()
    content_title = serializers.CharField(source='content.title', read_only=True)
    question_count = serializers.SerializerMethodField()
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}" if obj.created_by else None
    
    def get_question_count(self, obj):
        return obj.questions.count()
    
    class Meta:
        model = QCM
        fields = [
            'id', 'title', 'description', 'content', 'content_title',
            'time_limit_minutes', 'max_attempts', 'passing_score',
            'show_correct_answers', 'randomize_questions', 'total_attempts',
            'average_score', 'completion_rate', 'is_active', 'created_by',
            'created_by_name', 'created_at', 'updated_at', 'questions', 'question_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'total_attempts', 'average_score',
            'completion_rate', 'created_by'
        ]


class QCMCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création de QCM"""
    
    questions = QCMQuestionSerializer(many=True, required=False)
    
    class Meta:
        model = QCM
        fields = [
            'title', 'description', 'content', 'time_limit_minutes', 'max_attempts',
            'passing_score', 'show_correct_answers', 'randomize_questions', 'questions'
        ]
    
    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        validated_data['created_by'] = self.context['request'].user
        qcm = QCM.objects.create(**validated_data)
        
        # Créer les questions et réponses
        for question_data in questions_data:
            answers_data = question_data.pop('answers', [])
            question = QCMQuestion.objects.create(qcm=qcm, **question_data)
            
            for answer_data in answers_data:
                QCMAnswer.objects.create(question=question, **answer_data)
        
        return qcm


class ContentRatingSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les évaluations de contenu"""
    
    user_name = serializers.SerializerMethodField()
    rating_display = serializers.CharField(source='get_rating_display', read_only=True)
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" if obj.user else None
    
    class Meta:
        model = ContentRating
        fields = [
            'id', 'content', 'user', 'user_name', 'rating', 'rating_display',
            'comment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']
    
    def create(self, validated_data):
        # Ajouter l'utilisateur connecté
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EducationalContentListSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour la liste des contenus"""
    
    created_by_name = serializers.SerializerMethodField()
    content_type_display = serializers.CharField(source='get_content_type_display', read_only=True)
    subject_display = serializers.CharField(source='get_subject_display', read_only=True)
    class_level_display = serializers.CharField(source='get_class_level_display', read_only=True)
    country_display = serializers.CharField(source='get_country_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    
    def get_created_by_name(self, obj):
        return f"{obj.created_by.first_name} {obj.created_by.last_name}" if obj.created_by else None
    
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
    
    class Meta:
        model = EducationalContent
        fields = [
            'id', 'title', 'description', 'content_type', 'content_type_display',
            'subject', 'subject_display', 'class_level', 'class_level_display',
            'country', 'country_display', 'status', 'status_display',
            'created_by_name', 'is_featured', 'is_free', 'price',
            'view_count', 'rating_average', 'rating_count', 'created_at',
            'thumbnail_url'
        ]
