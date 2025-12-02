#!/usr/bin/env python3
"""
Script de test pour l'inscription des étudiants
"""

import requests
import json
from datetime import datetime

def test_student_registration():
    """Test l'inscription d'un étudiant"""
    
    # URL de l'API
    api_url = "http://localhost:8000/api/students/register/"
    
    # Données de test
    test_data = {
        "email": "test.student@example.com",
        "password": "testpassword123",
        "first_name": "Koffi",
        "last_name": "Asante",
        "phone": "+22912345678",
        "date_of_birth": "2010-05-15",
        "country": "Bénin",
        "city": "Cotonou",
        "school_level": "primary",
        "current_grade": "CM2",
        "school_name": "École Primaire de Cotonou"
    }
    
    print("🧪 Test d'inscription d'étudiant")
    print(f"📧 Email: {test_data['email']}")
    print(f"👤 Nom: {test_data['first_name']} {test_data['last_name']}")
    print(f"📱 Téléphone: {test_data['phone']}")
    print(f"🎓 Niveau: {test_data['school_level']}")
    print(f"🏫 École: {test_data['school_name']}")
    print()
    
    try:
        # Envoi de la requête
        response = requests.post(
            api_url,
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Statut de la réponse: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Inscription réussie!")
            data = response.json()
            print(f"🆔 ID Étudiant: {data.get('id', 'N/A')}")
            print(f"👤 Utilisateur créé: {data.get('user', {}).get('email', 'N/A')}")
        else:
            print("❌ Erreur lors de l'inscription")
            try:
                error_data = response.json()
                print(f"🔍 Détails de l'erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"🔍 Réponse brute: {response.text}")
                
    except requests.exceptions.ConnectionError:
        print("❌ Erreur de connexion - Vérifiez que le serveur Django est démarré")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")

def test_invalid_data():
    """Test avec des données invalides"""
    
    api_url = "http://localhost:8000/api/students/register/"
    
    # Données invalides (email manquant)
    invalid_data = {
        "password": "testpassword123",
        "first_name": "Koffi",
        "last_name": "Asante",
        "date_of_birth": "2010-05-15",
        "country": "Bénin",
        "city": "Cotonou",
        "school_level": "primary"
    }
    
    print("\n🧪 Test avec données invalides (email manquant)")
    
    try:
        response = requests.post(
            api_url,
            json=invalid_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"📊 Statut de la réponse: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Validation correcte - erreur détectée")
            error_data = response.json()
            print(f"🔍 Détails de l'erreur: {json.dumps(error_data, indent=2)}")
        else:
            print("❌ La validation devrait avoir échoué")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🚀 Démarrage des tests d'inscription étudiant")
    print("=" * 50)
    
    test_student_registration()
    test_invalid_data()
    
    print("\n" + "=" * 50)
    print("🏁 Tests terminés")


