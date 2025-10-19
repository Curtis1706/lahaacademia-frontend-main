"""
Vues d'authentification personnalisées pour l'API REST
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import User as CustomUser


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Vue de connexion pour l'API REST
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Nom d\'utilisateur et mot de passe requis'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Authentifier l'utilisateur
    user = authenticate(username=username, password=password)
    
    if user is not None:
        # Créer ou récupérer le token
        token, created = Token.objects.get_or_create(user=user)
        
        # Récupérer le profil utilisateur personnalisé
        # Le User est déjà le modèle personnalisé, pas besoin de user_ptr
        user_data = {
            'id': str(user.id),  # UUIDField converti en string
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'is_active': user.is_active,
            'date_joined': user.date_joined.isoformat(),
        }
        
        return Response({
            'token': token.key,
            'user': user_data,
            'message': 'Connexion réussie'
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Identifiants invalides'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_view(request):
    """
    Vue de déconnexion pour l'API REST
    """
    try:
        # Supprimer le token
        request.user.auth_token.delete()
        return Response(
            {'message': 'Déconnexion réussie'}, 
            status=status.HTTP_200_OK
        )
    except:
        return Response(
            {'error': 'Erreur lors de la déconnexion'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def me_view(request):
    """
    Vue pour récupérer les informations de l'utilisateur connecté
    """
    # Le request.user est déjà le modèle User personnalisé
    user_data = {
        'id': str(request.user.id),  # UUIDField converti en string
        'username': request.user.username,
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'role': request.user.role,
        'is_active': request.user.is_active,
        'date_joined': request.user.date_joined.isoformat(),
    }
    
    return Response(user_data, status=status.HTTP_200_OK)

