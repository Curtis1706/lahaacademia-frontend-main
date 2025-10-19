#!/usr/bin/env python3
"""
Script pour comparer les listes de professeurs entre Django et Next.js
"""

import requests
import json

def get_django_teachers():
    """Récupérer les professeurs depuis Django"""
    base_url = "http://localhost:8000/api"
    endpoint = "/teachers/pending/"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get('teachers', [])
        return []
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return []

def get_nextjs_teachers():
    """Récupérer les professeurs depuis Next.js"""
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get('teachers', [])
        return []
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return []

def compare_teachers():
    """Comparer les listes de professeurs"""
    print("🔍 Comparaison des listes de professeurs")
    print("=" * 60)
    
    django_teachers = get_django_teachers()
    nextjs_teachers = get_nextjs_teachers()
    
    print(f"📊 Django:  {len(django_teachers)} professeurs")
    print(f"📊 Next.js: {len(nextjs_teachers)} professeurs")
    
    # Créer des sets d'emails pour la comparaison
    django_emails = {teacher.get('user', {}).get('email', '') for teacher in django_teachers}
    nextjs_emails = {teacher.get('user', {}).get('email', '') for teacher in nextjs_teachers}
    
    print(f"\n📋 Emails Django: {sorted(django_emails)}")
    print(f"📋 Emails Next.js: {sorted(nextjs_emails)}")
    
    # Trouver les différences
    missing_in_nextjs = django_emails - nextjs_emails
    extra_in_nextjs = nextjs_emails - django_emails
    
    if missing_in_nextjs:
        print(f"\n❌ Manquants dans Next.js: {missing_in_nextjs}")
        
        # Afficher les détails des professeurs manquants
        for email in missing_in_nextjs:
            teacher = next((t for t in django_teachers if t.get('user', {}).get('email') == email), None)
            if teacher:
                user = teacher.get('user', {})
                print(f"   - {user.get('first_name')} {user.get('last_name')} ({email})")
    
    if extra_in_nextjs:
        print(f"\n➕ Supplémentaires dans Next.js: {extra_in_nextjs}")
    
    if not missing_in_nextjs and not extra_in_nextjs:
        print(f"\n✅ Les listes sont identiques")
    
    return missing_in_nextjs, extra_in_nextjs

def main():
    """Fonction principale"""
    print("🚀 Comparaison des professeurs Django vs Next.js")
    print("=" * 80)
    
    missing, extra = compare_teachers()
    
    print("\n" + "=" * 80)
    print("📋 Résumé")
    print("=" * 80)
    
    if missing:
        print(f"⚠️ {len(missing)} professeur(s) manquant(s) dans Next.js")
        print(f"💡 Le problème vient de l'endpoint Next.js")
        print(f"🔧 Vérifiez les logs Next.js pour plus de détails")
    else:
        print(f"✅ Aucun professeur manquant")
    
    if extra:
        print(f"⚠️ {len(extra)} professeur(s) supplémentaire(s) dans Next.js")

if __name__ == '__main__':
    main()




