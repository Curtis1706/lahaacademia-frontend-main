#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import User, Teacher, Student, Course

print("🔍 Vérification des données de test:")
print("=" * 50)

# Vérifier les teachers
print("\n👨‍🏫 Teachers disponibles:")
teachers = Teacher.objects.all()
for teacher in teachers:
    print(f"  - ID: {teacher.id} | User: {teacher.user.first_name} {teacher.user.last_name} | Email: {teacher.user.email}")

# Vérifier les students
print("\n👨‍🎓 Students disponibles:")
students = Student.objects.all()
for student in students:
    print(f"  - ID: {student.id} | User: {student.user.first_name} {student.user.last_name} | Email: {student.user.email}")

# Vérifier les courses
print("\n📚 Courses disponibles:")
courses = Course.objects.all()
for course in courses:
    print(f"  - ID: {course.id} | Title: {course.title} | Created by: {course.created_by.first_name}")

# Vérifier les users avec différents rôles
print("\n👥 Users par rôle:")
for role in ['student', 'teacher', 'parent', 'admin']:
    count = User.objects.filter(role=role).count()
    print(f"  - {role}: {count} utilisateurs")

print("\n" + "=" * 50)
print("✅ Vérification terminée")
