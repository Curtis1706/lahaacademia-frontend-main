#!/usr/bin/env python3
"""
Script pour forcer la synchronisation complète
"""

import requests
import time
import subprocess
import os

def clear_nextjs_cache():
    """Supprimer le cache Next.js"""
    print("🗑️ Suppression du cache Next.js...")
    
    try:
        if os.path.exists('.next'):
            import shutil
            shutil.rmtree('.next')
            print("✅ Cache Next.js supprimé")
            return True
        else:
            print("ℹ️ Aucun cache Next.js trouvé")
            return True
    except Exception as e:
        print(f"❌ Erreur suppression cache: {e}")
        return False

def test_endpoint_with_timestamp():
    """Tester l'endpoint avec timestamp"""
    print("🔍 Test de l'endpoint avec timestamp...")
    
    timestamp = int(time.time() * 1000)
    url = f'http://localhost:3000/api/teachers/pending?_t={timestamp}'
    
    try:
        response = requests.get(url, headers={'Cache-Control': 'no-cache'}, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"✅ Endpoint avec timestamp: {len(teachers)} professeurs")
            
            # Chercher Roblox ROB
            roblox_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                if email == 'roblox@gmail.com':
                    roblox_found = True
                    break
            
            if roblox_found:
                print("✅ Roblox ROB trouvé dans Next.js")
                return True
            else:
                print("❌ Roblox ROB non trouvé dans Next.js")
                return False
        else:
            print(f"❌ Erreur endpoint: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_multiple_requests():
    """Tester plusieurs requêtes pour forcer la synchronisation"""
    print("🔄 Test de plusieurs requêtes...")
    
    for i in range(5):
        timestamp = int(time.time() * 1000) + i
        url = f'http://localhost:3000/api/teachers/pending?_t={timestamp}'
        
        try:
            response = requests.get(url, headers={'Cache-Control': 'no-cache'}, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                teachers = data.get('teachers', [])
                
                print(f"   Requête {i+1}: {len(teachers)} professeurs")
                
                # Chercher Roblox ROB
                for teacher in teachers:
                    user = teacher.get('user', {})
                    email = user.get('email', '')
                    if email == 'roblox@gmail.com':
                        print(f"   ✅ Roblox ROB trouvé dans la requête {i+1}")
                        return True
            else:
                print(f"   ❌ Erreur requête {i+1}: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Erreur requête {i+1}: {e}")
        
        time.sleep(1)
    
    print("   ❌ Roblox ROB non trouvé après 5 requêtes")
    return False

def check_django_directly():
    """Vérifier Django directement"""
    print("🔍 Vérification Django directe...")
    
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
            
            print(f"✅ Django: {count} professeurs en attente")
            
            # Chercher Roblox ROB
            roblox_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                if email == 'roblox@gmail.com':
                    roblox_found = True
                    print(f"✅ Roblox ROB trouvé dans Django (ID: {teacher.get('id', 'N/A')})")
                    break
            
            if not roblox_found:
                print("❌ Roblox ROB non trouvé dans Django")
            
            return roblox_found, count
        else:
            print(f"❌ Erreur Django: {response.status_code}")
            return False, 0
            
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return False, 0

def main():
    """Fonction principale"""
    print("🚀 Force la synchronisation complète")
    print("=" * 80)
    
    # 1. Vérifier Django
    django_roblox, django_count = check_django_directly()
    
    if not django_roblox:
        print("❌ Roblox ROB n'est pas dans Django - impossible de synchroniser")
        return
    
    # 2. Tester l'endpoint avec timestamp
    print(f"\n🔍 Test de l'endpoint avec timestamp")
    print("-" * 50)
    endpoint_success = test_endpoint_with_timestamp()
    
    if endpoint_success:
        print("✅ Synchronisation réussie avec timestamp")
        return
    
    # 3. Tester plusieurs requêtes
    print(f"\n🔄 Test de plusieurs requêtes")
    print("-" * 50)
    multiple_success = test_multiple_requests()
    
    if multiple_success:
        print("✅ Synchronisation réussie avec plusieurs requêtes")
        return
    
    # 4. Supprimer le cache et redémarrer
    print(f"\n🗑️ Suppression du cache Next.js")
    print("-" * 50)
    cache_cleared = clear_nextjs_cache()
    
    if cache_cleared:
        print(f"\n📋 Instructions de redémarrage:")
        print("1. Arrêtez Next.js (Ctrl+C)")
        print("2. Redémarrez Next.js: npm run dev")
        print("3. Testez à nouveau l'endpoint")
        
        print(f"\n⏳ Attente du redémarrage Next.js...")
        print("Appuyez sur Entrée quand Next.js est redémarré...")
        
        input()
        
        # Tester après redémarrage
        print(f"\n🔍 Test après redémarrage")
        print("-" * 50)
        restart_success = test_endpoint_with_timestamp()
        
        if restart_success:
            print("✅ Synchronisation réussie après redémarrage")
        else:
            print("❌ Synchronisation échouée après redémarrage")
            print("💡 Vérifiez les logs Next.js pour plus de détails")
    
    print(f"\n" + "=" * 80)
    print("📋 Résumé de la synchronisation")
    print("=" * 80)
    print(f"📊 Django: {django_count} professeurs")
    print(f"📊 Roblox ROB dans Django: {'✅' if django_roblox else '❌'}")
    print(f"📊 Synchronisation Next.js: {'✅' if endpoint_success or multiple_success else '❌'}")

if __name__ == '__main__':
    main()



