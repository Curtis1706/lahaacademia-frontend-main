#!/usr/bin/env python3
"""
Script pour configurer un compte admin et tester la validation des enseignants
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

def setup_admin_account():
    """Créer ou récupérer le compte admin"""
    username = "admin"
    email = "admin@lahaacademia.com"
    password = "admin123"
    
    try:
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            print(f"✅ Utilisateur admin existant trouvé: {username}")
        else:
            # Créer un nouvel utilisateur admin
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role='admin',
                is_staff=True,
                is_superuser=True
            )
            print(f"✅ Nouveau compte admin créé: {username}")
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        
        print(f"🔑 Token API: {token.key}")
        print(f"📧 Email: {user.email}")
        print(f"👤 Rôle: {user.role}")
        
        return token.key, user.username
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du compte admin: {e}")
        return None, None

def create_test_teachers():
    """Créer des professeurs de test pour la validation"""
    test_teachers = [
        {
            'user': {
                'username': 'prof_jean',
                'email': 'jean.dupont@lahaacademia.com',
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
                'username': 'prof_marie',
                'email': 'marie.martin@lahaacademia.com',
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
        },
        {
            'user': {
                'username': 'prof_paul',
                'email': 'paul.nguema@lahaacademia.com',
                'first_name': 'Paul',
                'last_name': 'Nguema',
                'phone': '+237 555 123 456',
                'role': 'teacher'
            },
            'bio': 'Professeur d\'anglais certifié TEFL. Expérience internationale dans l\'enseignement de l\'anglais comme langue étrangère.',
            'subjects': ['Anglais', 'TOEFL', 'IELTS'],
            'experience_years': 10,
            'hourly_rate': 8000,
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
            for teacher in teachers:
                print(f"   - {teacher.get('user', {}).get('first_name', '')} {teacher.get('user', {}).get('last_name', '')}")
        else:
            print(f"❌ Teachers pending API: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Teachers pending API: {e}")

def main():
    print("🚀 Configuration de l'environnement de validation des enseignants...")
    
    # 1. Créer le compte admin
    print("\n1️⃣ Création du compte admin...")
    token, username = setup_admin_account()
    
    if not token:
        print("❌ Impossible de créer le compte admin")
        return
    
    # 2. Créer des professeurs de test
    print("\n2️⃣ Création de professeurs de test...")
    created_count = create_test_teachers()
    print(f"✅ {created_count} nouveaux professeurs créés")
    
    # 3. Tester les APIs
    print("\n3️⃣ Test des endpoints API...")
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
    print("4. Vous devriez voir les professeurs en attente de validation")
    print("5. Testez les actions Valider/Rejeter")
    print("="*60)

if __name__ == "__main__":
    main()









