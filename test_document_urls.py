#!/usr/bin/env python3
"""
Script pour tester les URLs des documents des professeurs
"""

import os
import sys
import django
import requests
from pathlib import Path

# Ajouter le chemin du projet Django
django_path = Path(__file__).parent / "django_backend"
sys.path.insert(0, str(django_path))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import Teacher
import json

def test_teacher_urls():
    """Tester les URLs des documents d'un professeur"""
    
    print("🔍 Test des URLs des documents des professeurs")
    print("=" * 60)
    
    # Récupérer un professeur avec des documents
    teacher = Teacher.objects.filter(
        diploma_file__isnull=False
    ).first()
    
    if not teacher:
        print("❌ Aucun professeur avec des documents trouvé")
        return
    
    print(f"📋 Professeur trouvé: {teacher.user.first_name} {teacher.user.last_name}")
    print(f"📧 Email: {teacher.user.email}")
    print(f"🆔 ID: {teacher.id}")
    
    # Tester les URLs des documents
    documents = [
        ('diploma_file', 'Diplôme'),
        ('criminal_record_file', 'Casier judiciaire'),
        ('identity_document_file', 'Pièce d\'identité'),
        ('proof_of_address_file', 'Justificatif de domicile'),
        ('profile_photo', 'Photo de profil'),
        ('cv_file', 'CV')
    ]
    
    base_url = 'http://localhost:8000'
    
    for field_name, display_name in documents:
        file_field = getattr(teacher, field_name)
        if file_field:
            # Obtenir l'URL du fichier
            file_url = file_field.url
            full_url = f"{base_url}{file_url}"
            
            print(f"\n📄 {display_name}:")
            print(f"  Champ: {field_name}")
            print(f"  Chemin relatif: {file_url}")
            print(f"  URL complète: {full_url}")
            
            # Tester l'accessibilité
            try:
                response = requests.head(full_url, timeout=5)
                if response.status_code == 200:
                    print(f"  ✅ Fichier accessible (status: {response.status_code})")
                else:
                    print(f"  ❌ Fichier non accessible (status: {response.status_code})")
            except requests.exceptions.RequestException as e:
                print(f"  ❌ Erreur de connexion: {e}")
        else:
            print(f"\n❌ {display_name}: Non fourni")

def test_api_response():
    """Tester la réponse de l'API Django"""
    
    print("\n🔍 Test de la réponse API Django")
    print("=" * 60)
    
    try:
        # Tester l'endpoint des professeurs
        response = requests.get('http://localhost:8000/api/teachers/')
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API accessible: {len(data.get('results', []))} professeurs")
            
            # Vérifier un professeur avec des documents
            for teacher_data in data.get('results', []):
                if teacher_data.get('diploma_file'):
                    print(f"\n📋 Professeur avec documents: {teacher_data.get('user', {}).get('first_name')} {teacher_data.get('user', {}).get('last_name')}")
                    
                    # Vérifier les URLs des documents
                    doc_fields = ['diploma_file', 'criminal_record_file', 'identity_document_file', 'proof_of_address_file', 'profile_photo', 'cv_file']
                    
                    for field in doc_fields:
                        url = teacher_data.get(f'{field}_url')
                        if url:
                            print(f"  📄 {field}_url: {url}")
                            
                            # Tester l'URL
                            try:
                                test_response = requests.head(f"http://localhost:8000{url}", timeout=5)
                                if test_response.status_code == 200:
                                    print(f"    ✅ Accessible")
                                else:
                                    print(f"    ❌ Non accessible (status: {test_response.status_code})")
                            except requests.exceptions.RequestException as e:
                                print(f"    ❌ Erreur: {e}")
                        else:
                            print(f"  ❌ {field}_url: Non disponible")
                    
                    break  # Tester seulement le premier professeur avec des documents
        else:
            print(f"❌ Erreur API: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur de connexion à l'API: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test des URLs des documents des professeurs")
    print("=" * 60)
    
    # 1. Tester les URLs directes
    test_teacher_urls()
    
    # 2. Tester la réponse API
    test_api_response()
    
    print("\n" + "=" * 60)
    print("✅ Tests terminés!")
    print("\n💡 Instructions:")
    print("1. Assurez-vous que le serveur Django est démarré: python manage.py runserver")
    print("2. Vérifiez que les fichiers existent dans django_backend/media/")
    print("3. Testez l'interface web sur http://localhost:3000/dashboard/admin/teachers/validation")

if __name__ == '__main__':
    main()







