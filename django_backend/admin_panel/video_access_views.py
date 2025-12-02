from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q
from core.models import User, Student, Teacher, Parent, EducationalContent
from admin_panel.models import (
    VideoAccessLevel, 
    VideoAccessRule, 
    UserVideoAccess, 
    UserProgress, 
    UserSubscription
)
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_video_access(request, video_id):
    """
    Vérifie si l'utilisateur a accès à une vidéo spécifique
    selon le cahier des charges LahaAcademia
    """
    try:
        user = request.user
        video = get_object_or_404(EducationalContent, id=video_id)
        
        # 1. Vérification de l'authentification
        if not user.is_authenticated:
            return Response({
                'has_access': False,
                'reason': 'authentification_requise',
                'message': 'Vous devez être connecté pour accéder à cette vidéo.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # 2. Vérification du niveau scolaire
        user_profile = get_user_profile(user)
        if not user_profile:
            return Response({
                'has_access': False,
                'reason': 'profil_incomplet',
                'message': 'Votre profil utilisateur est incomplet.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # 3. Vérification des règles d'accès spécifiques
        access_result = check_video_access_rules(user, video, user_profile)
        if not access_result['has_access']:
            return Response(access_result, status=status.HTTP_403_FORBIDDEN)
        
        # 4. Vérification de l'abonnement/achat
        subscription_result = check_user_subscription(user, video)
        if not subscription_result['has_access']:
            return Response(subscription_result, status=status.HTTP_403_FORBIDDEN)
        
        # 5. Vérification de la progression (prérequis)
        progression_result = check_prerequisites(user, video)
        if not progression_result['has_access']:
            return Response(progression_result, status=status.HTTP_403_FORBIDDEN)
        
        # 6. Vérification de la disponibilité temporelle
        time_result = check_time_availability(video)
        if not time_result['has_access']:
            return Response(time_result, status=status.HTTP_403_FORBIDDEN)
        
        # Si toutes les vérifications passent
        return Response({
            'has_access': True,
            'video': {
                'id': video.id,
                'title': video.title,
                'description': video.description,
                'duration': video.duration,
                'thumbnail': video.thumbnail.url if video.thumbnail else None,
                'video_url': video.video_file.url if video.video_file else None,
            },
            'access_info': {
                'access_level': subscription_result.get('access_level'),
                'expires_at': subscription_result.get('expires_at'),
                'progress': progression_result.get('progress', 0)
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la vérification d'accès vidéo: {str(e)}")
        return Response({
            'has_access': False,
            'reason': 'erreur_serveur',
            'message': 'Une erreur est survenue lors de la vérification d\'accès.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_user_profile(user):
    """Récupère le profil utilisateur selon son type"""
    try:
        if hasattr(user, 'student'):
            return user.student
        elif hasattr(user, 'teacher'):
            return user.teacher
        elif hasattr(user, 'parent'):
            return user.parent
        else:
            return None
    except:
        return None


def check_video_access_rules(user, video, user_profile):
    """Vérifie les règles d'accès spécifiques à la vidéo"""
    rules = VideoAccessRule.objects.filter(video=video, is_active=True)
    
    for rule in rules:
        if rule.rule_type == 'level_required':
            # Vérification du niveau scolaire
            if hasattr(user_profile, 'school_level'):
                if user_profile.school_level != rule.required_value:
                    return {
                        'has_access': False,
                        'reason': 'niveau_requis',
                        'message': f'Cette vidéo est réservée au niveau {rule.required_value}.',
                        'required_level': rule.required_value,
                        'user_level': getattr(user_profile, 'school_level', 'Non défini')
                    }
        
        elif rule.rule_type == 'subject_required':
            # Vérification de la matière
            if video.subject != rule.required_value:
                return {
                    'has_access': False,
                    'reason': 'matiere_requise',
                    'message': f'Cette vidéo nécessite des connaissances en {rule.required_value}.'
                }
    
    return {'has_access': True}


def check_user_subscription(user, video):
    """Vérifie l'abonnement ou l'achat de l'utilisateur"""
    # Vérifier les abonnements actifs
    active_subscriptions = UserSubscription.objects.filter(
        user=user,
        status='active',
        end_date__gte=timezone.now()
    )
    
    if active_subscriptions.exists():
        subscription = active_subscriptions.first()
        return {
            'has_access': True,
            'access_level': subscription.access_level.name,
            'expires_at': subscription.end_date.isoformat()
        }
    
    # Vérifier les accès individuels
    individual_access = UserVideoAccess.objects.filter(
        user=user,
        video=video,
        status='active'
    ).first()
    
    if individual_access and individual_access.is_active_access:
        return {
            'has_access': True,
            'access_level': individual_access.access_level.name,
            'expires_at': individual_access.expires_at.isoformat() if individual_access.expires_at else None
        }
    
    # Vérifier si la vidéo est gratuite
    free_access_level = VideoAccessLevel.objects.filter(level='free', is_active=True).first()
    if free_access_level:
        return {
            'has_access': True,
            'access_level': 'Gratuit'
        }
    
    return {
        'has_access': False,
        'reason': 'abonnement_requis',
        'message': 'Cette vidéo nécessite un abonnement Premium.',
        'subscription_options': get_subscription_options()
    }


def check_prerequisites(user, video):
    """Vérifie les prérequis (vidéos précédentes, QCM, etc.)"""
    rules = VideoAccessRule.objects.filter(
        video=video,
        rule_type__in=['prerequisite_video', 'prerequisite_qcm'],
        is_active=True
    )
    
    for rule in rules:
        if rule.rule_type == 'prerequisite_video':
            # Vérifier si la vidéo prérequise est terminée
            prerequisite_video = EducationalContent.objects.filter(id=rule.required_value).first()
            if prerequisite_video:
                progress = UserProgress.objects.filter(
                    user=user,
                    video=prerequisite_video,
                    is_completed=True
                ).first()
                
                if not progress:
                    return {
                        'has_access': False,
                        'reason': 'prerequis_video',
                        'message': f'Vous devez d\'abord terminer la vidéo "{prerequisite_video.title}".',
                        'prerequisite_video': {
                            'id': prerequisite_video.id,
                            'title': prerequisite_video.title
                        }
                    }
        
        elif rule.rule_type == 'prerequisite_qcm':
            # Vérifier si le QCM prérequis est réussi
            # TODO: Implémenter la vérification des QCM
            pass
    
    return {'has_access': True}


def check_time_availability(video):
    """Vérifie la disponibilité temporelle de la vidéo"""
    rules = VideoAccessRule.objects.filter(
        video=video,
        rule_type='time_limited',
        is_active=True
    )
    
    for rule in rules:
        # TODO: Implémenter la logique de vérification temporelle
        # Exemple: vérifier si la vidéo est disponible pendant les heures de cours
        pass
    
    return {'has_access': True}


def get_subscription_options():
    """Retourne les options d'abonnement disponibles"""
    levels = VideoAccessLevel.objects.filter(is_active=True).exclude(level='free')
    return [
        {
            'id': level.id,
            'name': level.name,
            'level': level.level,
            'price': float(level.price) if level.price else None,
            'duration_days': level.duration_days,
            'description': level.description
        }
        for level in levels
    ]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def grant_video_access(request, video_id):
    """
    Accorde l'accès à une vidéo (pour les administrateurs)
    """
    try:
        user = request.user
        video = get_object_or_404(EducationalContent, id=video_id)
        
        # Vérifier que l'utilisateur est admin
        if not user.is_staff:
            return Response({
                'error': 'Accès refusé. Seuls les administrateurs peuvent accorder l\'accès.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        target_user_id = request.data.get('user_id')
        access_level_id = request.data.get('access_level_id')
        expires_at = request.data.get('expires_at')
        
        if not target_user_id or not access_level_id:
            return Response({
                'error': 'user_id et access_level_id sont requis.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        target_user = get_object_or_404(User, id=target_user_id)
        access_level = get_object_or_404(VideoAccessLevel, id=access_level_id)
        
        # Créer ou mettre à jour l'accès
        user_access, created = UserVideoAccess.objects.get_or_create(
            user=target_user,
            video=video,
            defaults={
                'access_level': access_level,
                'granted_by': user,
                'expires_at': expires_at
            }
        )
        
        if not created:
            user_access.access_level = access_level
            user_access.granted_by = user
            user_access.expires_at = expires_at
            user_access.status = 'active'
            user_access.save()
        
        return Response({
            'success': True,
            'message': f'Accès accordé à {target_user.first_name} {target_user.last_name} pour la vidéo "{video.title}".',
            'access': {
                'user': f"{target_user.first_name} {target_user.last_name}",
                'video': video.title,
                'access_level': access_level.name,
                'expires_at': user_access.expires_at
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de l'octroi d'accès: {str(e)}")
        return Response({
            'error': 'Une erreur est survenue lors de l\'octroi d\'accès.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_video_progress(request, video_id):
    """
    Récupère la progression de l'utilisateur pour une vidéo
    """
    try:
        user = request.user
        video = get_object_or_404(EducationalContent, id=video_id)
        
        progress = UserProgress.objects.filter(user=user, video=video).first()
        
        if not progress:
            return Response({
                'progress': 0,
                'watch_time_seconds': 0,
                'is_completed': False,
                'last_watched_at': None
            })
        
        return Response({
            'progress': progress.completion_percentage,
            'watch_time_seconds': progress.watch_time_seconds,
            'is_completed': progress.is_completed,
            'last_watched_at': progress.last_watched_at
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération de la progression: {str(e)}")
        return Response({
            'error': 'Une erreur est survenue lors de la récupération de la progression.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_video_progress(request, video_id):
    """
    Met à jour la progression de l'utilisateur pour une vidéo
    """
    try:
        user = request.user
        video = get_object_or_404(EducationalContent, id=video_id)
        
        watch_time_seconds = request.data.get('watch_time_seconds', 0)
        completion_percentage = request.data.get('completion_percentage', 0)
        
        progress, created = UserProgress.objects.get_or_create(
            user=user,
            video=video,
            defaults={
                'watch_time_seconds': watch_time_seconds,
                'completion_percentage': completion_percentage,
                'is_completed': completion_percentage >= 90.0
            }
        )
        
        if not created:
            progress.watch_time_seconds = watch_time_seconds
            progress.completion_percentage = completion_percentage
            progress.is_completed = completion_percentage >= 90.0
            progress.save()
        
        return Response({
            'success': True,
            'progress': {
                'watch_time_seconds': progress.watch_time_seconds,
                'completion_percentage': progress.completion_percentage,
                'is_completed': progress.is_completed
            }
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la mise à jour de la progression: {str(e)}")
        return Response({
            'error': 'Une erreur est survenue lors de la mise à jour de la progression.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
