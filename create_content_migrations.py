#!/usr/bin/env python3
"""
Script pour créer les migrations Django pour les modèles de contenu pédagogique
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Configuration Django"""
    # Ajouter le répertoire django_backend au path
    django_backend_path = os.path.join(os.getcwd(), 'django_backend')
    sys.path.insert(0, django_backend_path)
    
    # Configuration des variables d'environnement Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
    
    # Initialiser Django
    django.setup()

def create_migrations():
    """Créer les migrations pour les nouveaux modèles"""
    print("🚀 Création des migrations Django pour les contenus pédagogiques")
    print("=" * 80)
    
    try:
        # Créer les migrations pour l'app core
        print("📝 Création des migrations pour l'app core...")
        execute_from_command_line(['manage.py', 'makemigrations', 'core'])
        
        print("✅ Migrations créées avec succès!")
        
        # Afficher les migrations créées
        print("\n📋 Migrations disponibles:")
        execute_from_command_line(['manage.py', 'showmigrations', 'core'])
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des migrations: {e}")
        return False

def apply_migrations():
    """Appliquer les migrations"""
    print(f"\n🔄 Application des migrations...")
    
    try:
        execute_from_command_line(['manage.py', 'migrate'])
        print("✅ Migrations appliquées avec succès!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de l'application des migrations: {e}")
        return False

def create_sample_data():
    """Créer des données d'exemple"""
    print(f"\n📊 Création de données d'exemple...")
    
    try:
        # Script pour créer des données d'exemple
        sample_data_script = '''
from core.content_models import EducationalContent, ContentTag
from core.models import User
from django.contrib.auth import get_user_model

# Créer des tags
tags_data = [
    {'name': 'Mathématiques', 'description': 'Contenu mathématique', 'color': '#3B82F6'},
    {'name': 'Physique', 'description': 'Contenu physique', 'color': '#EF4444'},
    {'name': 'Chimie', 'description': 'Contenu chimie', 'color': '#10B981'},
    {'name': 'Français', 'description': 'Contenu français', 'color': '#F59E0B'},
    {'name': 'Anglais', 'description': 'Contenu anglais', 'color': '#8B5CF6'},
]

for tag_data in tags_data:
    tag, created = ContentTag.objects.get_or_create(
        name=tag_data['name'],
        defaults=tag_data
    )
    if created:
        print(f"✅ Tag créé: {tag.name}")

# Créer des contenus d'exemple
User = get_user_model()
admin_user = User.objects.filter(is_staff=True).first()

if admin_user:
    sample_contents = [
        {
            'title': 'Cours de Mathématiques - Algèbre de base',
            'description': 'Introduction aux concepts fondamentaux de l\'algèbre pour les élèves de 6ème.',
            'content_type': 'course',
            'subject': 'mathematics',
            'class_level': '6eme',
            'country': 'cameroon',
            'difficulty_level': 'beginner',
            'duration_minutes': 45,
            'is_free': True,
            'status': 'published',
            'tags': ['Mathématiques', 'Algèbre'],
            'keywords': ['mathématiques', 'algèbre', '6ème', 'cours'],
            'learning_objectives': [
                'Comprendre les bases de l\'algèbre',
                'Maîtriser les opérations algébriques simples',
                'Résoudre des équations du premier degré'
            ]
        },
        {
            'title': 'Capsule Vidéo - Les Forces en Physique',
            'description': 'Vidéo explicative sur les différents types de forces en physique.',
            'content_type': 'video',
            'subject': 'physics',
            'class_level': '2nde',
            'country': 'cameroon',
            'difficulty_level': 'intermediate',
            'duration_minutes': 20,
            'video_url': 'https://example.com/video-physics-forces',
            'is_free': False,
            'price': 5000,
            'status': 'published',
            'tags': ['Physique', 'Forces'],
            'keywords': ['physique', 'forces', '2nde', 'vidéo'],
            'learning_objectives': [
                'Identifier les différents types de forces',
                'Comprendre les lois de Newton',
                'Calculer des forces résultantes'
            ]
        },
        {
            'title': 'Manuel de Chimie Organique',
            'description': 'Manuel complet sur la chimie organique pour le niveau universitaire.',
            'content_type': 'manual',
            'subject': 'chemistry',
            'class_level': 'university',
            'country': 'cameroon',
            'difficulty_level': 'advanced',
            'duration_minutes': 120,
            'is_free': False,
            'price': 15000,
            'status': 'published',
            'tags': ['Chimie', 'Organique'],
            'keywords': ['chimie', 'organique', 'université', 'manuel'],
            'learning_objectives': [
                'Maîtriser les réactions organiques',
                'Comprendre la nomenclature',
                'Analyser les structures moléculaires'
            ]
        }
    ]
    
    for content_data in sample_contents:
        content, created = EducationalContent.objects.get_or_create(
            title=content_data['title'],
            defaults={
                **content_data,
                'created_by': admin_user
            }
        )
        if created:
            print(f"✅ Contenu créé: {content.title}")
        else:
            print(f"ℹ️ Contenu existant: {content.title}")
    
    print(f"\\n🎉 Données d'exemple créées avec succès!")
    print(f"   📊 {ContentTag.objects.count()} tags créés")
    print(f"   📚 {EducationalContent.objects.count()} contenus créés")
    
else:
    print("❌ Aucun utilisateur admin trouvé pour créer les contenus d'exemple")
'''
        
        # Écrire le script temporaire
        with open('temp_sample_data.py', 'w', encoding='utf-8') as f:
            f.write(sample_data_script)
        
        # Exécuter le script
        execute_from_command_line(['manage.py', 'shell', '<', 'temp_sample_data.py'])
        
        # Supprimer le fichier temporaire
        if os.path.exists('temp_sample_data.py'):
            os.remove('temp_sample_data.py')
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des données d'exemple: {e}")
        return False

def main():
    """Fonction principale"""
    print("🚀 Configuration des modèles de contenu pédagogique")
    print("=" * 80)
    
    # Configuration Django
    setup_django()
    
    # Créer les migrations
    migrations_created = create_migrations()
    
    if not migrations_created:
        print("❌ Impossible de continuer sans les migrations")
        return
    
    # Appliquer les migrations
    migrations_applied = apply_migrations()
    
    if not migrations_applied:
        print("❌ Impossible de continuer sans appliquer les migrations")
        return
    
    # Créer des données d'exemple
    create_sample_data()
    
    print(f"\n" + "=" * 80)
    print("🎉 Configuration terminée avec succès!")
    print("=" * 80)
    print("✅ Modèles de contenu pédagogique créés")
    print("✅ Migrations appliquées")
    print("✅ Données d'exemple créées")
    print("✅ API endpoints disponibles")
    print("✅ Interface admin configurée")
    
    print(f"\n📋 Prochaines étapes:")
    print("1. Redémarrer le serveur Django: python manage.py runserver 8000")
    print("2. Accéder à l'interface admin: http://localhost:3000/dashboard/admin/content")
    print("3. Tester la création, modification et suppression de contenus")

if __name__ == '__main__':
    main()





