#!/usr/bin/env python3
"""
Script pour démarrer le serveur Django avec vérifications
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_django_setup():
    """Vérifier que Django est correctement configuré"""
    print("🔍 Vérification de la configuration Django")
    print("-" * 50)
    
    django_path = Path("django_backend")
    
    if not django_path.exists():
        print("❌ Dossier django_backend non trouvé")
        return False
    
    # Vérifier manage.py
    manage_py = django_path / "manage.py"
    if not manage_py.exists():
        print("❌ Fichier manage.py non trouvé")
        return False
    print("✅ manage.py trouvé")
    
    # Vérifier settings.py
    settings_py = django_path / "lahaacademia" / "settings.py"
    if not settings_py.exists():
        print("❌ Fichier settings.py non trouvé")
        return False
    print("✅ settings.py trouvé")
    
    # Vérifier la base de données
    db_file = django_path / "db.sqlite3"
    if not db_file.exists():
        print("⚠️ Base de données SQLite non trouvée")
        print("💡 Exécution des migrations...")
        try:
            subprocess.run([
                sys.executable, "manage.py", "migrate"
            ], cwd=django_path, check=True, capture_output=True)
            print("✅ Migrations exécutées")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur lors des migrations: {e}")
            return False
    else:
        print("✅ Base de données trouvée")
    
    return True

def start_django_server():
    """Démarrer le serveur Django"""
    print("\n🚀 Démarrage du serveur Django")
    print("-" * 50)
    
    django_path = Path("django_backend")
    
    try:
        # Changer vers le répertoire Django
        os.chdir(django_path)
        
        # Démarrer le serveur
        print("🔄 Démarrage du serveur sur http://localhost:8000...")
        subprocess.run([
            sys.executable, "manage.py", "runserver", "8000"
        ], check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors du démarrage du serveur: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⏹️ Serveur arrêté par l'utilisateur")
        return True
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("🚀 Démarrage du serveur Django pour LAHACADEMIA")
    print("=" * 60)
    
    # Vérifier la configuration
    if not check_django_setup():
        print("\n❌ Configuration Django incorrecte")
        print("💡 Vérifiez que vous êtes dans le bon répertoire")
        return
    
    # Démarrer le serveur
    start_django_server()

if __name__ == '__main__':
    main()







