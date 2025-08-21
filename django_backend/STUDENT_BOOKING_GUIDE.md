# Guide d'utilisation du système de réservation des élèves

## Vue d'ensemble

Le système de réservation permet maintenant aux **élèves** de réserver des cours directement, au même titre que les parents. Les élèves peuvent :

- Voir les cours disponibles
- Consulter les professeurs et leurs disponibilités
- Réserver des sessions de cours
- Gérer leurs réservations
- Voir leur planning

## API Endpoints

### 1. Réservation de cours

#### Réserver une session
```
POST /api/bookings/reserve/
```

**Paramètres requis :**
- `teacher_id` : ID du professeur
- `start_time` : Heure de début (format ISO)
- `end_time` : Heure de fin (format ISO)

**Paramètres optionnels :**
- `course_id` : ID du cours (pour les sessions de cours spécifiques)
- `student_id` : ID de l'élève (requis pour les parents)

**Exemple de requête :**
```json
{
  "teacher_id": "uuid-du-professeur",
  "course_id": "uuid-du-cours",
  "start_time": "2024-01-15T14:00:00Z",
  "end_time": "2024-01-15T15:00:00Z"
}
```

**Réponse de succès :**
```json
{
  "booking_id": "uuid-de-la-reservation",
  "session_id": "uuid-de-la-session",
  "booking_reference": "REF-ABC12345",
  "status": "confirmed",
  "student": {
    "id": "uuid-eleve",
    "name": "Jean Dupont",
    "email": "jean@example.com"
  },
  "teacher": {
    "id": "uuid-professeur",
    "name": "Marie Martin",
    "email": "marie@example.com"
  },
  "course": {
    "id": "uuid-cours",
    "name": "Mathématiques - Niveau 3ème",
    "description": "Cours de mathématiques..."
  },
  "session": {
    "start_time": "2024-01-15T14:00:00Z",
    "end_time": "2024-01-15T15:00:00Z",
    "type": "group",
    "max_capacity": 10,
    "current_enrollment": 1
  },
  "message": "Réservation confirmée avec succès"
}
```

### 2. Gestion des réservations

#### Voir ses réservations
```
GET /api/bookings/my-bookings/
```

**Réponse :**
```json
[
  {
    "id": "uuid-reservation",
    "booking_reference": "REF-ABC12345",
    "status": "confirmed",
    "payment_status": "pending",
    "days_until_session": 2,
    "session_status_display": "Programmée",
    "payment_status_display": "En attente",
    "session": {
      "start_time": "2024-01-15T14:00:00Z",
      "end_time": "2024-01-15T15:00:00Z"
    },
    "teacher": {
      "name": "Marie Martin"
    },
    "course": {
      "name": "Mathématiques - Niveau 3ème"
    }
  }
]
```

#### Voir les sessions à venir
```
GET /api/bookings/upcoming-sessions/
```

### 3. Consultation des cours

#### Cours disponibles
```
GET /api/courses/available-courses/
```

**Paramètres de filtrage :**
- `subject` : Matière (ex: "Mathématiques")
- `level` : Niveau (ex: "3ème")
- `country` : Pays (ex: "France")
- `difficulty` : Niveau de difficulté (ex: "intermediate")

#### Disponibilités d'un cours
```
GET /api/courses/{course_id}/availabilities/
```

### 4. Consultation des professeurs

#### Professeurs disponibles
```
GET /api/teachers/available-teachers/
```

**Paramètres de filtrage :**
- `subject` : Matière enseignée
- `country` : Pays du professeur
- `min_rating` : Note minimale
- `max_price` : Prix maximum par heure

#### Planning d'un professeur
```
GET /api/teachers/{teacher_id}/schedule/
```

## Cas d'usage

### Cas 1 : Élève qui réserve pour lui-même

1. L'élève se connecte avec son compte
2. Il consulte les cours disponibles : `GET /api/courses/available-courses/`
3. Il choisit un cours et consulte les professeurs : `GET /api/teachers/available-teachers/?subject=Mathématiques`
4. Il réserve une session : `POST /api/bookings/reserve/`

### Cas 2 : Parent qui réserve pour son enfant

1. Le parent se connecte avec son compte
2. Il consulte les cours disponibles
3. Il réserve une session en spécifiant l'ID de son enfant : `POST /api/bookings/reserve/` avec `student_id`

## Validations et contraintes

### Contraintes de réservation
- **Durée** : Entre 30 minutes et 4 heures
- **Date** : Impossible de réserver dans le passé
- **Capacité** : Vérification que la session n'est pas complète
- **Doublon** : Un élève ne peut pas s'inscrire deux fois à la même session

### Vérifications automatiques
- **Statut du professeur** : Doit être validé
- **Statut du cours** : Doit être actif
- **Blocage de l'élève** : Vérification des restrictions parentales
- **Conflits horaires** : Détection des chevauchements

## Gestion des erreurs

### Erreurs courantes

#### 400 - Bad Request
```json
{
  "error": "teacher_id, start_time et end_time sont requis"
}
```

#### 403 - Forbidden
```json
{
  "error": "Cet élève est temporairement bloqué jusqu'au 15/01/2024 14:00"
}
```

#### 409 - Conflict
```json
{
  "error": "Créneau déjà complet"
}
```

## Notifications

Le système envoie automatiquement des notifications :

- **À l'élève/parent** : Confirmation de réservation
- **Au professeur** : Nouvelle réservation reçue

## Tests

Pour tester le système, utilisez le script de test :

```bash
cd django_backend
python test_student_booking.py
```

## Sécurité

- **Authentification** : Toutes les routes nécessitent une connexion
- **Autorisation** : Vérification des rôles et permissions
- **Validation** : Contrôle des données d'entrée
- **Audit** : Traçabilité des actions (logs)

## Support

Pour toute question ou problème, consultez :
- Les logs Django pour le débogage
- La documentation des modèles dans `core/models.py`
- Les tests dans `test_student_booking.py`

