#!/usr/bin/env python3
"""
Script pour créer un compte admin de test et tester la connexion
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

def create_test_admin():
    """Créer un compte admin de test"""
    username = "admin"
    email = "admin@lahaacademia.com"
    password = "admin123"
    
    # Vérifier si l'utilisateur existe déjà
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        print(f"✅ Utilisateur '{username}' existe déjà")
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        print(f"🔑 Token: {token.key}")
        print(f"📧 Email: {user.email}")
        print(f"👤 Rôle: {getattr(user, 'role', 'admin')}")
        return token.key
    else:
        # Créer un nouvel utilisateur admin
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role='admin',
            is_staff=True,
            is_superuser=True
        )
        
        # Créer le token
        token = Token.objects.create(user=user)
        
        print(f"✅ Compte admin créé avec succès")
        print(f"👤 Nom d'utilisateur: {username}")
        print(f"🔑 Mot de passe: {password}")
        print(f"🔑 Token: {token.key}")
        print(f"📧 Email: {email}")
        
        return token.key

def test_api_endpoints(token):
    """Tester les endpoints API"""
    import requests
    
    base_url = "http://localhost:8000/api"
    headers = {"Authorization": f"Token {token}"}
    
    print("\n🧪 Test des endpoints API...")
    
    # Test 1: Login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": "admin", "password": "admin123"})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
        else:
            print(f"❌ Login API: {response.status_code}")
    except Exception as e:
        print(f"❌ Login API: {e}")
    
    # Test 2: Teachers pending
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ Teachers pending API: {len(teachers)} enseignants")
        else:
            print(f"❌ Teachers pending API: {response.status_code}")
    except Exception as e:
        print(f"❌ Teachers pending API: {e}")
    
    # Test 3: Content reports
    try:
        response = requests.get(f"{base_url}/admin/content-reports/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            reports = data.get('results', data) if isinstance(data, dict) else data
            if not isinstance(reports, list):
                reports = []
            print(f"✅ Content reports API: {len(reports)} signalements")
        else:
            print(f"❌ Content reports API: {response.status_code}")
    except Exception as e:
        print(f"❌ Content reports API: {e}")

if __name__ == "__main__":
    print("🚀 Création du compte admin de test...")
    token = create_test_admin()
    
    print("\n" + "="*50)
    print("📋 INSTRUCTIONS POUR TESTER LA PAGE:")
    print("1. Le serveur Django est démarré sur http://localhost:8000")
    print("2. Utilisez ces identifiants pour vous connecter:")
    print(f"   - Nom d'utilisateur: admin")
    print(f"   - Mot de passe: admin123")
    print("3. Ou utilisez ce token directement:")
    print(f"   - Token: {token}")
    print("4. Redémarrez votre serveur Next.js si nécessaire")
    print("="*50)
    
    # Tester les APIs
    test_api_endpoints(token)







