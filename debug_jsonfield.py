#!/usr/bin/env python3
"""
Script pour déboguer le problème avec JSONField
"""

import os
import sys
import django
from pathlib import Path
import json

# Ajouter le chemin du projet Django
django_path = Path(__file__).parent / "django_backend"
sys.path.insert(0, str(django_path))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import Teacher
from core.serializers import TeacherRegistrationSerializer

def test_jsonfield_directly():
    """Tester le JSONField directement"""
    print("🧪 Test direct du JSONField")
    
    # Test 1: Chaîne JSON
    test_data = {
        'subjects': '["mathematics"]'
    }
    print(f"📝 Test 1 - Chaîne JSON: {test_data}")
    
    serializer = TeacherRegistrationSerializer(data=test_data)
    if serializer.is_valid():
        print("✅ Chaîne JSON valide")
    else:
        print(f"❌ Chaîne JSON invalide: {serializer.errors}")
    
    # Test 2: Tableau Python
    test_data2 = {
        'subjects': ['mathematics']
    }
    print(f"📝 Test 2 - Tableau Python: {test_data2}")
    
    serializer2 = TeacherRegistrationSerializer(data=test_data2)
    if serializer2.is_valid():
        print("✅ Tableau Python valide")
    else:
        print(f"❌ Tableau Python invalide: {serializer2.errors}")
    
    # Test 3: Chaîne simple
    test_data3 = {
        'subjects': 'mathematics'
    }
    print(f"📝 Test 3 - Chaîne simple: {test_data3}")
    
    serializer3 = TeacherRegistrationSerializer(data=test_data3)
    if serializer3.is_valid():
        print("✅ Chaîne simple valide")
    else:
        print(f"❌ Chaîne simple invalide: {serializer3.errors}")

def test_teacher_model():
    """Tester le modèle Teacher directement"""
    print("\n🧪 Test direct du modèle Teacher")
    
    try:
        # Créer un Teacher avec subjects comme tableau
        from core.models import User
        
        user = User.objects.create(
            email="test.model@example.com",
            username="test.model@example.com",
            first_name="Test",
            last_name="Model",
            role="teacher"
        )
        
        teacher = Teacher.objects.create(
            user=user,
            subjects=['mathematics', 'physics'],  # Tableau Python
            bio="Test model"
        )
        
        print(f"✅ Teacher créé avec subjects: {teacher.subjects}")
        print(f"📋 Type de subjects: {type(teacher.subjects)}")
        
        # Nettoyer
        teacher.delete()
        user.delete()
        
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")

if __name__ == "__main__":
    print("🔍 Débogage du JSONField")
    print("=" * 40)
    
    test_jsonfield_directly()
    test_teacher_model()
    
    print("\n" + "=" * 40)
    print("🎯 Tests terminés!")









