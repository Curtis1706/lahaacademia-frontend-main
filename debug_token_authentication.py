#!/usr/bin/env python3
"""
Script pour déboguer l'authentification par token
"""

import requests
import json

def test_django_token_directly(token):
    """Tester le token directement avec Django"""
    print("🔍 Test direct du token avec Django")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    endpoint = f"{base_url}/teachers/me/"
    
    headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=10)
        
        print(f"📊 Status Django direct: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Django reconnaît le token")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Django ne reconnaît pas le token")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_nextjs_token(token):
    """Tester le token avec Next.js"""
    print(f"\n🔍 Test du token avec Next.js")
    print("-" * 50)
    
    headers = {'Authorization': f'Token {token}'}
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/me', 
                              headers=headers, timeout=10)
        
        print(f"📊 Status Next.js: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Next.js reconnaît le token")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Next.js ne reconnaît pas le token")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_token_without_prefix(token):
    """Tester le token sans le préfixe 'Token '"""
    print(f"\n🔍 Test du token sans préfixe")
    print("-" * 50)
    
    headers = {'Authorization': token}
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/me', 
                              headers=headers, timeout=10)
        
        print(f"📊 Status sans préfixe: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Fonctionne sans préfixe 'Token '")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Ne fonctionne pas sans préfixe")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_token_in_body(token):
    """Tester le token dans le body de la requête"""
    print(f"\n🔍 Test du token dans le body")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/me', 
                              json={'token': token},
                              timeout=10)
        
        print(f"📊 Status avec token dans body: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Fonctionne avec token dans body")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Ne fonctionne pas avec token dans body")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Débogage de l'authentification par token")
    print("=" * 80)
    
    # Utiliser un token de test
    test_token = "3f1ebc311e793e4a78c3c9ff66a597e053101374"
    
    print(f"🔑 Token de test: {test_token}")
    
    # 1. Test direct avec Django
    django_success = test_django_token_directly(test_token)
    
    # 2. Test avec Next.js
    nextjs_success = test_nextjs_token(test_token)
    
    # 3. Test sans préfixe
    no_prefix_success = test_token_without_prefix(test_token)
    
    # 4. Test dans le body
    body_success = test_token_in_body(test_token)
    
    print("\n" + "=" * 80)
    print("📋 Résumé des tests d'authentification")
    print("=" * 80)
    
    print(f"✅ Django direct: {'PASS' if django_success else 'FAIL'}")
    print(f"✅ Next.js avec 'Token ': {'PASS' if nextjs_success else 'FAIL'}")
    print(f"✅ Next.js sans préfixe: {'PASS' if no_prefix_success else 'FAIL'}")
    print(f"✅ Next.js avec token dans body: {'PASS' if body_success else 'FAIL'}")
    
    if django_success and not nextjs_success:
        print(f"\n⚠️ PROBLÈME: Django fonctionne mais Next.js ne fonctionne pas")
        print(f"   → Problème dans l'endpoint Next.js /api/teachers/me")
    elif not django_success:
        print(f"\n⚠️ PROBLÈME: Django ne reconnaît pas le token")
        print(f"   → Problème d'authentification Django")
    elif nextjs_success:
        print(f"\n✅ AUTHENTIFICATION FONCTIONNE!")
    else:
        print(f"\n❌ PROBLÈME: Aucun test ne fonctionne")

if __name__ == '__main__':
    main()



