#!/usr/bin/env python3
"""
Script de test pour valider la Phase 1 - Fonctionnalités administratives
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000/api"
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "admin123"
}

def test_admin_login():
    """Test de connexion admin"""
    print("🔐 Test de connexion admin...")
    
    try:
        # Utiliser l'API REST Framework avec headers appropriés
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        response = requests.post(f"{BASE_URL}/auth/login/", 
                               json=ADMIN_CREDENTIALS, 
                               headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print(f"✅ Connexion réussie - Token: {token[:20]}...")
            return token
        else:
            print(f"❌ Échec de connexion: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return None

def test_teachers_pending(token):
    """Test de récupération des enseignants en attente"""
    print("\n👨‍🏫 Test des enseignants en attente...")
    
    try:
        headers = {"Authorization": f"Token {token}"}
        response = requests.get(f"{BASE_URL}/teachers/pending/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"✅ {len(teachers)} enseignant(s) en attente trouvé(s)")
            
            # Afficher les détails du premier enseignant s'il y en a un
            if teachers:
                teacher = teachers[0]
                print(f"   - {teacher.get('user', {}).get('first_name', 'N/A')} {teacher.get('user', {}).get('last_name', 'N/A')}")
                print(f"   - Email: {teacher.get('user', {}).get('email', 'N/A')}")
                print(f"   - Matières: {', '.join(teacher.get('subjects', []))}")
                
        else:
            print(f"❌ Erreur API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_content_reports(token):
    """Test de récupération des signalements"""
    print("\n🚨 Test des signalements...")
    
    try:
        headers = {"Authorization": f"Token {token}"}
        response = requests.get(f"{BASE_URL}/admin/content-reports/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            reports = data.get('results', data) if isinstance(data, dict) else data
            if not isinstance(reports, list):
                reports = []
            print(f"✅ {len(reports)} signalement(s) trouvé(s)")
            
        else:
            print(f"❌ Erreur API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_activity_logs(token):
    """Test de récupération des logs d'activité"""
    print("\n📊 Test des logs d'activité...")
    
    try:
        headers = {"Authorization": f"Token {token}"}
        response = requests.get(f"{BASE_URL}/admin/activity-logs/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            logs = data.get('results', data) if isinstance(data, dict) else data
            if not isinstance(logs, list):
                logs = []
            print(f"✅ {len(logs)} log(s) d'activité trouvé(s)")
            
        else:
            print(f"❌ Erreur API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_banned_keywords(token):
    """Test de récupération des mots-clés bannis"""
    print("\n🚫 Test des mots-clés bannis...")
    
    try:
        headers = {"Authorization": f"Token {token}"}
        response = requests.get(f"{BASE_URL}/admin/banned-keywords/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            keywords = data.get('results', data) if isinstance(data, dict) else data
            if not isinstance(keywords, list):
                keywords = []
            print(f"✅ {len(keywords)} mot(s)-clé(s) banni(s) trouvé(s)")
            
        else:
            print(f"❌ Erreur API: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_create_content_report(token):
    """Test de création d'un signalement"""
    print("\n📝 Test de création d'un signalement...")
    
    try:
        headers = {"Authorization": f"Token {token}"}
        
        # Créer un signalement de test
        report_data = {
            "content_type": "course",
            "content_id": "test-course-123",
            "reason": "Contenu inapproprié",
            "severity": "medium"
        }
        
        response = requests.post(f"{BASE_URL}/admin/content-reports/", 
                               headers=headers, 
                               json=report_data)
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Signalement créé avec succès - ID: {data.get('id', 'N/A')}")
        else:
            print(f"❌ Erreur création: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale de test"""
    print("🚀 Début des tests Phase 1 - Fonctionnalités administratives")
    print("=" * 60)
    
    # Test de connexion
    token = test_admin_login()
    if not token:
        print("\n❌ Impossible de continuer sans token d'authentification")
        sys.exit(1)
    
    # Tests des fonctionnalités
    test_teachers_pending(token)
    test_content_reports(token)
    test_activity_logs(token)
    test_banned_keywords(token)
    test_create_content_report(token)
    
    print("\n" + "=" * 60)
    print("✅ Tests Phase 1 terminés")
    print("\n📋 Résumé des fonctionnalités testées:")
    print("   ✓ Authentification admin")
    print("   ✓ API enseignants en attente")
    print("   ✓ API signalements de contenu")
    print("   ✓ API logs d'activité")
    print("   ✓ API mots-clés bannis")
    print("   ✓ Création de signalements")

if __name__ == "__main__":
    main()
