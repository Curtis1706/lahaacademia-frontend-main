from django.http import HttpResponse, Http404, FileResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import never_cache
from django.conf import settings
import os
import mimetypes

@require_http_methods(["GET", "HEAD"])
@never_cache
def serve_video(request, video_path):
    """
    Serveur de vidéos optimisé pour le streaming
    """
    try:
        # Construire le chemin complet du fichier
        full_path = os.path.join(settings.MEDIA_ROOT, video_path)
        
        # Vérifier que le fichier existe
        if not os.path.exists(full_path):
            raise Http404("Fichier vidéo non trouvé")
        
        # Déterminer le type MIME
        content_type, _ = mimetypes.guess_type(full_path)
        if not content_type:
            content_type = 'video/mp4'  # Par défaut
        
        # Obtenir la taille du fichier
        file_size = os.path.getsize(full_path)
        
        # Gérer les requêtes Range pour le streaming
        range_header = request.META.get('HTTP_RANGE')
        
        if range_header:
            # Extraire la plage demandée
            range_match = range_header.replace('bytes=', '').split('-')
            start = int(range_match[0]) if range_match[0] else 0
            end = int(range_match[1]) if range_match[1] else file_size - 1
            
            # Lire le chunk demandé
            with open(full_path, 'rb') as f:
                f.seek(start)
                chunk_size = end - start + 1
                data = f.read(chunk_size)
            
            # Réponse partielle
            response = HttpResponse(
                data,
                status=206,
                content_type=content_type
            )
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Content-Length'] = str(chunk_size)
            response['Accept-Ranges'] = 'bytes'
            
        else:
            # Réponse complète
            response = FileResponse(
                open(full_path, 'rb'),
                content_type=content_type
            )
            response['Content-Length'] = str(file_size)
            response['Accept-Ranges'] = 'bytes'
        
        # Headers pour le streaming
        response['Cache-Control'] = 'public, max-age=3600'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Range, Content-Range'
        
        return response
        
    except Exception as e:
        print(f"Erreur lors du service de la vidéo {video_path}: {e}")
        raise Http404("Erreur lors du chargement de la vidéo")

