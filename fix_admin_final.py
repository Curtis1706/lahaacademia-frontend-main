#!/usr/bin/env python3
"""
Script pour identifier et corriger tous les comptes admin
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append('django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

def find_and_fix_admin():
    """Trouver et corriger le compte admin"""
    target_username = "admin"
    target_email = "admin@lahaacademia.com"
    target_password = "admin123"
    
    print("🔍 Recherche des comptes existants...\n")
    
    # Chercher tous les comptes potentiellement admin
    admin_by_username = User.objects.filter(username=target_username).first()
    admin_by_email = User.objects.filter(email=target_email).first()
    admin_by_role = User.objects.filter(role='admin').first()
    
    # Afficher ce qui a été trouvé
    if admin_by_username:
        print(f"📋 Compte avec username 'admin':")
        print(f"   - Username: {admin_by_username.username}")
        print(f"   - Email: {admin_by_username.email}")
        print(f"   - Rôle: {admin_by_username.role}")
        print(f"   - ID: {admin_by_username.id}")
    
    if admin_by_email and admin_by_email != admin_by_username:
        print(f"\n📋 Compte avec email 'admin@lahaacademia.com':")
        print(f"   - Username: {admin_by_email.username}")
        print(f"   - Email: {admin_by_email.email}")
        print(f"   - Rôle: {admin_by_email.role}")
        print(f"   - ID: {admin_by_email.id}")
    
    if admin_by_role and admin_by_role not in [admin_by_username, admin_by_email]:
        print(f"\n📋 Compte avec rôle 'admin':")
        print(f"   - Username: {admin_by_role.username}")
        print(f"   - Email: {admin_by_role.email}")
        print(f"   - Rôle: {admin_by_role.role}")
        print(f"   - ID: {admin_by_role.id}")
    
    # Décider quelle stratégie adopter
    user = None
    
    if admin_by_username:
        # Si on a un compte avec le bon username, on le met à jour
        user = admin_by_username
        print(f"\n✅ Utilisation du compte existant: {user.username}")
    elif admin_by_email:
        # Sinon, si on a un compte avec le bon email, on change le username
        user = admin_by_email
        print(f"\n✅ Utilisation du compte existant: {user.email}")
        user.username = target_username
    elif admin_by_role:
        # Sinon, si on a un compte avec le rôle admin, on le met à jour
        user = admin_by_role
        print(f"\n✅ Utilisation du compte existant: {user.username}")
        user.username = target_username
    else:
        # Créer un nouveau compte
        try:
            user = User.objects.create_user(
                username=target_username,
                email=target_email,
                password=target_password,
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            print(f"\n✅ Nouveau compte admin créé")
        except Exception as e:
            print(f"\n❌ Erreur lors de la création: {e}")
            return False
    
    if user:
        try:
            # Mettre à jour toutes les propriétés
            user.email = target_email
            user.role = 'admin'
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.set_password(target_password)
            user.save()
            
            print(f"✅ Compte mis à jour avec succès")
            
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=user)
            
            print("\n" + "="*60)
            print("🎉 COMPTE ADMIN PRÊT!")
            print("="*60)
            print(f"👤 Nom d'utilisateur: {user.username}")
            print(f"🔑 Mot de passe: {target_password}")
            print(f"📧 Email: {user.email}")
            print(f"🔐 Token API: {token.key}")
            print(f"👑 Rôle: {user.role}")
            print(f"📊 Staff: {user.is_staff}")
            print(f"⭐ Superuser: {user.is_superuser}")
            print(f"✅ Actif: {user.is_active}")
            print("="*60)
            print("\n🚀 Vous pouvez maintenant vous connecter!")
            print("   URL: http://localhost:3000/login")
            print("   ou: http://localhost:3000/dashboard/admin")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Erreur lors de la mise à jour: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    return False

if __name__ == "__main__":
    print("🔧 Configuration du compte admin...\n")
    success = find_and_fix_admin()
    
    if not success:
        print("\n❌ Échec de la configuration")
        sys.exit(1)









