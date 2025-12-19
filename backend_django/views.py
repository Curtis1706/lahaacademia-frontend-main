"""
Views Django REST Framework pour les nouvelles fonctionnalités
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q, Count, Avg, Sum, F
from django.utils import timezone
from django.db import transaction
from datetime import timedelta
import hashlib

from .models import (
    IncidentReport, CommissionRate, TeacherEarning, TeacherPayment,
    TeacherWarning, FraudDetection, BannedUser, TeacherProfile
)
from .serializers import (
    IncidentReportSerializer, IncidentReportCreateSerializer,
    CommissionRateSerializer, TeacherEarningSerializer, TeacherEarningSummarySerializer,
    TeacherPaymentSerializer, TeacherWarningSerializer, TeacherMetricsSerializer,
    FraudDetectionSerializer, FraudCheckRequestSerializer, FraudCheckResponseSerializer,
    BannedUserSerializer, TeacherPublicProfileSerializer
)


# ============================================================================
# 1. SYSTÈME DE SIGNALEMENT D'INCIDENTS
# ============================================================================

class IncidentReportViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les signalements d'incidents"""
    
    queryset = IncidentReport.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return IncidentReportCreateSerializer
        return IncidentReportSerializer
    
    def get_queryset(self):
        user = self.request.user
        user_role = self._get_user_role(user)
        
        # Les admins voient tout
        if user_role == 'admin':
            queryset = IncidentReport.objects.all()
        # Les enseignants voient leurs propres signalements
        elif user_role == 'teacher':
            queryset = IncidentReport.objects.filter(teacher__user=user)
        # Les autres voient leurs signalements
        else:
            queryset = IncidentReport.objects.filter(reporter=user)
        
        # Filtres
        status_filter = self.request.query_params.get('status')
        severity_filter = self.request.query_params.get('severity')
        teacher_id = self.request.query_params.get('teacher_id')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if severity_filter:
            queryset = queryset.filter(severity=severity_filter)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """Créer un signalement"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Résoudre un signalement (admin uniquement)"""
        if not self._is_admin(request.user):
            return Response(
                {'error': 'Accès réservé aux administrateurs'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        report = self.get_object()
        data = request.data
        
        report.status = 'resolved'
        report.resolution = data.get('resolution', 'resolved')
        report.action_taken = data.get('action_taken', '')
        report.admin_notes = data.get('admin_notes', '')
        report.resolution_date = timezone.now()
        report.resolved_by = request.user
        report.save()
        
        serializer = self.get_serializer(report)
        return Response(serializer.data)
    
    def _get_user_role(self, user):
        """Détermine le rôle de l'utilisateur"""
        if user.is_staff or user.is_superuser:
            return 'admin'
        if hasattr(user, 'teacher'):
            return 'teacher'
        if hasattr(user, 'student'):
            return 'student'
        if hasattr(user, 'parent'):
            return 'parent'
        return 'other'
    
    def _is_admin(self, user):
        return user.is_staff or user.is_superuser


# ============================================================================
# 2. RÉMUNÉRATION ENSEIGNANTS + COMMISSION
# ============================================================================

class CommissionRateViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les taux de commission"""
    
    queryset = CommissionRate.objects.all()
    serializer_class = CommissionRateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]
    
    def list(self, request):
        """Récupérer le taux de commission actuel"""
        rate = CommissionRate.objects.first()
        if not rate:
            # Créer un taux par défaut
            rate = CommissionRate.objects.create(default_rate=10.0, updated_by=request.user)
        serializer = self.get_serializer(rate)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Mettre à jour les taux de commission"""
        rate = CommissionRate.objects.first()
        if not rate:
            rate = CommissionRate.objects.create(updated_by=request.user)
        
        serializer = self.get_serializer(rate, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(updated_by=request.user)
        return Response(serializer.data)


class TeacherEarningViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour consulter les revenus (enseignant)"""
    
    serializer_class = TeacherEarningSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Récupérer l'enseignant associé
        try:
            from teachers.models import Teacher
            teacher = Teacher.objects.get(user=user)
            return TeacherEarning.objects.filter(teacher=teacher)
        except:
            return TeacherEarning.objects.none()
    
    def list(self, request):
        """Liste des revenus avec résumé"""
        queryset = self.get_queryset()
        
        # Filtres par période
        period = request.query_params.get('period', 'month')
        now = timezone.now()
        
        if period == 'week':
            start_date = now - timedelta(days=7)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = None
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        
        # Calculer le résumé
        summary = {
            'total_earnings': queryset.aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
            'pending_amount': queryset.filter(status='pending').aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
            'paid_amount': queryset.filter(status='paid').aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
            'ready_to_pay': queryset.filter(status='ready').aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
            'this_month': queryset.filter(
                created_at__year=now.year,
                created_at__month=now.month
            ).aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
            'this_week': queryset.filter(
                created_at__gte=now - timedelta(days=7)
            ).aggregate(Sum('net_amount'))['net_amount__sum'] or 0,
        }
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'earnings': serializer.data,
            'summary': summary
        })


class TeacherPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les paiements aux enseignants (admin)"""
    
    queryset = TeacherPayment.objects.all()
    serializer_class = TeacherPaymentSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = TeacherPayment.objects.all()
        
        # Filtres
        status_filter = self.request.query_params.get('status')
        teacher_id = self.request.query_params.get('teacher_id')
        
        if status_filter:
            # Filtrer par statut des earnings associés
            queryset = queryset.filter(earnings__status=status_filter).distinct()
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        return queryset.order_by('-processed_at')
    
    @transaction.atomic
    def create(self, request):
        """Créer un paiement et marquer les earnings comme payés"""
        teacher_id = request.data.get('teacher_id')
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        earnings_ids = request.data.get('earnings_ids', [])
        
        from teachers.models import Teacher
        teacher = Teacher.objects.get(id=teacher_id)
        
        # Récupérer les earnings à payer
        earnings = TeacherEarning.objects.filter(
            id__in=earnings_ids,
            teacher=teacher,
            status='ready'
        )
        
        if not earnings.exists():
            return Response(
                {'error': 'Aucun revenu prêt à payer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer le paiement
        payment = TeacherPayment.objects.create(
            teacher=teacher,
            total_amount=amount,
            payment_method=payment_method,
            payment_proof=request.data.get('payment_proof', ''),
            notes=request.data.get('notes', ''),
            processed_by=request.user
        )
        
        # Associer les earnings et les marquer comme payés
        payment.earnings.set(earnings)
        earnings.update(
            status='paid',
            payment_date=timezone.now(),
            payment_method=payment_method
        )
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ============================================================================
# 3. DÉTECTION ANNULATIONS FRÉQUENTES
# ============================================================================

class TeacherMetricsView(APIView):
    """Vue pour récupérer les métriques d'un enseignant"""
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request, teacher_id):
        """Récupérer les métriques d'un enseignant"""
        from teachers.models import Teacher
        from bookings.models import Booking
        
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Response(
                {'error': 'Enseignant non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calculer les métriques
        bookings = Booking.objects.filter(teacher=teacher)
        total = bookings.count()
        completed = bookings.filter(status='completed').count()
        cancelled_by_teacher = bookings.filter(
            status='cancelled',
            cancelled_by='teacher'
        ).count()
        cancelled_by_student = bookings.filter(
            status='cancelled',
            cancelled_by='student'
        ).count()
        
        cancellation_rate = (cancelled_by_teacher / total * 100) if total > 0 else 0
        
        # Annulations dernière minute (< 24h)
        last_minute = bookings.filter(
            status='cancelled',
            cancelled_by='teacher',
            cancelled_at__gte=timezone.now() - timedelta(hours=24)
        ).count()
        
        # Note moyenne
        from reviews.models import Review
        avg_rating = Review.objects.filter(teacher=teacher).aggregate(
            avg=Avg('rating')
        )['avg'] or 0.0
        
        # Avertissements
        warnings_count = TeacherWarning.objects.filter(teacher=teacher).count()
        last_warning = TeacherWarning.objects.filter(teacher=teacher).first()
        
        metrics = {
            'teacher_id': str(teacher.id),
            'teacher_name': f"{teacher.user.first_name} {teacher.user.last_name}",
            'total_bookings': total,
            'completed': completed,
            'cancelled_by_teacher': cancelled_by_teacher,
            'cancelled_by_student': cancelled_by_student,
            'cancellation_rate': round(cancellation_rate, 2),
            'last_minute_cancellations': last_minute,
            'average_rating': round(float(avg_rating), 2),
            'warnings_issued': warnings_count,
            'last_warning_date': last_warning.issued_at if last_warning else None,
            'is_suspended': getattr(teacher, 'is_suspended', False),
            'status': getattr(teacher, 'status', 'unknown')
        }
        
        serializer = TeacherMetricsSerializer(metrics)
        return Response(serializer.data)


class TeacherAtRiskView(APIView):
    """Vue pour récupérer les enseignants à risque"""
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """Liste des enseignants à risque"""
        from teachers.models import Teacher
        from bookings.models import Booking
        
        risk_level = request.query_params.get('risk_level', 'all')
        sort_by = request.query_params.get('sort_by', 'cancellation_rate')
        
        teachers = Teacher.objects.all()
        at_risk = []
        
        for teacher in teachers:
            bookings = Booking.objects.filter(teacher=teacher)
            total = bookings.count()
            
            if total == 0:
                continue
            
            cancelled_by_teacher = bookings.filter(
                status='cancelled',
                cancelled_by='teacher'
            ).count()
            
            cancellation_rate = (cancelled_by_teacher / total * 100)
            
            # Déterminer le niveau de risque
            if cancellation_rate >= 40:
                alert_level = 'critical'
            elif cancellation_rate >= 25:
                alert_level = 'danger'
            elif cancellation_rate >= 15:
                alert_level = 'warning'
            else:
                alert_level = 'safe'
            
            # Filtrer par niveau de risque
            if risk_level != 'all' and alert_level != risk_level:
                continue
            
            last_minute = bookings.filter(
                status='cancelled',
                cancelled_by='teacher',
                cancelled_at__gte=timezone.now() - timedelta(hours=24)
            ).count()
            
            from reviews.models import Review
            avg_rating = Review.objects.filter(teacher=teacher).aggregate(
                avg=Avg('rating')
            )['avg'] or 0.0
            
            warnings_count = TeacherWarning.objects.filter(teacher=teacher).count()
            last_warning = TeacherWarning.objects.filter(teacher=teacher).first()
            
            at_risk.append({
                'id': str(teacher.id),
                'first_name': teacher.user.first_name,
                'last_name': teacher.user.last_name,
                'email': teacher.user.email,
                'photo_url': getattr(teacher.profile, 'photo', None).url if hasattr(teacher, 'profile') and teacher.profile.photo else None,
                'total_bookings': total,
                'completed': bookings.filter(status='completed').count(),
                'cancelled_by_teacher': cancelled_by_teacher,
                'cancelled_by_student': bookings.filter(status='cancelled', cancelled_by='student').count(),
                'cancellation_rate': round(cancellation_rate, 2),
                'last_minute_cancellations': last_minute,
                'average_rating': round(float(avg_rating), 2),
                'alert_level': alert_level,
                'warnings_issued': warnings_count,
                'last_warning_date': last_warning.issued_at if last_warning else None,
                'status': getattr(teacher, 'status', 'unknown'),
                'is_suspended': getattr(teacher, 'is_suspended', False)
            })
        
        # Trier
        if sort_by == 'cancellation_rate':
            at_risk.sort(key=lambda x: x['cancellation_rate'], reverse=True)
        elif sort_by == 'last_minute_cancellations':
            at_risk.sort(key=lambda x: x['last_minute_cancellations'], reverse=True)
        elif sort_by == 'warnings_issued':
            at_risk.sort(key=lambda x: x['warnings_issued'], reverse=True)
        
        return Response({'results': at_risk})


class TeacherWarningViewSet(viewsets.ModelViewSet):
    """ViewSet pour gérer les avertissements enseignants"""
    
    queryset = TeacherWarning.objects.all()
    serializer_class = TeacherWarningSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def create(self, request):
        """Créer un avertissement"""
        teacher_id = request.data.get('teacher_id')
        
        from teachers.models import Teacher
        teacher = Teacher.objects.get(id=teacher_id)
        
        warning = TeacherWarning.objects.create(
            teacher=teacher,
            warning_type=request.data.get('warning_type'),
            severity=request.data.get('severity'),
            message=request.data.get('message'),
            action_taken=request.data.get('action_taken'),
            metadata=request.data.get('metadata', {}),
            issued_by=request.user
        )
        
        # Appliquer l'action si nécessaire
        if warning.action_taken == 'temporary_suspension':
            teacher.is_suspended = True
            teacher.save()
        elif warning.action_taken == 'permanent_ban':
            # Bannir l'enseignant
            BannedUser.objects.create(
                user=teacher.user,
                ban_reason=warning.message,
                permanent=True,
                banned_by=request.user
            )
        
        serializer = self.get_serializer(warning)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request):
        """Liste des avertissements d'un enseignant"""
        teacher_id = request.query_params.get('teacher_id')
        if teacher_id:
            queryset = self.queryset.filter(teacher_id=teacher_id)
        else:
            queryset = self.queryset.all()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# ============================================================================
# 4. SÉCURITÉ ANTI-FRAUDE
# ============================================================================

class FraudCheckView(APIView):
    """Vue pour vérifier les risques de fraude"""
    
    permission_classes = [permissions.AllowAny]  # Accessible lors de l'inscription
    
    def post(self, request):
        """Vérifier les risques de fraude"""
        serializer = FraudCheckRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        email = data['email']
        phone = data['phone']
        device_fingerprint = data.get('device_fingerprint', '')
        ip_address = data.get('ip_address', '')
        
        # Calculer le score de risque
        risk_score = 0
        risk_factors = {}
        
        # 1. Vérifier les doublons d'email
        email_variations = self._get_email_variations(email)
        duplicate_email = User.objects.filter(email__in=email_variations).exists()
        if duplicate_email:
            risk_score += 25
            risk_factors['duplicate_email'] = True
        
        # 2. Vérifier les doublons de téléphone
        duplicate_phone = User.objects.filter(
            profile__phone=phone
        ).exists() if hasattr(User, 'profile') else False
        if duplicate_phone:
            risk_score += 25
            risk_factors['duplicate_phone'] = True
        
        # 3. Vérifier les doublons de device fingerprint
        if device_fingerprint:
            duplicate_device = FraudDetection.objects.filter(
                device_fingerprint=device_fingerprint
            ).exclude(email=email).exists()
            if duplicate_device:
                risk_score += 20
                risk_factors['duplicate_device'] = True
        
        # 4. Détecter VPN (nécessite une API externe ou heuristique)
        vpn_detected = self._detect_vpn(ip_address)
        if vpn_detected:
            risk_score += 10
            risk_factors['vpn_detected'] = True
        
        # 5. Vérifier si l'utilisateur a été précédemment banni
        previously_banned = BannedUser.objects.filter(
            user__email__in=email_variations
        ).exists()
        if previously_banned:
            risk_score += 30
            risk_factors['previously_banned'] = True
        
        # 6. Vérifier les patterns suspects
        suspicious_activity = self._check_suspicious_patterns(email, phone)
        if suspicious_activity:
            risk_score += 15
            risk_factors['suspicious_activity'] = True
        
        # Déterminer l'action
        if risk_score >= 70:
            action = 'block'
            requires_manual_review = False
        elif risk_score >= 30:
            action = 'review'
            requires_manual_review = True
        else:
            action = 'allow'
            requires_manual_review = False
        
        # Enregistrer la détection
        fraud_detection = FraudDetection.objects.create(
            email=email,
            phone=phone,
            device_fingerprint=device_fingerprint,
            ip_address=ip_address,
            user_agent=data.get('user_agent', ''),
            risk_score=risk_score,
            risk_factors=risk_factors,
            action=action,
            status='pending' if requires_manual_review else 'reviewed'
        )
        
        response_data = {
            'risk_score': risk_score,
            'risk_factors': risk_factors,
            'action': action,
            'requires_manual_review': requires_manual_review,
            'message': self._get_action_message(action, risk_score)
        }
        
        serializer = FraudCheckResponseSerializer(response_data)
        return Response(serializer.data)
    
    def _get_email_variations(self, email):
        """Génère des variations d'email pour détecter les doublons"""
        variations = [email]
        local, domain = email.split('@')
        
        # Variations avec + et .
        variations.append(f"{local.replace('.', '')}@{domain}")
        variations.append(f"{local.replace('+', '')}@{domain}")
        
        return variations
    
    def _detect_vpn(self, ip_address):
        """Détecte si l'IP est un VPN (simplifié, nécessite une API externe)"""
        # TODO: Intégrer MaxMind GeoIP ou une API similaire
        # Pour l'instant, retourner False
        return False
    
    def _check_suspicious_patterns(self, email, phone):
        """Vérifie les patterns suspects"""
        # Exemples de patterns suspects
        suspicious_patterns = [
            'test', 'fake', 'temp', 'spam'
        ]
        
        email_lower = email.lower()
        for pattern in suspicious_patterns:
            if pattern in email_lower:
                return True
        
        return False
    
    def _get_action_message(self, action, score):
        """Retourne un message selon l'action"""
        if action == 'block':
            return 'Inscription bloquée automatiquement en raison d\'un risque élevé'
        elif action == 'review':
            return 'Inscription nécessite une révision manuelle'
        else:
            return 'Inscription autorisée'


class SuspiciousUsersView(APIView):
    """Vue pour récupérer les utilisateurs suspects (admin)"""
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """Liste des utilisateurs suspects"""
        min_score = int(request.query_params.get('min_score', 30))
        status_filter = request.query_params.get('status', 'all')
        
        queryset = FraudDetection.objects.filter(risk_score__gte=min_score)
        
        if status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Enrichir avec les données utilisateur si disponible
        results = []
        for detection in queryset:
            user_data = {
                'id': str(detection.id),
                'email': detection.email,
                'phone': detection.phone,
                'first_name': detection.user.first_name if detection.user else '',
                'last_name': detection.user.last_name if detection.user else '',
                'risk_score': detection.risk_score,
                'risk_factors': detection.risk_factors,
                'action': detection.action,
                'status': detection.status,
                'created_at': detection.created_at
            }
            results.append(user_data)
        
        return Response({'results': results})


class BanUserView(APIView):
    """Vue pour bannir un utilisateur (admin)"""
    
    permission_classes = [permissions.IsAdminUser]
    
    def post(self, request):
        """Bannir un utilisateur"""
        user_id = request.data.get('user_id')
        reason = request.data.get('reason')
        permanent = request.data.get('permanent', False)
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier si déjà banni
        if hasattr(user, 'ban_info'):
            return Response(
                {'error': 'Utilisateur déjà banni'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer le bannissement
        banned_until = None if permanent else timezone.now() + timedelta(days=30)
        
        ban = BannedUser.objects.create(
            user=user,
            ban_reason=reason,
            permanent=permanent,
            banned_until=banned_until,
            banned_by=request.user
        )
        
        # Mettre à jour la détection de fraude si applicable
        fraud_detection = FraudDetection.objects.filter(
            user=user
        ).first()
        if fraud_detection:
            fraud_detection.status = 'banned'
            fraud_detection.reviewed_by = request.user
            fraud_detection.reviewed_at = timezone.now()
            fraud_detection.save()
        
        serializer = BannedUserSerializer(ban)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BannedListView(APIView):
    """Vue pour récupérer la liste des utilisateurs bannis (admin)"""
    
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        """Liste des utilisateurs bannis"""
        queryset = BannedUser.objects.all()
        serializer = BannedUserSerializer(queryset, many=True)
        return Response({'results': serializer.data})


# ============================================================================
# 5. PROFIL ENSEIGNANT ENRICHI
# ============================================================================

class TeacherPublicProfileView(APIView):
    """Vue pour récupérer le profil public d'un enseignant"""
    
    permission_classes = [permissions.AllowAny]  # Public
    
    def get(self, request, teacher_id):
        """Récupérer le profil public"""
        from teachers.models import Teacher
        
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Response(
                {'error': 'Enseignant non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Récupérer ou créer le profil
        profile, created = TeacherProfile.objects.get_or_create(teacher=teacher)
        
        serializer = TeacherPublicProfileSerializer(profile)
        return Response(serializer.data)


class TeacherStatsView(APIView):
    """Vue pour récupérer les statistiques d'un enseignant"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, teacher_id):
        """Récupérer les statistiques"""
        from teachers.models import Teacher
        
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Response(
                {'error': 'Enseignant non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Vérifier que l'utilisateur est l'enseignant ou un admin
        if teacher.user != request.user and not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {'error': 'Accès non autorisé'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Calculer les statistiques
        from bookings.models import Booking
        from reviews.models import Review
        
        bookings = Booking.objects.filter(teacher=teacher)
        reviews = Review.objects.filter(teacher=teacher)
        
        stats = {
            'total_bookings': bookings.count(),
            'completed_bookings': bookings.filter(status='completed').count(),
            'cancelled_bookings': bookings.filter(status='cancelled').count(),
            'average_rating': reviews.aggregate(avg=Avg('rating'))['avg'] or 0.0,
            'total_reviews': reviews.count(),
            'total_hours': sum(b.duration for b in bookings.filter(status='completed') if hasattr(b, 'duration')),
        }
        
        return Response(stats)


# ============================================================================
# 6. CRÉATION AUTOMATIQUE DES EARNINGS LORS D'UN PAIEMENT
# ============================================================================

def create_teacher_earning_on_payment(sender, instance, created, **kwargs):
    """Signal Django pour créer automatiquement un TeacherEarning lors d'un paiement"""
    if created and instance.status == 'completed':
        from bookings.models import Booking
        from teachers.models import Teacher
        
        # Vérifier que c'est une réservation avec un enseignant
        if hasattr(instance, 'booking'):
            booking = instance.booking
            if hasattr(booking, 'teacher'):
                teacher = booking.teacher
                
                # Récupérer le taux de commission
                commission_config = CommissionRate.objects.first()
                commission_rate = commission_config.default_rate if commission_config else 10.0
                
                # Calculer les montants
                gross_amount = instance.amount
                
                # Créer l'earning
                earning = TeacherEarning.objects.create(
                    teacher=teacher,
                    booking=booking,
                    gross_amount=gross_amount,
                    commission_rate=commission_rate
                )
                earning.calculate_amounts(commission_rate)
                earning.save()

# Connecter le signal (à faire dans apps.py ou models.py du module bookings)
# from django.db.models.signals import post_save
# from payments.models import Payment
# post_save.connect(create_teacher_earning_on_payment, sender=Payment)

