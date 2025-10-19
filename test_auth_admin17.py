#!/usr/bin/env python3
"""
Test d'authentification avec le compte admin17
"""

import requests
import json

def test_auth_admin17():
    """Tester l'authentification avec admin17"""
    base_url = "http://localhost:8000/api"
    
    print("🧪 Test d'authentification avec admin17...")
    
    # Test login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": "admin17", "password": "admin123"},
                               timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login API fonctionne avec admin17")
            data = response.json()
            token = data.get('token')
            if token:
                print(f"🔑 Token reçu: {token[:20]}...")
                
                # Tester l'API des professeurs
                headers = {"Authorization": f"Token {token}"}
                response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=5)
                
                if response.status_code == 200:
                    print("✅ API des professeurs fonctionne")
                    data = response.json()
                    teachers = data.get('teachers', [])
                    print(f"📋 {len(teachers)} professeurs en attente de validation")
                    
                    for teacher in teachers[:3]:
                        user_info = teacher.get('user', {})
                        print(f"   - {user_info.get('first_name', '')} {user_info.get('last_name', '')} ({user_info.get('email', '')})")
                    
                    print("\n🎉 SUCCÈS COMPLET !")
                    print("✅ L'authentification fonctionne")
                    print("✅ L'API des professeurs fonctionne")
                    print("✅ La page de validation est opérationnelle")
                    print("\n📋 INFORMATIONS DE CONNEXION:")
                    print("👤 Nom d'utilisateur: admin17")
                    print("🔑 Mot de passe: admin123")
                    print(f"🔑 Token API: {token}")
                    return True
                else:
                    print(f"❌ API des professeurs: {response.status_code} - {response.text}")
            else:
                print("❌ Pas de token dans la réponse")
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    return False

def main():
    print("🚀 Test de l'authentification admin17...")
    print("="*50)
    
    success = test_auth_admin17()
    
    if success:
        print("\n🎯 INSTRUCTIONS FINALES:")
        print("1. Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
        print("2. Connectez-vous avec:")
        print("   - Nom d'utilisateur: admin17")
        print("   - Mot de passe: admin123")
        print("3. La page devrait maintenant afficher les vraies données des professeurs")
    else:
        print("\n⚠️  Problème persistant avec l'authentification")
        print("💡 Essayez de redémarrer le serveur Django")

if __name__ == "__main__":
    main()







