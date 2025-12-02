#!/usr/bin/env python3
"""
Script pour réinitialiser le mot de passe admin
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

def reset_admin_password():
    """Réinitialiser le mot de passe admin"""
    try:
        # Chercher l'utilisateur admin
        admin_user = User.objects.filter(role='admin').first()
        if not admin_user:
            admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            admin_user = User.objects.filter(is_superuser=True).first()
        
        if admin_user:
            # Réinitialiser le mot de passe
            admin_user.set_password('admin123')
            admin_user.save()
            
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=admin_user)
            
            print(f"✅ Mot de passe admin réinitialisé")
            print(f"👤 Nom d'utilisateur: {admin_user.username}")
            print(f"🔑 Mot de passe: admin123")
            print(f"🔑 Token API: {token.key}")
            print(f"📧 Email: {admin_user.email}")
            
            return token.key, admin_user.username
        else:
            print("❌ Aucun compte admin trouvé")
            return None, None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None, None

def test_login(username, password, token):
    """Tester la connexion"""
    base_url = "http://localhost:8000/api"
    
    print(f"\n🧪 Test de connexion avec '{username}'...")
    
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": username, "password": password})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
            return True
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Login API: {e}")
        return False

def test_teachers_pending(token):
    """Tester l'API des professeurs en attente"""
    base_url = "http://localhost:8000/api"
    headers = {"Authorization": f"Token {token}"}
    
    print(f"\n🧪 Test de l'API des professeurs en attente...")
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ Teachers pending API: {len(teachers)} enseignants en attente")
            return True
        else:
            print(f"❌ Teachers pending API: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Teachers pending API: {e}")
        return False

def main():
    print("🔧 Réinitialisation du mot de passe admin...")
    
    # 1. Réinitialiser le mot de passe admin
    token, username = reset_admin_password()
    
    if not token:
        print("❌ Impossible de réinitialiser le mot de passe admin")
        return
    
    # 2. Tester la connexion
    login_success = test_login(username, 'admin123', token)
    
    if login_success:
        # 3. Tester l'API des professeurs en attente
        api_success = test_teachers_pending(token)
        
        if api_success:
            print("\n🎉 TOUT FONCTIONNE !")
            print("="*50)
            print("📋 La page de validation des enseignants est maintenant fonctionnelle")
            print("🔗 Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
            print("👤 Connectez-vous avec:")
            print(f"   - Nom d'utilisateur: {username}")
            print("   - Mot de passe: admin123")
            print("="*50)
        else:
            print("\n⚠️  Problème avec l'API des professeurs en attente")
    else:
        print("\n⚠️  Problème avec la connexion admin")

if __name__ == "__main__":
    main()









