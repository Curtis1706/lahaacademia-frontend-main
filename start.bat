@echo off
echo ========================================
echo    LAHACADEMIA - Démarrage du Projet
echo ========================================

echo.
echo 1. Démarrage du backend Django...
cd django_backend
start "Django Backend" cmd /k "venv\Scripts\activate && python manage.py runserver 0.0.0.0:8000"

echo.
echo 2. Démarrage du frontend Next.js...
cd ..
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Projet démarré avec succès !
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Admin:    http://localhost:8000/admin
echo.
echo Appuyez sur une touche pour fermer...
pause > nul


























