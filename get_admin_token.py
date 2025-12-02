#!/usr/bin/env python3
"""
Script pour obtenir un token admin valide
"""

import requests
import json

def get_admin_token():
    """Obtenir un token admin valide"""
    base_url = "http://localhost:8000/api"
    
    print("🔑 Obtention du token admin...")
    
    # Test avec admin17
    credentials = [
        {"username": "admin17", "password": "admin123"},
        {"username": "admin@lahaacademia.com", "password": "admin123"},
        {"username": "superadmin", "password": "admin123"}
    ]
    
    for cred in credentials:
        try:
            print(f"🧪 Test avec {cred['username']}...")
            response = requests.post(f"{base_url}/auth/login/", 
                                   json=cred,
                                   timeout=5)
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                token = data.get('token')
                if token:
                    print(f"\n✅ SUCCÈS avec {cred['username']}!")
                    print(f"🔑 Token: {token}")
                    
                    # Tester l'API des professeurs
                    headers = {"Authorization": f"Token {token}"}
                    response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=5)
                    
                    if response.status_code == 200:
                        data = response.json()
                        teachers = data.get('teachers', [])
                        print(f"✅ API des professeurs fonctionne: {len(teachers)} professeurs")
                        
                        print(f"\n🎯 SOLUTION:")
                        print(f"1. Utilisez ce token dans le localStorage:")
                        print(f"   localStorage.setItem('auth_token', '{token}')")
                        print(f"2. Ou connectez-vous avec:")
                        print(f"   - Username: {cred['username']}")
                        print(f"   - Password: {cred['password']}")
                        
                        return token, cred['username']
                    else:
                        print(f"❌ API des professeurs: {response.status_code}")
                else:
                    print("❌ Pas de token dans la réponse")
            else:
                print(f"❌ Échec: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erreur: {e}")
    
    return None, None

def main():
    print("🚀 Obtention du token admin pour la page de validation...")
    print("="*60)
    
    token, username = get_admin_token()
    
    if token:
        print(f"\n🎉 TOKEN OBTENU AVEC SUCCÈS!")
        print("="*50)
        print(f"👤 Nom d'utilisateur: {username}")
        print(f"🔑 Token: {token}")
        print("\n📋 INSTRUCTIONS:")
        print("1. Ouvrez la console du navigateur (F12)")
        print("2. Exécutez cette commande:")
        print(f"   localStorage.setItem('auth_token', '{token}')")
        print("3. Rechargez la page de validation")
        print("4. Les données devraient maintenant s'afficher!")
        print("="*50)
    else:
        print("\n❌ Impossible d'obtenir un token valide")
        print("💡 Vérifiez que le serveur Django fonctionne correctement")

if __name__ == "__main__":
    main()









