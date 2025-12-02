#!/usr/bin/env python3
"""
Script pour tester l'endpoint d'inscription des professeurs
"""

import urllib.request
import urllib.error
import urllib.parse
import json

def test_teacher_registration_endpoint():
    """Tester l'endpoint d'inscription des professeurs"""
    print("🔍 Test de l'endpoint d'inscription des professeurs")
    print("=" * 60)
    
    # Données de test pour l'inscription
    test_data = {
        'email': 'test_teacher@example.com',
        'password': 'testpassword123',
        'first_name': 'Test',
        'last_name': 'Teacher',
        'subjects': '["mathematics", "physics"]',
        'experience_years': 3,
        'hourly_rate': 25000,
        'bio': 'Professeur de test'
    }
    
    # Convertir en JSON
    json_data = json.dumps(test_data).encode('utf-8')
    
    try:
        # Créer la requête
        req = urllib.request.Request(
            'http://localhost:8000/api/teachers/register/',
            data=json_data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        print(f"📤 Envoi de la requête vers: http://localhost:8000/api/teachers/register/")
        print(f"📋 Données: {json.dumps(test_data, indent=2)}")
        
        # Envoyer la requête
        response = urllib.request.urlopen(req)
        
        print(f"✅ Succès! Status: {response.getcode()}")
        
        # Lire la réponse
        response_data = response.read().decode('utf-8')
        try:
            json_response = json.loads(response_data)
            print(f"📥 Réponse: {json.dumps(json_response, indent=2)}")
        except json.JSONDecodeError:
            print(f"📥 Réponse (non-JSON): {response_data}")
            
    except urllib.error.HTTPError as e:
        print(f"❌ Erreur HTTP: {e.code}")
        error_data = e.read().decode('utf-8')
        try:
            error_json = json.loads(error_data)
            print(f"📥 Erreur: {json.dumps(error_json, indent=2)}")
        except json.JSONDecodeError:
            print(f"📥 Erreur (non-JSON): {error_data}")
            
    except urllib.error.URLError as e:
        print(f"❌ Erreur URL: {e}")
        print("💡 Vérifiez que le serveur Django est démarré sur le port 8000")
        
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")

def test_endpoint_accessibility():
    """Tester l'accessibilité de l'endpoint"""
    print("\n🔍 Test d'accessibilité de l'endpoint")
    print("=" * 60)
    
    try:
        # Test GET (devrait retourner une erreur 405 Method Not Allowed)
        req = urllib.request.Request('http://localhost:8000/api/teachers/register/')
        response = urllib.request.urlopen(req)
        print(f"⚠️ GET autorisé (inattendu): {response.getcode()}")
        
    except urllib.error.HTTPError as e:
        if e.code == 405:
            print(f"✅ GET non autorisé (attendu): {e.code}")
        else:
            print(f"❌ Erreur GET inattendue: {e.code}")
            
    except urllib.error.URLError as e:
        print(f"❌ Endpoint non accessible: {e}")
        print("💡 Vérifiez que le serveur Django est démarré")
        
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")

def test_django_server_status():
    """Tester le statut du serveur Django"""
    print("\n🔍 Test du statut du serveur Django")
    print("=" * 60)
    
    try:
        # Test de l'endpoint racine
        response = urllib.request.urlopen('http://localhost:8000/')
        print(f"✅ Serveur Django accessible: {response.getcode()}")
        
    except urllib.error.URLError as e:
        print(f"❌ Serveur Django non accessible: {e}")
        print("💡 Démarrez le serveur: cd django_backend && python manage.py runserver")
        
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test de l'endpoint d'inscription des professeurs")
    print("=" * 80)
    
    # 1. Tester le statut du serveur
    test_django_server_status()
    
    # 2. Tester l'accessibilité de l'endpoint
    test_endpoint_accessibility()
    
    # 3. Tester l'inscription
    test_teacher_registration_endpoint()
    
    print("\n" + "=" * 80)
    print("✅ Tests terminés!")

if __name__ == '__main__':
    main()







