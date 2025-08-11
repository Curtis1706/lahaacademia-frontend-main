from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, StudentViewSet, TeacherViewSet, AuthorViewSet, ParentViewSet, CourseViewSet, CourseAvailabilityViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'students', StudentViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'parents', ParentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'course-availabilities', CourseAvailabilityViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('rest_framework.urls')),
]

