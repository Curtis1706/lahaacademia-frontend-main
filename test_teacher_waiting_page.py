#!/usr/bin/env python3
"""
Script pour tester la page d'attente des enseignants
"""

import requests
import json

def test_teacher_me_api():
    """Tester l'API /api/teachers/me"""
    print("🔍 Test de l'API /api/teachers/me")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/me', timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API /api/teachers/me fonctionne")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            
            is_validated = data.get('is_validated', False)
            user = data.get('user', {})
            email = user.get('email', 'N/A')
            first_name = user.get('first_name', 'N/A')
            last_name = user.get('last_name', 'N/A')
            
            print(f"\n📋 Informations professeur:")
            print(f"   Nom: {first_name} {last_name}")
            print(f"   Email: {email}")
            print(f"   Validé: {is_validated}")
            
            if not is_validated:
                print(f"✅ Professeur non validé - page d'attente devrait s'afficher")
                return True
            else:
                print(f"ℹ️ Professeur déjà validé - dashboard normal devrait s'afficher")
                return True
                
        elif response.status_code == 401:
            print("❌ Erreur 401 - Non autorisé")
            print("💡 L'utilisateur n'est pas connecté ou le token est invalide")
            return False
            
        else:
            print(f"❌ Erreur: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_teacher_login_and_dashboard():
    """Tester la connexion d'un enseignant et l'accès au dashboard"""
    print(f"\n🔍 Test de connexion enseignant et dashboard")
    print("-" * 50)
    
    # Utiliser Olympe CHABI qui est en attente
    email = "chabi@gmail.com"
    password = "password123"  # Mot de passe par défaut
    
    try:
        # 1. Se connecter
        login_response = requests.post('http://localhost:3000/api/auth/login', 
                                     json={'email': email, 'password': password},
                                     timeout=10)
        
        print(f"📊 Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            print("✅ Connexion réussie")
            print(f"📊 Données login: {json.dumps(login_data, indent=2)}")
            
            # 2. Tester l'API /api/teachers/me avec le token
            token = login_data.get('token')
            if token:
                headers = {'Authorization': f'Token {token}'}
                me_response = requests.get('http://localhost:3000/api/teachers/me', 
                                         headers=headers, timeout=10)
                
                print(f"\n📊 /api/teachers/me avec token: {me_response.status_code}")
                
                if me_response.status_code == 200:
                    me_data = me_response.json()
                    is_validated = me_data.get('is_validated', False)
                    
                    print("✅ API /api/teachers/me avec token fonctionne")
                    print(f"📊 Validé: {is_validated}")
                    
                    if not is_validated:
                        print("✅ Page d'attente devrait s'afficher")
                        return True
                    else:
                        print("ℹ️ Dashboard normal devrait s'afficher")
                        return True
                else:
                    print(f"❌ Erreur /api/teachers/me: {me_response.status_code}")
                    return False
            else:
                print("❌ Aucun token dans la réponse de login")
                return False
                
        else:
            print(f"❌ Erreur de connexion: {login_response.status_code}")
            try:
                error_data = login_response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test de la page d'attente des enseignants")
    print("=" * 80)
    
    # Test 1: API sans authentification
    print("1️⃣ Test de l'API /api/teachers/me sans authentification")
    api_success = test_teacher_me_api()
    
    # Test 2: Connexion et dashboard
    print(f"\n2️⃣ Test de connexion enseignant et dashboard")
    login_success = test_teacher_login_and_dashboard()
    
    print("\n" + "=" * 80)
    print("📋 Résumé des tests")
    print("=" * 80)
    
    print(f"✅ API /api/teachers/me: {'PASS' if api_success else 'FAIL'}")
    print(f"✅ Connexion et dashboard: {'PASS' if login_success else 'FAIL'}")
    
    if api_success and login_success:
        print("\n🎉 Tous les tests sont passés!")
        print("✅ La page d'attente devrait s'afficher pour les enseignants non validés")
    else:
        print("\n❌ Certains tests ont échoué")
        print("💡 Vérifiez l'authentification et les tokens")
    
    print(f"\n📋 Instructions manuelles:")
    print(f"1. Connectez-vous avec un compte enseignant non validé")
    print(f"2. Allez sur http://localhost:3000/dashboard/teacher")
    print(f"3. Vérifiez que la page d'attente s'affiche")

if __name__ == '__main__':
    main()



