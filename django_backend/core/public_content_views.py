from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from .models import EducationalContent
from .content_serializers import EducationalContentListSerializer

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def public_videos_list(request):
    """
    Endpoint public pour récupérer la liste des vidéos (sans authentification)
    """
    try:
        # Filtrer seulement les vidéos publiées
        videos = EducationalContent.objects.filter(
            content_type='video',
            status='published'
        ).order_by('-created_at')
        
        # Appliquer les filtres optionnels
        subject = request.GET.get('subject')
        class_level = request.GET.get('class_level')
        search = request.GET.get('search')
        
        if subject and subject != 'all':
            videos = videos.filter(subject=subject)
        
        if class_level and class_level != 'all':
            videos = videos.filter(class_level=class_level)
        
        if search:
            videos = videos.filter(
                title__icontains=search
            ) | videos.filter(
                description__icontains=search
            )
        
        # Pagination
        page_size = int(request.GET.get('page_size', 20))
        page = int(request.GET.get('page', 1))
        
        start = (page - 1) * page_size
        end = start + page_size
        
        videos_page = videos[start:end]
        
        # Sérialiser avec le contexte de la requête
        serializer = EducationalContentListSerializer(
            videos_page, 
            many=True, 
            context={'request': request}
        )
        
        return Response({
            'results': serializer.data,
            'count': videos.count(),
            'page': page,
            'page_size': page_size,
            'total_pages': (videos.count() + page_size - 1) // page_size
        })
        
    except Exception as e:
        print(f"❌ Erreur dans public_videos_list: {e}")
        return Response(
            {'error': 'Erreur lors de la récupération des vidéos'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

