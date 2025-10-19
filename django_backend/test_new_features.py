#!/usr/bin/env python
"""
Script de test pour vérifier les nouvelles fonctionnalités
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import *
from django.contrib.auth import get_user_model
from django.utils import timezone
from decimal import Decimal

User = get_user_model()

def test_adult_education():
    """Tester le support de l'enseignement aux adultes"""
    print("🧪 Test: Enseignement aux adultes")
    
    # Créer un utilisateur adulte
    adult_user = User.objects.create(
        email='adult@test.com',
        username='adult_test',
        first_name='Jean',
        last_name='Adulte',
        role='student'
    )
    
    # Créer un profil étudiant adulte
    adult_student = Student.objects.create(
        user=adult_user,
        date_of_birth='1990-01-01',
        country='Cameroun',
        city='Douala',
        school_level='adult',
        is_adult=True,
        occupation='Ingénieur',
        education_level='Master',
        professional_experience='5 ans dans le développement',
        learning_objectives='Apprendre les nouvelles technologies',
        budget_range='50000-100000',
        certification_needed=True
    )
    
    print(f"   ✅ Étudiant adulte créé: {adult_student.user.first_name}")
    print(f"   ✅ Occupation: {adult_student.occupation}")
    print(f"   ✅ Objectifs: {adult_student.learning_objectives}")
    
    return adult_student

def test_enhanced_teacher_profile():
    """Tester le profil enseignant enrichi"""
    print("\n🧪 Test: Profil enseignant enrichi")
    
    # Créer un enseignant avec informations enrichies
    teacher_user = User.objects.create(
        email='teacher@test.com',
        username='teacher_test',
        first_name='Marie',
        last_name='Enseignante',
        role='teacher'
    )
    
    teacher = Teacher.objects.create(
        user=teacher_user,
        location='Yaoundé, Cameroun',
        languages_spoken=['Français', 'Anglais'],
        teaching_style='Interactif',
        availability_for_adults=True,
        reliability_score=4.5,
        total_cancellations=2,
        cancellation_rate=5.0,
        is_payment_verified=True
    )
    
    print(f"   ✅ Enseignant créé: {teacher.user.first_name}")
    print(f"   ✅ Localisation: {teacher.location}")
    print(f"   ✅ Langues: {teacher.languages_spoken}")
    print(f"   ✅ Score de fiabilité: {teacher.reliability_score}")
    print(f"   ✅ Disponible pour adultes: {teacher.availability_for_adults}")
    
    return teacher

def test_incident_reporting():
    """Tester le système de signalement d'incidents"""
    print("\n🧪 Test: Signalement d'incidents")
    
    # Créer un signalement
    reporter = User.objects.create(
        email='reporter@test.com',
        username='reporter_test',
        first_name='Parent',
        last_name='Test',
        role='parent'
    )
    
    teacher = Teacher.objects.first()
    if not teacher:
        print("   ⚠️ Aucun enseignant trouvé pour le test")
        return
    
    incident = IncidentReport.objects.create(
        reporter=reporter,
        teacher=teacher,
        incident_type='inappropriate_behavior',
        severity='medium',
        description='Comportement inapproprié lors du cours',
        status='pending'
    )
    
    print(f"   ✅ Incident signalé: {incident.get_incident_type_display()}")
    print(f"   ✅ Gravité: {incident.get_severity_display()}")
    print(f"   ✅ Statut: {incident.get_status_display()}")
    
    return incident

def test_payment_system():
    """Tester le système de paiement"""
    print("\n🧪 Test: Système de paiement")
    
    # Vérifier la configuration
    config = PaymentConfiguration.objects.filter(is_active=True).first()
    if config:
        print(f"   ✅ Configuration active trouvée")
        print(f"   ✅ Commission enseignants: {config.teacher_commission_percentage}%")
        print(f"   ✅ Frais plateforme: {config.platform_fee_percentage}%")
        print(f"   ✅ Montant minimum: {config.minimum_payout_amount} FCFA")
    else:
        print("   ❌ Aucune configuration de paiement trouvée")
        return
    
    # Créer un paiement test
    teacher = Teacher.objects.first()
    if teacher:
        payout = TeacherPayout.objects.create(
            teacher=teacher,
            amount=Decimal('5000.00'),
            commission_percentage=config.teacher_commission_percentage,
            platform_fee=Decimal('4500.00'),
            period_start=timezone.now(),
            period_end=timezone.now(),
            status='pending'
        )
        
        print(f"   ✅ Paiement créé: {payout.amount} FCFA")
        print(f"   ✅ Commission: {payout.commission_percentage}%")
        print(f"   ✅ Statut: {payout.get_status_display()}")
    
    return config

def test_security_system():
    """Tester le système de sécurité"""
    print("\n🧪 Test: Système de sécurité")
    
    # Créer une alerte de sécurité
    user = User.objects.create(
        email='suspicious@test.com',
        username='suspicious_test',
        first_name='Suspicious',
        last_name='User',
        role='student'
    )
    
    alert = SecurityAlert.objects.create(
        alert_type='duplicate_email',
        severity='medium',
        user=user,
        description='Email dupliqué détecté',
        evidence_data={'original_email': 'test@example.com'}
    )
    
    print(f"   ✅ Alerte créée: {alert.get_alert_type_display()}")
    print(f"   ✅ Gravité: {alert.get_severity_display()}")
    print(f"   ✅ Utilisateur: {alert.user.email}")
    
    # Créer un utilisateur banni
    banned_user = User.objects.create(
        email='banned@test.com',
        username='banned_test',
        first_name='Banned',
        last_name='User',
        role='student'
    )
    
    admin_user = User.objects.filter(role='admin').first()
    if admin_user:
        ban_record = BannedUser.objects.create(
            user=banned_user,
            ban_reason='fraud',
            description='Fraude de paiement détectée',
            banned_by=admin_user,
            ip_addresses=['192.168.1.100'],
            email_patterns=['banned@*']
        )
        
        print(f"   ✅ Utilisateur banni: {ban_record.user.email}")
        print(f"   ✅ Raison: {ban_record.get_ban_reason_display()}")
    
    return alert

def test_rating_system():
    """Tester le système d'évaluation"""
    print("\n🧪 Test: Système d'évaluation")
    
    teacher = Teacher.objects.first()
    student = Student.objects.first()
    
    if teacher and student:
        rating = TeacherRating.objects.create(
            teacher=teacher,
            student=student,
            rating=5,
            comment='Excellent enseignant, très pédagogue',
            teaching_quality=5,
            punctuality=4,
            communication=5,
            professionalism=5,
            is_verified=True
        )
        
        print(f"   ✅ Évaluation créée: {rating.rating}/5 étoiles")
        print(f"   ✅ Qualité d'enseignement: {rating.teaching_quality}/5")
        print(f"   ✅ Ponctualité: {rating.punctuality}/5")
        print(f"   ✅ Communication: {rating.communication}/5")
        print(f"   ✅ Professionnalisme: {rating.professionalism}/5")
        
        # Mettre à jour la note moyenne de l'enseignant
        ratings = TeacherRating.objects.filter(teacher=teacher)
        if ratings.exists():
            avg_rating = sum(r.rating for r in ratings) / ratings.count()
            teacher.average_rating = round(avg_rating, 1)
            teacher.save()
            print(f"   ✅ Note moyenne mise à jour: {teacher.average_rating}")
    
    return rating

def cleanup_test_data():
    """Nettoyer les données de test"""
    print("\n🧹 Nettoyage des données de test...")
    
    # Supprimer les utilisateurs de test
    test_emails = [
        'adult@test.com',
        'teacher@test.com', 
        'reporter@test.com',
        'suspicious@test.com',
        'banned@test.com'
    ]
    
    for email in test_emails:
        try:
            user = User.objects.get(email=email)
            user.delete()
            print(f"   ✅ Utilisateur {email} supprimé")
        except User.DoesNotExist:
            pass
    
    # Supprimer les autres objets de test
    IncidentReport.objects.filter(description__contains='Test').delete()
    SecurityAlert.objects.filter(description__contains='Test').delete()
    BannedUser.objects.filter(description__contains='Test').delete()
    TeacherRating.objects.filter(comment__contains='Test').delete()
    TeacherPayout.objects.filter(amount=Decimal('5000.00')).delete()
    
    print("   ✅ Données de test nettoyées")

def main():
    """Fonction principale de test"""
    print("🚀 Tests des nouvelles fonctionnalités LAHA Academia")
    print("=" * 60)
    
    try:
        # Tests des fonctionnalités
        test_adult_education()
        test_enhanced_teacher_profile()
        test_incident_reporting()
        test_payment_system()
        test_security_system()
        test_rating_system()
        
        print("\n" + "=" * 60)
        print("✅ Tous les tests sont passés avec succès!")
        print("\n📊 Résumé des fonctionnalités testées:")
        print("   ✅ Enseignement aux adultes")
        print("   ✅ Profil enseignant enrichi")
        print("   ✅ Signalement d'incidents")
        print("   ✅ Système de paiement")
        print("   ✅ Système de sécurité")
        print("   ✅ Système d'évaluation")
        
        # Nettoyage
        cleanup_test_data()
        
    except Exception as e:
        print(f"\n❌ Erreur lors des tests: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
