#!/usr/bin/env python3
"""
Script pour tester les fonctionnalités de validation et rejet
"""

import requests
import json

def get_pending_teachers():
    """Récupérer la liste des professeurs en attente"""
    print("🔍 Récupération des professeurs en attente")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📊 {count} professeurs en attente")
            
            if teachers:
                # Prendre le premier professeur pour le test
                test_teacher = teachers[0]
                teacher_id = test_teacher['id']
                user = test_teacher['user']
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                
                print(f"📋 Professeur de test: {first_name} {last_name} ({email}) - ID: {teacher_id}")
                
                return {
                    'id': teacher_id,
                    'name': f"{first_name} {last_name}",
                    'email': email,
                    'is_validated': test_teacher.get('is_validated', False),
                    'is_active': user.get('is_active', True)
                }
            else:
                print("❌ Aucun professeur en attente trouvé")
                return None
                
        else:
            print(f"❌ Erreur API: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def test_validation_via_django(teacher_id):
    """Tester la validation via Django"""
    print(f"\n🔍 Test de validation via Django")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(f"{base_url}/teachers/{teacher_id}/validate/", 
                               headers=headers, timeout=10)
        
        print(f"📊 Status validation Django: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Validation Django réussie")
            print(f"📊 Réponse: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Erreur validation Django: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_validation_via_nextjs(teacher_id):
    """Tester la validation via Next.js"""
    print(f"\n🔍 Test de validation via Next.js")
    print("-" * 50)
    
    try:
        response = requests.post(f'http://localhost:3000/api/teachers/{teacher_id}/validate',
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        
        print(f"📊 Status validation Next.js: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Validation Next.js réussie")
            print(f"📊 Réponse: {json.dumps(data, indent=2)}")
            return True
        else:
            print(f"❌ Erreur validation Next.js: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def verify_teacher_status(teacher_id, email):
    """Vérifier le statut du professeur après validation"""
    print(f"\n🔍 Vérification du statut du professeur")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Vérifier les détails du professeur
        response = requests.get(f"{base_url}/teachers/{teacher_id}/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            teacher_data = response.json()
            is_validated = teacher_data.get('is_validated', False)
            user = teacher_data.get('user', {})
            is_active = user.get('is_active', True)
            
            print(f"📋 Statut du professeur {email}:")
            print(f"   ID: {teacher_id}")
            print(f"   Validé: {is_validated}")
            print(f"   Actif: {is_active}")
            
            if is_validated:
                print("✅ Professeur validé avec succès")
                return True
            else:
                print("❌ Professeur non validé")
                return False
        else:
            print(f"❌ Erreur récupération statut: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def check_teacher_in_pending_list(email):
    """Vérifier si le professeur est encore dans la liste des en attente"""
    print(f"\n🔍 Vérification dans la liste des en attente")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📊 Nombre de professeurs en attente: {count}")
            
            # Chercher le professeur validé
            found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == email:
                    found = True
                    break
            
            if found:
                print(f"❌ Le professeur {email} est encore dans la liste des en attente")
                print("⚠️ Le professeur devrait être retiré de la liste après validation")
                return False
            else:
                print(f"✅ Le professeur {email} n'est plus dans la liste des en attente")
                print("✅ La validation fonctionne correctement")
                return True
                
        else:
            print(f"❌ Erreur récupération liste: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test des fonctionnalités de validation")
    print("=" * 80)
    
    # 1. Récupérer un professeur en attente
    teacher = get_pending_teachers()
    
    if not teacher:
        print("❌ Impossible de continuer - aucun professeur en attente")
        return
    
    teacher_id = teacher['id']
    email = teacher['email']
    name = teacher['name']
    
    print(f"\n📋 Professeur sélectionné pour le test:")
    print(f"   Nom: {name}")
    print(f"   Email: {email}")
    print(f"   ID: {teacher_id}")
    
    # 2. Tester la validation via Django
    django_success = test_validation_via_django(teacher_id)
    
    # 3. Tester la validation via Next.js
    nextjs_success = test_validation_via_nextjs(teacher_id)
    
    # 4. Vérifier le statut du professeur
    status_success = verify_teacher_status(teacher_id, email)
    
    # 5. Vérifier que le professeur n'est plus dans la liste des en attente
    removal_success = check_teacher_in_pending_list(email)
    
    print("\n" + "=" * 80)
    print("📋 Résumé des tests de validation")
    print("=" * 80)
    
    print(f"📧 Professeur testé: {name} ({email})")
    print(f"✅ Validation Django: {'PASS' if django_success else 'FAIL'}")
    print(f"✅ Validation Next.js: {'PASS' if nextjs_success else 'FAIL'}")
    print(f"✅ Statut mis à jour: {'PASS' if status_success else 'FAIL'}")
    print(f"✅ Retiré de la liste: {'PASS' if removal_success else 'FAIL'}")
    
    if django_success and nextjs_success and status_success and removal_success:
        print("\n🎉 SUCCÈS! Toutes les fonctionnalités de validation fonctionnent:")
        print("   1. ✅ Validation Django fonctionnelle")
        print("   2. ✅ Validation Next.js fonctionnelle")
        print("   3. ✅ Statut du professeur mis à jour")
        print("   4. ✅ Professeur retiré de la liste des en attente")
    else:
        print("\n❌ ÉCHEC! Certaines fonctionnalités ne fonctionnent pas")
        print("💡 Vérifiez les erreurs ci-dessus")

if __name__ == '__main__':
    main()



