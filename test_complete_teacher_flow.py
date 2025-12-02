#!/usr/bin/env python3
"""
Script pour tester le flux complet d'inscription des enseignants
"""

import requests
import json
import time

def test_teacher_registration():
    """Tester l'inscription d'un enseignant"""
    print("🔍 Test d'inscription d'un enseignant")
    print("=" * 60)
    
    # Données de test
    test_data = {
        'firstName': 'Test',
        'lastName': 'AUTO',
        'email': f'test.auto.{int(time.time())}@example.com',
        'password': 'password123',
        'bio': 'Professeur de test automatique',
        'specialization': '["mathematics", "physics"]',
        'experience_years': '3',
        'hourly_rate': '25000'
    }
    
    print(f"📧 Email de test: {test_data['email']}")
    
    try:
        response = requests.post('http://localhost:3000/api/teachers/register', 
                               data=test_data, timeout=30)
        
        print(f"📊 Status inscription: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Inscription réussie")
            print(f"📊 Réponse: {json.dumps(data, indent=2)}")
            return test_data
        else:
            print(f"❌ Erreur inscription: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_teacher_login(email, password):
    """Tester la connexion d'un enseignant"""
    print(f"\n🔍 Test de connexion enseignant")
    print("-" * 50)
    
    try:
        response = requests.post('http://localhost:3000/api/auth/login', 
                               json={'email': email, 'password': password},
                               timeout=10)
        
        print(f"📊 Status connexion: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Connexion réussie")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            
            token = data.get('token')
            if token:
                print(f"🔑 Token reçu: {token[:20]}...")
                return token
            else:
                print("❌ Aucun token dans la réponse")
                return None
        else:
            print(f"❌ Erreur connexion: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_teacher_me_api(token):
    """Tester l'API /api/teachers/me"""
    print(f"\n🔍 Test de l'API /api/teachers/me")
    print("-" * 50)
    
    try:
        headers = {'Authorization': f'Token {token}'}
        response = requests.get('http://localhost:3000/api/teachers/me', 
                              headers=headers, timeout=10)
        
        print(f"📊 Status /api/teachers/me: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API /api/teachers/me fonctionne")
            print(f"📊 Données: {json.dumps(data, indent=2)}")
            
            is_validated = data.get('is_validated', False)
            user = data.get('user', {})
            email = user.get('email', 'N/A')
            
            print(f"\n📋 Résumé:")
            print(f"   Email: {email}")
            print(f"   Validé: {is_validated}")
            
            if not is_validated:
                print("✅ Professeur non validé - page d'attente devrait s'afficher")
                return True
            else:
                print("ℹ️ Professeur déjà validé - dashboard normal devrait s'afficher")
                return True
                
        else:
            print(f"❌ Erreur /api/teachers/me: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def check_teacher_in_admin_panel(email):
    """Vérifier si le professeur apparaît dans le panel admin"""
    print(f"\n🔍 Vérification dans le panel admin")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == email:
                    found = True
                    print(f"✅ Professeur trouvé dans le panel admin")
                    print(f"   Nom: {user.get('first_name')} {user.get('last_name')}")
                    print(f"   Email: {user.get('email')}")
                    print(f"   Validé: {teacher.get('is_validated', False)}")
                    break
            
            if not found:
                print(f"❌ Professeur non trouvé dans le panel admin")
                print(f"   Total professeurs en attente: {len(teachers)}")
            
            return found
            
        else:
            print(f"❌ Erreur panel admin: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test du flux complet d'inscription des enseignants")
    print("=" * 80)
    
    # 1. Test d'inscription
    teacher_data = test_teacher_registration()
    
    if not teacher_data:
        print("❌ Impossible de continuer - inscription échouée")
        return
    
    email = teacher_data['email']
    password = teacher_data['password']
    
    # Attendre un peu pour que l'inscription soit traitée
    print("\n⏳ Attente de 2 secondes...")
    time.sleep(2)
    
    # 2. Test de connexion
    token = test_teacher_login(email, password)
    
    if not token:
        print("❌ Impossible de continuer - connexion échouée")
        return
    
    # 3. Test de l'API /api/teachers/me
    me_api_success = test_teacher_me_api(token)
    
    # 4. Vérifier dans le panel admin
    admin_panel_success = check_teacher_in_admin_panel(email)
    
    print("\n" + "=" * 80)
    print("📋 Résumé du flux complet")
    print("=" * 80)
    
    print(f"📧 Email testé: {email}")
    print(f"✅ Inscription: {'PASS' if teacher_data else 'FAIL'}")
    print(f"✅ Connexion: {'PASS' if token else 'FAIL'}")
    print(f"✅ API /api/teachers/me: {'PASS' if me_api_success else 'FAIL'}")
    print(f"✅ Visible dans panel admin: {'PASS' if admin_panel_success else 'FAIL'}")
    
    if teacher_data and token and me_api_success and admin_panel_success:
        print("\n🎉 SUCCÈS! Le flux complet fonctionne:")
        print("   1. ✅ Inscription automatique")
        print("   2. ✅ Connexion automatique")
        print("   3. ✅ Page d'attente accessible")
        print("   4. ✅ Visible dans le panel admin")
    else:
        print("\n❌ ÉCHEC! Le flux n'est pas complet")
        print("💡 Vérifiez les étapes qui ont échoué")

if __name__ == '__main__':
    main()





