#!/usr/bin/env python3
"""
Script pour corriger les durées des vidéos dans la base de données
en détectant la durée réelle des fichiers vidéo.
"""

import os
import sys
import django
from pathlib import Path

# Ajouter le chemin Django
sys.path.append(str(Path(__file__).parent / 'django_backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lahaacademia.settings')
django.setup()

from core.models import EducationalContent
import subprocess
import json

def get_video_duration(file_path):
    """Détecte la durée d'un fichier vidéo avec ffprobe"""
    try:
        cmd = [
            'ffprobe',
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_format',
            file_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            data = json.loads(result.stdout)
            duration = float(data['format']['duration'])
            return int(duration / 60)  # Convertir en minutes
        else:
            print(f"❌ Erreur ffprobe pour {file_path}: {result.stderr}")
            return None
            
    except subprocess.TimeoutExpired:
        print(f"⏰ Timeout pour {file_path}")
        return None
    except Exception as e:
        print(f"❌ Erreur pour {file_path}: {e}")
        return None

def fix_video_durations():
    """Corrige les durées de toutes les vidéos"""
    videos = EducationalContent.objects.filter(content_type='video')
    
    print(f"🎬 Correction des durées pour {videos.count()} vidéos...")
    
    for video in videos:
        if not video.video_url:
            print(f"⚠️ Pas d'URL vidéo pour: {video.title}")
            continue
            
        # Extraire le chemin du fichier
        if 'media/' in video.video_url:
            file_path = video.video_url.split('media/')[1]
            full_path = os.path.join('django_backend', 'media', file_path)
            
            if os.path.exists(full_path):
                print(f"🔍 Analyse de: {video.title}")
                print(f"   Fichier: {full_path}")
                print(f"   Durée actuelle: {video.duration_minutes}min")
                
                # Détecter la durée réelle
                real_duration = get_video_duration(full_path)
                
                if real_duration is not None:
                    print(f"   Durée réelle: {real_duration}min")
                    
                    if real_duration != video.duration_minutes:
                        video.duration_minutes = real_duration
                        video.save()
                        print(f"   ✅ Durée corrigée!")
                    else:
                        print(f"   ✅ Durée déjà correcte")
                else:
                    print(f"   ❌ Impossible de détecter la durée")
            else:
                print(f"❌ Fichier non trouvé: {full_path}")
        else:
            print(f"⚠️ URL vidéo invalide pour: {video.title}")
        
        print()

if __name__ == '__main__':
    print("🚀 Début de la correction des durées vidéo...")
    fix_video_durations()
    print("✅ Correction terminée!")
