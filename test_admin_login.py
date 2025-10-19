#!/usr/bin/env python3
"""
Script pour tester la connexion admin
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
        'password': 'admin123'  # Mot de passe par défaut
    }
    
    test_login('http://localhost:8000/api/auth/login/', login_data)
    
    # Test 2: Connexion avec email admin
    print("\n📋 Test 2: Connexion avec email admin")
    login_data_email = {
        'username': 'admin@lahaacademia.com',
        'password': 'admin123'
    }
    
    test_login('http://localhost:8000/api/auth/login/', login_data_email)
    
    # Test 3: Test avec différents mots de passe
    print("\n📋 Test 3: Test avec différents mots de passe")
    passwords_to_test = ['admin123', 'admin', 'password', 'lahaacademia']
    
    for password in passwords_to_test:
        print(f"\n  Test avec mot de passe: '{password}'")
        login_data_test = {
            'username': 'admin',
            'password': password
        }
        test_login('http://localhost:8000/api/auth/login/', login_data_test, show_details=False)

def test_login(url, data, show_details=True):
    """Tester une tentative de connexion"""
    try:
        if show_details:
            print(f"📤 Envoi vers: {url}")
            print(f"📋 Données: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=10)
        
        if show_details:
            print(f"📊 Status: {response.status_code}")
            print(f"📥 Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            if show_details:
                print(f"📥 Réponse: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 200:
                print("✅ Connexion réussie!")
                return True
            elif response.status_code == 401:
                print("❌ Identifiants invalides")
                return False
            elif response.status_code == 400:
                print("❌ Données invalides")
                return False
            else:
                print(f"⚠️ Status inattendu: {response.status_code}")
                return False
                
        except json.JSONDecodeError:
            print(f"📥 Réponse non-JSON: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Erreur de connexion - Serveur Django non accessible")
        print("💡 Démarrez le serveur: cd django_backend && python manage.py runserver 8000")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_django_server():
    """Vérifier si le serveur Django est accessible"""
    print("🔍 Vérification du serveur Django")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:8000/api/auth/login/', timeout=5)
        print(f"📊 Status GET: {response.status_code}")
        if response.status_code == 405:
            print("✅ Endpoint accessible (GET non autorisé, normal)")
            return True
        else:
            print(f"⚠️ Status inattendu: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Django non accessible")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def create_admin_user():
    """Créer un utilisateur admin si nécessaire"""
    print("\n🔧 Création d'un utilisateur admin")
    print("-" * 50)
    
    try:
        # Test si l'utilisateur admin existe
        from django.contrib.auth.models import User
        from django.core.management import execute_from_command_line
        import os
        import sys
        
        # Changer vers le répertoire Django
        os.chdir('django_backend')
        sys.path.append('.')
        
        # Configuration Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
        import django
        django.setup()
        
        # Vérifier si l'admin existe
        try:
            admin_user = User.objects.get(username='admin')
            print(f"✅ Utilisateur admin existe: {admin_user.email}")
            print(f"   Actif: {admin_user.is_active}")
            print(f"   Staff: {admin_user.is_staff}")
            print(f"   Superuser: {admin_user.is_superuser}")
            return True
        except User.DoesNotExist:
            print("❌ Utilisateur admin n'existe pas")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors de la vérification: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test de la connexion admin")
    print("=" * 80)
    
    # Vérifier que Django est accessible
    if not test_django_server():
        print("\n❌ Impossible de continuer - Serveur Django non accessible")
        return
    
    # Vérifier l'utilisateur admin
    if not create_admin_user():
        print("\n❌ Utilisateur admin manquant")
        print("💡 Créez l'utilisateur admin avec:")
        print("   cd django_backend && python manage.py createsuperuser")
        return
    
    # Tester la connexion
    test_admin_login()
    
    print("\n" + "=" * 80)
    print("📋 Résumé")
    print("=" * 80)
    print("✅ Si la connexion échoue:")
    print("   1. Vérifiez que le serveur Django est démarré")
    print("   2. Vérifiez que l'utilisateur admin existe")
    print("   3. Vérifiez le mot de passe admin")
    print("   4. Consultez les logs Django pour plus de détails")

if __name__ == '__main__':
    main()




