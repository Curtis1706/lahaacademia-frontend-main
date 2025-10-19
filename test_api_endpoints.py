#!/usr/bin/env python3
"""
Script pour tester les endpoints API corrigés
"""

import requests
import json

def test_api_endpoints():
    """Tester les endpoints API principaux"""
    print("🔍 Test des endpoints API corrigés")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api"
    
    # Endpoints à tester
    endpoints = [
        "/teachers/available-for-booking/",
        "/courses/courses-with-teachers/",
        "/teachers/pending/",
        "/courses/",
    ]
    
    for endpoint in endpoints:
        print(f"\n📋 Test de: {endpoint}")
        url = base_url + endpoint
        
        try:
            response = requests.get(url, timeout=10)
            print(f"📊 Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ Endpoint accessible")
                try:
                    data = response.json()
                    if isinstance(data, list):
                        print(f"📥 Nombre d'éléments: {len(data)}")
                    elif isinstance(data, dict):
                        keys = list(data.keys())
                        print(f"📥 Clés disponibles: {keys}")
                except:
                    print("📥 Réponse non-JSON")
            elif response.status_code == 401:
                print("⚠️ Authentification requise (normal)")
            elif response.status_code == 404:
                print("❌ Endpoint non trouvé")
            else:
                print(f"⚠️ Status inattendu: {response.status_code}")
                
        except requests.exceptions.ConnectionError:
            print("❌ Serveur Django non accessible")
            break
        except Exception as e:
            print(f"❌ Erreur: {e}")

def test_with_admin_token():
    """Tester avec le token admin"""
    print("\n🔍 Test avec token admin")
    print("-" * 50)
    
    base_url = "http://localhost:8000/api"
    admin_token = "cee5456080015db2299344035fecdb5936469663"
    
    headers = {
        'Authorization': f'Token {admin_token}',
        'Content-Type': 'application/json'
    }
    
    # Test endpoint qui nécessite une authentification
    endpoint = "/teachers/pending/"
    url = base_url + endpoint
    
    try:
        print(f"📋 Test de: {endpoint} avec token admin")
        response = requests.get(url, headers=headers, timeout=10)
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Endpoint accessible avec token admin")
            try:
                data = response.json()
                print(f"📥 Données reçues: {json.dumps(data, indent=2)}")
            except:
                print("📥 Réponse non-JSON")
        else:
            print(f"⚠️ Status: {response.status_code}")
            try:
                error_data = response.json()
                print(f"📥 Erreur: {json.dumps(error_data, indent=2)}")
            except:
                print(f"📥 Réponse: {response.text}")
                
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test des endpoints API après correction")
    print("=" * 80)
    
    # Test 1: Endpoints sans authentification
    test_api_endpoints()
    
    # Test 2: Endpoints avec authentification admin
    test_with_admin_token()
    
    print("\n" + "=" * 80)
    print("📋 Résumé")
    print("=" * 80)
    print("✅ Si tous les endpoints retournent 200 ou 401:")
    print("   → Les endpoints Django sont correctement configurés")
    print("✅ Si vous voyez encore des 404:")
    print("   → Vérifiez que Django est démarré et accessible")
    print("✅ Pour appliquer les changements:")
    print("   → Redémarrez Next.js: npm run dev")

if __name__ == '__main__':
    main()




