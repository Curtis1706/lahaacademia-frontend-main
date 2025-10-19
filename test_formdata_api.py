#!/usr/bin/env python3
"""
Test de l'API avec FormData (comme le frontend)
"""

import requests

# Configuration
BASE_URL = "http://localhost:3000"  # Next.js
DJANGO_BASE_URL = "http://localhost:8000"  # Django
ADMIN_TOKEN = "cee5456080015db2299344035fecdb5936469663"

def test_nextjs_api():
    """Test de l'API Next.js avec FormData"""
    print("🔍 Test POST /api/admin/educational-content/ (Next.js)")
    
    url = f"{BASE_URL}/api/admin/educational-content/"
    
    # Créer FormData comme le frontend
    data = {
        'title': 'QCM sur analyse',
        'description': 'QCM de test pour l\'analyse',
        'content_type': 'qcm',
        'subject': 'mathematics',
        'class_level': '5eme',
        'country': 'france',
        'tags': 'mathématiques, algèbre, équations'
    }
    
    try:
        response = requests.post(url, data=data)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Succès: Contenu créé")
            print(f"📝 Réponse: {result}")
            return True
        else:
            print(f"❌ Erreur: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_django_direct():
    """Test direct de Django avec FormData"""
    print("\n🔍 Test POST direct Django avec FormData")
    
    url = f"{DJANGO_BASE_URL}/api/educational-content/"
    headers = {
        'Authorization': f'Token {ADMIN_TOKEN}',
    }
    
    data = {
        'title': 'QCM sur analyse Django',
        'description': 'QCM de test direct Django',
        'content_type': 'qcm',
        'subject': 'mathematics',
        'class_level': '5eme',
        'country': 'france',
        'tags': 'mathématiques, algèbre, équations'
    }
    
    try:
        response = requests.post(url, headers=headers, data=data)
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
    print("🧪 Test FormData API")
    print("=" * 50)
    
    # Test 1: Next.js API
    nextjs_success = test_nextjs_api()
    
    # Test 2: Django direct
    django_success = test_django_direct()
    
    print("\n" + "=" * 50)
    print("📊 Résultats:")
    print(f"  Next.js API: {'✅' if nextjs_success else '❌'}")
    print(f"  Django direct: {'✅' if django_success else '❌'}")
    
    if nextjs_success:
        print("\n🎉 Next.js API fonctionne!")
    else:
        print("\n⚠️  Problème avec Next.js API. Vérifiez les logs.")

if __name__ == "__main__":
    main()



