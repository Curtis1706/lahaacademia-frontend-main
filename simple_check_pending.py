#!/usr/bin/env python3
"""
Script simple pour vérifier les professeurs en attente
"""

import requests
import json

def check_pending_simple():
    """Vérification simple des professeurs en attente"""
    print("🔍 Vérification simple des professeurs en attente")
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
            
            # Chercher Olympe CHABI
            chabi_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                first_name = user.get('first_name', '')
                last_name = user.get('last_name', '')
                
                if email == 'chabi@gmail.com':
                    chabi_found = True
                    print(f"✅ Olympe CHABI trouvé dans Django pending")
                    print(f"   Email: {email}")
                    print(f"   Nom: {first_name} {last_name}")
                    print(f"   Validé: {teacher.get('is_validated', False)}")
                    print(f"   Actif: {user.get('is_active', True)}")
                    break
            
            if not chabi_found:
                print(f"❌ Olympe CHABI non trouvé dans Django pending")
            
            print(f"\n📋 Tous les emails dans Django pending:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                email = user.get('email', 'N/A')
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                print(f"  {i}. {first_name} {last_name} ({email})")
            
            return chabi_found
            
        else:
            print(f"❌ Erreur API: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def check_nextjs_simple():
    """Vérification simple de Next.js"""
    print(f"\n🔍 Vérification simple de Next.js")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js: {len(teachers)} professeurs")
            
            # Chercher Olympe CHABI
            chabi_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                first_name = user.get('first_name', '')
                last_name = user.get('last_name', '')
                
                if email == 'chabi@gmail.com':
                    chabi_found = True
                    print(f"✅ Olympe CHABI trouvé dans Next.js")
                    print(f"   Email: {email}")
                    print(f"   Nom: {first_name} {last_name}")
                    print(f"   Validé: {teacher.get('is_validated', False)}")
                    print(f"   Actif: {user.get('is_active', True)}")
                    break
            
            if not chabi_found:
                print(f"❌ Olympe CHABI non trouvé dans Next.js")
            
            print(f"\n📋 Tous les emails dans Next.js:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                email = user.get('email', 'N/A')
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                print(f"  {i}. {first_name} {last_name} ({email})")
            
            return chabi_found
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Vérification simple - Olympe CHABI")
    print("=" * 80)
    
    # Vérifier Django
    django_found = check_pending_simple()
    
    # Vérifier Next.js
    nextjs_found = check_nextjs_simple()
    
    print("\n" + "=" * 80)
    print("📋 Résumé")
    print("=" * 80)
    
    print(f"📧 Olympe CHABI (chabi@gmail.com):")
    print(f"   Dans Django pending: {'✅' if django_found else '❌'}")
    print(f"   Dans Next.js: {'✅' if nextjs_found else '❌'}")
    
    if django_found and not nextjs_found:
        print(f"\n⚠️ PROBLÈME: Django a le professeur mais Next.js ne l'a pas")
        print(f"   → Problème de cache Next.js ou de synchronisation")
        print(f"   💡 Solution: Redémarrer Next.js")
    elif not django_found and nextjs_found:
        print(f"\n⚠️ PROBLÈME: Next.js a le professeur mais Django ne l'a pas")
        print(f"   → Problème avec l'endpoint Django pending")
    elif not django_found and not nextjs_found:
        print(f"\n⚠️ PROBLÈME: Le professeur n'est nulle part")
        print(f"   → Vérifier que l'inscription s'est bien passée")
    else:
        print(f"\n✅ Tout fonctionne - le professeur est visible partout")

if __name__ == '__main__':
    main()





