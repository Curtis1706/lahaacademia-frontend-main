#!/usr/bin/env python3
"""
Script pour tester l'endpoint Next.js des professeurs en attente
"""

import requests
import json

def test_nextjs_pending_endpoint():
    """Tester l'endpoint Next.js pour les professeurs en attente"""
    print("🔍 Test de l'endpoint Next.js /api/teachers/pending")
    print("=" * 60)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📋 Nombre de professeurs retournés par Next.js: {len(teachers)}")
            
            print(f"\n📝 Liste des professeurs:")
            for i, teacher in enumerate(teachers, 1):
                user = teacher.get('user', {})
                first_name = user.get('first_name', 'N/A')
                last_name = user.get('last_name', 'N/A')
                email = user.get('email', 'N/A')
                
                print(f"  {i}. {first_name} {last_name} ({email})")
            
            # Vérifier si c'est des données de test
            if len(teachers) == 1 and teachers[0].get('user', {}).get('email') == 'nathan@gmail.com':
                print(f"\n⚠️ Données de test détectées (Nathan CLO)")
                print(f"   → L'API Django ne répond pas correctement")
            else:
                print(f"\n✅ Données réelles reçues")
            
            return teachers
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
            return []
            
    except requests.exceptions.ConnectionError:
        print("❌ Serveur Next.js non accessible")
        print("💡 Démarrez Next.js: npm run dev")
        return []
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def test_django_pending_endpoint():
    """Tester directement l'endpoint Django"""
    print("\n🔍 Test direct de l'endpoint Django")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    endpoint = "/teachers/pending/"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=10)
        
        print(f"📊 Status Django: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📋 Django retourne: {count} professeurs")
            print(f"📋 Liste length: {len(teachers)}")
            
            return teachers
        else:
            print(f"❌ Erreur Django: {response.status_code}")
            return []
            
    except Exception as e:
        print(f"❌ Erreur Django: {e}")
        return []

def main():
    """Fonction principale"""
    print("🚀 Test des endpoints pour les professeurs en attente")
    print("=" * 80)
    
    # Test 1: Endpoint Next.js
    nextjs_teachers = test_nextjs_pending_endpoint()
    
    # Test 2: Endpoint Django direct
    django_teachers = test_django_pending_endpoint()
    
    print("\n" + "=" * 80)
    print("📋 Comparaison")
    print("=" * 80)
    
    if nextjs_teachers and django_teachers:
        print(f"✅ Next.js: {len(nextjs_teachers)} professeurs")
        print(f"✅ Django:  {len(django_teachers)} professeurs")
        
        if len(nextjs_teachers) != len(django_teachers):
            print(f"\n⚠️ Différence détectée:")
            print(f"   Next.js retourne {len(nextjs_teachers)} professeurs")
            print(f"   Django retourne {len(django_teachers)} professeurs")
            print(f"\n💡 Le problème vient de l'endpoint Next.js")
        else:
            print(f"\n✅ Les deux endpoints retournent le même nombre")
    else:
        print("❌ Impossible de comparer - un des endpoints ne fonctionne pas")

if __name__ == '__main__':
    main()






