#!/usr/bin/env python3
"""
Script pour tester la synchronisation automatique
"""

import requests
import time
import json

def check_sync_status():
    """Vérifier l'état de la synchronisation"""
    print("🔍 Vérification de l'état de synchronisation")
    print("=" * 60)
    
    # Django
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Vérifier Django
        django_response = requests.get(f"{base_url}/teachers/pending/", headers=headers, timeout=10)
        
        if django_response.status_code == 200:
            django_data = django_response.json()
            django_count = django_data.get('count', 0)
            django_teachers = django_data.get('teachers', [])
            
            print(f"📊 Django: {django_count} professeurs en attente")
            
            # Lister les emails Django
            django_emails = []
            for teacher in django_teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                if email:
                    django_emails.append(email)
            
            print(f"📋 Emails Django: {', '.join(django_emails[:5])}{'...' if len(django_emails) > 5 else ''}")
        else:
            print(f"❌ Erreur Django: {django_response.status_code}")
            return None, None
            
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return None, None
    
    # Next.js
    try:
        # Ajouter un timestamp pour forcer le rafraîchissement
        timestamp = int(time.time() * 1000)
        nextjs_response = requests.get(f'http://localhost:3000/api/teachers/pending?_t={timestamp}', 
                                     headers={'Cache-Control': 'no-cache'}, timeout=10)
        
        if nextjs_response.status_code == 200:
            nextjs_data = nextjs_response.json()
            nextjs_teachers = nextjs_data.get('teachers', [])
            
            print(f"📊 Next.js: {len(nextjs_teachers)} professeurs en attente")
            
            # Lister les emails Next.js
            nextjs_emails = []
            for teacher in nextjs_teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                if email:
                    nextjs_emails.append(email)
            
            print(f"📋 Emails Next.js: {', '.join(nextjs_emails[:5])}{'...' if len(nextjs_emails) > 5 else ''}")
        else:
            print(f"❌ Erreur Next.js: {nextjs_response.status_code}")
            return django_emails, None
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return django_emails, None
    
    return django_emails, nextjs_emails

def test_auto_refresh():
    """Tester le rafraîchissement automatique"""
    print(f"\n🔄 Test du rafraîchissement automatique")
    print("=" * 60)
    
    print("📋 Instructions:")
    print("1. Créez un nouveau professeur via l'interface web")
    print("2. Le script va vérifier la synchronisation toutes les 10 secondes")
    print("3. Appuyez sur Ctrl+C pour arrêter")
    print("\n⏳ Attente de la création d'un nouveau professeur...")
    
    previous_django_count = 0
    previous_nextjs_count = 0
    
    try:
        while True:
            django_emails, nextjs_emails = check_sync_status()
            
            if django_emails and nextjs_emails:
                django_count = len(django_emails)
                nextjs_count = len(nextjs_emails)
                
                # Vérifier s'il y a des changements
                if django_count != previous_django_count or nextjs_count != previous_nextjs_count:
                    print(f"\n🔄 Changement détecté!")
                    print(f"   Django: {previous_django_count} → {django_count}")
                    print(f"   Next.js: {previous_nextjs_count} → {nextjs_count}")
                    
                    if django_count == nextjs_count:
                        print("✅ Synchronisation réussie!")
                        
                        # Vérifier les nouveaux emails
                        new_emails = set(django_emails) - set(previous_django_emails) if previous_django_count > 0 else set(django_emails)
                        if new_emails:
                            print(f"📧 Nouveaux professeurs détectés: {', '.join(new_emails)}")
                    else:
                        print("❌ Désynchronisation détectée")
                        print(f"   Différence: {django_count - nextjs_count} professeurs")
                
                previous_django_count = django_count
                previous_nextjs_count = nextjs_count
                previous_django_emails = django_emails.copy()
            
            print("⏳ Attente de 10 secondes...")
            time.sleep(10)
            
    except KeyboardInterrupt:
        print(f"\n\n🛑 Arrêt du monitoring")
        print("📋 Résumé final:")
        if django_emails and nextjs_emails:
            print(f"   Django: {len(django_emails)} professeurs")
            print(f"   Next.js: {len(nextjs_emails)} professeurs")
            if len(django_emails) == len(nextjs_emails):
                print("✅ Synchronisation finale: OK")
            else:
                print("❌ Synchronisation finale: ÉCHEC")

def main():
    """Fonction principale"""
    print("🚀 Test de la synchronisation automatique")
    print("=" * 80)
    
    # Test initial
    django_emails, nextjs_emails = check_sync_status()
    
    if django_emails and nextjs_emails:
        print(f"\n📋 État initial:")
        print(f"   Django: {len(django_emails)} professeurs")
        print(f"   Next.js: {len(nextjs_emails)} professeurs")
        
        if len(django_emails) == len(nextjs_emails):
            print("✅ Synchronisation initiale: OK")
        else:
            print("❌ Désynchronisation initiale détectée")
            print(f"   Différence: {len(django_emails) - len(nextjs_emails)} professeurs")
    
    # Test du rafraîchissement automatique
    test_auto_refresh()

if __name__ == '__main__':
    main()





