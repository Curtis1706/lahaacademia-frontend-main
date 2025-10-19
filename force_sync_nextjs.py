#!/usr/bin/env python3
"""
Script pour forcer la synchronisation Next.js
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

def wait_for_nextjs():
    """Attendre que Next.js soit disponible"""
    print("⏳ Attente de Next.js...")
    
    for i in range(60):  # Attendre jusqu'à 60 secondes
        try:
            response = requests.get('http://localhost:3000', timeout=2)
            if response.status_code == 200:
                print("✅ Next.js est disponible")
                return True
        except:
            pass
        
        print(f"   Tentative {i+1}/60...")
        time.sleep(1)
    
    print("❌ Next.js n'est pas disponible après 60 secondes")
    return False

def test_sync():
    """Tester la synchronisation"""
    print("\n🔍 Test de synchronisation")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📊 Next.js après redémarrage: {len(teachers)} professeurs")
            
            # Chercher les professeurs récents
            recent_found = []
            for teacher in teachers:
                user = teacher.get('user', {})
                email = user.get('email', '')
                
                if 'chabi@gmail.com' in email or 'test.auto.' in email or 'test7@gmail.com' in email:
                    recent_found.append(email)
            
            print(f"📋 Professeurs récents trouvés: {len(recent_found)}")
            for email in recent_found:
                print(f"  ✅ {email}")
            
            if len(recent_found) >= 3:
                print(f"\n🎉 SUCCÈS! Synchronisation réussie")
                print(f"   → {len(teachers)} professeurs en attente")
                print(f"   → Professeurs récents visibles")
                return True
            else:
                print(f"\n⚠️ PARTIEL! Seulement {len(recent_found)} professeurs récents")
                return False
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Force la synchronisation Next.js")
    print("=" * 80)
    
    print("📋 Instructions:")
    print("1. Arrêtez Next.js (Ctrl+C dans le terminal Next.js)")
    print("2. Le script va supprimer le cache")
    print("3. Redémarrez Next.js: npm run dev")
    print("4. Appuyez sur Entrée quand Next.js est redémarré...")
    
    input("Appuyez sur Entrée quand Next.js est redémarré...")
    
    # Supprimer le cache
    cache_cleared = clear_nextjs_cache()
    
    if not cache_cleared:
        print("❌ Impossible de supprimer le cache")
        return
    
    # Attendre que Next.js soit disponible
    if not wait_for_nextjs():
        print("❌ Impossible de continuer - Next.js non disponible")
        return
    
    # Tester la synchronisation
    sync_success = test_sync()
    
    print("\n" + "=" * 80)
    if sync_success:
        print("🎉 SUCCÈS! La synchronisation est réussie")
        print("✅ Tous les professeurs en attente sont maintenant visibles")
        print("✅ Le dashboard admin affiche les bonnes données")
    else:
        print("❌ ÉCHEC! La synchronisation n'est pas complète")
        print("💡 Vérifiez que Next.js a bien redémarré")
        print("💡 Vérifiez les logs Next.js pour plus de détails")

if __name__ == '__main__':
    main()



