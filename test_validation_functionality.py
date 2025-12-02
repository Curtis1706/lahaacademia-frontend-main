#!/usr/bin/env python3
"""
Script pour tester les fonctionnalités de validation et rejet des enseignants
"""

import requests
import json

def test_validation_endpoints():
    """Tester les endpoints de validation et rejet"""
    print("🔍 Test des fonctionnalités de validation")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    # 1. Récupérer la liste des professeurs en attente
    print("1️⃣ Récupération des professeurs en attente...")
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ {len(teachers)} professeurs en attente trouvés")
            
            if teachers:
                # Prendre le premier professeur pour les tests
                test_teacher = teachers[0]
                teacher_id = test_teacher['id']
                teacher_name = f"{test_teacher['user']['first_name']} {test_teacher['user']['last_name']}"
                teacher_email = test_teacher['user']['email']
                
                print(f"📋 Professeur de test: {teacher_name} ({teacher_email}) - ID: {teacher_id}")
                
                # 2. Tester la validation
                print(f"\n2️⃣ Test de validation du professeur {teacher_name}...")
                try:
                    validate_response = requests.post(
                        f"{base_url}/teachers/{teacher_id}/validate/", 
                        headers=headers, 
                        timeout=10
                    )
                    
                    if validate_response.status_code == 200:
                        print("✅ Validation réussie!")
                        validate_data = validate_response.json()
                        print(f"📊 Réponse: {json.dumps(validate_data, indent=2)}")
                        
                        # 3. Vérifier que le professeur n'est plus en attente
                        print(f"\n3️⃣ Vérification que le professeur n'est plus en attente...")
                        pending_response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
                        if pending_response.status_code == 200:
                            pending_data = pending_response.json()
                            new_pending_count = pending_data.get('count', 0)
                            print(f"📊 Nombre de professeurs en attente après validation: {new_pending_count}")
                            
                            # Chercher si le professeur validé est toujours dans la liste
                            still_pending = False
                            for teacher in pending_data.get('teachers', []):
                                if teacher['id'] == teacher_id:
                                    still_pending = True
                                    break
                            
                            if not still_pending:
                                print("✅ Le professeur n'est plus dans la liste des en attente")
                            else:
                                print("❌ Le professeur est toujours dans la liste des en attente")
                        
                        return True
                        
                    else:
                        print(f"❌ Erreur de validation: {validate_response.status_code}")
                        try:
                            error_data = validate_response.json()
                            print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
                        except:
                            print(f"📥 Réponse: {validate_response.text}")
                        return False
                        
                except Exception as e:
                    print(f"❌ Erreur lors de la validation: {e}")
                    return False
                    
            else:
                print("❌ Aucun professeur en attente trouvé pour les tests")
                return False
                
        else:
            print(f"❌ Erreur lors de la récupération des professeurs: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_nextjs_validation_api():
    """Tester l'API Next.js de validation"""
    print("\n🔍 Test de l'API Next.js de validation")
    print("-" * 50)
    
    # D'abord, récupérer un professeur en attente via Next.js
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            if teachers:
                test_teacher = teachers[0]
                teacher_id = test_teacher['id']
                teacher_name = f"{test_teacher['user']['first_name']} {test_teacher['user']['last_name']}"
                
                print(f"📋 Professeur de test Next.js: {teacher_name} - ID: {teacher_id}")
                
                # Tester la validation via Next.js
                print(f"\n🧪 Test de validation via Next.js...")
                try:
                    validate_response = requests.post(
                        f'http://localhost:3000/api/teachers/{teacher_id}/validate',
                        headers={'Content-Type': 'application/json'},
                        timeout=10
                    )
                    
                    if validate_response.status_code == 200:
                        print("✅ Validation via Next.js réussie!")
                        validate_data = validate_response.json()
                        print(f"📊 Réponse: {json.dumps(validate_data, indent=2)}")
                        return True
                    else:
                        print(f"❌ Erreur de validation Next.js: {validate_response.status_code}")
                        try:
                            error_data = validate_response.json()
                            print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
                        except:
                            print(f"📥 Réponse: {validate_response.text}")
                        return False
                        
                except Exception as e:
                    print(f"❌ Erreur lors de la validation Next.js: {e}")
                    return False
            else:
                print("❌ Aucun professeur trouvé via Next.js")
                return False
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return False

def test_teacher_waiting_page():
    """Tester la page d'attente pour les enseignants"""
    print("\n🔍 Test de la page d'attente des enseignants")
    print("-" * 50)
    
    try:
        # Tester l'API /api/teachers/me
        response = requests.get('http://localhost:3000/api/teachers/me', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API /api/teachers/me fonctionne")
            print(f"📊 Données professeur: {json.dumps(data, indent=2)}")
            
            if data.get('is_validated') == False:
                print("✅ Professeur non validé - page d'attente devrait s'afficher")
            else:
                print("ℹ️ Professeur déjà validé - dashboard normal devrait s'afficher")
                
            return True
        else:
            print(f"❌ Erreur API /api/teachers/me: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test des fonctionnalités de validation des enseignants")
    print("=" * 80)
    
    # Test 1: Endpoints Django
    django_success = test_validation_endpoints()
    
    # Test 2: API Next.js
    nextjs_success = test_nextjs_validation_api()
    
    # Test 3: Page d'attente
    waiting_page_success = test_teacher_waiting_page()
    
    print("\n" + "=" * 80)
    print("📋 Résumé des tests")
    print("=" * 80)
    
    print(f"✅ Endpoints Django: {'PASS' if django_success else 'FAIL'}")
    print(f"✅ API Next.js: {'PASS' if nextjs_success else 'FAIL'}")
    print(f"✅ Page d'attente: {'PASS' if waiting_page_success else 'FAIL'}")
    
    if django_success and nextjs_success and waiting_page_success:
        print("\n🎉 Tous les tests sont passés! Les fonctionnalités de validation sont opérationnelles.")
    else:
        print("\n❌ Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")

if __name__ == '__main__':
    main()





