#!/usr/bin/env python3
"""
Script pour tester l'inscription d'un professeur avec des documents
"""

import os
import sys
import django
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

def create_test_documents():
    """Créer des fichiers de test simulés"""
    
    # Créer des fichiers texte simulés (dans un vrai cas, ce seraient des PDF/images)
    diploma_content = b"Diplome de test - Nathan CLO"
    criminal_content = b"Extrait de casier judiciaire - Nathan CLO"
    identity_content = b"Piece d'identite - Nathan CLO"
    address_content = b"Justificatif de domicile - Nathan CLO"
    cv_content = b"CV de Nathan CLO - Professeur de mathematiques"
    photo_content = b"Photo de profil - Nathan CLO"
    
    return {
        'diploma_file': SimpleUploadedFile("diploma.pdf", diploma_content, content_type="application/pdf"),
        'criminal_record_file': SimpleUploadedFile("criminal.pdf", criminal_content, content_type="application/pdf"),
        'identity_document_file': SimpleUploadedFile("identity.pdf", identity_content, content_type="application/pdf"),
        'proof_of_address_file': SimpleUploadedFile("address.pdf", address_content, content_type="application/pdf"),
        'cv_file': SimpleUploadedFile("cv.pdf", cv_content, content_type="application/pdf"),
        'profile_photo': SimpleUploadedFile("photo.jpg", photo_content, content_type="image/jpeg"),
    }

def test_teacher_registration():
    """Tester l'inscription d'un professeur avec documents"""
    
    print("🧪 Test d'inscription professeur avec documents")
    
    # Vérifier si Nathan CLO existe déjà
    try:
        user = User.objects.get(email="nathan@gmail.com")
        print(f"❌ Nathan CLO existe déjà (ID: {user.id})")
        
        # Vérifier ses documents
        if hasattr(user, 'teacher'):
            teacher = user.teacher
            print("\n📄 Documents actuels de Nathan CLO:")
            print(f"  - Diplôme: {teacher.diploma_file}")
            print(f"  - Casier judiciaire: {teacher.criminal_record_file}")
            print(f"  - Pièce d'identité: {teacher.identity_document_file}")
            print(f"  - Justificatif domicile: {teacher.proof_of_address_file}")
            print(f"  - CV: {teacher.cv_file}")
            print(f"  - Photo: {teacher.profile_photo}")
            
            # Mettre à jour avec de nouveaux documents
            print("\n🔄 Mise à jour des documents...")
            documents = create_test_documents()
            
            for field_name, file_obj in documents.items():
                setattr(teacher, field_name, file_obj)
            
            teacher.save()
            print("✅ Documents mis à jour avec succès!")
            
            # Vérifier les nouveaux documents
            print("\n📄 Nouveaux documents de Nathan CLO:")
            teacher.refresh_from_db()
            print(f"  - Diplôme: {teacher.diploma_file}")
            print(f"  - Casier judiciaire: {teacher.criminal_record_file}")
            print(f"  - Pièce d'identité: {teacher.identity_document_file}")
            print(f"  - Justificatif domicile: {teacher.proof_of_address_file}")
            print(f"  - CV: {teacher.cv_file}")
            print(f"  - Photo: {teacher.profile_photo}")
            
        return True
        
    except User.DoesNotExist:
        print("👤 Nathan CLO n'existe pas, création d'un nouveau compte...")
        
        # Créer l'utilisateur
        user = User.objects.create(
            email="nathan@gmail.com",
            username="nathan@gmail.com",
            first_name="Nathan",
            last_name="CLO",
            role="teacher",
            phone="+237 555 123 456"
        )
        user.set_password("test123")
        user.save()
        
        # Créer le profil professeur avec documents
        documents = create_test_documents()
        
        teacher = Teacher.objects.create(
            user=user,
            bio="Professeur de mathématiques avec 5 ans d'expérience",
            subjects=["mathematics"],
            experience_years=5,
            hourly_rate=20000,
            is_validated=False,
            **documents
        )
        
        print("✅ Nathan CLO créé avec documents!")
        print(f"  - ID: {teacher.id}")
        print(f"  - Email: {teacher.user.email}")
        print(f"  - Diplôme: {teacher.diploma_file}")
        print(f"  - Casier judiciaire: {teacher.criminal_record_file}")
        print(f"  - Pièce d'identité: {teacher.identity_document_file}")
        print(f"  - Justificatif domicile: {teacher.proof_of_address_file}")
        print(f"  - CV: {teacher.cv_file}")
        print(f"  - Photo: {teacher.profile_photo}")
        
        return True

def test_api_response():
    """Tester la réponse API avec les documents"""
    
    print("\n🌐 Test de la réponse API...")
    
    try:
        teacher = Teacher.objects.get(user__email="nathan@gmail.com")
        
        # Simuler la réponse du serializer
        from core.serializers import TeacherSerializer
        serializer = TeacherSerializer(teacher)
        data = serializer.data
        
        print("📋 Données sérialisées:")
        print(json.dumps(data, indent=2, default=str))
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test API: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Début des tests d'inscription professeur avec documents")
    print("=" * 60)
    
    success = True
    
    try:
        # Test 1: Inscription/Création
        success &= test_teacher_registration()
        
        # Test 2: Réponse API
        success &= test_api_response()
        
        print("\n" + "=" * 60)
        if success:
            print("🎉 Tous les tests sont passés avec succès!")
            print("\n📝 Prochaines étapes:")
            print("1. Redémarrer le serveur Django")
            print("2. Tester l'inscription via le frontend")
            print("3. Vérifier l'affichage des documents dans l'admin")
        else:
            print("❌ Certains tests ont échoué")
            
    except Exception as e:
        print(f"💥 Erreur générale: {e}")
        import traceback
        traceback.print_exc()







