#!/usr/bin/env python3
"""
Script pour tester l'URL construite par l'endpoint Next.js
"""

import requests
import json

def test_endpoint_url():
    """Tester l'URL construite par Next.js"""
    print("🔍 Test de l'URL construite par Next.js")
    print("=" * 60)
    
    # Simuler la construction d'URL de Next.js
    base_api = "http://localhost:8000/api"  # NEXT_PUBLIC_API_URL
    endpoint = f"{base_api}/teachers/pending/"
    
    print(f"📋 URL construite: {endpoint}")
    
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=10)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            teachers = data.get('teachers', [])
            
            print(f"📋 Nombre de professeurs: {count}")
            print(f"📋 Liste length: {len(teachers)}")
            
            # Chercher Fifamè
            fifa_teacher = None
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == 'fifa@gmail.com':
                    fifa_teacher = teacher
                    break
            
            if fifa_teacher:
                print(f"\n✅ Fifamè trouvé:")
                user = fifa_teacher.get('user', {})
                print(f"   Nom: {user.get('first_name')} {user.get('last_name')}")
                print(f"   Email: {user.get('email')}")
                print(f"   Validé: {fifa_teacher.get('is_validated')}")
                print(f"   Actif: {user.get('is_active')}")
            else:
                print(f"\n❌ Fifamè non trouvé dans la liste")
                
            # Afficher tous les emails pour debug
            emails = [teacher.get('user', {}).get('email', '') for teacher in teachers]
            print(f"\n📋 Tous les emails: {sorted(emails)}")
            
        else:
            print(f"❌ Erreur: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
                
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_nextjs_endpoint():
    """Tester l'endpoint Next.js directement"""
    print("\n🔍 Test de l'endpoint Next.js")
    print("-" * 50)
    
    try:
        response = requests.get('http://localhost:3000/api/teachers/pending', timeout=10)
        print(f"📊 Status Next.js: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            teachers = data.get('teachers', [])
            
            print(f"📋 Nombre de professeurs Next.js: {len(teachers)}")
            
            # Chercher Fifamè dans Next.js
            fifa_found = False
            for teacher in teachers:
                user = teacher.get('user', {})
                if user.get('email') == 'fifa@gmail.com':
                    fifa_found = True
                    print(f"✅ Fifamè trouvé dans Next.js")
                    break
            
            if not fifa_found:
                print(f"❌ Fifamè non trouvé dans Next.js")
                
            # Afficher tous les emails
            emails = [teacher.get('user', {}).get('email', '') for teacher in teachers]
            print(f"📋 Emails Next.js: {sorted(emails)}")
            
        else:
            print(f"❌ Erreur Next.js: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur Next.js: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test de l'URL et de l'endpoint")
    print("=" * 80)
    
    # Test 1: URL construite par Next.js
    test_endpoint_url()
    
    # Test 2: Endpoint Next.js
    test_nextjs_endpoint()
    
    print("\n" + "=" * 80)
    print("📋 Conclusion")
    print("=" * 80)
    print("✅ Si Fifamè est trouvé dans le test 1 mais pas dans le test 2:")
    print("   → Le problème vient de l'endpoint Next.js")
    print("✅ Si Fifamè n'est trouvé ni dans le test 1 ni dans le test 2:")
    print("   → Le problème vient de Django ou des données")

if __name__ == '__main__':
    main()




