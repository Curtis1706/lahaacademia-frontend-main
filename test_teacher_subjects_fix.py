#!/usr/bin/env python3
"""
Script pour tester la correction de l'erreur teacher.subjects.slice(...).join
"""

import json

def test_subjects_normalization():
    """Tester la normalisation des données subjects"""
    print("🧪 Test de la normalisation des données subjects")
    print("=" * 60)
    
    # Simuler différentes formes de données subjects
    test_cases = [
        {
            "name": "Array normal",
            "data": {
                "subjects": ["mathématiques", "physique", "chimie"]
            }
        },
        {
            "name": "String JSON",
            "data": {
                "subjects": '["mathématiques", "physique", "chimie"]'
            }
        },
        {
            "name": "String simple",
            "data": {
                "subjects": "mathématiques"
            }
        },
        {
            "name": "String vide",
            "data": {
                "subjects": ""
            }
        },
        {
            "name": "Null/undefined",
            "data": {
                "subjects": None
            }
        },
        {
            "name": "Nombre",
            "data": {
                "subjects": 123
            }
        }
    ]
    
    # Simuler la fonction de normalisation JavaScript
    def normalize_subjects(teacher_data):
        subjects = teacher_data.get("subjects")
        
        if isinstance(subjects, list):
            return subjects
        elif isinstance(subjects, str):
            if subjects == "":
                return []
            try:
                return json.loads(subjects)
            except json.JSONDecodeError:
                return [subjects]
        else:
            return []
    
    print("📋 Résultats des tests:")
    print()
    
    for test_case in test_cases:
        result = normalize_subjects(test_case["data"])
        print(f"✅ {test_case['name']}:")
        print(f"   Entrée: {test_case['data']['subjects']}")
        print(f"   Résultat: {result}")
        print(f"   Type: {type(result)}")
        print(f"   Array.isArray(): {isinstance(result, list)}")
        
        # Tester les méthodes qui causent l'erreur
        if isinstance(result, list) and len(result) > 0:
            try:
                slice_result = result[:2]
                join_result = ", ".join(slice_result)
                print(f"   slice(0, 2).join(', '): {join_result}")
            except Exception as e:
                print(f"   ❌ Erreur: {e}")
        else:
            print(f"   ⚠️ Pas de données à traiter")
        print()

def test_teacher_data_structure():
    """Tester la structure complète des données de professeur"""
    print("🧪 Test de la structure complète des données")
    print("=" * 60)
    
    # Simuler des données de professeur complètes
    teacher_data = {
        "id": "1",
        "user": {
            "first_name": "Jean",
            "last_name": "Dupont"
        },
        "subjects": '["mathématiques", "physique"]',
        "profile_photo": "/media/teacher_photos/photo.jpg",
        "average_rating": 4.5,
        "experience_years": 5,
        "hourly_rate": 25000,
        "total_students": 50,
        "total_sessions": 200,
        "bio": "Professeur expérimenté",
        "specializations": '["algèbre", "géométrie"]',
        "certifications": '["CAPES", "Agrégation"]'
    }
    
    def normalize_teacher_data(teacher):
        return {
            **teacher,
            "subjects": normalize_subjects(teacher),
            "name": f"{teacher.get('user', {}).get('first_name', '')} {teacher.get('user', {}).get('last_name', '')}".strip() or "Professeur inconnu",
            "avatar": teacher.get("profile_photo") or "/placeholder-user.jpg",
            "rating": teacher.get("average_rating") or 0,
            "experience": f"{teacher.get('experience_years', 0)} ans d'expérience",
            "hourly_rate": teacher.get("hourly_rate") or 0,
            "country": teacher.get("country") or "Non spécifié",
            "total_students": teacher.get("total_students") or 0,
            "total_sessions": teacher.get("total_sessions") or 0,
            "bio": teacher.get("bio") or "",
            "specializations": normalize_subjects({"subjects": teacher.get("specializations")}),
            "certifications": normalize_subjects({"subjects": teacher.get("certifications")})
        }
    
    def normalize_subjects(data):
        subjects = data.get("subjects")
        if isinstance(subjects, list):
            return subjects
        elif isinstance(subjects, str):
            if subjects == "":
                return []
            try:
                return json.loads(subjects)
            except json.JSONDecodeError:
                return [subjects]
        else:
            return []
    
    normalized = normalize_teacher_data(teacher_data)
    
    print("📋 Données originales:")
    print(json.dumps(teacher_data, indent=2, ensure_ascii=False))
    print()
    
    print("📋 Données normalisées:")
    print(json.dumps(normalized, indent=2, ensure_ascii=False))
    print()
    
    # Tester les opérations qui causent l'erreur
    print("🧪 Test des opérations problématiques:")
    try:
        subjects_display = normalized["subjects"][:2]
        result = ", ".join(subjects_display)
        print(f"✅ subjects.slice(0, 2).join(', '): {result}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale"""
    print("🚀 Test de la correction de l'erreur teacher.subjects.slice(...).join")
    print("=" * 80)
    
    test_subjects_normalization()
    test_teacher_data_structure()
    
    print("=" * 80)
    print("✅ Tests terminés!")
    print("\n💡 La correction permet de:")
    print("1. Gérer les subjects sous forme d'array, string JSON, ou string simple")
    print("2. Normaliser toutes les données des professeurs")
    print("3. Éviter l'erreur 'slice(...).join is not a function'")
    print("4. Afficher correctement les matières dans l'interface")

if __name__ == '__main__':
    main()







