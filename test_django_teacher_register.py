#!/usr/bin/env python3
"""
Script pour tester la route d'inscription des professeurs dans Django
"""

import os
import sys
import django
from pathlib import Path
import requests
import json

# Ajouter le chemin du projet Django
django_path = Path(__file__).parent / "django_backend"
sys.path.insert(0, str(django_path))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

def test_django_server():
    """Tester si le serveur Django répond"""
    try:
        response = requests.get('http://localhost:8000/api/teachers/', timeout=5)
        print(f"✅ Serveur Django accessible: {response.status_code}")
        return True
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Django non accessible sur http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Erreur lors du test du serveur Django: {e}")
        return False

def test_teacher_register_endpoint():
    """Tester l'endpoint d'inscription des professeurs"""
    try:
        # Données de test
        test_data = {
            'email': 'test.teacher@example.com',
            'password': 'test123',
            'first_name': 'Test',
            'last_name': 'Teacher',
            'bio': 'Professeur de test',
            'subjects': '["mathematics"]',  # JSON string
            'experience_years': 2,
            'hourly_rate': 15000
        }
        
        response = requests.post(
            'http://localhost:8000/api/teachers/register/',
            data=test_data,
            timeout=10
        )
        
        print(f"📡 Test inscription professeur: {response.status_code}")
        print(f"📋 Réponse: {response.text[:200]}...")
        
        if response.status_code == 201:
            print("✅ Inscription réussie!")
            return True
        elif response.status_code == 400:
            print("❌ Erreur 400 - Données invalides")
            try:
                error_data = response.json()
                print(f"🔍 Détails de l'erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"🔍 Réponse brute: {response.text}")
            return False
        else:
            print(f"❌ Erreur inattendue: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return False

def test_teacher_register_with_files():
    """Tester l'inscription avec des fichiers simulés"""
    try:
        # Créer des fichiers de test
        files = {
            'diploma_file': ('diploma.pdf', b'Test diploma content', 'application/pdf'),
            'criminal_record_file': ('criminal.pdf', b'Test criminal record', 'application/pdf'),
            'identity_document_file': ('identity.pdf', b'Test identity document', 'application/pdf'),
            'proof_of_address_file': ('address.pdf', b'Test address proof', 'application/pdf'),
            'profile_photo': ('photo.jpg', b'Test photo content', 'image/jpeg'),
            'cv_file': ('cv.pdf', b'Test CV content', 'application/pdf')
        }
        
        # Données de test
        data = {
            'email': 'test.teacher.files@example.com',
            'password': 'test123',
            'first_name': 'Test',
            'last_name': 'TeacherFiles',
            'bio': 'Professeur de test avec fichiers',
            'subjects': '["mathematics"]',  # JSON string
            'experience_years': 3,
            'hourly_rate': 18000
        }
        
        response = requests.post(
            'http://localhost:8000/api/teachers/register/',
            data=data,
            files=files,
            timeout=15
        )
        
        print(f"📡 Test inscription avec fichiers: {response.status_code}")
        print(f"📋 Réponse: {response.text[:200]}...")
        
        if response.status_code == 201:
            print("✅ Inscription avec fichiers réussie!")
            return True
        elif response.status_code == 400:
            print("❌ Erreur 400 - Données invalides")
            try:
                error_data = response.json()
                print(f"🔍 Détails de l'erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"🔍 Réponse brute: {response.text}")
            return False
        else:
            print(f"❌ Erreur inattendue: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du test avec fichiers: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Test de l'inscription des professeurs Django")
    print("=" * 50)
    
    # Test 1: Serveur accessible
    if not test_django_server():
        print("\n💡 Solution: Démarrer le serveur Django avec:")
        print("   cd django_backend && python manage.py runserver 8000")
        sys.exit(1)
    
    print("\n" + "-" * 30)
    
    # Test 2: Inscription simple
    test_teacher_register_endpoint()
    
    print("\n" + "-" * 30)
    
    # Test 3: Inscription avec fichiers
    test_teacher_register_with_files()
    
    print("\n" + "=" * 50)
    print("🎯 Tests terminés!")
