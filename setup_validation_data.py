#!/usr/bin/env python3
"""
Script pour configurer les données de validation des enseignants
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append('django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from core.models import Teacher
import requests

User = get_user_model()

def get_admin_info():
    """Récupérer les informations du compte admin existant"""
    try:
        # Chercher l'utilisateur admin
        admin_user = User.objects.filter(role='admin').first()
        if not admin_user:
            admin_user = User.objects.filter(is_staff=True).first()
        if not admin_user:
            admin_user = User.objects.filter(is_superuser=True).first()
        
        if admin_user:
            # Créer ou récupérer le token
            token, created = Token.objects.get_or_create(user=admin_user)
            
            print(f"✅ Compte admin trouvé: {admin_user.username}")
            print(f"🔑 Token API: {token.key}")
            print(f"📧 Email: {admin_user.email}")
            
            return token.key, admin_user.username
        else:
            print("❌ Aucun compte admin trouvé")
            return None, None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None, None

def create_test_teachers():
    """Créer des professeurs de test pour la validation"""
    test_teachers = [
        {
            'user': {
                'username': 'prof_jean_test',
                'email': 'jean.dupont.test@lahaacademia.com',
                'first_name': 'Jean',
                'last_name': 'Dupont',
                'phone': '+237 123 456 789',
                'role': 'teacher'
            },
            'bio': 'Professeur de mathématiques avec plus de 8 ans d\'expérience dans l\'enseignement secondaire. Spécialisé dans la préparation aux examens et aux concours.',
            'subjects': ['Mathématiques', 'Physique', 'Statistiques'],
            'experience_years': 8,
            'hourly_rate': 7500,
            'is_validated': False
        },
        {
            'user': {
                'username': 'prof_marie_test',
                'email': 'marie.martin.test@lahaacademia.com',
                'first_name': 'Marie',
                'last_name': 'Martin',
                'phone': '+237 987 654 321',
                'role': 'teacher'
            },
            'bio': 'Enseignante de français et littérature. Passionnée par la pédagogie et l\'accompagnement des élèves en difficulté.',
            'subjects': ['Français', 'Littérature', 'Expression écrite'],
            'experience_years': 6,
            'hourly_rate': 6000,
            'is_validated': False
        }
    ]
    
    created_count = 0
    
    for teacher_data in test_teachers:
        try:
            # Vérifier si l'utilisateur existe déjà
            if User.objects.filter(username=teacher_data['user']['username']).exists():
                print(f"⏭️  Professeur {teacher_data['user']['username']} existe déjà")
                continue
            
            # Créer l'utilisateur
            user = User.objects.create_user(
                username=teacher_data['user']['username'],
                email=teacher_data['user']['email'],
                first_name=teacher_data['user']['first_name'],
                last_name=teacher_data['user']['last_name'],
                phone=teacher_data['user']['phone'],
                role=teacher_data['user']['role'],
                password='test123'  # Mot de passe par défaut
            )
            
            # Créer le profil professeur
            teacher = Teacher.objects.create(
                user=user,
                bio=teacher_data['bio'],
                subjects=teacher_data['subjects'],
                experience_years=teacher_data['experience_years'],
                hourly_rate=teacher_data['hourly_rate'],
                is_validated=teacher_data['is_validated']
            )
            
            print(f"✅ Professeur créé: {user.first_name} {user.last_name} ({user.email})")
            created_count += 1
            
        except Exception as e:
            print(f"❌ Erreur lors de la création du professeur {teacher_data['user']['username']}: {e}")
    
    return created_count

def get_pending_teachers():
    """Récupérer la liste des professeurs en attente"""
    try:
        pending_teachers = Teacher.objects.filter(is_validated=False)
        print(f"\n📋 Professeurs en attente de validation: {pending_teachers.count()}")
        
        for teacher in pending_teachers:
            user = teacher.user
            print(f"   - {user.first_name} {user.last_name} ({user.email})")
            print(f"     Matières: {', '.join(teacher.subjects)}")
            print(f"     Expérience: {teacher.experience_years} ans")
            print(f"     Tarif: {teacher.hourly_rate} FCFA")
            print()
        
        return pending_teachers.count()
        
    except Exception as e:
        print(f"❌ Erreur lors de la récupération des professeurs: {e}")
        return 0

def test_api_endpoints(token):
    """Tester les endpoints API"""
    base_url = "http://localhost:8000/api"
    headers = {"Authorization": f"Token {token}"}
    
    print("\n🧪 Test des endpoints API...")
    
    # Test 1: Login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": "admin", "password": "admin123"})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Login API: {e}")
    
    # Test 2: Teachers pending
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ Teachers pending API: {len(teachers)} enseignants en attente")
        else:
            print(f"❌ Teachers pending API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Teachers pending API: {e}")

def main():
    print("🚀 Configuration des données de validation des enseignants...")
    
    # 1. Récupérer le compte admin
    print("\n1️⃣ Récupération du compte admin...")
    token, username = get_admin_info()
    
    if not token:
        print("❌ Impossible de récupérer le compte admin")
        return
    
    # 2. Créer des professeurs de test
    print("\n2️⃣ Création de professeurs de test...")
    created_count = create_test_teachers()
    print(f"✅ {created_count} nouveaux professeurs créés")
    
    # 3. Afficher les professeurs en attente
    print("\n3️⃣ Professeurs en attente de validation...")
    pending_count = get_pending_teachers()
    
    # 4. Tester les APIs
    print("\n4️⃣ Test des endpoints API...")
    test_api_endpoints(token)
    
    print("\n" + "="*60)
    print("🎉 CONFIGURATION TERMINÉE !")
    print("="*60)
    print("📋 INSTRUCTIONS POUR TESTER LA VALIDATION:")
    print("1. Le serveur Django est démarré sur http://localhost:8000")
    print("2. Connectez-vous à l'interface admin avec:")
    print(f"   - Nom d'utilisateur: admin")
    print(f"   - Mot de passe: admin123")
    print("3. Allez sur la page de validation des enseignants")
    print(f"4. Vous devriez voir {pending_count} professeurs en attente de validation")
    print("5. Testez les actions Valider/Rejeter")
    print("="*60)

if __name__ == "__main__":
    main()









