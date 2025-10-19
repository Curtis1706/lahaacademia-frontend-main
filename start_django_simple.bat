@echo off
echo 🚀 Démarrage de Django avec gestion des contenus pédagogiques
echo ================================================================

cd django_backend

echo 📂 Répertoire: %CD%
echo 🔧 Démarrage du serveur Django sur le port 8000...
echo.

python manage.py runserver 8000

pause



