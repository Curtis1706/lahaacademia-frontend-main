"""
URLs Django pour les nouvelles fonctionnalités
À intégrer dans votre urls.py principal
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Signalements d'incidents
router.register(r'reports', views.IncidentReportViewSet, basename='reports')

# Commission et rémunération
router.register(r'admin/commission-rates', views.CommissionRateViewSet, basename='commission-rates')
router.register(r'teachers/earnings', views.TeacherEarningViewSet, basename='teacher-earnings')
router.register(r'admin/teachers/payments', views.TeacherPaymentViewSet, basename='teacher-payments')

# Avertissements enseignants
router.register(r'admin/teachers/(?P<teacher_id>[^/.]+)/warnings', views.TeacherWarningViewSet, basename='teacher-warnings')

urlpatterns = [
    # Router URLs
    path('api/', include(router.urls)),
    
    # Signalements - Actions spéciales
    path('api/reports/<uuid:pk>/resolve/', views.IncidentReportViewSet.as_view({'post': 'resolve'}), name='report-resolve'),
    path('api/reports/teacher/<uuid:teacherId>/', views.IncidentReportViewSet.as_view({'get': 'list'}), name='teacher-reports'),
    
    # Métriques enseignants
    path('api/admin/teachers/<uuid:teacher_id>/metrics/', views.TeacherMetricsView.as_view(), name='teacher-metrics'),
    path('api/admin/teachers/at-risk/', views.TeacherAtRiskView.as_view(), name='teachers-at-risk'),
    
    # Sécurité anti-fraude
    path('api/security/fraud-check/', views.FraudCheckView.as_view(), name='fraud-check'),
    path('api/admin/security/suspicious-users/', views.SuspiciousUsersView.as_view(), name='suspicious-users'),
    path('api/admin/security/ban-user/', views.BanUserView.as_view(), name='ban-user'),
    path('api/admin/security/banned-list/', views.BannedListView.as_view(), name='banned-list'),
    
    # Profil enseignant public
    path('api/teachers/<uuid:teacher_id>/public-profile/', views.TeacherPublicProfileView.as_view(), name='teacher-public-profile'),
    path('api/teachers/<uuid:teacher_id>/stats/', views.TeacherStatsView.as_view(), name='teacher-stats'),
    
    # Avis enseignants (si pas déjà créé)
    # path('api/teachers/<uuid:teacher_id>/reviews/', views.TeacherReviewsView.as_view(), name='teacher-reviews'),
]

