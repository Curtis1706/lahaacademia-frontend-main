#!/usr/bin/env python
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import User, Teacher, Course
from rest_framework.authtoken.models import Token

def debug_auth():
    print("=== DIAGNOSTIC D'AUTHENTIFICATION ===\n")
    
    # 1. Lister tous les utilisateurs
    print("1. UTILISATEURS:")
    for user in User.objects.all():
        print(f"   - {user.email} (ID: {user.id}, Role: {user.role})")
    
    # 2. Lister tous les professeurs
    print("\n2. PROFESSEURS:")
    for teacher in Teacher.objects.all():
        print(f"   - {teacher.user.email} (Teacher ID: {teacher.id})")
    
    # 3. Lister tous les cours
    print("\n3. COURS:")
    for course in Course.objects.all():
        print(f"   - {course.title} (ID: {course.id}, Par: {course.created_by.email})")
    
    # 4. Vérifier les tokens
    print("\n4. TOKENS D'AUTHENTIFICATION:")
    for token in Token.objects.all():
        print(f"   - {token.user.email}: {token.key}")
        
        # Vérifier si cet utilisateur a un profil Teacher
        try:
            teacher = Teacher.objects.get(user=token.user)
            print(f"     ✅ A un profil Teacher (ID: {teacher.id})")
        except Teacher.DoesNotExist:
            print(f"     ❌ N'a PAS de profil Teacher")
    
    # 5. Vérifier le cours spécifique de l'erreur
    course_id = "44a9f118-6cfe-4e8e-a72d-6738f42ac30e"
    print(f"\n5. VÉRIFICATION DU COURS {course_id}:")
    try:
        course = Course.objects.get(id=course_id)
        print(f"   ✅ Cours trouvé: {course.title}")
        print(f"   ✅ Créé par: {course.created_by.email}")
    except Course.DoesNotExist:
        print(f"   ❌ Cours NON TROUVÉ avec cet ID")
        print("   📋 Cours disponibles:")
        for course in Course.objects.all():
            print(f"      - {course.title}: {course.id}")

if __name__ == "__main__":
    debug_auth()
