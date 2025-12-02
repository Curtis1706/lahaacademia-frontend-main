#!/usr/bin/env python3
"""
Script pour vérifier un professeur spécifique
"""

import requests
import json

def check_teacher_by_email(email):
    """Vérifier un professeur par email"""
    print(f"🔍 Recherche du professeur: {email}")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Chercher dans tous les professeurs
        response = requests.get(f"{base_url}/teachers/", headers=headers, timeout=10)
        
        if response.status_code == 200:
            teachers = response.json()
            
            found_teacher = None
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == email:
                    found_teacher = teacher
                    break
            
            if found_teacher:
                print(f"✅ Professeur trouvé dans Django")
                user = found_teacher.get('user', {})
                
                print(f"📋 Informations:")
                print(f"   Nom: {user.get('first_name')} {user.get('last_name')}")
                print(f"   Email: {user.get('email')}")
                print(f"   Validé: {found_teacher.get('is_validated', False)}")
                print(f"   Actif: {user.get('is_active', True)}")
                print(f"   Créé: {user.get('created_at', 'N/A')}")
                
                # Vérifier s'il est dans pending
                is_pending = not found_teacher.get('is_validated', False) and user.get('is_active', True)
                print(f"   Devrait être en attente: {is_pending}")
                
                return found_teacher
            else:
                print(f"❌ Professeur non trouvé dans Django")
                return None
                
        else:
            print(f"❌ Erreur API Django: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def check_teacher_in_pending(email):
    """Vérifier si un professeur est dans la liste pending"""
    print(f"\n🔍 Vérification dans la liste pending")
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
            teachers = data.get('teachers', [])
            
            found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == email:
                    found = True
                    print(f"✅ Professeur trouvé dans pending Django")
                    break
            
            if not found:
                print(f"❌ Professeur non trouvé dans pending Django")
            
            return found
            
        else:
            print(f"❌ Erreur API pending: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def check_teacher_in_nextjs(email):
    """Vérifier si un professeur est dans Next.js"""
    print(f"\n🔍 Vérification dans Next.js")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == email:
                    found = True
                    print(f"✅ Professeur trouvé dans Next.js")
                    break
            
            if not found:
                print(f"❌ Professeur non trouvé dans Next.js")
            
            return found
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Vérification d'un professeur spécifique")
    print("=" * 80)
    
    # Vérifier Olympe CHABI (le plus récent)
    email = "chabi@gmail.com"
    
    # 1. Chercher dans Django
    teacher = check_teacher_by_email(email)
    
    if teacher:
        # 2. Vérifier dans pending
        in_pending = check_teacher_in_pending(email)
        
        # 3. Vérifier dans Next.js
        in_nextjs = check_teacher_in_nextjs(email)
        
        print("\n" + "=" * 80)
        print("📋 Résumé")
        print("=" * 80)
        
        print(f"📧 {email}:")
        print(f"   Dans Django: ✅")
        print(f"   Dans pending Django: {'✅' if in_pending else '❌'}")
        print(f"   Dans Next.js: {'✅' if in_nextjs else '❌'}")
        
        if not in_pending:
            print(f"\n⚠️ PROBLÈME: Le professeur n'est pas dans pending Django")
            print(f"   Vérifiez la logique de filtrage dans l'endpoint pending")
        elif not in_nextjs:
            print(f"\n⚠️ PROBLÈME: Le professeur n'est pas dans Next.js")
            print(f"   Problème de cache ou de synchronisation Next.js")
        else:
            print(f"\n✅ Tout fonctionne correctement pour ce professeur")
    
    else:
        print(f"\n❌ Professeur {email} non trouvé dans la base de données")

if __name__ == '__main__':
    main()





