from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, StudentViewSet, TeacherViewSet, AuthorViewSet, ParentViewSet, 
    CourseViewSet, CourseAvailabilityViewSet, BookingViewSet,
    IncidentReportViewSet, PaymentConfigurationViewSet, TeacherPayoutViewSet,
    SecurityAlertViewSet, TeacherRatingViewSet, AdultStudentViewSet, EnhancedTeacherViewSet
)
from .content_views import EducationalContentViewSet, QCMViewSet, QCMQuestionViewSet, ContentRatingViewSet, ContentTagViewSet
from .auth_views import login_view, logout_view, me_view

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'students', StudentViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'parents', ParentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'course-availabilities', CourseAvailabilityViewSet)
router.register(r'incident-reports', IncidentReportViewSet)
router.register(r'payment-configurations', PaymentConfigurationViewSet)
router.register(r'teacher-payouts', TeacherPayoutViewSet)
router.register(r'security-alerts', SecurityAlertViewSet)
router.register(r'teacher-ratings', TeacherRatingViewSet)
router.register(r'adult-students', AdultStudentViewSet)
router.register(r'enhanced-teachers', EnhancedTeacherViewSet)

# URLs pour la gestion des contenus pédagogiques
router.register(r'educational-content', EducationalContentViewSet)
router.register(r'qcm', QCMViewSet)
router.register(r'qcm-questions', QCMQuestionViewSet)
router.register(r'content-ratings', ContentRatingViewSet)
router.register(r'content-tags', ContentTagViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/logout/', logout_view, name='logout'),
    path('api/auth/me/', me_view, name='me'),
]

