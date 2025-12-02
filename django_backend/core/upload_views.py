from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import os
import uuid
from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """
    Endpoint pour l'upload de fichiers
    """
    try:
        if 'file' not in request.FILES:
            return Response(
                {'error': 'Aucun fichier fourni'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        file_type = request.data.get('type', 'content')
        
        # Validation de la taille
        max_sizes = {
            'content': 50 * 1024 * 1024,  # 50MB
            'thumbnail': 5 * 1024 * 1024,  # 5MB
            'video': 500 * 1024 * 1024,   # 500MB
        }
        
        if file.size > max_sizes.get(file_type, 50 * 1024 * 1024):
            return Response(
                {'error': f'Fichier trop volumineux. Taille max: {max_sizes[file_type] // (1024*1024)}MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Générer un nom de fichier unique
        file_extension = os.path.splitext(file.name)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Déterminer le dossier de destination
        upload_folders = {
            'content': 'educational_content/',
            'thumbnail': 'content_thumbnails/',
            'video': 'educational_content/videos/',
        }
        
        upload_folder = upload_folders.get(file_type, 'educational_content/')
        file_path = os.path.join(upload_folder, unique_filename)
        
        # Sauvegarder le fichier
        saved_path = default_storage.save(file_path, ContentFile(file.read()))
        
        # Construire l'URL du fichier
        file_url = request.build_absolute_uri(default_storage.url(saved_path))
        
        return Response({
            'success': True,
            'file_url': file_url,
            'file_name': file.name,
            'file_size': file.size,
            'file_type': file.content_type,
            'saved_path': saved_path,
            'message': 'Fichier uploadé avec succès'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de l\'upload: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

