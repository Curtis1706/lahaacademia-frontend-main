import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    console.log('Récupération de la liste des professeurs')
    
    const response = await fetch(`${apiBase}/teachers/public_list/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Réponse API teachers list status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('Professeurs récupérés:', data)
      
      // Enrichir les données avec les cours de chaque professeur
      const enrichedTeachers = []
      
      for (const teacher of data) {
        try {
          // Essayons une URL directe avec 127.0.0.1 au lieu de localhost
          const coursesUrl = `http://127.0.0.1:8000/api/teachers/${teacher.id}/courses/`
          console.log(`🔍 Récupération courses pour teacher ${teacher.id}:`, coursesUrl)
          
          // Récupérer les cours de ce professeur avec timeout
          const coursesResponse = await fetch(coursesUrl, {
            headers: {
              'Content-Type': 'application/json'
            },
            // Ajouter un timeout plus long
            signal: AbortSignal.timeout(10000) // 10 secondes
          })
          
          console.log(`📊 Response status pour teacher ${teacher.id}:`, coursesResponse.status, coursesResponse.statusText)
          
          if (coursesResponse.ok) {
            const courses = await coursesResponse.json()
            console.log(`✅ Courses trouvés pour teacher ${teacher.id}:`, courses.length)
            console.log(`📚 Détails courses:`, courses.map(c => ({ id: c.id, title: c.title })))
            enrichedTeachers.push({ ...teacher, courses })
          } else {
            console.log(`❌ Erreur response pour teacher ${teacher.id}:`, coursesResponse.status)
            enrichedTeachers.push({ ...teacher, courses: [] })
          }
        } catch (error) {
          console.log('💥 Erreur récupération courses pour teacher', teacher.id, error.message)
          enrichedTeachers.push({ ...teacher, courses: [] })
        }
      }
      
      return NextResponse.json(enrichedTeachers)
    }

    // Fallback avec données de test si l'API Django n'est pas accessible
    console.log('Erreur API, utilisation des données de fallback')
    const fallbackTeachers = [
      {
        id: 1,
        user: {
          first_name: 'Aminata',
          last_name: 'Diallo',
          email: 'aminata.diallo@example.com'
        },
        subjects: ['Mathématiques', 'Physique'],
        bio: 'Professeure expérimentée en mathématiques et physique avec 10 ans d\'expérience.',
        hourly_rate: 5000,
        experience_years: 10,
        rating: 4.8,
        total_students: 156,
        courses: [
          {
            id: 1,
            title: 'Mathématiques Terminale',
            description: 'Préparation au BAC mathématiques',
            subject: 'mathematics',
            level: 'terminale',
            duration: 60,
            price: 5000,
            course_type: 'individual'
          },
          {
            id: 2,
            title: 'Physique Première',
            description: 'Cours de physique pour première S',
            subject: 'physics',
            level: 'premiere',
            duration: 90,
            price: 4500,
            course_type: 'group',
            max_students: 4
          }
        ]
      },
      {
        id: 2,
        user: {
          first_name: 'Mamadou',
          last_name: 'Touré',
          email: 'mamadou.toure@example.com'
        },
        subjects: ['Français', 'Philosophie'],
        bio: 'Spécialiste en littérature française et philosophie.',
        hourly_rate: 4500,
        experience_years: 8,
        rating: 4.6,
        total_students: 89,
        courses: [
          {
            id: 3,
            title: 'Français Terminale',
            description: 'Préparation à l\'épreuve de français du BAC',
            subject: 'french',
            level: 'terminale',
            duration: 60,
            price: 4500,
            course_type: 'individual'
          },
          {
            id: 4,
            title: 'Philosophie Terminale',
            description: 'Initiation à la philosophie et préparation BAC',
            subject: 'philosophy',
            level: 'terminale',
            duration: 120,
            price: 6000,
            course_type: 'individual'
          }
        ]
      }
    ]

    return NextResponse.json(fallbackTeachers)
  } catch (error) {
    console.error('Error fetching teachers list:', error)
    
    // En cas d'erreur, retourner des données minimales
    const fallbackTeachers = [
      {
        id: 1,
        user: {
          first_name: 'Professeur',
          last_name: 'Exemple',
          email: 'prof@example.com'
        },
        subjects: ['Mathématiques'],
        bio: 'Professeur de mathématiques',
        hourly_rate: 5000,
        experience_years: 5,
        rating: 4.5,
        total_students: 50,
        courses: [
          {
            id: 1,
            title: 'Mathématiques Générale',
            description: 'Cours de mathématiques',
            subject: 'mathematics',
            level: 'seconde',
            duration: 60,
            price: 5000,
            course_type: 'individual'
          }
        ]
      }
    ]
    
    return NextResponse.json(fallbackTeachers)
  }
}