#!/usr/bin/env python3
"""
Script de débogage pour vérifier les données des professeurs
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
django_backend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'django_backend')
sys.path.append(django_backend_path)

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import Teacher, User, Course
from django.db.models import Q

def debug_teachers():
    """Débogue les données des professeurs"""
    print("🔍 Débogage des professeurs dans la base de données")
    print("=" * 60)
    
    # 1. Compter tous les utilisateurs
    total_users = User.objects.count()
    print(f"👥 Total utilisateurs: {total_users}")
    
    # 2. Compter tous les professeurs
    total_teachers = Teacher.objects.count()
    print(f"👨‍🏫 Total professeurs: {total_teachers}")
    
    # 3. Détails de chaque professeur
    print(f"\n📋 Détails des professeurs:")
    for i, teacher in enumerate(Teacher.objects.all(), 1):
        user = teacher.user
        print(f"\n   {i}. Professeur ID: {teacher.id}")
        print(f"      - Nom: {user.first_name} {user.last_name}")
        print(f"      - Email: {user.email}")
        print(f"      - Actif: {user.is_active}")
        print(f"      - Validé: {teacher.is_validated}")
        print(f"      - Matières: {teacher.subjects}")
        print(f"      - Note moyenne: {teacher.average_rating}")
        print(f"      - Tarif horaire: {teacher.hourly_rate}")
        print(f"      - Bio: {teacher.bio[:50] if teacher.bio else 'Aucune'}...")
    
    # 4. Vérifier les filtres de l'endpoint
    print(f"\n🔍 Test des filtres de l'endpoint available-for-booking:")
    
    # Filtre 1: is_validated=True
    validated_teachers = Teacher.objects.filter(is_validated=True)
    print(f"   - Professeurs validés: {validated_teachers.count()}")
    
    # Filtre 2: user__is_active=True
    active_teachers = Teacher.objects.filter(user__is_active=True)
    print(f"   - Professeurs avec utilisateur actif: {active_teachers.count()}")
    
    # Filtre 3: Les deux filtres combinés
    available_teachers = Teacher.objects.filter(
        is_validated=True,
        user__is_active=True
    )
    print(f"   - Professeurs disponibles (validés + actifs): {available_teachers.count()}")
    
    # 5. Vérifier les cours
    print(f"\n📚 Cours dans la base:")
    total_courses = Course.objects.count()
    print(f"   - Total cours: {total_courses}")
    
    for i, course in enumerate(Course.objects.all()[:5], 1):  # Afficher les 5 premiers
        print(f"   {i}. {course.title} (Créé par: {course.created_by.first_name if course.created_by else 'N/A'})")
    
    print("\n" + "=" * 60)
    print("✅ Débogage terminé")

if __name__ == "__main__":
    debug_teachers()

