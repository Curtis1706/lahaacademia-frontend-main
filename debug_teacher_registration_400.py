#!/usr/bin/env python3
"""
Script pour déboguer l'erreur 400 lors de l'inscription des professeurs
"""

import requests
import json

def test_teacher_registration_with_different_data():
    """Tester l'inscription avec différentes données"""
    print("🔍 Test de l'inscription des professeurs avec différentes données")
    print("=" * 70)
    
    # Test 1: Données minimales
    print("\n📋 Test 1: Données minimales")
    test_data_minimal = {
        'email': 'test_teacher_minimal@example.com',
        'password': 'testpassword123',
        'first_name': 'Test',
        'last_name': 'Teacher',
        'subjects': '["mathematics"]',
        'experience_years': 1,
        'hourly_rate': 20000,
        'bio': 'Test bio'
    }
    
    test_endpoint('http://localhost:8000/api/teachers/register/', test_data_minimal)
    
    # Test 2: Données complètes
    print("\n📋 Test 2: Données complètes")
    test_data_complete = {
        'email': 'test_teacher_complete@example.com',
        'password': 'testpassword123',
        'first_name': 'Test',
        'last_name': 'Teacher',
        'subjects': '["mathematics", "physics", "chemistry"]',
        'experience_years': 5,
        'hourly_rate': 30000,
        'bio': 'Professeur expérimenté en sciences'
    }
    
    test_endpoint('http://localhost:8000/api/teachers/register/', test_data_complete)
    
    # Test 3: Données invalides (pour voir l'erreur)
    print("\n📋 Test 3: Données invalides (test d'erreur)")
    test_data_invalid = {
        'email': 'invalid-email',  # Email invalide
        'password': '123',  # Mot de passe trop court
        'first_name': '',  # Prénom vide
        'last_name': '',  # Nom vide
        'subjects': 'invalid_json',  # JSON invalide
        'experience_years': -1,  # Années négatives
        'hourly_rate': -1000,  # Taux négatif
    }
    
    test_endpoint('http://localhost:8000/api/teachers/register/', test_data_invalid)

def test_endpoint(url, data):
    """Tester un endpoint avec des données spécifiques"""
    try:
        print(f"📤 Envoi vers: {url}")
        print(f"📋 Données: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        print(f"📥 Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"📥 Réponse JSON: {json.dumps(response_data, indent=2)}")
        except:
            print(f"📥 Réponse texte: {response.text}")
            
        if response.status_code == 201:
            print("✅ Succès!")
        elif response.status_code == 400:
            print("❌ Erreur 400 - Données invalides")
        else:
            print(f"⚠️ Status inattendu: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erreur de connexion - Serveur Django non accessible")
        print("💡 Démarrez le serveur: cd django_backend && python manage.py runserver 8000")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_django_server_status():
    """Vérifier le statut du serveur Django"""
    print("🔍 Vérification du serveur Django")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:8000/api/teachers/register/', timeout=5)
        print(f"📊 Status GET: {response.status_code}")
        if response.status_code == 405:
            print("✅ Endpoint accessible (GET non autorisé, normal)")
        else:
            print(f"⚠️ Status inattendu: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Django non accessible")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("🚀 Débogage de l'erreur 400 lors de l'inscription des professeurs")
    print("=" * 80)
    
    # Vérifier que Django est accessible
    if not test_django_server_status():
        print("\n❌ Impossible de continuer - Serveur Django non accessible")
        return
    
    # Tester différentes données
    test_teacher_registration_with_different_data()
    
    print("\n" + "=" * 80)
    print("📋 Résumé des tests")
    print("=" * 80)
    print("✅ Si vous voyez des erreurs 400, vérifiez:")
    print("   1. Format des données JSON")
    print("   2. Validation des champs requis")
    print("   3. Types de données (string, number, etc.)")
    print("   4. Logs Django pour plus de détails")

if __name__ == '__main__':
    main()




