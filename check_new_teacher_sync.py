#!/usr/bin/env python3
"""
Script pour vérifier la synchronisation des nouveaux enseignants
"""

import requests
import json

def check_django_pending():
    """Vérifier les enseignants en attente dans Django"""
    print("🔍 Vérification Django - Professeurs en attente")
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
            
            print(f"📊 Django: {count} professeurs en attente")
            
            # Lister tous les professeurs avec leur date de création
            print(f"\n📋 Professeurs dans Django:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                created_at = user.get('created_at', 'N/A')
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Créé: {created_at}")
            
            return teachers
            
        else:
            print(f"❌ Erreur Django: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return []

def check_nextjs_pending():
    """Vérifier les enseignants en attente dans Next.js"""
    print(f"\n🔍 Vérification Next.js - Professeurs en attente")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js: {len(teachers)} professeurs en attente")
            
            # Lister tous les professeurs avec leur date de création
            print(f"\n📋 Professeurs dans Next.js:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                created_at = user.get('created_at', 'N/A')
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Créé: {created_at}")
            
            return teachers
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return []

def find_newest_teachers(django_teachers, nextjs_teachers):
    """Trouver les professeurs les plus récents"""
    print(f"\n🔍 Analyse des professeurs les plus récents")
    print("=" * 60)
    
    # Extraire les emails des deux listes
    django_emails = set()
    nextjs_emails = set()
    
    for teacher in django_teachers:
        user = teacher.get('user', {})
        email = user.get('email', '')
        if email:
            django_emails.add(email)
    
    for teacher in nextjs_teachers:
        user = teacher.get('user', {})
        email = user.get('email', '')
        if email:
            nextjs_emails.add(email)
    
    # Trouver les nouveaux professeurs (dans Django mais pas dans Next.js)
    new_teachers = django_emails - nextjs_emails
    
    if new_teachers:
        print(f"📋 Nouveaux professeurs non synchronisés ({len(new_teachers)}):")
        for email in sorted(new_teachers):
            print(f"  ❌ {email}")
        
        # Trouver les détails des nouveaux professeurs
        print(f"\n📋 Détails des nouveaux professeurs:")
        for teacher in django_teachers:
            user = teacher.get('user', {})
            email = user.get('email', '')
            if email in new_teachers:
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                created_at = user.get('created_at', 'N/A')
                teacher_id = teacher.get('id', 'N/A')
                
                print(f"  📧 {email}:")
                print(f"     Nom: {first_name} {last_name}")
                print(f"     ID: {teacher_id}")
                print(f"     Créé: {created_at}")
    else:
        print("✅ Aucun nouveau professeur non synchronisé")
    
    return new_teachers

def main():
    """Fonction principale"""
    print("🚀 Vérification de la synchronisation des nouveaux enseignants")
    print("=" * 80)
    
    # 1. Vérifier Django
    django_teachers = check_django_pending()
    
    # 2. Vérifier Next.js
    nextjs_teachers = check_nextjs_pending()
    
    # 3. Analyser les différences
    if django_teachers and nextjs_teachers:
        new_teachers = find_newest_teachers(django_teachers, nextjs_teachers)
        
        print(f"\n" + "=" * 80)
        print("📋 Résumé de la synchronisation")
        print("=" * 80)
        
        print(f"📊 Django: {len(django_teachers)} professeurs")
        print(f"📊 Next.js: {len(nextjs_teachers)} professeurs")
        print(f"📊 Différence: {len(django_teachers) - len(nextjs_teachers)} professeurs")
        
        if new_teachers:
            print(f"\n❌ PROBLÈME: {len(new_teachers)} professeurs non synchronisés")
            print("💡 Solution: Implémenter la synchronisation automatique")
        else:
            print(f"\n✅ SUCCÈS: Synchronisation parfaite")
    
    else:
        print(f"\n❌ Impossible de comparer - erreur dans les APIs")

if __name__ == '__main__':
    main()





