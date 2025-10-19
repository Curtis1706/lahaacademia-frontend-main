#!/usr/bin/env python3
"""
Script pour vérifier la configuration de l'inscription des professeurs
"""

import os
from pathlib import Path

def check_env_file():
    """Vérifier si le fichier .env.local existe"""
    print("🔍 Vérification du fichier .env.local")
    print("-" * 50)
    
    env_file = Path(".env.local")
    
    if env_file.exists():
        print("✅ Fichier .env.local trouvé")
        
        # Lire le contenu
        try:
            content = env_file.read_text()
            print(f"📋 Contenu:")
            print(content)
            
            # Vérifier la variable NEXT_PUBLIC_API_URL
            if "NEXT_PUBLIC_API_URL=http://localhost:8000" in content:
                print("✅ Variable NEXT_PUBLIC_API_URL correctement configurée")
                return True
            else:
                print("❌ Variable NEXT_PUBLIC_API_URL manquante ou incorrecte")
                return False
                
        except Exception as e:
            print(f"❌ Erreur lors de la lecture du fichier: {e}")
            return False
    else:
        print("❌ Fichier .env.local non trouvé")
        print("💡 Ce fichier est nécessaire pour configurer l'URL de l'API Django")
        return False

def check_django_server():
    """Vérifier si le serveur Django est accessible"""
    print("\n🔍 Vérification du serveur Django")
    print("-" * 50)
    
    try:
        import urllib.request
        response = urllib.request.urlopen('http://localhost:8000/api/teachers/register/', timeout=5)
        print(f"✅ Serveur Django accessible (status: {response.getcode()})")
        return True
    except Exception as e:
        print(f"❌ Serveur Django non accessible: {e}")
        print("💡 Démarrez le serveur: cd django_backend && python manage.py runserver 8000")
        return False

def check_nextjs_config():
    """Vérifier la configuration Next.js"""
    print("\n🔍 Vérification de la configuration Next.js")
    print("-" * 50)
    
    # Vérifier package.json
    package_json = Path("package.json")
    if package_json.exists():
        print("✅ package.json trouvé")
    else:
        print("❌ package.json non trouvé")
        return False
    
    # Vérifier next.config.mjs
    next_config = Path("next.config.mjs")
    if next_config.exists():
        print("✅ next.config.mjs trouvé")
    else:
        print("❌ next.config.mjs non trouvé")
        return False
    
    return True

def check_api_routes():
    """Vérifier les routes API Next.js"""
    print("\n🔍 Vérification des routes API Next.js")
    print("-" * 50)
    
    api_routes = [
        "app/api/teachers/register/route.ts",
        "app/api/teachers/pending/route.ts"
    ]
    
    all_exist = True
    for route in api_routes:
        route_path = Path(route)
        if route_path.exists():
            print(f"✅ {route}")
        else:
            print(f"❌ {route} manquant")
            all_exist = False
    
    return all_exist

def main():
    """Fonction principale"""
    print("🚀 Vérification de la configuration de l'inscription des professeurs")
    print("=" * 80)
    
    # Vérifications
    env_ok = check_env_file()
    django_ok = check_django_server()
    nextjs_ok = check_nextjs_config()
    routes_ok = check_api_routes()
    
    print("\n" + "=" * 80)
    print("📋 Résumé de la vérification")
    print("=" * 80)
    
    if env_ok:
        print("✅ Configuration .env.local: OK")
    else:
        print("❌ Configuration .env.local: Problèmes détectés")
    
    if django_ok:
        print("✅ Serveur Django: OK")
    else:
        print("❌ Serveur Django: Problèmes détectés")
    
    if nextjs_ok:
        print("✅ Configuration Next.js: OK")
    else:
        print("❌ Configuration Next.js: Problèmes détectés")
    
    if routes_ok:
        print("✅ Routes API: OK")
    else:
        print("❌ Routes API: Problèmes détectés")
    
    # Résultat final
    if env_ok and django_ok and nextjs_ok and routes_ok:
        print("\n🎉 Toutes les configurations sont correctes !")
        print("\n💡 Vous pouvez maintenant tester l'inscription des professeurs:")
        print("1. Allez sur http://localhost:3000")
        print("2. Naviguez vers la page d'inscription des professeurs")
        print("3. Remplissez le formulaire et soumettez")
    else:
        print("\n⚠️ Des problèmes ont été détectés.")
        print("\n🔧 Actions requises:")
        
        if not env_ok:
            print("1. Créez le fichier .env.local avec le contenu:")
            print("   NEXT_PUBLIC_API_URL=http://localhost:8000")
        
        if not django_ok:
            print("2. Démarrez le serveur Django:")
            print("   cd django_backend && python manage.py runserver 8000")
        
        if not nextjs_ok:
            print("3. Vérifiez la configuration Next.js")
        
        if not routes_ok:
            print("4. Vérifiez que les routes API existent")
        
        print("\n📚 Consultez: SOLUTION_ERREUR_404_INSCRIPTION.md")

if __name__ == '__main__':
    main()





