# LAHACADEMIA - Plateforme Éducative

Plateforme éducative complète avec frontend Next.js et backend Django.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ 
- Python 3.8+
- PostgreSQL (optionnel, SQLite par défaut)

### 1. Installation du Frontend

```bash
# Installer les dépendances
npm install
# ou
pnpm install

# Démarrer le serveur de développement
npm run dev
# ou
pnpm dev
```

Le frontend sera accessible sur `http://localhost:3000`

### 2. Installation du Backend

```bash
# Aller dans le dossier backend
cd django_backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### 3. Configuration PostgreSQL (Optionnel)

1. Installer PostgreSQL
2. Créer une base de données `lahaacademia_db`
3. Modifier `django_backend/lahaacademia/settings.py` :

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'lahaacademia_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📁 Structure du Projet

```
lahaacademia-frontend-main/
├── app/                    # Frontend Next.js
│   ├── (auth)/            # Pages d'authentification
│   ├── dashboard/         # Tableaux de bord
│   └── ...
├── components/            # Composants React
├── lib/                   # Utilitaires et API
├── django_backend/        # Backend Django
│   ├── core/             # Application principale
│   ├── lahaacademia/     # Configuration Django
│   └── ...
└── ...
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Endpoints

Le frontend utilise un proxy pour rediriger les appels API vers le backend Django :

- `/api/*` → `http://localhost:8000/api/*`

## 🎯 Fonctionnalités

### Frontend
- ✅ Interface moderne avec Tailwind CSS
- ✅ Formulaire d'inscription multi-étapes
- ✅ Tableaux de bord personnalisés
- ✅ Navigation responsive
- ✅ Animations avec Framer Motion

### Backend
- ✅ API REST complète avec Django REST Framework
- ✅ Modèles séparés pour chaque type d'utilisateur
- ✅ Authentification et autorisation
- ✅ Gestion des fichiers (upload)
- ✅ Base de données relationnelle
- ✅ Interface d'administration Django

### Types d'Utilisateurs
- **Élèves** : Suivi pédagogique, cours, progression
- **Enseignants** : Gestion des cours, sessions, documents
- **Auteurs** : Création de contenu, expertise
- **Parents** : Suivi des enfants, contrôle parental
- **Administrateurs** : Gestion de la plateforme

## 🚀 Déploiement

### Frontend (Vercel)
```bash
npm run build
npm start
```

### Backend (Heroku/DigitalOcean)
```bash
# Configurer les variables d'environnement
# Déployer avec les fichiers requirements.txt et Procfile
```

## 📊 Base de Données

### Modèles Principaux
- `User` : Utilisateur de base avec rôles
- `Student` : Profil élève avec suivi pédagogique
- `Teacher` : Profil enseignant avec validation
- `Author` : Profil auteur avec expertise
- `Parent` : Profil parent avec contrôle
- `Course` : Cours et contenus éducatifs
- `Session` : Sessions de cours en ligne
- `Booking` : Réservations et paiements
- `Progress` : Suivi de progression
- `Notification` : Système de notifications

## 🔐 Sécurité

- Authentification sécurisée
- Validation des données
- Gestion des permissions
- Protection CSRF
- CORS configuré

## 📝 API Documentation

### Endpoints Principaux

#### Authentification
- `POST /api/users/register/` - Inscription
- `POST /api/users/login/` - Connexion
- `POST /api/users/logout/` - Déconnexion

#### Étudiants
- `POST /api/students/register/` - Inscription étudiant
- `GET /api/students/{id}/progress/` - Progression

#### Enseignants
- `POST /api/teachers/register/` - Inscription enseignant
- `GET /api/teachers/{id}/sessions/` - Sessions
- `GET /api/teachers/{id}/earnings/` - Revenus

#### Cours
- `GET /api/courses/` - Liste des cours
- `GET /api/courses/{id}/` - Détails d'un cours
- `GET /api/courses/{id}/enrollments/` - Inscriptions

## 🐛 Dépannage

### Problèmes Courants

1. **Erreur de connexion à la base de données**
   - Vérifier que PostgreSQL est démarré
   - Vérifier les paramètres de connexion

2. **Erreur CORS**
   - Vérifier que le backend est démarré sur le bon port
   - Vérifier la configuration CORS dans settings.py

3. **Erreur de migration**
   - Supprimer le fichier db.sqlite3
   - Relancer `python manage.py migrate`

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.

## 📄 Licence

Ce projet est sous licence MIT.







