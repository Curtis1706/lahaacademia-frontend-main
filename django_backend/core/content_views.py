from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg
from django.http import HttpResponse
import mimetypes
import os

from .models import (
    EducationalContent, QCM, QCMQuestion, QCMAnswer, 
    ContentRating, ContentTag
)
from .content_serializers import (
    EducationalContentSerializer, EducationalContentCreateSerializer,
    EducationalContentListSerializer, QCMSerializer, QCMCreateSerializer,
    QCMQuestionSerializer, ContentRatingSerializer, ContentTagSerializer
)


class EducationalContentViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des contenus pédagogiques"""
    
    queryset = EducationalContent.objects.all()
    serializer_class = EducationalContentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['content_type', 'subject', 'class_level', 'country', 'status', 'is_free']
    search_fields = ['title', 'description', 'tags', 'keywords']
    ordering_fields = ['created_at', 'updated_at', 'title', 'view_count', 'rating_average']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return EducationalContentCreateSerializer
        elif self.action == 'list':
            return EducationalContentListSerializer
        return EducationalContentSerializer
    
    def get_permissions(self):
        """
        Instancie et retourne la liste des permissions que cette vue requiert.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtrer les contenus selon les permissions"""
        queryset = super().get_queryset()
        
        # Les admins voient tout, les autres utilisateurs voient seulement le contenu publié
        if not self.request.user.is_staff:
            queryset = queryset.filter(status='published')
        
        # Filtrage par contenu de l'utilisateur connecté
        if self.request.query_params.get('my_content') == 'true':
            queryset = queryset.filter(created_by=self.request.user)
        
        return queryset.select_related('created_by', 'approved_by')
    
    def perform_create(self, serializer):
        """Créer un nouveau contenu"""
        serializer.save(created_by=self.request.user)
    
    def perform_update(self, serializer):
        """Mettre à jour un contenu"""
        # Seul l'auteur ou un admin peut modifier
        if not (self.request.user.is_staff or serializer.instance.created_by == self.request.user):
            return Response(
                {'error': 'Vous n\'avez pas la permission de modifier ce contenu.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approuver un contenu (admin seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent approuver du contenu.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        content = self.get_object()
        content.status = 'published'
        content.approved_by = request.user
        content.save()
        
        serializer = self.get_serializer(content)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Rejeter un contenu (admin seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent rejeter du contenu.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        content = self.get_object()
        content.status = 'draft'
        content.save()
        
        serializer = self.get_serializer(content)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """Basculer le statut "en vedette" (admin seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent modifier le statut en vedette.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        content = self.get_object()
        content.is_featured = not content.is_featured
        content.save()
        
        serializer = self.get_serializer(content)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Télécharger le fichier de contenu"""
        content = self.get_object()
        
        if not content.content_file:
            return Response(
                {'error': 'Aucun fichier disponible pour ce contenu.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Incrémenter le compteur de téléchargements
        content.download_count += 1
        content.save()
        
        # Préparer la réponse de téléchargement
        file_path = content.content_file.path
        file_name = os.path.basename(file_path)
        
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            return response
    
    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Évaluer un contenu"""
        content = self.get_object()
        rating_value = request.data.get('rating')
        comment = request.data.get('comment', '')
        
        if not rating_value or not (1 <= int(rating_value) <= 5):
            return Response(
                {'error': 'La note doit être entre 1 et 5.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer ou mettre à jour l'évaluation
        rating, created = ContentRating.objects.get_or_create(
            content=content,
            user=request.user,
            defaults={'rating': int(rating_value), 'comment': comment}
        )
        
        if not created:
            rating.rating = int(rating_value)
            rating.comment = comment
            rating.save()
        
        # Recalculer la note moyenne
        ratings = ContentRating.objects.filter(content=content)
        content.rating_average = ratings.aggregate(Avg('rating'))['rating__avg'] or 0.0
        content.rating_count = ratings.count()
        content.save()
        
        serializer = ContentRatingSerializer(rating)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques des contenus (admin seulement)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Seuls les administrateurs peuvent voir les statistiques.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        stats = {
            'total_content': EducationalContent.objects.count(),
            'published_content': EducationalContent.objects.filter(status='published').count(),
            'draft_content': EducationalContent.objects.filter(status='draft').count(),
            'content_by_type': dict(
                EducationalContent.objects.values('content_type').annotate(
                    count=Count('id')
                ).values_list('content_type', 'count')
            ),
            'content_by_subject': dict(
                EducationalContent.objects.values('subject').annotate(
                    count=Count('id')
                ).values_list('subject', 'count')
            ),
            'content_by_country': dict(
                EducationalContent.objects.values('country').annotate(
                    count=Count('id')
                ).values_list('country', 'count')
            ),
            'average_rating': EducationalContent.objects.aggregate(
                avg_rating=Avg('rating_average')
            )['avg_rating'] or 0.0,
            'total_downloads': sum(
                EducationalContent.objects.values_list('download_count', flat=True)
            ),
            'total_views': sum(
                EducationalContent.objects.values_list('view_count', flat=True)
            ),
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def filter_options(self, request):
        """Options de filtrage disponibles"""
        return Response({
            'content_types': [{'value': choice[0], 'label': choice[1]} 
                            for choice in EducationalContent.CONTENT_TYPE_CHOICES],
            'subjects': [{'value': choice[0], 'label': choice[1]} 
                        for choice in EducationalContent.SUBJECTS],
            'class_levels': [{'value': choice[0], 'label': choice[1]} 
                           for choice in EducationalContent.CLASS_LEVELS],
            'countries': [{'value': choice[0], 'label': choice[1]} 
                        for choice in EducationalContent.COUNTRIES],
            'difficulty_levels': [{'value': choice[0], 'label': choice[1]} 
                                for choice in EducationalContent.DIFFICULTY_LEVELS],
            'statuses': [{'value': choice[0], 'label': choice[1]} 
                       for choice in EducationalContent.STATUS_CHOICES],
        })


class QCMViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des QCM"""
    
    queryset = QCM.objects.all()
    serializer_class = QCMSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['content', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return QCMCreateSerializer
        return QCMSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('content', 'created_by').prefetch_related('questions__answers')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class QCMQuestionViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des questions QCM"""
    
    queryset = QCMQuestion.objects.all()
    serializer_class = QCMQuestionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['qcm', 'question_type', 'difficulty']
    ordering_fields = ['order', 'created_at']
    ordering = ['order']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('qcm').prefetch_related('answers')


class ContentRatingViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des évaluations de contenu"""
    
    queryset = ContentRating.objects.all()
    serializer_class = ContentRatingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['content', 'rating']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.select_related('content', 'user')


class ContentTagViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des tags de contenu"""
    
    queryset = ContentTag.objects.all()
    serializer_class = ContentTagSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'usage_count', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
