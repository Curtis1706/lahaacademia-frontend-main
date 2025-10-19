@echo off
echo 🚀 Démarrage des serveurs pour LAHACADEMIA
echo ========================================

echo.
echo 📋 Instructions:
echo 1. Ce script va démarrer le serveur Django sur le port 8000
echo 2. Ouvrez un autre terminal et exécutez: npm run dev
echo 3. Allez sur http://localhost:3000/dashboard/admin/teachers/validation
echo.

echo 🔧 Démarrage du serveur Django...
cd django_backend
python manage.py runserver 0.0.0.0:8000

pause





