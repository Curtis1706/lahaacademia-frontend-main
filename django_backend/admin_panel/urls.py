from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContentReportViewSet, ActivityLogViewSet, BannedKeywordViewSet

router = DefaultRouter()
router.register(r'content-reports', ContentReportViewSet)
router.register(r'activity-logs', ActivityLogViewSet)
router.register(r'banned-keywords', BannedKeywordViewSet)

urlpatterns = [
    path('admin/', include(router.urls)),
]

