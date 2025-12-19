"""
Configuration Django Admin pour les nouveaux modèles
"""

from django.contrib import admin
from .models import (
    IncidentReport, CommissionRate, TeacherEarning, TeacherPayment,
    TeacherWarning, FraudDetection, BannedUser, TeacherProfile
)


@admin.register(IncidentReport)
class IncidentReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'reporter', 'teacher', 'incident_type', 'severity', 'status', 'created_at']
    list_filter = ['status', 'severity', 'incident_type', 'created_at']
    search_fields = ['reporter__email', 'teacher__user__email', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'resolution_date']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('id', 'reporter', 'teacher', 'booking')
        }),
        ('Détails de l\'incident', {
            'fields': ('incident_type', 'severity', 'description', 'evidence')
        }),
        ('Traitement', {
            'fields': ('status', 'admin_notes', 'resolution', 'action_taken', 'resolved_by', 'resolution_date')
        }),
        ('Métadonnées', {
            'fields': ('metadata', 'created_at', 'updated_at')
        }),
    )


@admin.register(CommissionRate)
class CommissionRateAdmin(admin.ModelAdmin):
    list_display = ['default_rate', 'individual_rate', 'group_rate', 'updated_at', 'updated_by']
    readonly_fields = ['id', 'updated_at']


@admin.register(TeacherEarning)
class TeacherEarningAdmin(admin.ModelAdmin):
    list_display = ['id', 'teacher', 'booking', 'gross_amount', 'net_amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['teacher__user__email', 'booking__id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informations', {
            'fields': ('id', 'teacher', 'booking')
        }),
        ('Montants', {
            'fields': ('gross_amount', 'commission_rate', 'commission_amount', 'net_amount')
        }),
        ('Paiement', {
            'fields': ('status', 'payment_date', 'payment_method', 'payment_proof', 'payment_notes')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(TeacherPayment)
class TeacherPaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'teacher', 'total_amount', 'payment_method', 'processed_at', 'processed_by']
    list_filter = ['payment_method', 'processed_at']
    search_fields = ['teacher__user__email']
    filter_horizontal = ['earnings']


@admin.register(TeacherWarning)
class TeacherWarningAdmin(admin.ModelAdmin):
    list_display = ['id', 'teacher', 'warning_type', 'severity', 'action_taken', 'issued_at', 'issued_by']
    list_filter = ['warning_type', 'severity', 'action_taken', 'issued_at']
    search_fields = ['teacher__user__email', 'message']
    readonly_fields = ['id', 'issued_at']


@admin.register(FraudDetection)
class FraudDetectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'email', 'phone', 'risk_score', 'action', 'status', 'created_at']
    list_filter = ['action', 'status', 'risk_score', 'created_at']
    search_fields = ['email', 'phone', 'ip_address']
    readonly_fields = ['id', 'created_at', 'reviewed_at']
    
    fieldsets = (
        ('Informations utilisateur', {
            'fields': ('user', 'email', 'phone')
        }),
        ('Détection', {
            'fields': ('device_fingerprint', 'ip_address', 'user_agent', 'password_hash')
        }),
        ('Risque', {
            'fields': ('risk_score', 'risk_factors', 'action', 'status')
        }),
        ('Révision', {
            'fields': ('reviewed_by', 'reviewed_at')
        }),
        ('Dates', {
            'fields': ('created_at',)
        }),
    )


@admin.register(BannedUser)
class BannedUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'ban_reason', 'permanent', 'banned_until', 'banned_at', 'banned_by']
    list_filter = ['permanent', 'banned_at']
    search_fields = ['user__email', 'ban_reason']
    readonly_fields = ['id', 'banned_at']


@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ['teacher', 'country', 'city', 'is_verified', 'years_of_experience']
    list_filter = ['country', 'is_verified']
    search_fields = ['teacher__user__email', 'teacher__user__first_name', 'teacher__user__last_name']
    readonly_fields = ['created_at', 'updated_at']

