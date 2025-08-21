#!/usr/bin/env python3
"""
Test du système de réservation des élèves
Ce script teste les fonctionnalités de réservation pour les élèves
"""

import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import User, Student, Teacher, Course, Session, Booking, CourseAvailability
from core.serializers import BookingSerializer, SessionSerializer

def test_student_booking_system():
    """Tester le système de réservation des élèves"""
    print("🧪 Test du système de réservation des élèves")
    print("=" * 50)
    
    # 1. Créer un élève de test
    print("\n1. Création d'un élève de test...")
    try:
        student_user = User.objects.create(
            email='student.test@example.com',
            username='student.test@example.com',
            first_name='Jean',
            last_name='Dupont',
            role='student'
        )
        student = Student.objects.create(
            user=student_user,
            date_of_birth='2010-01-01',
            country='France',
            city='Paris',
            school_level='secondary',
            current_grade='3ème'
        )
        print(f"✅ Élève créé: {student.user.first_name} {student.user.last_name}")
    except Exception as e:
        print(f"❌ Erreur création élève: {e}")
        return
    
    # 2. Créer un professeur de test
    print("\n2. Création d'un professeur de test...")
    try:
        teacher_user = User.objects.create(
            email='teacher.test@example.com',
            username='teacher.test@example.com',
            first_name='Marie',
            last_name='Martin',
            role='teacher'
        )
        teacher = Teacher.objects.create(
            user=teacher_user,
            is_validated=True,
            subjects=['Mathématiques', 'Physique'],
            experience_years=5,
            hourly_rate=25.00
        )
        print(f"✅ Professeur créé: {teacher.user.first_name} {teacher.user.last_name}")
    except Exception as e:
        print(f"❌ Erreur création professeur: {e}")
        return
    
    # 3. Créer un cours de test
    print("\n3. Création d'un cours de test...")
    try:
        course = Course.objects.create(
            title='Mathématiques - Niveau 3ème',
            description='Cours de mathématiques pour élèves de 3ème',
            subject='Mathématiques',
            level='3ème',
            country='France',
            duration=60,
            price=25.00,
            created_by=teacher_user,
            difficulty_level='intermediate'
        )
        print(f"✅ Cours créé: {course.title}")
    except Exception as e:
        print(f"❌ Erreur création cours: {e}")
        return
    
    # 4. Créer une disponibilité de cours
    print("\n4. Création d'une disponibilité de cours...")
    try:
        availability = CourseAvailability.objects.create(
            course=course,
            teacher=teacher,
            day_of_week=1,  # Mardi
            start_time='14:00:00',
            end_time='15:00:00',
            is_active=True
        )
        print(f"✅ Disponibilité créée: {availability}")
    except Exception as e:
        print(f"❌ Erreur création disponibilité: {e}")
        return
    
    # 5. Créer une session de test
    print("\n5. Création d'une session de test...")
    try:
        start_time = timezone.now() + timedelta(days=2, hours=14)
        end_time = start_time + timedelta(hours=1)
        
        session = Session.objects.create(
            course=course,
            teacher=teacher,
            start_time=start_time,
            end_time=end_time,
            status='scheduled',
            session_type='group',
            max_capacity=10,
            current_enrollment=0
        )
        print(f"✅ Session créée: {session}")
        print(f"   Début: {session.start_time}")
        print(f"   Fin: {session.end_time}")
    except Exception as e:
        print(f"❌ Erreur création session: {e}")
        return
    
    # 6. Tester la réservation
    print("\n6. Test de la réservation...")
    try:
        booking = Booking.objects.create(
            student=student,
            teacher=teacher,
            session=session,
            status='confirmed',
            payment_status='pending'
        )
        
        # Ajouter l'élève à la session
        session.students.add(student)
        session.current_enrollment += 1
        session.save()
        
        print(f"✅ Réservation créée: {booking}")
        print(f"   Statut: {booking.status}")
        print(f"   Paiement: {booking.payment_status}")
        print(f"   Session: {session.current_enrollment}/{session.max_capacity} élèves")
    except Exception as e:
        print(f"❌ Erreur création réservation: {e}")
        return
    
    # 7. Tester le sérialiseur
    print("\n7. Test du sérialiseur de réservation...")
    try:
        serializer = BookingSerializer(booking)
        data = serializer.data
        print(f"✅ Sérialisation réussie")
        print(f"   Référence: {data.get('booking_reference')}")
        print(f"   Jours jusqu'à la session: {data.get('days_until_session')}")
        print(f"   Statut session: {data.get('session_status_display')}")
    except Exception as e:
        print(f"❌ Erreur sérialisation: {e}")
    
    # 8. Tester le sérialiseur de session
    print("\n8. Test du sérialiseur de session...")
    try:
        session_serializer = SessionSerializer(session, context={'request': None})
        session_data = session_serializer.data
        print(f"✅ Sérialisation session réussie")
        print(f"   Places disponibles: {session_data.get('available_spots')}")
        print(f"   Durée: {session_data.get('duration_minutes')} minutes")
        print(f"   Temps jusqu'au début: {session_data.get('time_until_start')}")
    except Exception as e:
        print(f"❌ Erreur sérialisation session: {e}")
    
    # 9. Nettoyage
    print("\n9. Nettoyage des données de test...")
    try:
        booking.delete()
        session.delete()
        availability.delete()
        course.delete()
        teacher.delete()
        teacher_user.delete()
        student.delete()
        student_user.delete()
        print("✅ Données de test supprimées")
    except Exception as e:
        print(f"❌ Erreur nettoyage: {e}")
    
    print("\n🎉 Test terminé avec succès!")

if __name__ == '__main__':
    test_student_booking_system()

