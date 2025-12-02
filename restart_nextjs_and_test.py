#!/usr/bin/env python3
"""
Script pour redémarrer Next.js et tester
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

def test_after_restart():
    """Tester après redémarrage"""
    print("\n🔍 Test après redémarrage de Next.js")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js après redémarrage: {len(teachers)} professeurs")
            
            # Chercher Olympe CHABI
            chabi_found = False
            igor_found = False
            
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                first_name = user.get('first_name', '')
                last_name = user.get('last_name', '')
                
                if email == 'chabi@gmail.com':
                    chabi_found = True
                    print(f"✅ Olympe CHABI trouvé dans Next.js")
                
                if email == 'igor@gmail.com':
                    igor_found = True
                    print(f"⚠️ Igor JEJI encore présent (devrait être validé)")
            
            print(f"\n📋 Résultats:")
            print(f"   Olympe CHABI: {'✅' if chabi_found else '❌'}")
            print(f"   Igor JEJI (validé): {'❌' if not igor_found else '⚠️'}")
            
            if chabi_found and not igor_found:
                print(f"\n🎉 SUCCÈS! Next.js affiche maintenant les bonnes données")
                return True
            elif not chabi_found:
                print(f"\n❌ ÉCHEC! Olympe CHABI toujours absent")
                return False
            else:
                print(f"\n⚠️ PARTIEL! Olympe CHABI présent mais Igor JEJI encore là")
                return False
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Redémarrage Next.js et test")
    print("=" * 80)
    
    print("📋 Instructions:")
    print("1. Arrêtez Next.js (Ctrl+C dans le terminal Next.js)")
    print("2. Redémarrez Next.js: npm run dev")
    print("3. Appuyez sur Entrée quand Next.js est redémarré...")
    
    input("Appuyez sur Entrée quand Next.js est redémarré...")
    
    # Attendre que Next.js soit disponible
    if not wait_for_nextjs():
        print("❌ Impossible de continuer - Next.js non disponible")
        return
    
    # Tester
    success = test_after_restart()
    
    print("\n" + "=" * 80)
    if success:
        print("🎉 SUCCÈS! Le problème de cache Next.js est résolu")
        print("✅ Olympe CHABI devrait maintenant être visible dans le dashboard admin")
    else:
        print("❌ ÉCHEC! Le problème persiste")
        print("💡 Vérifiez les logs Next.js pour plus de détails")

if __name__ == '__main__':
    main()





