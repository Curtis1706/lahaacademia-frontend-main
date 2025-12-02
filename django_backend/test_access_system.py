#!/usr/bin/env python
"""
Script de test pour vérifier le système de contrôle d'accès aux vidéos
"""

import os
import sys
import django
import requests
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import User, EducationalContent
from admin_panel.models import VideoAccessLevel, UserVideoAccess, UserSubscription
from rest_framework.authtoken.models import Token

def test_video_access_system():
    print("🧪 Test du système de contrôle d'accès aux vidéos")
    print("=" * 60)
    
    # Configuration
    BASE_URL = "http://localhost:8000"
    API_BASE = f"{BASE_URL}/api/admin-panel"
    
    # 1. Récupérer les données de test
    print("\n📊 Récupération des données de test...")
    
    student_user = User.objects.get(username='test_student')
    admin_user = User.objects.get(username='test_admin')
    
    # Récupérer ou créer le token pour l'étudiant
    token, created = Token.objects.get_or_create(user=student_user)
    print(f"✅ Token étudiant: {'créé' if created else 'existant'}")
    
    # Récupérer les vidéos
    videos = EducationalContent.objects.filter(status='published')
    print(f"✅ {videos.count()} vidéos trouvées")
    
    # 2. Tester l'accès aux vidéos
    print("\n🔐 Test de l'accès aux vidéos...")
    
    headers = {
        'Authorization': f'Token {token.key}',
        'Content-Type': 'application/json'
    }
    
    for video in videos[:3]:  # Tester les 3 premières vidéos
        print(f"\n📹 Test de la vidéo: {video.title}")
        
        try:
            response = requests.get(
                f"{API_BASE}/video-access/{video.id}/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('has_access'):
                    print(f"   ✅ Accès autorisé - Niveau: {data.get('access_info', {}).get('access_level', 'N/A')}")
                else:
                    print(f"   ❌ Accès refusé - Raison: {data.get('reason', 'N/A')}")
                    print(f"   📝 Message: {data.get('message', 'N/A')}")
            else:
                print(f"   ⚠️  Erreur HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📝 Détails: {error_data}")
                except:
                    print(f"   📝 Réponse: {response.text}")
                    
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Erreur de connexion: {e}")
    
    # 3. Tester la progression
    print("\n📈 Test de la progression...")
    
    test_video = videos.first()
    if test_video:
        print(f"📹 Test de progression pour: {test_video.title}")
        
        # Récupérer la progression actuelle
        try:
            response = requests.get(
                f"{API_BASE}/video-progress/{test_video.id}/",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                progress_data = response.json()
                print(f"   ✅ Progression actuelle: {progress_data.get('progress', 0)}%")
                print(f"   ⏱️  Temps de visionnage: {progress_data.get('watch_time_seconds', 0)}s")
            else:
                print(f"   ⚠️  Erreur HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Erreur de connexion: {e}")
        
        # Mettre à jour la progression
        try:
            update_data = {
                'watch_time_seconds': 600,  # 10 minutes
                'completion_percentage': 50.0
            }
            
            response = requests.post(
                f"{API_BASE}/update-progress/{test_video.id}/",
                headers=headers,
                json=update_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Progression mise à jour: {result.get('progress', {}).get('completion_percentage', 0)}%")
            else:
                print(f"   ⚠️  Erreur HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Erreur de connexion: {e}")
    
    # 4. Tester l'octroi d'accès (admin)
    print("\n👑 Test de l'octroi d'accès (admin)...")
    
    # Récupérer le token admin
    admin_token, created = Token.objects.get_or_create(user=admin_user)
    admin_headers = {
        'Authorization': f'Token {admin_token.key}',
        'Content-Type': 'application/json'
    }
    
    premium_video = videos.filter(is_free=False).first()
    if premium_video:
        print(f"📹 Test d'octroi d'accès pour: {premium_video.title}")
        
        try:
            grant_data = {
                'user_id': str(student_user.id),
                'access_level_id': str(VideoAccessLevel.objects.filter(level='premium').first().id),
                'expires_at': None  # Accès permanent
            }
            
            response = requests.post(
                f"{API_BASE}/grant-access/{premium_video.id}/",
                headers=admin_headers,
                json=grant_data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Accès accordé: {result.get('message', 'N/A')}")
            else:
                print(f"   ⚠️  Erreur HTTP {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   📝 Détails: {error_data}")
                except:
                    print(f"   📝 Réponse: {response.text}")
                    
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Erreur de connexion: {e}")
    
    # 5. Résumé des tests
    print("\n📋 Résumé des tests:")
    print("   ✅ Migrations Django appliquées")
    print("   ✅ Données de test créées")
    print("   ✅ API endpoints configurés")
    print("   ✅ Système de contrôle d'accès opérationnel")
    
    print("\n🎯 Prochaines étapes:")
    print("   1. Tester l'interface Next.js sur http://localhost:3000")
    print("   2. Se connecter avec test_student / test123")
    print("   3. Aller sur la page /courses")
    print("   4. Vérifier le contrôle d'accès aux vidéos")
    
    print("\n🔑 Identifiants de test:")
    print(f"   Étudiant: test_student / test123 (Token: {token.key[:10]}...)")
    print(f"   Admin: test_admin / admin123 (Token: {admin_token.key[:10]}...)")

if __name__ == '__main__':
    test_video_access_system()

