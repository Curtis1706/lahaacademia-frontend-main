#!/usr/bin/env python
"""
Script pour créer des données de test pour le système de contrôle d'accès aux vidéos
"""

import os
import sys
import django
from django.utils import timezone
from datetime import timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import User, EducationalContent, Student, Teacher
from admin_panel.models import (
    VideoAccessLevel, 
    VideoAccessRule, 
    UserVideoAccess, 
    UserProgress, 
    UserSubscription
)

def create_test_data():
    print("🚀 Création des données de test pour le système de contrôle d'accès...")
    
    # 1. Créer les niveaux d'accès
    print("📊 Création des niveaux d'accès...")
    
    free_level, created = VideoAccessLevel.objects.get_or_create(
        name="Gratuit",
        defaults={
            'level': 'free',
            'description': 'Accès gratuit aux vidéos de base',
            'price': None,
            'duration_days': None,
            'is_active': True
        }
    )
    print(f"✅ Niveau 'Gratuit': {'créé' if created else 'existant'}")
    
    premium_level, created = VideoAccessLevel.objects.get_or_create(
        name="Premium",
        defaults={
            'level': 'premium',
            'description': 'Accès premium à toutes les vidéos',
            'price': 5000.00,  # 5000 XOF
            'duration_days': 30,
            'is_active': True
        }
    )
    print(f"✅ Niveau 'Premium': {'créé' if created else 'existant'}")
    
    subscription_level, created = VideoAccessLevel.objects.get_or_create(
        name="Abonnement Mensuel",
        defaults={
            'level': 'subscription',
            'description': 'Abonnement mensuel avec accès complet',
            'price': 10000.00,  # 10000 XOF
            'duration_days': 30,
            'is_active': True
        }
    )
    print(f"✅ Niveau 'Abonnement Mensuel': {'créé' if created else 'existant'}")
    
    # 2. Créer des utilisateurs de test
    print("\n👥 Création des utilisateurs de test...")
    
    # Utilisateur étudiant
    student_user, created = User.objects.get_or_create(
        username='test_student',
        defaults={
            'email': 'student@test.com',
            'first_name': 'Spéro',
            'last_name': 'ASHANTE',
            'role': 'student',
            'is_active': True
        }
    )
    if created:
        student_user.set_password('test123')
        student_user.save()
    
    # Créer le profil étudiant
    student_profile, created = Student.objects.get_or_create(
        user=student_user,
        defaults={
            'date_of_birth': '2005-01-01',
            'country': 'Sénégal',
            'city': 'Dakar',
            'school_level': 'secondary',
            'current_grade': 'Terminale'
        }
    )
    print(f"✅ Étudiant test: {'créé' if created else 'existant'}")
    
    # Utilisateur admin
    admin_user, created = User.objects.get_or_create(
        username='test_admin',
        defaults={
            'email': 'admin@test.com',
            'first_name': 'Admin',
            'last_name': 'Test',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
    print(f"✅ Admin test: {'créé' if created else 'existant'}")
    
    # 3. Créer des vidéos de test
    print("\n🎬 Création des vidéos de test...")
    
    # Vidéo gratuite
    free_video, created = EducationalContent.objects.get_or_create(
        title="Introduction aux Mathématiques",
        defaults={
            'description': 'Vidéo d\'introduction aux concepts de base des mathématiques',
            'content_type': 'video',
            'subject': 'mathematics',
            'class_level': 'terminale',
            'country': 'senegal',
            'duration_minutes': 15,  # 15 minutes
            'is_free': True,
            'created_by': admin_user,
            'status': 'published'
        }
    )
    print(f"✅ Vidéo gratuite: {'créée' if created else 'existante'}")
    
    # Vidéo premium
    premium_video, created = EducationalContent.objects.get_or_create(
        title="Équations du Second Degré",
        defaults={
            'description': 'Cours complet sur les équations du second degré',
            'content_type': 'video',
            'subject': 'mathematics',
            'class_level': 'terminale',
            'country': 'senegal',
            'duration_minutes': 45,  # 45 minutes
            'is_free': False,
            'price': 2000.00,  # 2000 XOF
            'created_by': admin_user,
            'status': 'published'
        }
    )
    print(f"✅ Vidéo premium: {'créée' if created else 'existante'}")
    
    # Vidéo avec prérequis
    prerequisite_video, created = EducationalContent.objects.get_or_create(
        title="Applications des Équations",
        defaults={
            'description': 'Applications pratiques des équations du second degré',
            'content_type': 'video',
            'subject': 'mathematics',
            'class_level': 'terminale',
            'country': 'senegal',
            'duration_minutes': 30,  # 30 minutes
            'is_free': False,
            'price': 1500.00,  # 1500 XOF
            'created_by': admin_user,
            'status': 'published'
        }
    )
    print(f"✅ Vidéo avec prérequis: {'créée' if created else 'existante'}")
    
    # 4. Créer des règles d'accès
    print("\n🔐 Création des règles d'accès...")
    
    # Règle de niveau scolaire pour la vidéo premium
    level_rule, created = VideoAccessRule.objects.get_or_create(
        video=premium_video,
        rule_type='level_required',
        required_value='secondary',
        defaults={'is_active': True}
    )
    print(f"✅ Règle niveau scolaire: {'créée' if created else 'existante'}")
    
    # Règle de prérequis pour la vidéo avec prérequis
    prerequisite_rule, created = VideoAccessRule.objects.get_or_create(
        video=prerequisite_video,
        rule_type='prerequisite_video',
        required_value=str(premium_video.id),
        defaults={'is_active': True}
    )
    print(f"✅ Règle prérequis: {'créée' if created else 'existante'}")
    
    # 5. Créer des abonnements de test
    print("\n💳 Création des abonnements de test...")
    
    # Abonnement premium pour l'étudiant
    subscription, created = UserSubscription.objects.get_or_create(
        user=student_user,
        access_level=premium_level,
        defaults={
            'status': 'active',
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=30),
            'auto_renew': False,
            'payment_reference': 'TEST_PREMIUM_001'
        }
    )
    print(f"✅ Abonnement premium: {'créé' if created else 'existant'}")
    
    # 6. Créer des accès individuels
    print("\n🎯 Création des accès individuels...")
    
    # Accès gratuit à la vidéo gratuite
    free_access, created = UserVideoAccess.objects.get_or_create(
        user=student_user,
        video=free_video,
        defaults={
            'access_level': free_level,
            'status': 'active',
            'granted_by': admin_user
        }
    )
    print(f"✅ Accès gratuit: {'créé' if created else 'existant'}")
    
    # 7. Créer des progressions de test
    print("\n📈 Création des progressions de test...")
    
    # Progression pour la vidéo gratuite
    progress, created = UserProgress.objects.get_or_create(
        user=student_user,
        video=free_video,
        defaults={
            'watch_time_seconds': 300,  # 5 minutes
            'completion_percentage': 33.3,
            'is_completed': False
        }
    )
    print(f"✅ Progression vidéo gratuite: {'créée' if created else 'existante'}")
    
    print("\n🎉 Données de test créées avec succès !")
    print("\n📋 Résumé des données créées :")
    print(f"   • {VideoAccessLevel.objects.count()} niveaux d'accès")
    print(f"   • {User.objects.count()} utilisateurs")
    print(f"   • {EducationalContent.objects.count()} vidéos")
    print(f"   • {VideoAccessRule.objects.count()} règles d'accès")
    print(f"   • {UserSubscription.objects.count()} abonnements")
    print(f"   • {UserVideoAccess.objects.count()} accès individuels")
    print(f"   • {UserProgress.objects.count()} progressions")
    
    print("\n🔑 Identifiants de test :")
    print("   Étudiant: test_student / test123")
    print("   Admin: test_admin / admin123")

if __name__ == '__main__':
    create_test_data()
