#!/usr/bin/env python3
"""
Script simple pour tester l'API Django
"""

import urllib.request
import urllib.error
import json

def test_django_api():
    """Tester si l'API Django est accessible"""
    print("🔍 Test de l'API Django")
    print("=" * 40)
    
    # Test de l'endpoint principal
    try:
        response = urllib.request.urlopen('http://localhost:8000/api/teachers/')
        print(f"✅ API Django accessible (status: {response.getcode()})")
        
        # Lire la réponse
        data = response.read().decode('utf-8')
        try:
            json_data = json.loads(data)
            print(f"📋 Réponse JSON valide: {len(json_data.get('results', []))} professeurs")
        except json.JSONDecodeError:
            print("⚠️ Réponse non-JSON reçue")
            
    except urllib.error.URLError as e:
        print(f"❌ API Django non accessible: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False
    
    # Test de l'endpoint d'inscription
    try:
        # Créer une requête POST pour tester l'endpoint d'inscription
        data = {
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        req = urllib.request.Request(
            'http://localhost:8000/api/teachers/register/',
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        response = urllib.request.urlopen(req)
        print(f"✅ Endpoint d'inscription accessible (status: {response.getcode()})")
        
    except urllib.error.HTTPError as e:
        if e.code == 400:
            print(f"✅ Endpoint d'inscription accessible (erreur 400 attendue pour données de test)")
        else:
            print(f"⚠️ Endpoint d'inscription: status {e.code}")
    except urllib.error.URLError as e:
        print(f"❌ Endpoint d'inscription non accessible: {e}")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue sur l'endpoint d'inscription: {e}")
        return False
    
    return True

if __name__ == '__main__':
    print("🚀 Test de l'API Django")
    print("=" * 40)
    
    if test_django_api():
        print("\n✅ L'API Django fonctionne correctement!")
        print("\n💡 Vous pouvez maintenant:")
        print("1. Tester l'inscription des professeurs dans l'interface")
        print("2. Vérifier que les documents sont téléchargeables")
    else:
        print("\n❌ Problème avec l'API Django")
        print("\n💡 Vérifiez que:")
        print("1. Le serveur Django est démarré: python manage.py runserver")
        print("2. Le serveur écoute sur le port 8000")
        print("3. Aucun autre service n'utilise le port 8000")







