#!/usr/bin/env python3
"""
Script pour vérifier le nombre exact de professeurs en attente
"""

import requests
import json

def check_pending_teachers():
    """Vérifier le nombre de professeurs en attente"""
    print("🔍 Vérification du nombre de professeurs en attente")
    print("=" * 60)
    
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
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📊 Nombre total de professeurs en attente: {count}")
            print(f"📋 Nombre de professeurs dans la liste: {len(teachers)}")
            
            print(f"\n📝 Liste des professeurs en attente:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                is_validated = teacher.get('is_validated', False)
                is_active = user.get('is_active', True)
                
                print(f"  {i}. {first_name} {last_name} ({email})")
                print(f"     Validé: {is_validated}, Actif: {is_active}")
            
            # Vérifier s'il y a des incohérences
            if count != len(teachers):
                print(f"\n⚠️ Incohérence détectée:")
                print(f"   Count API: {count}")
                print(f"   Liste length: {len(teachers)}")
            
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

def check_all_teachers():
    """Vérifier tous les professeurs (pas seulement ceux en attente)"""
    print("\n🔍 Vérification de tous les professeurs")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    endpoint = "/teachers/"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            teachers = response.json()
            
            print(f"📊 Nombre total de professeurs: {len(teachers)}")
            
            # Compter par statut
            pending_count = 0
            validated_count = 0
            inactive_count = 0
            
            for teacher in teachers:
                user = teacher.get('user', {})
                is_validated = teacher.get('is_validated', False)
                is_active = user.get('is_active', True)
                
                if not is_active:
                    inactive_count += 1
                elif is_validated:
                    validated_count += 1
                else:
                    pending_count += 1
            
            print(f"📋 Répartition:")
            print(f"   En attente: {pending_count}")
            print(f"   Validés: {validated_count}")
            print(f"   Inactifs: {inactive_count}")
            
            return teachers
            
        else:
            print(f"❌ Erreur API: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def main():
    """Fonction principale"""
    print("🚀 Vérification du nombre de professeurs en attente")
    print("=" * 80)
    
    # Test 1: Professeurs en attente
    pending_teachers = check_pending_teachers()
    
    # Test 2: Tous les professeurs
    all_teachers = check_all_teachers()
    
    print("\n" + "=" * 80)
    print("📋 Résumé")
    print("=" * 80)
    
    if pending_teachers:
        print(f"✅ API pending retourne: {len(pending_teachers)} professeurs")
    else:
        print("❌ Problème avec l'API pending")
    
    if all_teachers:
        pending_from_all = sum(1 for t in all_teachers 
                             if not t.get('is_validated', False) and t.get('user', {}).get('is_active', True))
        print(f"✅ Calcul manuel depuis tous les profs: {pending_from_all} en attente")
    
    print("\n💡 Si les nombres ne correspondent pas:")
    print("   1. Vérifiez la logique de filtrage dans Django")
    print("   2. Vérifiez l'affichage dans le frontend")
    print("   3. Consultez les logs Django pour plus de détails")

if __name__ == '__main__':
    main()




