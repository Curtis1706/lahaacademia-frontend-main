#!/usr/bin/env python3
"""
Script pour identifier et corriger le compte admin
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
import requests

User = get_user_model()

def find_admin_accounts():
    """Trouver tous les comptes admin"""
    print("🔍 Recherche des comptes admin...")
    
    # Chercher par rôle admin
    admin_by_role = User.objects.filter(role='admin')
    print(f"📋 Comptes avec rôle 'admin': {admin_by_role.count()}")
    for user in admin_by_role:
        print(f"   - {user.username} ({user.email}) - Staff: {user.is_staff}, Superuser: {user.is_superuser}")
    
    # Chercher par is_staff
    staff_users = User.objects.filter(is_staff=True)
    print(f"📋 Comptes staff: {staff_users.count()}")
    for user in staff_users:
        print(f"   - {user.username} ({user.email}) - Rôle: {user.role}, Superuser: {user.is_superuser}")
    
    # Chercher par is_superuser
    super_users = User.objects.filter(is_superuser=True)
    print(f"📋 Comptes superuser: {super_users.count()}")
    for user in super_users:
        print(f"   - {user.username} ({user.email}) - Rôle: {user.role}, Staff: {user.is_staff}")
    
    return admin_by_role.first() or staff_users.first() or super_users.first()

def reset_admin_password(user):
    """Réinitialiser le mot de passe admin"""
    if not user:
        print("❌ Aucun compte admin trouvé")
        return None, None
    
    try:
        # Réinitialiser le mot de passe
        user.set_password('admin123')
        user.is_staff = True
        user.is_superuser = True
        user.role = 'admin'
        user.save()
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        
        print(f"✅ Mot de passe admin réinitialisé")
        print(f"👤 Nom d'utilisateur: {user.username}")
        print(f"🔑 Mot de passe: admin123")
        print(f"🔑 Token API: {token.key}")
        print(f"📧 Email: {user.email}")
        print(f"👑 Rôle: {user.role}")
        
        return token.key, user.username
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None, None

def test_login(username, password):
    """Tester la connexion"""
    base_url = "http://localhost:8000/api"
    
    print(f"\n🧪 Test de connexion avec '{username}'...")
    
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": username, "password": password})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
            data = response.json()
            print(f"📋 Réponse: {data}")
            return True
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login API: {e}")
        return False

def main():
    print("🔧 Correction du compte admin...")
    
    # 1. Trouver le compte admin
    admin_user = find_admin_accounts()
    
    if not admin_user:
        print("❌ Aucun compte admin trouvé")
        return
    
    # 2. Réinitialiser le mot de passe
    token, username = reset_admin_password(admin_user)
    
    if not token:
        print("❌ Impossible de réinitialiser le mot de passe")
        return
    
    # 3. Tester la connexion
    login_success = test_login(username, 'admin123')
    
    if login_success:
        print("\n🎉 SUCCÈS !")
        print("="*50)
        print("📋 INFORMATIONS DE CONNEXION:")
        print(f"👤 Nom d'utilisateur: {username}")
        print("🔑 Mot de passe: admin123")
        print(f"🔑 Token API: {token.key}")
        print("="*50)
        print("🚀 Vous pouvez maintenant tester la page de validation des enseignants !")
    else:
        print("\n⚠️  Problème avec la connexion")

if __name__ == "__main__":
    main()









