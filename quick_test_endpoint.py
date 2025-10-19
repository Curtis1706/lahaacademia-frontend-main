#!/usr/bin/env python3
"""
Test rapide de l'endpoint d'inscription
"""

import requests
import json

def test_endpoint():
    try:
        # Test simple de l'endpoint
        response = requests.post('http://localhost:8000/api/teachers/register/', 
                               json={'email': 'test@example.com', 'password': 'test123'})
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == '__main__':
    test_endpoint()





