# LAHACADEMIA - Backend Django

## Architecture de la Base de Données

### Tables Principales

1. **Users** - Utilisateurs avec rôles multiples
2. **StudentProfiles** - Profils spécifiques aux élèves
3. **TeacherProfiles** - Profils spécifiques aux professeurs
4. **AuthorProfiles** - Profils spécifiques aux auteurs
5. **ParentProfiles** - Profils spécifiques aux parents
6. **Courses** - Cours disponibles
7. **Sessions** - Sessions de cours
8. **Bookings** - Réservations
9. **Payments** - Paiements
10. **Progress** - Suivi de progression
11. **Notifications** - Notifications
12. **Messages** - Messagerie interne
13. **Forums** - Forums de discussion
14. **Exams** - Examens blancs

### Relations Clés

- **User** ↔ **StudentProfile** (OneToOne)
- **User** ↔ **TeacherProfile** (OneToOne)
- **User** ↔ **AuthorProfile** (OneToOne)
- **User** ↔ **ParentProfile** (OneToOne)
- **ParentProfile** ↔ **StudentProfile** (ManyToMany)
- **Course** ↔ **Session** (OneToMany)
- **Session** ↔ **Booking** (OneToMany)
- **Booking** ↔ **Payment** (OneToOne)
- **User** ↔ **Progress** (OneToMany)
- **User** ↔ **Notification** (OneToMany)

## Installation

### Prérequis

- Python 3.8+
- PostgreSQL
- Redis (pour Celery)

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd lahaacademia-backend
```

2. **Créer un environnement virtuel**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer la base de données PostgreSQL**
```sql
CREATE DATABASE lahaacademia_db;
CREATE USER lahaacademia_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lahaacademia_db TO lahaacademia_user;
```

5. **Configurer les variables d'environnement**
Créer un fichier `.env` :
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://lahaacademia_user:your_password@localhost:5432/lahaacademia_db
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

6. **Appliquer les migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Créer un superutilisateur**
```bash
python manage.py createsuperuser
```

8. **Lancer le serveur**
```bash
python manage.py runserver
```

## API Endpoints

### Authentification
- `POST /api/users/register/` - Inscription
- `POST /api/users/login/` - Connexion

### Utilisateurs
- `GET /api/users/` - Liste des utilisateurs
- `GET /api/users/{id}/` - Détails d'un utilisateur
- `PUT /api/users/{id}/` - Modifier un utilisateur

### Cours
- `GET /api/courses/` - Liste des cours
- `GET /api/courses/{id}/` - Détails d'un cours
- `POST /api/courses/` - Créer un cours

### Sessions
- `GET /api/sessions/` - Liste des sessions
- `POST /api/sessions/{id}/join/` - Rejoindre une session

### Réservations
- `GET /api/bookings/` - Liste des réservations
- `POST /api/bookings/` - Créer une réservation
- `POST /api/bookings/{id}/cancel/` - Annuler une réservation

### Progression
- `GET /api/progress/` - Progression de l'utilisateur
- `POST /api/progress/update_progress/` - Mettre à jour la progression

### Notifications
- `GET /api/notifications/` - Liste des notifications
- `POST /api/notifications/{id}/mark_as_read/` - Marquer comme lue

### Messages
- `GET /api/messages/` - Liste des messages
- `POST /api/messages/` - Envoyer un message

## Fonctionnalités Implémentées

### ✅ Authentification & Gestion des Profils
- Inscription avec validation des champs obligatoires
- Connexion sécurisée par email/téléphone
- Double authentification (OTP)
- Système de parrainage
- Rôles multiples (Élève, Professeur, Auteur, Parent, Admin)

### ✅ Cours & Tutorat
- Gestion des cours avec filtres (matière, niveau, pays)
- Sessions de cours avec visioconférence
- Système de réservation
- Suivi de progression

### ✅ Paiements & Abonnements
- Gestion des paiements
- Système d'abonnements
- Intégration Mobile Money

### ✅ Suivi & Analytics
- Tableaux de bord personnalisés
- Suivi de progression
- Statistiques d'activité

### ✅ Notifications & Messagerie
- Système de notifications
- Messagerie interne
- Alertes intelligentes

## Prochaines Étapes

1. **Implémentation des examens blancs**
2. **Système de forums**
3. **Intégration vidéo (Zoom API)**
4. **Système de paiement (Mobile Money)**
5. **IA pour recommandations**
6. **Tests unitaires et d'intégration**
7. **Documentation API complète**
8. **Déploiement en production**

## Structure du Projet

```
django_backend/
├── models.py          # Modèles de base de données
├── serializers.py     # Sérialiseurs DRF
├── views.py          # Vues API
├── urls.py           # URLs de l'API
├── settings.py       # Configuration Django
└── requirements.txt  # Dépendances Python
```

## Support

Pour toute question ou problème, veuillez créer une issue sur le repository GitHub.
