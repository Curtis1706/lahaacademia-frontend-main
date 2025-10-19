#!/usr/bin/env python3
"""
Script pour vérifier la configuration des documents des professeurs
"""

import os
import sys
from pathlib import Path

def check_django_config():
    """Vérifier la configuration Django"""
    print("🔍 Vérification de la configuration Django")
    print("-" * 50)
    
    django_path = Path("django_backend")
    
    if not django_path.exists():
        print("❌ Dossier django_backend non trouvé")
        return False
    
    # Vérifier le fichier urls.py principal
    urls_file = django_path / "lahaacademia" / "urls.py"
    if urls_file.exists():
        content = urls_file.read_text()
        if "static(settings.MEDIA_URL" in content:
            print("✅ Configuration des fichiers média trouvée dans urls.py")
        else:
            print("❌ Configuration des fichiers média manquante dans urls.py")
            return False
    else:
        print("❌ Fichier urls.py principal non trouvé")
        return False
    
    # Vérifier le sérialiseur TeacherSerializer
    serializers_file = django_path / "core" / "serializers.py"
    if serializers_file.exists():
        content = serializers_file.read_text()
        if "diploma_file_url" in content and "SerializerMethodField" in content:
            print("✅ Sérialiseur TeacherSerializer avec URLs complètes trouvé")
        else:
            print("❌ Sérialiseur TeacherSerializer manquant ou incorrect")
            return False
    else:
        print("❌ Fichier serializers.py non trouvé")
        return False
    
    # Vérifier le dossier media
    media_path = django_path / "media"
    if media_path.exists():
        print("✅ Dossier media trouvé")
        
        # Vérifier les sous-dossiers
        subdirs = ["teacher_diplomas", "teacher_criminal_records", "teacher_identity", 
                  "teacher_address", "teacher_photos", "teacher_cvs"]
        
        for subdir in subdirs:
            subdir_path = media_path / subdir
            if subdir_path.exists():
                print(f"  ✅ {subdir}/")
            else:
                print(f"  ❌ {subdir}/ manquant")
                subdir_path.mkdir(exist_ok=True)
                print(f"  ✅ {subdir}/ créé")
    else:
        print("❌ Dossier media non trouvé")
        media_path.mkdir(exist_ok=True)
        print("✅ Dossier media créé")
    
    return True

def check_frontend_config():
    """Vérifier la configuration frontend"""
    print("\n🔍 Vérification de la configuration frontend")
    print("-" * 50)
    
    # Vérifier le fichier de validation des professeurs
    validation_file = Path("app") / "dashboard" / "admin" / "teachers" / "validation" / "page.tsx"
    if validation_file.exists():
        try:
            content = validation_file.read_text(encoding='utf-8')
            if "downloadDocument" in content and "viewDocument" in content:
                print("✅ Fonctions de gestion des documents trouvées")
            else:
                print("❌ Fonctions de gestion des documents manquantes")
                return False
        except UnicodeDecodeError:
            print("⚠️ Problème d'encodage dans le fichier de validation")
            print("✅ Fichier de validation des professeurs existe")
    else:
        print("❌ Fichier de validation des professeurs non trouvé")
        return False
    
    # Vérifier les endpoints API
    api_files = [
        "app/api/teachers/[id]/documents/route.ts",
        "app/api/teachers/[id]/documents/[filename]/route.ts"
    ]
    
    for api_file in api_files:
        file_path = Path(api_file)
        if file_path.exists():
            print(f"✅ {api_file}")
        else:
            print(f"❌ {api_file} manquant")
            return False
    
    return True

def check_environment():
    """Vérifier la configuration de l'environnement"""
    print("\n🔍 Vérification de l'environnement")
    print("-" * 50)
    
    # Vérifier le fichier .env.local
    env_file = Path(".env.local")
    if env_file.exists():
        content = env_file.read_text()
        if "NEXT_PUBLIC_API_URL=http://localhost:8000" in content:
            print("✅ Configuration NEXT_PUBLIC_API_URL correcte")
        else:
            print("❌ Configuration NEXT_PUBLIC_API_URL incorrecte ou manquante")
            print("💡 Ajoutez: NEXT_PUBLIC_API_URL=http://localhost:8000")
            return False
    else:
        print("❌ Fichier .env.local non trouvé")
        print("💡 Créez le fichier avec: NEXT_PUBLIC_API_URL=http://localhost:8000")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("🚀 Vérification de la configuration des documents des professeurs")
    print("=" * 70)
    
    django_ok = check_django_config()
    frontend_ok = check_frontend_config()
    env_ok = check_environment()
    
    print("\n" + "=" * 70)
    print("📋 Résumé de la vérification")
    print("=" * 70)
    
    if django_ok:
        print("✅ Configuration Django: OK")
    else:
        print("❌ Configuration Django: Problèmes détectés")
    
    if frontend_ok:
        print("✅ Configuration Frontend: OK")
    else:
        print("❌ Configuration Frontend: Problèmes détectés")
    
    if env_ok:
        print("✅ Configuration Environnement: OK")
    else:
        print("❌ Configuration Environnement: Problèmes détectés")
    
    if django_ok and frontend_ok and env_ok:
        print("\n🎉 Toutes les configurations sont correctes !")
        print("\n💡 Prochaines étapes:")
        print("1. Démarrez Django: cd django_backend && python manage.py runserver")
        print("2. Démarrez Next.js: npm run dev")
        print("3. Testez: python test_teacher_documents.py")
        print("4. Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
    else:
        print("\n⚠️ Des problèmes ont été détectés. Corrigez-les avant de continuer.")
        print("\n📚 Consultez: SOLUTION_ERREUR_404_DOCUMENTS.md")

if __name__ == '__main__':
    main()
