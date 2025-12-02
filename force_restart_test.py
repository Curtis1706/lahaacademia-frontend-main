#!/usr/bin/env python3
"""
Script pour forcer le test après redémarrage
"""

import requests
import json
import time

def wait_for_nextjs():
    """Attendre que Next.js soit disponible"""
    print("⏳ Attente de Next.js...")
    
    for i in range(30):  # Attendre jusqu'à 30 secondes
        try:
            response = requests.get('http://localhost:3000', timeout=2)
            if response.status_code == 200:
                print("✅ Next.js est disponible")
                return True
        except:
            pass
        
        print(f"   Tentative {i+1}/30...")
        time.sleep(1)
    
    print("❌ Next.js n'est pas disponible après 30 secondes")
    return False

def test_endpoint_after_restart():
    """Tester l'endpoint après redémarrage"""
    print("🔍 Test de l'endpoint après redémarrage")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📋 Nombre de professeurs: {len(teachers)}")
            
            # Chercher Fifamè
            fifa_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == 'fifa@gmail.com':
                    fifa_found = True
                    print(f"✅ Fifamè trouvé: {user.get('first_name')} {user.get('last_name')}")
                    break
            
            if not fifa_found:
                print(f"❌ Fifamè toujours manquant")
                
            # Compter les professeurs manquants
            django_emails = {'carlos@gmail.com', 'fifa@gmail.com', 'igor@gmail.com', 'jean.dupont.test@lahaacademia.com', 'marie.martin.test@lahaacademia.com', 'test.teacher@example.com', 'test_teacher@example.com', 'test_teacher_complete@example.com', 'test_teacher_docs@example.com', 'test_teacher_minimal@example.com'}
            nextjs_emails = {teacher.get('user', {}).get('email', '') for teacher in teachers}
            
            missing = django_emails - nextjs_emails
            extra = nextjs_emails - django_emails
            
            print(f"\n📊 Résultat:")
            print(f"   Professeurs manquants: {len(missing)}")
            print(f"   Professeurs supplémentaires: {len(extra)}")
            
            if missing:
                print(f"   Manquants: {sorted(missing)}")
            if extra:
                print(f"   Supplémentaires: {sorted(extra)}")
                
            return len(missing) == 0
            
        else:
            print(f"❌ Erreur: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Test après redémarrage de Next.js")
    print("=" * 80)
    
    # Attendre que Next.js soit disponible
    if not wait_for_nextjs():
        print("❌ Impossible de continuer - Next.js non disponible")
        return
    
    # Tester l'endpoint
    success = test_endpoint_after_restart()
    
    print("\n" + "=" * 80)
    if success:
        print("🎉 SUCCÈS! Tous les professeurs sont maintenant visibles")
    else:
        print("❌ ÉCHEC! Le problème persiste")
        print("💡 Vérifiez les logs Next.js pour plus de détails")

if __name__ == '__main__':
    main()






