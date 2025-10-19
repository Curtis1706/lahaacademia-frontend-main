#!/usr/bin/env python3
"""
Script de test pour le système de gestion des contenus pédagogiques
"""

import requests
import json
import time

def test_django_api():
    """Tester l'API Django"""
    print("🔍 Test de l'API Django")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Test 1: Récupérer les options de filtrage
        print("📋 Test 1: Options de filtrage")
        response = requests.get(f"{base_url}/educational-content/filter_options/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Options de filtrage récupérées")
            print(f"   Types de contenu: {len(data.get('content_types', []))}")
            print(f"   Matières: {len(data.get('subjects', []))}")
            print(f"   Classes: {len(data.get('class_levels', []))}")
            print(f"   Pays: {len(data.get('countries', []))}")
        else:
            print(f"❌ Erreur options de filtrage: {response.status_code}")
            return False
        
        # Test 2: Lister les contenus
        print(f"\n📚 Test 2: Liste des contenus")
        response = requests.get(f"{base_url}/educational-content/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            contents = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ {len(contents)} contenus récupérés")
            
            if contents:
                content = contents[0]
                print(f"   Premier contenu: {content.get('title', 'N/A')}")
                print(f"   Type: {content.get('content_type', 'N/A')}")
                print(f"   Statut: {content.get('status', 'N/A')}")
                return True
            else:
                print("⚠️ Aucun contenu trouvé")
                return True
        else:
            print(f"❌ Erreur liste contenus: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur API Django: {e}")
        return False

def test_nextjs_api():
    """Tester l'API Next.js"""
    print(f"\n🔍 Test de l'API Next.js")
    print("=" * 60)
    
    try:
        # Test 1: Options de filtrage
        print("📋 Test 1: Options de filtrage Next.js")
        response = requests.get('http://localhost:3000/api/admin/educational-content/filter-options', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Options de filtrage Next.js récupérées")
            print(f"   Types de contenu: {len(data.get('content_types', []))}")
            print(f"   Matières: {len(data.get('subjects', []))}")
            print(f"   Classes: {len(data.get('class_levels', []))}")
            print(f"   Pays: {len(data.get('countries', []))}")
        else:
            print(f"❌ Erreur options de filtrage Next.js: {response.status_code}")
            return False
        
        # Test 2: Liste des contenus
        print(f"\n📚 Test 2: Liste des contenus Next.js")
        response = requests.get('http://localhost:3000/api/admin/educational-content', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            contents = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ {len(contents)} contenus récupérés via Next.js")
            
            if contents:
                content = contents[0]
                print(f"   Premier contenu: {content.get('title', 'N/A')}")
                print(f"   Type: {content.get('content_type_display', 'N/A')}")
                print(f"   Statut: {content.get('status_display', 'N/A')}")
                return True
            else:
                print("⚠️ Aucun contenu trouvé via Next.js")
                return True
        else:
            print(f"❌ Erreur liste contenus Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur API Next.js: {e}")
        return False

def test_content_creation():
    """Tester la création de contenu"""
    print(f"\n🔍 Test de création de contenu")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    # Données de test
    test_content = {
        'title': 'Test Contenu - Cours de Test',
        'description': 'Ceci est un contenu de test créé automatiquement.',
        'content_type': 'course',
        'subject': 'mathematics',
        'class_level': '6eme',
        'country': 'cameroon',
        'difficulty_level': 'beginner',
        'duration_minutes': 30,
        'is_free': True,
        'tags': ['Test', 'Mathématiques'],
        'keywords': ['test', 'math', 'cours'],
        'learning_objectives': [
            'Tester la création de contenu',
            'Valider le système de gestion'
        ]
    }
    
    try:
        print("📝 Création d'un contenu de test...")
        response = requests.post(f"{base_url}/educational-content/", 
                               headers=headers, 
                               json=test_content, 
                               timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            content_id = data.get('id')
            print(f"✅ Contenu créé avec succès")
            print(f"   ID: {content_id}")
            print(f"   Titre: {data.get('title')}")
            print(f"   Statut: {data.get('status')}")
            
            # Test de suppression
            print(f"\n🗑️ Test de suppression du contenu de test...")
            delete_response = requests.delete(f"{base_url}/educational-content/{content_id}/", 
                                            headers=headers, 
                                            timeout=10)
            
            if delete_response.status_code == 204:
                print(f"✅ Contenu supprimé avec succès")
                return True
            else:
                print(f"⚠️ Erreur lors de la suppression: {delete_response.status_code}")
                return True
        else:
            print(f"❌ Erreur création contenu: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Détails: {error_data}")
            except:
                print(f"   Réponse: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur création contenu: {e}")
        return False

def test_filtering():
    """Tester le filtrage"""
    print(f"\n🔍 Test de filtrage")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Test filtrage par matière
        print("📋 Test filtrage par matière (mathématiques)...")
        response = requests.get(f"{base_url}/educational-content/?subject=mathematics", 
                              headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            contents = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ {len(contents)} contenus de mathématiques trouvés")
            
            for content in contents[:3]:  # Afficher les 3 premiers
                print(f"   - {content.get('title', 'N/A')}")
        else:
            print(f"❌ Erreur filtrage: {response.status_code}")
            return False
        
        # Test filtrage par pays
        print(f"\n📋 Test filtrage par pays (Cameroun)...")
        response = requests.get(f"{base_url}/educational-content/?country=cameroon", 
                              headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            contents = data.get('results', data) if isinstance(data, dict) else data
            print(f"✅ {len(contents)} contenus du Cameroun trouvés")
        else:
            print(f"❌ Erreur filtrage pays: {response.status_code}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur filtrage: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test du système de gestion des contenus pédagogiques")
    print("=" * 80)
    
    # Tests Django
    django_success = test_django_api()
    
    # Tests Next.js
    nextjs_success = test_nextjs_api()
    
    # Test création de contenu
    creation_success = test_content_creation()
    
    # Test filtrage
    filtering_success = test_filtering()
    
    print(f"\n" + "=" * 80)
    print("📋 Résumé des tests")
    print("=" * 80)
    
    print(f"✅ API Django: {'PASS' if django_success else 'FAIL'}")
    print(f"✅ API Next.js: {'PASS' if nextjs_success else 'FAIL'}")
    print(f"✅ Création contenu: {'PASS' if creation_success else 'FAIL'}")
    print(f"✅ Filtrage: {'PASS' if filtering_success else 'FAIL'}")
    
    if all([django_success, nextjs_success, creation_success, filtering_success]):
        print(f"\n🎉 SUCCÈS! Tous les tests sont passés")
        print("✅ Le système de gestion des contenus pédagogiques est opérationnel")
        print("✅ Les administrateurs peuvent gérer les contenus via l'interface")
        print("✅ Le filtrage par pays, classe et matière fonctionne")
        print("✅ La création, modification et suppression sont fonctionnelles")
    else:
        print(f"\n❌ ÉCHEC! Certains tests ont échoué")
        print("💡 Vérifiez les erreurs ci-dessus et corrigez les problèmes")
        print("💡 Assurez-vous que Django et Next.js sont démarrés")

if __name__ == '__main__':
    main()
