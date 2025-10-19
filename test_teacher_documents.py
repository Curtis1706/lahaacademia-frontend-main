#!/usr/bin/env python3
"""
Script pour tester la récupération et le téléchargement des documents des professeurs
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

from django.core.files.uploadedfile import SimpleUploadedFile
from core.models import Teacher, User
import json

def create_test_teacher_with_documents():
    """Créer un professeur de test avec des documents"""
    
    # Créer un utilisateur de test
    user, created = User.objects.get_or_create(
        email='test_teacher_docs@example.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'TeacherDocs',
            'phone': '+237 555 123 456',
            'role': 'teacher'
        }
    )
    
    if created:
        user.set_password('testpassword123')
        user.save()
        print(f"✅ Utilisateur créé: {user.email}")
    else:
        print(f"ℹ️ Utilisateur existant: {user.email}")
    
    # Créer des fichiers de test simulés
    diploma_content = b"Diplome de test - Test TeacherDocs"
    criminal_content = b"Extrait de casier judiciaire - Test TeacherDocs"
    identity_content = b"Piece d'identite - Test TeacherDocs"
    address_content = b"Justificatif de domicile - Test TeacherDocs"
    cv_content = b"CV de Test TeacherDocs - Professeur de mathematiques"
    photo_content = b"Photo de profil - Test TeacherDocs"
    
    documents = {
        'diploma_file': SimpleUploadedFile("diploma_test.pdf", diploma_content, content_type="application/pdf"),
        'criminal_record_file': SimpleUploadedFile("criminal_test.pdf", criminal_content, content_type="application/pdf"),
        'identity_document_file': SimpleUploadedFile("identity_test.pdf", identity_content, content_type="application/pdf"),
        'proof_of_address_file': SimpleUploadedFile("address_test.pdf", address_content, content_type="application/pdf"),
        'cv_file': SimpleUploadedFile("cv_test.pdf", cv_content, content_type="application/pdf"),
        'profile_photo': SimpleUploadedFile("photo_test.jpg", photo_content, content_type="image/jpeg"),
    }
    
    # Créer ou mettre à jour le profil professeur
    teacher, created = Teacher.objects.get_or_create(
        user=user,
        defaults={
            'subjects': json.dumps(['mathematics', 'physics']),
            'experience_years': 3,
            'hourly_rate': 25000,
            'bio': 'Professeur de test pour les documents',
            'is_validated': False,
        }
    )
    
    if created:
        print(f"✅ Profil professeur créé pour: {user.email}")
    else:
        print(f"ℹ️ Profil professeur existant pour: {user.email}")
    
    # Ajouter les documents
    for field_name, file_obj in documents.items():
        if hasattr(teacher, field_name):
            getattr(teacher, field_name).save(file_obj.name, file_obj, save=True)
            print(f"✅ Document ajouté: {field_name} -> {file_obj.name}")
    
    teacher.save()
    return teacher

def test_api_endpoints():
    """Tester les endpoints API pour les documents"""
    
    base_url = 'http://localhost:8000'
    admin_token = 'cee5456080015db2299344035fecdb5936469663'
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    print("\n🔍 Test des endpoints API...")
    
    # 1. Tester l'endpoint des professeurs en attente
    try:
        response = requests.get(f'{base_url}/api/teachers/pending/', headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Endpoint teachers/pending: {len(data.get('teachers', []))} professeurs")
            
            # Tester l'accès aux documents du premier professeur
            teachers = data.get('teachers', [])
            if teachers:
                teacher = teachers[0]
                print(f"📋 Professeur trouvé: {teacher.get('user', {}).get('first_name')} {teacher.get('user', {}).get('last_name')}")
                
                # Vérifier les documents
                documents = ['diploma_file', 'criminal_record_file', 'identity_document_file', 'proof_of_address_file', 'profile_photo', 'cv_file']
                for doc_field in documents:
                    doc_path = teacher.get(doc_field)
                    if doc_path:
                        print(f"  📄 {doc_field}: {doc_path}")
                        
                        # Tester l'accès au fichier
                        file_url = f'{base_url}{doc_path}'
                        file_response = requests.head(file_url)
                        if file_response.status_code == 200:
                            print(f"    ✅ Fichier accessible: {file_url}")
                        else:
                            print(f"    ❌ Fichier non accessible: {file_url} (status: {file_response.status_code})")
                    else:
                        print(f"  ❌ {doc_field}: Non fourni")
        else:
            print(f"❌ Erreur endpoint teachers/pending: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur lors du test des endpoints: {e}")

def test_frontend_api():
    """Tester les endpoints API du frontend Next.js"""
    
    frontend_url = 'http://localhost:3000'
    
    print("\n🔍 Test des endpoints frontend...")
    
    try:
        # Tester l'endpoint des professeurs en attente
        response = requests.get(f'{frontend_url}/api/teachers/pending')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Endpoint frontend teachers/pending: {len(data.get('teachers', []))} professeurs")
        else:
            print(f"❌ Erreur endpoint frontend teachers/pending: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur lors du test des endpoints frontend: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test de la gestion des documents des professeurs")
    print("=" * 60)
    
    # 1. Créer un professeur de test avec des documents
    print("\n📝 Création d'un professeur de test avec documents...")
    teacher = create_test_teacher_with_documents()
    
    # 2. Tester les endpoints Django
    test_api_endpoints()
    
    # 3. Tester les endpoints frontend
    test_frontend_api()
    
    print("\n" + "=" * 60)
    print("✅ Tests terminés!")
    print(f"📧 Email du professeur de test: {teacher.user.email}")
    print(f"🔑 ID du professeur: {teacher.id}")
    print("\n💡 Instructions:")
    print("1. Démarrez le serveur Django: cd django_backend && python manage.py runserver")
    print("2. Démarrez le serveur Next.js: npm run dev")
    print("3. Allez sur http://localhost:3000/dashboard/admin/teachers/validation")
    print("4. Vérifiez que les documents sont visibles et téléchargeables")

if __name__ == '__main__':
    main()





