#!/usr/bin/env python3
"""
Script pour déboguer pourquoi un nouveau compte enseignant n'apparaît pas
"""

import requests
import json
from datetime import datetime

def check_all_teachers():
    """Vérifier tous les professeurs dans la base"""
    print("🔍 Vérification de tous les professeurs")
    print("=" * 60)
    
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
            
            print(f"📊 Total des professeurs dans la base: {len(teachers)}")
            
            # Analyser par statut
            pending_count = 0
            validated_count = 0
            inactive_count = 0
            
            print(f"\n📋 Détails des professeurs:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                is_validated = teacher.get('is_validated', False)
                is_active = user.get('is_active', True)
                created_at = user.get('created_at', 'N/A')
                
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                
                status = "VALIDÉ" if is_validated else "EN ATTENTE"
                active_status = "ACTIF" if is_active else "INACTIF"
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Statut: {status} | Compte: {active_status}")
                print(f"     Créé le: {created_at}")
                
                if not is_active:
                    inactive_count += 1
                elif is_validated:
                    validated_count += 1
                else:
                    pending_count += 1
                
                print()
            
            print(f"\n📊 Répartition:")
            print(f"   En attente: {pending_count}")
            print(f"   Validés: {validated_count}")
            print(f"   Inactifs: {inactive_count}")
            
            return teachers
            
        else:
            print(f"❌ Erreur API: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def check_pending_teachers():
    """Vérifier les professeurs en attente via l'endpoint pending"""
    print("\n🔍 Vérification des professeurs en attente")
    print("-" * 50)
    
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
            
            print(f"📊 Endpoint pending retourne: {count} professeurs")
            print(f"📋 Liste length: {len(teachers)}")
            
            print(f"\n📝 Professeurs en attente:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                created_at = user.get('created_at', 'N/A')
                is_active = user.get('is_active', True)
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Actif: {is_active} | Créé: {created_at}")
            
            return teachers
            
        else:
            print(f"❌ Erreur API pending: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def check_nextjs_pending():
    """Vérifier ce que Next.js retourne"""
    print("\n🔍 Vérification Next.js")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js retourne: {len(teachers)} professeurs")
            
            print(f"\n📝 Professeurs Next.js:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                
                print(f"  {i}. {first_name} {last_name} ({email})")
            
            return teachers
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return []

def find_recent_teachers(all_teachers, hours=1):
    """Trouver les professeurs créés récemment"""
    print(f"\n🔍 Recherche des professeurs créés dans les dernières {hours}h")
    print("-" * 50)
    
    recent_teachers = []
    now = datetime.now()
    
    for teacher in all_teachers:
        user = teacher.get('user', {})
        created_at_str = user.get('created_at', '')
        
        if created_at_str:
            try:
                # Parser la date ISO
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
                
                # Calculer la différence en heures
                diff_hours = (now - created_at.replace(tzinfo=None)).total_seconds() / 3600
                
                if diff_hours <= hours:
                    recent_teachers.append({
                        'teacher': teacher,
                        'hours_ago': diff_hours
                    })
                    
            except Exception as e:
                print(f"❌ Erreur parsing date {created_at_str}: {e}")
    
    print(f"📊 Professeurs créés dans les dernières {hours}h: {len(recent_teachers)}")
    
    for item in recent_teachers:
        teacher = item['teacher']
        user = teacher.get('user', {})
        hours_ago = item['hours_ago']
        
        first_name = user.get('first_name', 'N/A')
        last_name = user.get('last_name', 'N/A')
        email = user.get('email', 'N/A')
        is_validated = teacher.get('is_validated', False)
        is_active = user.get('is_active', True)
        
        print(f"  • {first_name} {last_name} ({email})")
        print(f"    Créé il y a {hours_ago:.1f}h")
        print(f"    Validé: {is_validated} | Actif: {is_active}")
    
    return recent_teachers

def main():
    """Fonction principale"""
    print("🚀 Débogage - Nouveau compte enseignant non visible")
    print("=" * 80)
    
    # 1. Vérifier tous les professeurs
    all_teachers = check_all_teachers()
    
    # 2. Vérifier les professeurs en attente
    pending_teachers = check_pending_teachers()
    
    # 3. Vérifier Next.js
    nextjs_teachers = check_nextjs_pending()
    
    # 4. Chercher les professeurs récents
    recent_teachers = find_recent_teachers(all_teachers, hours=2)
    
    print("\n" + "=" * 80)
    print("📋 Analyse")
    print("=" * 80)
    
    if recent_teachers:
        print(f"✅ {len(recent_teachers)} professeur(s) récent(s) trouvé(s)")
        
        for item in recent_teachers:
            teacher = item['teacher']
            user = teacher.get('user', {})
            email = user.get('email', 'N/A')
            is_validated = teacher.get('is_validated', False)
            is_active = user.get('is_active', True)
            
            # Vérifier si ce professeur est dans la liste pending
            in_pending = any(t['user']['email'] == email for t in pending_teachers)
            in_nextjs = any(t['user']['email'] == email for t in nextjs_teachers)
            
            print(f"\n📧 {email}:")
            print(f"   Validé: {is_validated} | Actif: {is_active}")
            print(f"   Dans pending Django: {'✅' if in_pending else '❌'}")
            print(f"   Dans Next.js: {'✅' if in_nextjs else '❌'}")
            
            if not in_pending and not is_validated and is_active:
                print(f"   ⚠️ PROBLÈME: Professeur non validé et actif mais absent de pending!")
                
    else:
        print("❌ Aucun professeur récent trouvé")
    
    print(f"\n💡 Solutions possibles:")
    print(f"   1. Vérifier que le professeur est bien créé avec is_validated=False")
    print(f"   2. Vérifier que le professeur a is_active=True")
    print(f"   3. Vérifier que l'endpoint pending filtre correctement")
    print(f"   4. Redémarrer Next.js pour mettre à jour le cache")

if __name__ == '__main__':
    main()



