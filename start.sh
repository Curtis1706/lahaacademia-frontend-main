#!/bin/bash

echo "========================================"
echo "   LAHACADEMIA - Démarrage du Projet"
echo "========================================"

echo ""
echo "1. Démarrage du backend Django..."
cd django_backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &
DJANGO_PID=$!

echo ""
echo "2. Démarrage du frontend Next.js..."
cd ..
npm run dev &
NEXT_PID=$!

echo ""
echo "========================================"
echo "   Projet démarré avec succès !"
echo "========================================"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Admin:    http://localhost:8000/admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter..."

# Fonction pour nettoyer les processus
cleanup() {
    echo ""
    echo "Arrêt des serveurs..."
    kill $DJANGO_PID $NEXT_PID 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait

