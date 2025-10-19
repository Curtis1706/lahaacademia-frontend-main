@echo off
echo ================================================
echo    DEMARRAGE INSCRIPTION PROFESSEURS
echo ================================================
echo.

echo 1. Verification du fichier .env.local...
if exist .env.local (
    echo    ✅ Fichier .env.local trouve
    type .env.local
) else (
    echo    ❌ Fichier .env.local manquant
    echo    Creation du fichier...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo    ✅ Fichier .env.local cree
)

echo.
echo 2. Demarrage du serveur Django...
echo    Port: 8000
start "Django Server" cmd /k "cd django_backend && python manage.py runserver 8000"

echo.
echo 3. Demarrage du serveur Next.js...
echo    Port: 3000
start "Next.js Server" cmd /k "npm run dev"

echo.
echo ================================================
echo    SERVEURS DEMARRES
echo ================================================
echo Django:  http://localhost:8000
echo Next.js: http://localhost:3000
echo.
echo Pour tester l'inscription:
echo 1. Allez sur http://localhost:3000
echo 2. Naviguez vers l'inscription professeur
echo 3. Remplissez le formulaire
echo.
echo Appuyez sur une touche pour fermer...
pause > nul




