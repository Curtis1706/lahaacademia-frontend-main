#!/usr/bin/env python3
"""
Script de test pour vérifier les endpoints API
"""

import requests
import json

# URL de base de l'API
BASE_URL = "http://localhost:8000/api"

def test_endpoint(endpoint, description):
    """Teste un endpoint et affiche le résultat"""
    print(f"\n🔍 Test de {description}")
    print(f"URL: {BASE_URL}{endpoint}")
    
    try:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Succès! Données reçues:")
            print(f"   - Total: {data.get('total', 'N/A')}")
            if 'courses' in data:
                print(f"   - Cours: {len(data['courses'])}")
                for i, course in enumerate(data['courses'][:3]):  # Afficher les 3 premiers
                    print(f"     {i+1}. {course.get('title', 'N/A')}")
            if 'teachers' in data:
                print(f"   - Professeurs: {len(data['teachers'])}")
                for i, teacher in enumerate(data['teachers'][:3]):  # Afficher les 3 premiers
                    print(f"     {i+1}. {teacher.get('name', 'N/A')}")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur Django")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    print("🚀 Test des endpoints API pour la réservation de cours")
    print("=" * 60)
    
    # Test des endpoints principaux
    test_endpoint("/courses/courses-with-teachers/", "Cours avec professeurs")
    test_endpoint("/teachers/available-for-booking/", "Professeurs disponibles")
    
    # Test des endpoints de base
    test_endpoint("/courses/", "Liste des cours")
    test_endpoint("/teachers/", "Liste des professeurs")
    
    print("\n" + "=" * 60)
    print("✅ Tests terminés")

if __name__ == "__main__":
    main()

