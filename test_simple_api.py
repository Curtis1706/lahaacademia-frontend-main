#!/usr/bin/env python3
"""
Test simple des API endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_endpoints():
    """Test des endpoints principaux"""
    print("🧪 Test des endpoints API...")
    
    # Test 1: Vérifier que le serveur répond
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Serveur accessible: {response.status_code}")
    except Exception as e:
        print(f"❌ Serveur inaccessible: {e}")
        return
    
    # Test 2: Test de l'endpoint auth/login avec différentes méthodes
    print("\n🔐 Test de connexion...")
    
    # Méthode 1: POST avec JSON
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", 
                               json={"username": "admin", "password": "admin123"},
                               headers={'Content-Type': 'application/json'})
        print(f"POST JSON: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Connexion réussie: {response.json()}")
            return response.json().get('token')
    except Exception as e:
        print(f"❌ POST JSON failed: {e}")
    
    # Méthode 2: POST avec form data
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", 
                               data={"username": "admin", "password": "admin123"})
        print(f"POST Form: {response.status_code}")
        if response.status_code == 200:
            print(f"✅ Connexion réussie: {response.json()}")
            return response.json().get('token')
    except Exception as e:
        print(f"❌ POST Form failed: {e}")
    
    return None

def test_without_auth():
    """Test des endpoints qui ne nécessitent pas d'authentification"""
    print("\n🔓 Test des endpoints publics...")
    
    # Test des enseignants (devrait retourner 401 sans auth)
    try:
        response = requests.get(f"{BASE_URL}/teachers/")
        print(f"Teachers endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Teachers endpoint failed: {e}")
    
    # Test des cours
    try:
        response = requests.get(f"{BASE_URL}/courses/")
        print(f"Courses endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Courses endpoint failed: {e}")

if __name__ == "__main__":
    print("🚀 Test simple des API")
    print("=" * 40)
    
    token = test_endpoints()
    test_without_auth()
    
    print("\n" + "=" * 40)
    print("✅ Tests terminés")







