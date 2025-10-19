#!/usr/bin/env python3
"""
Test de l'API de création de contenu pédagogique
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
ADMIN_TOKEN = "cee5456080015db2299344035fecdb5936469663"

def test_get_content():
    """Test de récupération des contenus"""
    print("🔍 Test GET /api/educational-content/")
    
    url = f"{BASE_URL}/api/educational-content/"
    headers = {
        'Authorization': f'Token {ADMIN_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès: {len(data.get('results', []))} contenus trouvés")
            return True
        else:
            print(f"❌ Erreur: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_create_content():
    """Test de création d'un contenu"""
    print("\n🔍 Test POST /api/educational-content/")
    
    url = f"{BASE_URL}/api/educational-content/"
    headers = {
        'Authorization': f'Token {ADMIN_TOKEN}',
        'Content-Type': 'application/json'
    }
    
    # Données de test
    data = {
        'title': 'Test QCM Mathématiques',
        'description': 'QCM de test pour les mathématiques',
        'content_type': 'qcm',
        'subject': 'mathematics',
        'class_level': '6eme',
        'country': 'cameroon',
        'tags': 'test, math, qcm'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Succès: Contenu créé avec l'ID {result.get('id')}")
            return True
        else:
            print(f"❌ Erreur: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🧪 Test de l'API de contenu pédagogique")
    print("=" * 50)
    
    # Test 1: Récupération
    get_success = test_get_content()
    
    # Test 2: Création
    create_success = test_create_content()
    
    print("\n" + "=" * 50)
    print("📊 Résultats:")
    print(f"  GET: {'✅' if get_success else '❌'}")
    print(f"  POST: {'✅' if create_success else '❌'}")
    
    if get_success and create_success:
        print("\n🎉 Tous les tests sont passés!")
    else:
        print("\n⚠️  Certains tests ont échoué. Vérifiez Django.")

if __name__ == "__main__":
    main()



