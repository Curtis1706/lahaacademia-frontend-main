#!/usr/bin/env python3
"""
Script pour tester la construction des URLs des documents
"""

def test_url_construction():
    """Tester la construction des URLs comme le fait le frontend"""
    
    print("🔍 Test de la construction des URLs")
    print("=" * 50)
    
    # Simuler les chemins de fichiers retournés par Django
    test_paths = [
        "/media/teacher_diplomas/diploma.pdf",
        "/media/teacher_criminal_records/criminal.pdf", 
        "/media/teacher_identity/identity.pdf",
        "/media/teacher_address/address.pdf",
        "/media/teacher_photos/photo.jpg",
        "/media/teacher_cvs/cv.pdf",
        "teacher_diplomas/diploma.pdf",  # Chemin relatif
        "http://localhost:8000/media/teacher_diplomas/diploma.pdf"  # URL complète
    ]
    
    # Simuler la fonction getFileUrl du frontend
    def getFileUrl(filePath):
        if not filePath:
            return None
        
        # Si c'est déjà une URL complète (commence par http), l'utiliser directement
        if filePath.startswith('http'):
            return filePath
        
        # Construire l'URL complète avec l'URL de base du serveur Django
        baseApi = 'http://localhost:8000'
        
        # Si le chemin commence par /media/, utiliser tel quel
        if filePath.startswith('/media/'):
            return f"{baseApi}{filePath}"
        
        # Sinon, ajouter le préfixe /media/
        return f"{baseApi}/media/{filePath}"
    
    print("🧪 Test des différents formats de chemins:")
    print()
    
    for path in test_paths:
        result = getFileUrl(path)
        print(f"📄 Entrée: {path}")
        print(f"🔗 Résultat: {result}")
        print()
    
    print("✅ Construction des URLs testée!")
    print()
    print("💡 Le problème dans l'erreur 404 était probablement:")
    print("   - L'URL contenait '/api/media/' au lieu de '/media/'")
    print("   - Cela indique que la baseApi contenait '/api' à la fin")
    print("   - La correction a été appliquée dans app/api/teachers/register/route.ts")

if __name__ == '__main__':
    test_url_construction()







