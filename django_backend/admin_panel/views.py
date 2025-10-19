from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from django.db.models import Count
from .models import ContentReport, ActivityLog, BannedKeyword
from .serializers import ContentReportSerializer, ActivityLogSerializer, BannedKeywordSerializer

class ContentReportViewSet(viewsets.ModelViewSet):
    queryset = ContentReport.objects.all()
    serializer_class = ContentReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'review', 'take_action', 'pending']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        """Créer un signalement"""
        serializer.save(reported_by=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def review(self, request, pk=None):
        """Examiner un signalement"""
        report = self.get_object()
        
        report.status = 'reviewing'
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.admin_notes = request.data.get('notes', '')
        report.save()
        
        return Response(ContentReportSerializer(report).data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def take_action(self, request, pk=None):
        """Prendre une action suite au signalement"""
        report = self.get_object()
        action_type = request.data.get('action_type')  # 'remove', 'warn', 'ban', 'dismiss'
        
        report.status = 'action_taken' if action_type != 'dismiss' else 'dismissed'
        report.action_taken = action_type
        report.admin_notes = request.data.get('notes', '')
        report.save()
        
        # Log de l'action
        ActivityLog.objects.create(
            user=request.user,
            action=f'report_{action_type}',
            entity_type='ContentReport',
            entity_id=report.id,
            details={
                'report_id': str(report.id),
                'content_type': report.content_type,
                'action': action_type
            }
        )
        
        return Response({'status': 'success', 'action': action_type})
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def pending(self, request):
        """Signalements en attente"""
        reports = ContentReport.objects.filter(status='pending')
        return Response({
            'count': reports.count(),
            'reports': ContentReportSerializer(reports, many=True).data
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        """Statistiques des signalements"""
        stats = ContentReport.objects.values('status').annotate(
            count=Count('id')
        )
        
        return Response({
            'by_status': list(stats),
            'total_reports': ContentReport.objects.count(),
            'pending_count': ContentReport.objects.filter(status='pending').count()
        })


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        queryset = ActivityLog.objects.all()
        
        # Filtres
        user_id = self.request.query_params.get('user_id')
        action = self.request.query_params.get('action')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if action:
            queryset = queryset.filter(action__icontains=action)
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Statistiques des logs"""
        stats = ActivityLog.objects.values('action').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        return Response({
            'top_actions': list(stats),
            'total_logs': ActivityLog.objects.count(),
            'unique_users': ActivityLog.objects.values('user').distinct().count()
        })


class BannedKeywordViewSet(viewsets.ModelViewSet):
    queryset = BannedKeyword.objects.all()
    serializer_class = BannedKeywordSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        """Assigner l'utilisateur qui crée le mot interdit"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def check_content(self, request):
        """Vérifier si un contenu contient des mots interdits"""
        content = request.data.get('content', '')
        found_keywords = []
        
        if content:
            for keyword in BannedKeyword.objects.filter(is_active=True):
                if keyword.keyword.lower() in content.lower():
                    found_keywords.append({
                        'keyword': keyword.keyword,
                        'severity': keyword.severity,
                        'action': keyword.action
                    })
        
        return Response({
            'has_banned_content': len(found_keywords) > 0,
            'found_keywords': found_keywords
        })

