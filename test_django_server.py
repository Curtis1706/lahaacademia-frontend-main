#!/usr/bin/env python3
"""
Script pour tester si le serveur Django fonctionne
"""

import requests
import json

def test_django_server():
    """Tester le serveur Django"""
    base_url = "http://localhost:8000"
    
    print("🧪 Test du serveur Django...")
    
    # Test 1: Page d'accueil
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur Django fonctionne")
        else:
            print(f"⚠️  Serveur répond avec le code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Django non accessible - Vérifiez qu'il est démarré sur le port 8000")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    
    # Test 2: API endpoints
    try:
        response = requests.get(f"{base_url}/api/", timeout=5)
        if response.status_code == 200:
            print("✅ API Django fonctionne")
        else:
            print(f"⚠️  API répond avec le code: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur API: {e}")
    
    # Test 3: Admin Django
    try:
        response = requests.get(f"{base_url}/admin/", timeout=5)
        if response.status_code == 200:
            print("✅ Interface admin Django accessible")
        else:
            print(f"⚠️  Admin répond avec le code: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur admin: {e}")
    
    return True

def test_api_endpoints():
    """Tester les endpoints API spécifiques"""
    base_url = "http://localhost:8000/api"
    
    print("\n🧪 Test des endpoints API...")
    
    # Test login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": "admin", "password": "admin123"},
                               timeout=5)
        if response.status_code == 200:
            print("✅ Login API fonctionne")
            data = response.json()
            token = data.get('token')
            if token:
                print(f"🔑 Token reçu: {token[:20]}...")
                return token
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erreur login: {e}")
    
    return None

def test_teachers_api(token):
    """Tester l'API des professeurs"""
    if not token:
        print("⚠️  Pas de token, impossible de tester l'API des professeurs")
        return
    
    base_url = "http://localhost:8000/api"
    headers = {"Authorization": f"Token {token}"}
    
    print("\n🧪 Test de l'API des professeurs...")
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=5)
        if response.status_code == 200:
            print("✅ API des professeurs fonctionne")
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"📋 {len(teachers)} professeurs en attente")
        else:
            print(f"❌ API des professeurs: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Erreur API professeurs: {e}")

def main():
    print("🚀 Test du serveur Django pour la validation des enseignants")
    print("="*60)
    
    # Test 1: Serveur Django
    if not test_django_server():
        print("\n❌ SERVEUR DJANGO NON ACCESSIBLE")
        print("🔧 Solutions:")
        print("1. Démarrez le serveur Django: cd django_backend && python manage.py runserver 8000")
        print("2. Vérifiez que le port 8000 n'est pas utilisé par un autre service")
        print("3. Vérifiez les erreurs dans le terminal du serveur Django")
        return
    
    # Test 2: API endpoints
    token = test_api_endpoints()
    
    # Test 3: API des professeurs
    test_teachers_api(token)
    
    print("\n" + "="*60)
    if token:
        print("🎉 SERVEUR DJANGO FONCTIONNEL !")
        print("✅ Vous pouvez maintenant utiliser la page de validation avec de vraies données")
        print("🔗 Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
    else:
        print("⚠️  SERVEUR DJANGO FONCTIONNEL MAIS PROBLÈME D'AUTHENTIFICATION")
        print("🔧 Solutions:")
        print("1. Créez un superutilisateur: python manage.py createsuperuser")
        print("2. Utilisez les identifiants: admin / admin123")
        print("3. Vérifiez la configuration de l'authentification")

if __name__ == "__main__":
    main()







