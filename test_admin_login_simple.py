#!/usr/bin/env python3
"""
Script simple pour tester la connexion admin
"""

import requests
import json

def test_admin_login():
    """Tester la connexion admin"""
    print("🔍 Test de la connexion admin")
    print("=" * 50)
    
    # Test 1: Connexion avec username 'admin'
    print("\n📋 Test 1: Connexion avec username 'admin'")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/login/',
            json=login_data,
            timeout=10
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Connexion réussie!")
            data = response.json()
            print(f"📥 Token: {data.get('token', 'N/A')[:20]}...")
            print(f"📥 User: {data.get('user', {}).get('username', 'N/A')}")
            print(f"📥 Role: {data.get('user', {}).get('role', 'N/A')}")
            return True
        else:
            print("❌ Échec de la connexion")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Django non accessible")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_different_passwords():
    """Tester avec différents mots de passe"""
    print("\n🔍 Test avec différents mots de passe")
    print("-" * 50)
    
    passwords = ['admin123', 'admin', 'password', 'lahaacademia', '123456']
    
    for password in passwords:
        print(f"\n  Test avec mot de passe: '{password}'")
        login_data = {
            'username': 'admin',
            'password': password
        }
        
        try:
            response = requests.post(
                'http://localhost:8000/api/auth/login/',
                json=login_data,
                timeout=5
            )
            
            if response.status_code == 200:
                print("  ✅ Connexion réussie!")
                return password
            else:
                print("  ❌ Échec")
                
        except Exception as e:
            print(f"  ❌ Erreur: {e}")
    
    return None

def main():
    """Fonction principale"""
    print("🚀 Test simple de la connexion admin")
    print("=" * 80)
    
    # Test 1: Connexion avec mot de passe par défaut
    success = test_admin_login()
    
    if not success:
        # Test 2: Essayer différents mots de passe
        correct_password = test_different_passwords()
        
        if correct_password:
            print(f"\n✅ Mot de passe correct trouvé: '{correct_password}'")
        else:
            print("\n❌ Aucun mot de passe correct trouvé")
            print("\n💡 Solutions possibles:")
            print("   1. Créer un superutilisateur:")
            print("      cd django_backend && python manage.py createsuperuser")
            print("   2. Réinitialiser le mot de passe admin:")
            print("      cd django_backend && python manage.py shell")
            print("      >>> from django.contrib.auth.models import User")
            print("      >>> u = User.objects.get(username='admin')")
            print("      >>> u.set_password('admin123')")
            print("      >>> u.save()")
    
    print("\n" + "=" * 80)
    print("✅ Test terminé!")

if __name__ == '__main__':
    main()






