#!/usr/bin/env python3
"""
Script pour créer un superutilisateur admin
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append('django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    """Créer un superutilisateur admin"""
    username = "admin"
    email = "admin@lahaacademia.com"
    password = "admin123"
    
    try:
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            print(f"✅ Utilisateur '{username}' existe déjà")
            
            # Mettre à jour les permissions
            user.is_staff = True
            user.is_superuser = True
            user.role = 'admin'
            user.set_password(password)
            user.save()
            
            print(f"✅ Permissions admin mises à jour pour '{username}'")
        else:
            # Créer un nouvel utilisateur
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role='admin'
            )
            print(f"✅ Superutilisateur '{username}' créé")
        
        print(f"👤 Nom d'utilisateur: {username}")
        print(f"🔑 Mot de passe: {password}")
        print(f"📧 Email: {email}")
        print(f"👑 Rôle: admin")
        print(f"🔐 Staff: {user.is_staff}")
        print(f"👑 Superuser: {user.is_superuser}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la création du superutilisateur: {e}")
        return False

def main():
    print("🔧 Création du superutilisateur admin...")
    
    if create_superuser():
        print("\n🎉 SUCCÈS !")
        print("="*50)
        print("📋 INFORMATIONS DE CONNEXION:")
        print("👤 Nom d'utilisateur: admin")
        print("🔑 Mot de passe: admin123")
        print("📧 Email: admin@lahaacademia.com")
        print("="*50)
        print("🚀 Vous pouvez maintenant tester la page de validation !")
        print("🔗 Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
    else:
        print("\n❌ ÉCHEC de la création du superutilisateur")

if __name__ == "__main__":
    main()







