#!/usr/bin/env python3
"""
Script rapide pour corriger l'authentification admin
"""

import os
import sys

# Ajouter le chemin du projet Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'django_backend'))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')

try:
    import django
    django.setup()
    
    from django.contrib.auth import get_user_model
    from rest_framework.authtoken.models import Token
    
    User = get_user_model()
    
    print("🔧 Correction rapide de l'authentification admin...")
    
    # Chercher tous les utilisateurs
    all_users = User.objects.all()
    print(f"📋 {all_users.count()} utilisateurs trouvés dans la base de données")
    
    # Chercher les comptes admin potentiels
    admin_users = []
    for user in all_users:
        if (user.is_staff or user.is_superuser or 
            (hasattr(user, 'role') and user.role == 'admin')):
            admin_users.append(user)
            print(f"   - {user.username} ({user.email}) - Staff: {user.is_staff}, Super: {user.is_superuser}")
    
    if admin_users:
        # Prendre le premier utilisateur admin et le corriger
        admin_user = admin_users[0]
        print(f"\n🔧 Correction du compte: {admin_user.username}")
        
        # Mettre à jour les permissions
        admin_user.is_staff = True
        admin_user.is_superuser = True
        if hasattr(admin_user, 'role'):
            admin_user.role = 'admin'
        admin_user.set_password('admin123')
        admin_user.save()
        
        # Créer le token
        token, created = Token.objects.get_or_create(user=admin_user)
        
        print(f"✅ Compte admin corrigé!")
        print(f"👤 Nom d'utilisateur: {admin_user.username}")
        print(f"🔑 Mot de passe: admin123")
        print(f"🔑 Token API: {token.key}")
        
        print("\n🎉 SUCCÈS !")
        print("="*50)
        print("📋 INFORMATIONS DE CONNEXION:")
        print(f"👤 Nom d'utilisateur: {admin_user.username}")
        print("🔑 Mot de passe: admin123")
        print("="*50)
        print("🚀 La page de validation est maintenant opérationnelle !")
        
    else:
        print("❌ Aucun compte admin trouvé")
        
except Exception as e:
    print(f"❌ Erreur: {e}")
    print("\n🔧 Solution alternative:")
    print("1. Allez dans django_backend/")
    print("2. Exécutez: python manage.py createsuperuser")
    print("3. Utilisez les identifiants: admin / admin123")







