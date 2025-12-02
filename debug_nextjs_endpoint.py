#!/usr/bin/env python3
"""
Script pour déboguer l'endpoint Next.js
"""

import requests
import json

def test_nextjs_endpoint_directly():
    """Tester directement l'endpoint Next.js avec logs"""
    print("🔍 Test direct de l'endpoint Next.js")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📋 Nombre de professeurs: {len(teachers)}")
            
            # Analyser les professeurs
            print(f"\n📝 Professeurs dans Next.js:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                email = user.get('email', 'N/A')
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                is_validated = teacher.get('is_validated', False)
                is_active = user.get('is_active', True)
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Validé: {is_validated} | Actif: {is_active}")
            
            # Vérifier s'il y a des incohérences
            validated_count = sum(1 for t in teachers if t.get('is_validated', False))
            active_count = sum(1 for t in teachers if t.get('user', {}).get('is_active', True))
            
            print(f"\n📊 Analyse:")
            print(f"   Total: {len(teachers)}")
            print(f"   Validés: {validated_count}")
            print(f"   Actifs: {active_count}")
            print(f"   En attente (non validés + actifs): {len(teachers) - validated_count}")
            
            return teachers
            
        else:
            print(f"❌ Erreur: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def compare_with_django():
    """Comparer avec Django"""
    print(f"\n🔍 Comparaison avec Django")
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
            
            print(f"📊 Django pending: {count} professeurs")
            
            # Analyser les professeurs Django
            django_emails = set()
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                if email:
                    django_emails.add(email)
            
            return django_emails, count
            
        else:
            print(f"❌ Erreur Django: {response.status_code}")
            return set(), 0
            
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return set(), 0

def main():
    """Fonction principale"""
    print("🚀 Débogage de l'endpoint Next.js")
    print("=" * 80)
    
    # 1. Tester Next.js
    nextjs_teachers = test_nextjs_endpoint_directly()
    
    # 2. Comparer avec Django
    django_emails, django_count = compare_with_django()
    
    # 3. Analyser les différences
    if nextjs_teachers:
        nextjs_emails = set()
        for teacher in nextjs_teachers:
            user = teacher.get('user', {})
            email = user.get('email', '')
            if email:
                nextjs_emails.add(email)
        
        print(f"\n📋 Analyse des différences")
        print("-" * 50)
        
        missing_in_nextjs = django_emails - nextjs_emails
        extra_in_nextjs = nextjs_emails - django_emails
        
        print(f"📊 Django: {django_count} professeurs")
        print(f"📊 Next.js: {len(nextjs_teachers)} professeurs")
        
        if missing_in_nextjs:
            print(f"\n❌ Manquants dans Next.js ({len(missing_in_nextjs)}):")
            for email in sorted(missing_in_nextjs):
                print(f"   • {email}")
        
        if extra_in_nextjs:
            print(f"\n➕ Supplémentaires dans Next.js ({len(extra_in_nextjs)}):")
            for email in sorted(extra_in_nextjs):
                print(f"   • {email}")
        
        if not missing_in_nextjs and not extra_in_nextjs:
            print(f"\n✅ Les listes sont identiques")
        
        print(f"\n💡 Solutions:")
        if missing_in_nextjs:
            print(f"   1. Redémarrer Next.js pour synchroniser")
            print(f"   2. Vérifier les logs Next.js pour les erreurs")
            print(f"   3. Vérifier que l'endpoint Next.js appelle bien Django")
        
    else:
        print(f"\n❌ Impossible de comparer - Next.js ne fonctionne pas")

if __name__ == '__main__':
    main()





