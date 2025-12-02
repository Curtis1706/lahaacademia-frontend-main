#!/usr/bin/env python3
"""
Script pour récupérer les informations du compte admin existant
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

def get_admin_info():
    """Récupérer les informations du compte admin"""
    try:
        # Chercher l'utilisateur admin
        admin_user = User.objects.filter(role='admin').first()
        if not admin_user:
            admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            admin_user = User.objects.filter(is_superuser=True).first()
        
        if admin_user:
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=admin_user)
            
            print("✅ Compte admin trouvé:")
            print(f"👤 Nom d'utilisateur: {admin_user.username}")
            print(f"📧 Email: {admin_user.email}")
            print(f"🔑 Token: {token.key}")
            print(f"👑 Rôle: {getattr(admin_user, 'role', 'admin')}")
            print(f"🔐 Staff: {admin_user.is_staff}")
            print(f"👑 Superuser: {admin_user.is_superuser}")
            
            return token.key, admin_user.username
        else:
            print("❌ Aucun compte admin trouvé")
            return None, None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None, None

def test_connection(username, token):
    """Tester la connexion"""
    import requests
    
    base_url = "http://localhost:8000/api"
    
    print(f"\n🧪 Test de connexion avec '{username}'...")
    
    # Test 1: Login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": username, "password": "admin123"})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
            return True
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Login API: {e}")
    
    return False

if __name__ == "__main__":
    print("🔍 Recherche du compte admin existant...")
    token, username = get_admin_info()
    
    if token and username:
        print("\n" + "="*60)
        print("📋 INFORMATIONS DE CONNEXION:")
        print(f"🌐 Serveur Django: http://localhost:8000")
        print(f"👤 Nom d'utilisateur: {username}")
        print(f"🔑 Mot de passe: admin123 (ou le mot de passe défini)")
        print(f"🔑 Token API: {token}")
        print("="*60)
        
        # Tester la connexion
        test_connection(username, token)
        
        print("\n💡 SOLUTION POUR LA PAGE DE VALIDATION:")
        print("1. Assurez-vous que le serveur Django est démarré (http://localhost:8000)")
        print("2. Connectez-vous à l'interface admin avec les identifiants ci-dessus")
        print("3. Ou utilisez le token directement dans votre application frontend")
        print("4. Redémarrez votre serveur Next.js si nécessaire")
    else:
        print("\n❌ Impossible de trouver un compte admin")
        print("💡 Créez un compte admin manuellement dans Django Admin")









