#!/usr/bin/env python3
"""
Script pour vérifier pourquoi le nouveau professeur n'apparaît pas dans le panel admin
"""

import requests
import json

def check_django_pending_directly():
    """Vérifier directement Django pour les professeurs en attente"""
    print("🔍 Vérification directe Django")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📊 Django pending: {count} professeurs")
            
            # Chercher les professeurs récents
            recent_teachers = []
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                created_at = user.get('created_at', '')
                
                if 'test.auto.' in email:
                    recent_teachers.append({
                        'email': email,
                        'created_at': created_at,
                        'is_validated': teacher.get('is_validated', False),
                        'is_active': user.get('is_active', True)
                    })
            
            print(f"\n📋 Professeurs de test trouvés: {len(recent_teachers)}")
            for teacher in recent_teachers:
                print(f"  • {teacher['email']}")
                print(f"    Créé: {teacher['created_at']}")
                print(f"    Validé: {teacher['is_validated']}")
                print(f"    Actif: {teacher['is_active']}")
            
            return recent_teachers
            
        else:
            print(f"❌ Erreur Django: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def check_nextjs_pending():
    """Vérifier Next.js pour les professeurs en attente"""
    print(f"\n🔍 Vérification Next.js")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js: {len(teachers)} professeurs")
            
            # Chercher les professeurs de test
            test_teachers = []
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                
                if 'test.auto.' in email:
                    test_teachers.append(email)
            
            print(f"\n📋 Professeurs de test dans Next.js: {len(test_teachers)}")
            for email in test_teachers:
                print(f"  • {email}")
            
            return test_teachers
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def check_django_all_teachers():
    """Vérifier tous les professeurs dans Django"""
    print(f"\n🔍 Vérification de tous les professeurs Django")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}/teachers/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            teachers = response.json()
            
            print(f"📊 Total professeurs Django: {len(teachers)}")
            
            # Chercher les professeurs de test
            test_teachers = []
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                
                if 'test.auto.' in email:
                    test_teachers.append({
                        'email': email,
                        'is_validated': teacher.get('is_validated', False),
                        'is_active': user.get('is_active', True)
                    })
            
            print(f"\n📋 Professeurs de test dans Django: {len(test_teachers)}")
            for teacher in test_teachers:
                print(f"  • {teacher['email']}")
                print(f"    Validé: {teacher['is_validated']}")
                print(f"    Actif: {teacher['is_active']}")
            
            return test_teachers
            
        else:
            print(f"❌ Erreur Django all: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def main():
    """Fonction principale"""
    print("🚀 Vérification - Nouveau professeur dans panel admin")
    print("=" * 80)
    
    # 1. Vérifier Django pending
    django_pending = check_django_pending_directly()
    
    # 2. Vérifier Next.js pending
    nextjs_pending = check_nextjs_pending()
    
    # 3. Vérifier tous les professeurs Django
    django_all = check_django_all_teachers()
    
    print("\n" + "=" * 80)
    print("📋 Analyse")
    print("=" * 80)
    
    print(f"📊 Professeurs de test:")
    print(f"   Django pending: {len(django_pending)}")
    print(f"   Next.js pending: {len(nextjs_pending)}")
    print(f"   Django all: {len(django_all)}")
    
    if len(django_all) > 0 and len(django_pending) == 0:
        print(f"\n⚠️ PROBLÈME: Professeurs de test créés mais pas dans pending")
        print(f"   → Vérifiez la logique de filtrage de l'endpoint pending")
        
        for teacher in django_all:
            if not teacher['is_validated'] and teacher['is_active']:
                print(f"   → {teacher['email']} devrait être en attente mais ne l'est pas")
    
    elif len(django_pending) > 0 and len(nextjs_pending) == 0:
        print(f"\n⚠️ PROBLÈME: Professeurs dans Django pending mais pas dans Next.js")
        print(f"   → Problème de synchronisation Next.js")
    
    elif len(django_all) == 0:
        print(f"\n⚠️ PROBLÈME: Aucun professeur de test trouvé")
        print(f"   → Vérifiez que l'inscription s'est bien passée")
    
    else:
        print(f"\n✅ Tout semble correct")

if __name__ == '__main__':
    main()





