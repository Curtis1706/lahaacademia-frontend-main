from django.utils.deprecation import MiddlewareMixin
from .models import ActivityLog

class ActivityLogMiddleware(MiddlewareMixin):
    """Middleware pour logger automatiquement les actions"""
    
    def process_request(self, request):
        """Logger les actions importantes"""
        if (request.user.is_authenticated and 
            request.method in ['POST', 'PUT', 'PATCH', 'DELETE']):
            self.log_activity(request)
    
    def log_activity(self, request):
        """Créer un log d'activité"""
        try:
            # Éviter de logger les requêtes de logging elles-mêmes
            if '/activity-logs/' in request.path:
                return
                
            ActivityLog.objects.create(
                user=request.user,
                action=f"{request.method} {request.path}",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                details={
                    'method': request.method,
                    'path': request.path,
                    'query_params': dict(request.GET),
                    'content_type': request.content_type,
                }
            )
        except Exception as e:
            # Ne pas bloquer la requête si le logging échoue
            print(f"Erreur lors du logging: {e}")
    
    @staticmethod
    def get_client_ip(request):
        """Récupérer l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

