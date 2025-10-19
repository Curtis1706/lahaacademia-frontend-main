#!/usr/bin/env python
"""
Script pour configurer le système de paiement par défaut
"""

import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import PaymentConfiguration, User
from django.utils import timezone

def create_default_payment_config():
    """Créer la configuration de paiement par défaut"""
    
    # Vérifier s'il existe déjà une configuration active
    existing_config = PaymentConfiguration.objects.filter(is_active=True).first()
    if existing_config:
        print(f"✅ Configuration de paiement existante trouvée:")
        print(f"   - Commission enseignants: {existing_config.teacher_commission_percentage}%")
        print(f"   - Frais plateforme: {existing_config.platform_fee_percentage}%")
        print(f"   - Montant minimum de paiement: {existing_config.minimum_payout_amount} FCFA")
        return existing_config
    
    # Créer un utilisateur admin par défaut si nécessaire
    admin_user = User.objects.filter(role='admin').first()
    if not admin_user:
        print("⚠️ Aucun utilisateur admin trouvé. Création d'un admin par défaut...")
        admin_user = User.objects.create(
            email='admin@lahaacademia.com',
            username='admin',
            first_name='Admin',
            last_name='LAHA',
            role='admin',
            is_active=True,
            is_verified=True
        )
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"✅ Utilisateur admin créé: {admin_user.email}")
    
    # Créer la configuration par défaut
    config = PaymentConfiguration.objects.create(
        teacher_commission_percentage=10.00,  # 10% pour les enseignants
        platform_fee_percentage=90.00,         # 90% pour LAHA
        minimum_payout_amount=100.00,          # 100 FCFA minimum
        payout_frequency='monthly',            # Paiement mensuel
        is_active=True,
        created_by=admin_user
    )
    
    print("✅ Configuration de paiement par défaut créée:")
    print(f"   - Commission enseignants: {config.teacher_commission_percentage}%")
    print(f"   - Frais plateforme: {config.platform_fee_percentage}%")
    print(f"   - Montant minimum de paiement: {config.minimum_payout_amount} FCFA")
    print(f"   - Fréquence de paiement: {config.get_payout_frequency_display()}")
    print(f"   - Créé par: {config.created_by.email}")
    
    return config

def update_teacher_payment_info():
    """Mettre à jour les informations de paiement des enseignants existants"""
    
    from core.models import Teacher
    
    teachers = Teacher.objects.all()
    updated_count = 0
    
    for teacher in teachers:
        if not teacher.is_payment_verified:
            # Marquer comme non vérifié par défaut
            teacher.is_payment_verified = False
            teacher.save()
            updated_count += 1
    
    print(f"✅ {updated_count} enseignants mis à jour avec les informations de paiement")

if __name__ == '__main__':
    print("🚀 Configuration du système de paiement LAHA Academia...")
    print("=" * 60)
    
    try:
        # Créer la configuration par défaut
        config = create_default_payment_config()
        
        # Mettre à jour les enseignants
        update_teacher_payment_info()
        
        print("=" * 60)
        print("✅ Configuration terminée avec succès!")
        print("\n📋 Résumé:")
        print(f"   - Commission enseignants: {config.teacher_commission_percentage}%")
        print(f"   - Frais plateforme: {config.platform_fee_percentage}%")
        print(f"   - Montant minimum: {config.minimum_payout_amount} FCFA")
        print(f"   - Fréquence: {config.get_payout_frequency_display()}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la configuration: {e}")
        sys.exit(1)
