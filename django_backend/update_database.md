# Mise à jour de la base de données

## Vue d'ensemble

Ce document explique comment mettre à jour la base de données pour supporter le nouveau système de réservation des élèves.

## Étapes de mise à jour

### 1. Vérifier la structure actuelle

La base de données contient déjà tous les modèles nécessaires :
- `User` : Utilisateurs avec rôles (élève, parent, professeur)
- `Student` : Profils des élèves
- `Teacher` : Profils des professeurs
- `Course` : Cours disponibles
- `Session` : Sessions de cours
- `Booking` : Réservations
- `CourseAvailability` : Disponibilités des cours

### 2. Appliquer les migrations existantes

```bash
cd django_backend
python manage.py makemigrations
python manage.py migrate
```

### 3. Vérifier les données existantes

```bash
python manage.py shell
```

```python
from core.models import User, Student, Teacher, Course, Session, Booking

# Vérifier les utilisateurs
print(f"Utilisateurs: {User.objects.count()}")
print(f"Élèves: {Student.objects.count()}")
print(f"Professeurs: {Teacher.objects.count()}")
print(f"Cours: {Course.objects.count()}")
print(f"Sessions: {Session.objects.count()}")
print(f"Réservations: {Booking.objects.count()}")

# Vérifier les rôles
for user in User.objects.all()[:5]:
    print(f"- {user.email}: {user.role}")
```

### 4. Créer des données de test (optionnel)

Si vous voulez tester le système avec des données réelles :

```bash
python test_student_booking.py
```

### 5. Vérifier les permissions

Assurez-vous que les utilisateurs ont les bonnes permissions :

```python
# Dans le shell Django
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

# Vérifier les permissions pour les réservations
content_type = ContentType.objects.get_for_model(Booking)
permissions = Permission.objects.filter(content_type=content_type)
for perm in permissions:
    print(f"- {perm.codename}: {perm.name}")
```

## Structure des données

### Modèle User
```python
class User(AbstractUser):
    role = models.CharField(choices=[
        ('student', 'Élève'),
        ('teacher', 'Professeur'),
        ('parent', 'Parent'),
        ('admin', 'Administrateur'),
    ])
```

### Modèle Student
```python
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # ... autres champs
```

### Modèle Booking
```python
class Booking(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    status = models.CharField(choices=[
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ])
```

## Vérifications post-mise à jour

### 1. Test des API

Vérifiez que les endpoints fonctionnent :

```bash
# Démarrer le serveur
python manage.py runserver

# Tester les endpoints (avec un outil comme curl ou Postman)
curl -X GET http://localhost:8000/api/courses/available-courses/
curl -X GET http://localhost:8000/api/teachers/available-teachers/
```

### 2. Test des permissions

Vérifiez que les élèves peuvent accéder aux bonnes fonctionnalités :

```python
# Dans le shell Django
from django.test import Client
from django.contrib.auth import authenticate

# Créer un client de test
client = Client()

# Tester l'authentification d'un élève
user = User.objects.filter(role='student').first()
if user:
    client.force_login(user)
    response = client.get('/api/bookings/my-bookings/')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.content}")
```

### 3. Vérification des contraintes

Testez les validations :

```python
# Tenter de créer une réservation invalide
from datetime import datetime, timedelta
from django.utils import timezone

# Date dans le passé
past_date = timezone.now() - timedelta(days=1)
# Cela devrait échouer
```

## Résolution des problèmes courants

### Problème 1 : Erreur de migration

```bash
# Réinitialiser les migrations si nécessaire
python manage.py migrate --fake-initial
```

### Problème 2 : Permissions manquantes

```python
# Créer les permissions manquantes
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

content_type = ContentType.objects.get_for_model(Booking)
permission = Permission.objects.create(
    codename='can_book_course',
    name='Can book course',
    content_type=content_type,
)
```

### Problème 3 : Données corrompues

```python
# Vérifier l'intégrité des données
from core.models import Booking, Session, Student

# Vérifier les réservations orphelines
orphan_bookings = Booking.objects.filter(
    session__isnull=True
)
print(f"Réservations orphelines: {orphan_bookings.count()}")

# Nettoyer si nécessaire
orphan_bookings.delete()
```

## Maintenance

### Nettoyage périodique

```python
# Supprimer les sessions passées
from django.utils import timezone
from core.models import Session

old_sessions = Session.objects.filter(
    end_time__lt=timezone.now(),
    status='scheduled'
)
old_sessions.update(status='completed')

# Annuler les réservations des sessions annulées
from core.models import Booking
cancelled_bookings = Booking.objects.filter(
    session__status='cancelled',
    status='confirmed'
)
cancelled_bookings.update(status='cancelled')
```

### Sauvegarde

```bash
# Sauvegarder la base de données
python manage.py dumpdata > backup_$(date +%Y%m%d_%H%M%S).json

# Restaurer si nécessaire
python manage.py loaddata backup_YYYYMMDD_HHMMSS.json
```

## Support

Pour toute question ou problème :
1. Vérifiez les logs Django
2. Consultez la documentation des modèles
3. Testez avec le script de test
4. Vérifiez les permissions et contraintes

