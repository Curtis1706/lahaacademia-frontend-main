import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route: Récupération des cours disponibles')
    
    // Récupérer le cookie user_session_client
    const userSessionClient = request.cookies.get('user_session_client')?.value
    
    if (!userSessionClient) {
      console.error('❌ Pas de cookie user_session_client')
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Parser les données du cookie
    const userData = JSON.parse(userSessionClient)
    console.log('✅ Données utilisateur du cookie:', userData)

    // Appeler Django pour récupérer les cours
    const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/courses/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '', // Transmettre tous les cookies
      },
    })

    console.log('📡 Réponse Django cours:', djangoResponse.status, djangoResponse.statusText)

    if (djangoResponse.status === 401) {
      console.error('❌ Django: Non authentifié')
      return NextResponse.json(
        { error: 'Session Django expirée' },
        { status: 401 }
      )
    }

    if (!djangoResponse.ok) {
      throw new Error(`Django error: ${djangoResponse.status}`)
    }

    const coursesData = await djangoResponse.json()
    console.log('✅ Données cours reçues de Django:', coursesData)

    // Transformer les données Django en format frontend
    const transformedCourses = coursesData.map((course: any) => ({
      id: course.id.toString(),
      title: course.title,
      subject: course.subject,
      duration: course.duration || 60,
      price: course.price || 5000,
      available_slots: course.available_slots || ['09:00', '14:00'],
      teacher_id: course.teacher?.id?.toString() || '1',
      class_level: course.class_level || 'Seconde',
      country: course.teacher?.country || 'Non spécifié',
      language: course.language || 'Français',
      description: course.description || 'Cours de qualité',
      teacher: {
        id: course.teacher?.id?.toString() || '1',
        name: course.teacher ? `${course.teacher.user?.first_name || ''} ${course.teacher.user?.last_name || ''}`.trim() : 'Professeur',
        country: course.teacher?.country || 'Non spécifié',
        languages: course.teacher?.languages || ['Français'],
        rating: course.teacher?.average_rating || 4.0
      }
    }))

    console.log('✅ Cours transformés:', transformedCourses)

    return NextResponse.json({
      courses: transformedCourses,
      success: true
    })

  } catch (error) {
    console.error('❌ Erreur API Route cours:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}


