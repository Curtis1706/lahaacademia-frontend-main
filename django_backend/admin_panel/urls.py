from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentReportViewSet, ActivityLogViewSet, BannedKeywordViewSet
from . import video_access_views

router = DefaultRouter()
router.register(r'content-reports', ContentReportViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'banned-keywords', BannedKeywordViewSet)

urlpatterns = [
    path('admin/', include(router.urls)),
    
    # URLs pour le contrôle d'accès aux vidéos
    path('video-access/<uuid:video_id>/', video_access_views.check_video_access, name='check_video_access'),
    path('grant-access/<uuid:video_id>/', video_access_views.grant_video_access, name='grant_video_access'),
    path('video-progress/<uuid:video_id>/', video_access_views.user_video_progress, name='user_video_progress'),
    path('update-progress/<uuid:video_id>/', video_access_views.update_video_progress, name='update_video_progress'),
]

