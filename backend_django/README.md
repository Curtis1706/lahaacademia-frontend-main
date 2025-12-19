# Backend Django - Nouvelles Fonctionnalités

Ce dossier contient l'implémentation backend Django pour les 8 fonctionnalités demandées par Monsieur Harry.

## 📋 Structure

```
backend_django/
├── models.py          # Modèles Django
├── serializers.py     # Serializers DRF
├── views.py          # Views/ViewSets
├── urls.py           # URLs routing
├── admin.py         # Configuration Django Admin
└── README.md        # Ce fichier
```

## 🚀 Installation

### 1. Copier les fichiers dans votre projet Django

```bash
# Copier les fichiers dans votre app Django (ex: apps/reports, apps/finances, etc.)
# Ou créer une nouvelle app: python manage.py startapp new_features
```

### 2. Ajouter les modèles à settings.py

```python
INSTALLED_APPS = [
    # ... vos apps existantes
    'rest_framework',
    'new_features',  # ou le nom de votre app
]
```

### 3. Créer les migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Ajouter les URLs

Dans votre `urls.py` principal :

```python
from django.urls import path, include

urlpatterns = [
    # ... vos URLs existantes
    path('', include('new_features.urls')),
]
```

### 5. Créer un superutilisateur (si nécessaire)

```bash
python manage.py createsuperuser
```

## 📦 Modèles Créés

### 1. IncidentReport
- Signalements d'incidents par parents/élèves
- Types : absence, retard, comportement, contenu, qualité, technique
- Niveaux de gravité : faible, moyen, élevé, critique

### 2. CommissionRate
- Configuration des taux de commission (défaut 10%)
- Taux personnalisés pour cours individuels/groupe

### 3. TeacherEarning
- Revenus des enseignants par réservation
- Calcul automatique commission LAHA + revenu enseignant

### 4. TeacherPayment
- Historique des paiements effectués aux enseignants
- Support MTN Money, Orange Money, virement bancaire

### 5. TeacherWarning
- Avertissements émis aux enseignants
- Actions : warning, suspension temporaire, bannissement

### 6. FraudDetection
- Détection de fraude lors des inscriptions
- Scoring de risque 0-100%
- Facteurs : doublons email/phone/device, VPN, précédemment banni

### 7. BannedUser
- Utilisateurs bannis (permanent ou temporaire)
- Raisons et historique

### 8. TeacherProfile
- Profil enrichi enseignant (photo, CV, localisation, etc.)
- Extension du modèle Teacher existant

## 🔌 APIs Disponibles

### Signalements
- `GET /api/reports/` - Liste des signalements
- `POST /api/reports/create/` - Créer un signalement
- `GET /api/reports/<id>/` - Détails d'un signalement
- `PUT /api/reports/<id>/` - Mettre à jour
- `POST /api/reports/<id>/resolve/` - Résoudre
- `GET /api/reports/teacher/<teacherId>/` - Signalements d'un enseignant

### Rémunération
- `GET /api/admin/commission-rates/` - Taux de commission
- `PUT /api/admin/commission-rates/` - Mettre à jour les taux
- `GET /api/teachers/earnings/` - Revenus enseignant
- `GET /api/admin/teachers/payments/` - Liste des paiements
- `POST /api/admin/teachers/payments/` - Effectuer un paiement

### Détection Annulations
- `GET /api/admin/teachers/<id>/metrics/` - Métriques enseignant
- `GET /api/admin/teachers/at-risk/` - Enseignants à risque
- `GET /api/admin/teachers/<id>/warnings/` - Avertissements
- `POST /api/admin/teachers/<id>/warnings/` - Créer un avertissement

### Sécurité Anti-Fraude
- `POST /api/security/fraud-check/` - Vérifier les risques
- `GET /api/admin/security/suspicious-users/` - Utilisateurs suspects
- `POST /api/admin/security/ban-user/` - Bannir un utilisateur
- `GET /api/admin/security/banned-list/` - Liste des bannis

### Profil Enseignant
- `GET /api/teachers/<id>/public-profile/` - Profil public
- `GET /api/teachers/<id>/stats/` - Statistiques
- `GET /api/teachers/<id>/reviews/` - Avis (à créer si nécessaire)

## 🔧 Configuration Requise

### Dépendances Python

```python
# requirements.txt
Django>=4.2.0
djangorestframework>=3.14.0
django-cors-headers>=4.0.0
Pillow>=10.0.0  # Pour les images
```

### Variables d'Environnement

```env
# .env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost/dbname
```

## 📝 Notes Importantes

### 1. Relations avec Modèles Existants

Les modèles font référence à :
- `teachers.Teacher` - Modèle enseignant existant
- `bookings.Booking` - Modèle réservation existant
- `courses.Course` - Modèle cours existant
- `reviews.Review` - Modèle avis existant (si disponible)
- `payments.Payment` - Modèle paiement existant

**Ajustez les imports selon votre structure !**

### 2. Signal pour Earnings Automatiques

Pour créer automatiquement un `TeacherEarning` lors d'un paiement :

```python
# Dans apps/bookings/models.py ou apps/payments/models.py
from django.db.models.signals import post_save
from new_features.views import create_teacher_earning_on_payment
from payments.models import Payment

post_save.connect(create_teacher_earning_on_payment, sender=Payment)
```

### 3. Détection VPN

La fonction `_detect_vpn()` est simplifiée. Pour une détection réelle :

```python
# Option 1: MaxMind GeoIP
import geoip2.database
reader = geoip2.database.Reader('GeoLite2-City.mmdb')
response = reader.city(ip_address)
# Vérifier si c'est un VPN/Proxy

# Option 2: API externe
# https://ipapi.co/{ip}/json/
```

### 4. Permissions

Toutes les vues utilisent :
- `permissions.IsAuthenticated` - Nécessite authentification
- `permissions.IsAdminUser` - Nécessite admin
- `permissions.AllowAny` - Public (profil enseignant, fraud-check)

### 5. Calcul Commission Automatique

Lors de la création d'un `TeacherEarning`, les montants sont calculés automatiquement :

```python
earning = TeacherEarning.objects.create(
    teacher=teacher,
    booking=booking,
    gross_amount=10000
)
earning.calculate_amounts()  # Calcule commission et net
earning.save()
```

## 🧪 Tests

Créer des tests unitaires :

```python
# tests.py
from django.test import TestCase
from .models import IncidentReport, CommissionRate

class IncidentReportTestCase(TestCase):
    def setUp(self):
        # Créer des données de test
        pass
    
    def test_create_report(self):
        # Tester la création
        pass
```

## 🐛 Dépannage

### Erreur: "No module named 'teachers'"
→ Ajustez les imports selon votre structure d'apps Django

### Erreur: "RelatedObjectDoesNotExist"
→ Vérifiez que les relations (Teacher, Booking, etc.) existent

### Erreur: "FieldError: Cannot resolve keyword"
→ Vérifiez les noms de champs dans les modèles existants

## 📞 Support

Pour toute question, référez-vous à :
- Documentation Django : https://docs.djangoproject.com/
- Documentation DRF : https://www.django-rest-framework.org/

---

**✅ Backend prêt à être intégré dans votre projet Django !**

