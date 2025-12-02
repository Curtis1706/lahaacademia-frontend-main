#!/usr/bin/env python3
"""
Script pour tester le format des données envoyées par le frontend
"""

import requests
import json

def test_frontend_data_format():
    """Tester avec le format exact des données frontend"""
    print("🔍 Test avec le format des données frontend")
    print("=" * 60)
    
    # Simuler les données comme envoyées par le frontend
    # (tous les champs sont des strings, même les vides)
    frontend_data = {
        'firstName': 'Test',
        'lastName': 'Teacher',
        'email': 'test_frontend@example.com',
        'phone': '',  # Champ vide
        'password': 'testpassword123',
        'confirm_password': 'testpassword123',
        'bio': 'Test bio',
        'specialization': 'Mathematics',  # String simple, pas JSON
        'experience_years': '3',  # String, pas number
        'education_level': '',  # Champ vide
        'certifications': '',  # Champ vide
        'hourly_rate': '25000',  # String, pas number
        # Pas de fichiers pour ce test
    }
    
    print("📋 Données simulées du frontend:")
    for key, value in frontend_data.items():
        print(f"  {key}: '{value}' (type: {type(value).__name__})")
    
    try:
        # Tester avec FormData (comme le frontend)
        form_data = {}
        for key, value in frontend_data.items():
            if key != 'confirm_password':  # Exclure confirm_password
                form_data[key] = str(value)
        
        print(f"\n📤 Envoi vers Django...")
        response = requests.post(
            'http://localhost:8000/api/teachers/register/',
            data=form_data,  # Utiliser data= au lieu de json=
            timeout=10
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Succès avec format frontend!")
            try:
                data = response.json()
                print(f"📥 Réponse: {json.dumps(data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
        elif response.status_code == 400:
            print("❌ Erreur 400 - Données invalides")
            try:
                errors = response.json()
                print(f"📥 Erreurs: {json.dumps(errors, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
        else:
            print(f"⚠️ Status inattendu: {response.status_code}")
            print(f"📥 Réponse: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Erreur de connexion - Serveur Django non accessible")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_required_fields_only():
    """Tester avec seulement les champs requis"""
    print("\n🔍 Test avec champs requis seulement")
    print("=" * 60)
    
    required_data = {
        'firstName': 'Test',
        'lastName': 'Teacher', 
        'email': 'test_required@example.com',
        'password': 'testpassword123',
        'specialization': 'Mathematics',
        'experience_years': '1',
        'hourly_rate': '20000',
        'bio': 'Test bio'
    }
    
    print("📋 Données requises seulement:")
    for key, value in required_data.items():
        print(f"  {key}: '{value}'")
    
    try:
        response = requests.post(
            'http://localhost:8000/api/teachers/register/',
            data=required_data,
            timeout=10
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Succès avec champs requis!")
        elif response.status_code == 400:
            print("❌ Erreur 400 même avec champs requis")
            try:
                errors = response.json()
                print(f"📥 Erreurs: {json.dumps(errors, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
        else:
            print(f"⚠️ Status inattendu: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test du format des données frontend")
    print("=" * 80)
    
    # Test 1: Format exact du frontend
    test_frontend_data_format()
    
    # Test 2: Champs requis seulement
    test_required_fields_only()
    
    print("\n" + "=" * 80)
    print("📋 Analyse")
    print("=" * 80)
    print("✅ Si le test 1 échoue mais le test 2 réussit:")
    print("   → Le problème vient des champs vides ou optionnels")
    print("✅ Si les deux tests échouent:")
    print("   → Le problème vient du format des champs requis")
    print("✅ Si les deux tests réussissent:")
    print("   → Le problème vient du frontend ou de la transmission")

if __name__ == '__main__':
    main()






