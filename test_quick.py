import requests

# Test rapide de l'endpoint des professeurs
response = requests.get("http://localhost:8000/api/teachers/available-for-booking/")
print(f"Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"Professeurs trouvés: {data.get('total', 0)}")
    if data.get('teachers'):
        for teacher in data['teachers']:
            print(f"- {teacher.get('name', 'N/A')}")
else:
    print(f"Erreur: {response.text}")

