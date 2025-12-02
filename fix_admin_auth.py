#!/usr/bin/env python3
"""
Script pour corriger l'authentification admin
"""

import os
import sys
import django

# Ajouter le chemin du projet Django
sys.path.append('django_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
import requests

User = get_user_model()

def find_and_fix_admin():
    """Trouver et corriger le compte admin"""
    print("🔍 Recherche du compte admin...")
    
    # Chercher tous les utilisateurs avec des permissions admin
    admin_candidates = []
    
    # Par rôle admin
    admin_by_role = User.objects.filter(role='admin')
    for user in admin_by_role:
        admin_candidates.append(user)
    
    # Par is_staff
    staff_users = User.objects.filter(is_staff=True)
    for user in staff_users:
        if user not in admin_candidates:
            admin_candidates.append(user)
    
    # Par is_superuser
    super_users = User.objects.filter(is_superuser=True)
    for user in super_users:
        if user not in admin_candidates:
            admin_candidates.append(user)
    
    print(f"📋 {len(admin_candidates)} comptes admin trouvés:")
    for i, user in enumerate(admin_candidates):
        print(f"   {i+1}. {user.username} ({user.email}) - Rôle: {user.role}, Staff: {user.is_staff}, Super: {user.is_superuser}")
    
    if not admin_candidates:
        print("❌ Aucun compte admin trouvé")
        return None, None
    
    # Prendre le premier candidat et le corriger
    admin_user = admin_candidates[0]
    print(f"\n🔧 Correction du compte: {admin_user.username}")
    
    try:
        # Mettre à jour les permissions et le mot de passe
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.role = 'admin'
        admin_user.set_password('admin123')
        admin_user.save()
        
        print(f"✅ Compte admin corrigé: {admin_user.username}")
        print(f"🔑 Mot de passe: admin123")
        
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=admin_user)
        print(f"🔑 Token API: {token.key}")
        
        return token.key, admin_user.username
        
    except Exception as e:
        print(f"❌ Erreur lors de la correction: {e}")
        return None, None

def test_authentication(username, token):
    """Tester l'authentification"""
    base_url = "http://localhost:8000/api"
    
    print(f"\n🧪 Test d'authentification avec '{username}'...")
    
    # Test login
    try:
        response = requests.post(f"{base_url}/auth/login/", 
                               json={"username": username, "password": "admin123"})
        if response.status_code == 200:
            print("✅ Login API fonctionne")
            data = response.json()
            print(f"📋 Réponse: {data}")
            return True
        else:
            print(f"❌ Login API: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur login: {e}")
        return False

def test_teachers_api(token):
    """Tester l'API des professeurs"""
    base_url = "http://localhost:8000/api"
    headers = {"Authorization": f"Token {token}"}
    
    print(f"\n🧪 Test de l'API des professeurs...")
    
    try:
        response = requests.get(f"{base_url}/teachers/pending/", headers=headers)
        if response.status_code == 200:
            print("✅ API des professeurs fonctionne")
            data = response.json()
            teachers = data.get('teachers', [])
            print(f"📋 {len(teachers)} professeurs en attente de validation")
            
            for teacher in teachers[:3]:  # Afficher les 3 premiers
                user_info = teacher.get('user', {})
                print(f"   - {user_info.get('first_name', '')} {user_info.get('last_name', '')} ({user_info.get('email', '')})")
            
            return True
        else:
            print(f"❌ API des professeurs: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur API professeurs: {e}")
        return False

def main():
    print("🔧 Correction de l'authentification admin...")
    print("="*50)
    
    # 1. Trouver et corriger le compte admin
    token, username = find_and_fix_admin()
    
    if not token:
        print("\n❌ Impossible de corriger le compte admin")
        return
    
    # 2. Tester l'authentification
    auth_success = test_authentication(username, token)
    
    if auth_success:
        # 3. Tester l'API des professeurs
        api_success = test_teachers_api(token)
        
        if api_success:
            print("\n🎉 SUCCÈS COMPLET !")
            print("="*50)
            print("✅ L'authentification admin fonctionne")
            print("✅ L'API des professeurs fonctionne")
            print("✅ La page de validation est maintenant opérationnelle")
            print("\n📋 INFORMATIONS DE CONNEXION:")
            print(f"👤 Nom d'utilisateur: {username}")
            print("🔑 Mot de passe: admin123")
            print(f"🔑 Token API: {token}")
            print("\n🚀 Vous pouvez maintenant utiliser la page de validation avec de vraies données !")
            print("🔗 Allez sur: http://localhost:3000/dashboard/admin/teachers/validation")
        else:
            print("\n⚠️  Authentification OK mais problème avec l'API des professeurs")
    else:
        print("\n⚠️  Problème avec l'authentification")

if __name__ == "__main__":
    main()









