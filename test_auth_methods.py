#!/usr/bin/env python3
"""
Script pour tester différentes méthodes d'authentification
"""

import requests
import json

def test_cookie_auth():
    """Tester l'authentification par cookie"""
    print("🔍 Test de l'authentification par cookie")
    print("=" * 60)
    
    # D'abord, se connecter pour obtenir un cookie
    login_response = requests.post('http://localhost:3000/api/auth/login', 
                                 json={'email': 'test.auto.1760199018@example.com', 'password': 'password123'},
                                 timeout=10)
    
    if login_response.status_code == 200:
        print("✅ Connexion réussie")
        
        # Extraire le cookie
        cookies = login_response.cookies
        print(f"🍪 Cookies reçus: {dict(cookies)}")
        
        # Tester l'API avec le cookie
        me_response = requests.get('http://localhost:3000/api/teachers/me', 
                                 cookies=cookies, timeout=10)
        
        print(f"📊 Status avec cookie: {me_response.status_code}")
        
        if me_response.status_code == 200:
            data = me_response.json()
            print("✅ Authentification par cookie fonctionne")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Authentification par cookie échoue")
            try:
                error_data = me_response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {me_response.text}")
            return False
    else:
        print(f"❌ Connexion échouée: {login_response.status_code}")
        return False

def test_header_auth():
    """Tester l'authentification par header"""
    print(f"\n🔍 Test de l'authentification par header")
    print("-" * 50)
    
    token = "3f1ebc311e793e4a78c3c9ff66a597e053101374"
    
    # Tester différents formats de header
    headers_variants = [
        {'Authorization': f'Token {token}'},
        {'Authorization': f'Bearer {token}'},
        {'Authorization': token},
        {'X-Auth-Token': token},
        {'Authentication': f'Token {token}'}
    ]
    
    for i, headers in enumerate(headers_variants, 1):
        print(f"\n  Test {i}: {list(headers.keys())[0]} = {list(headers.values())[0][:20]}...")
        
        try:
            response = requests.get('http://localhost:3000/api/teachers/me', 
                                  headers=headers, timeout=10)
            
            print(f"    Status: {response.status_code}")
            
            if response.status_code == 200:
                print("    ✅ SUCCÈS!")
                data = response.json()
                print(f"    📊 Données: {json.dumps(data, indent=2)}")
                return True
            else:
                print(f"    ❌ Échec")
                
        except Exception as e:
            print(f"    ❌ Erreur: {e}")
    
    return False

def test_body_auth():
    """Tester l'authentification par body"""
    print(f"\n🔍 Test de l'authentification par body")
    print("-" * 50)
    
    token = "3f1ebc311e793e4a78c3c9ff66a597e053101374"
    
    # Tester différents formats dans le body
    body_variants = [
        {'token': token},
        {'auth_token': token},
        {'access_token': token},
        {'authorization': f'Token {token}'}
    ]
    
    for i, body in enumerate(body_variants, 1):
        print(f"\n  Test {i}: {list(body.keys())[0]} = {list(body.values())[0][:20]}...")
        
        try:
            response = requests.get('http://localhost:3000/api/teachers/me', 
                                  json=body, timeout=10)
            
            print(f"    Status: {response.status_code}")
            
            if response.status_code == 200:
                print("    ✅ SUCCÈS!")
                data = response.json()
                print(f"    📊 Données: {json.dumps(data, indent=2)}")
                return True
            else:
                print(f"    ❌ Échec")
                
        except Exception as e:
            print(f"    ❌ Erreur: {e}")
    
    return False

def main():
    """Fonction principale"""
    print("🚀 Test de différentes méthodes d'authentification")
    print("=" * 80)
    
    # 1. Test par cookie
    cookie_success = test_cookie_auth()
    
    # 2. Test par header
    header_success = test_header_auth()
    
    # 3. Test par body
    body_success = test_body_auth()
    
    print("\n" + "=" * 80)
    print("📋 Résumé des méthodes d'authentification")
    print("=" * 80)
    
    print(f"✅ Cookie: {'PASS' if cookie_success else 'FAIL'}")
    print(f"✅ Header: {'PASS' if header_success else 'FAIL'}")
    print(f"✅ Body: {'PASS' if body_success else 'FAIL'}")
    
    if cookie_success or header_success or body_success:
        print(f"\n🎉 AU MOINS UNE MÉTHODE FONCTIONNE!")
        if cookie_success:
            print("💡 Utilisez l'authentification par cookie")
        elif header_success:
            print("💡 Utilisez l'authentification par header")
        elif body_success:
            print("💡 Utilisez l'authentification par body")
    else:
        print(f"\n❌ AUCUNE MÉTHODE NE FONCTIONNE")
        print("💡 Vérifiez la configuration de l'endpoint Next.js")

if __name__ == '__main__':
    main()



