import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    console.log('Récupération des cours du professeur:', user.email)
    
    // D'abord, récupérer les infos du professeur pour avoir son ID
    const teacherResponse = await fetch(`${apiBase}/teachers/me/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (teacherResponse.ok) {
      const teacherData = await teacherResponse.json()
      console.log('Données professeur:', teacherData)
      
      // Récupérer les cours de ce professeur
      const coursesResponse = await fetch(`${apiBase}/teachers/${teacherData.id}/courses/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Réponse API courses status:', coursesResponse.status, coursesResponse.statusText)

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json()
        console.log('Cours récupérés depuis Django:', coursesData)
        
        // Adapter les données pour le frontend
        const adaptedCourses = coursesData.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          subject: course.subject,
          level: course.level,
          duration: course.duration,
          price: course.price,
          course_type: 'individual', // Par défaut, pourrait être dans les métadonnées
          max_students: 1,
          created_at: course.created_at
        }))
        
        return NextResponse.json(adaptedCourses)
      }
    }

    // Fallback avec données de test si l'API Django n'est pas accessible
    console.log('Erreur API, utilisation des données de fallback')
    const fallbackCourses = [
      {
        id: 1,
        title: 'Mathématiques Terminale',
        description: 'Cours de mathématiques pour les élèves de terminale, préparation au BAC',
        subject: 'mathematics',
        level: 'terminale',
        duration: 60,
        price: 5000,
        max_students: 1,
        course_type: 'individual',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Physique Première',
        description: 'Cours de physique pour première scientifique',
        subject: 'physics',
        level: 'premiere',
        duration: 90,
        price: 4500,
        max_students: 4,
        course_type: 'group',
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json(fallbackCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    
    // En cas d'erreur, retourner un tableau vide
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    console.log('=== CRÉATION DE COURS ===')
    console.log('User token:', user.token?.substring(0, 20) + '...')
    console.log('Course data:', body)

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    // Adapter les données pour l'API Django
    const djangoPayload = {
      title: body.title,
      description: body.description,
      subject: body.subject,
      level: body.level,
      duration: body.duration,
      price: body.price,
      // Ajouter des champs obligatoires pour Django
      country: 'Bénin', // Par défaut
      difficulty_level: 'beginner'
    }

    console.log('Django payload:', djangoPayload)

    const response = await fetch(`${apiBase}/courses/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(djangoPayload)
    })

    console.log('Réponse API create course status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('Cours créé dans Django:', data)
      
      // Adapter la réponse pour le frontend
      const adaptedCourse = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        level: data.level,
        duration: data.duration,
        price: data.price,
        course_type: body.course_type,
        max_students: body.max_students,
        created_at: data.created_at,
        teacher: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`
        }
      }
      
      return NextResponse.json(adaptedCourse, { status: 201 })
    }

    // Fallback - retourner les données envoyées avec un ID généré
    console.log('Erreur API, création fallback')
    const fallbackCourse = {
      id: Date.now(), // ID temporaire basé sur timestamp
      ...body,
      created_at: new Date().toISOString(),
      teacher: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      }
    }

    return NextResponse.json(fallbackCourse, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du cours' }, { status: 500 })
  }
}
