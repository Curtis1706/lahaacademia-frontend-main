import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route: Récupération des données enseignants')
    
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

    // Appeler Django pour récupérer les enseignants
    const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/teachers/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '', // Transmettre tous les cookies
      },
    })

    console.log('📡 Réponse Django:', djangoResponse.status, djangoResponse.statusText)

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

    const teachersData = await djangoResponse.json()
    console.log('✅ Données enseignants reçues de Django:', teachersData)

    // Transformer les données Django en format frontend
    const transformedTeachers = teachersData.map((teacher: any) => ({
      id: teacher.id.toString(),
      name: `${teacher.user.first_name} ${teacher.user.last_name}`,
      avatar: teacher.profile_photo || null,
      location: teacher.city || 'Non spécifié',
      country: teacher.country || 'Non spécifié',
      languages: teacher.languages || ['Français'],
      rating: teacher.average_rating || 4.0,
      students_count: teacher.students_count || 0,
      hourly_rate: teacher.hourly_rate || 5000,
      subjects: teacher.subjects || [],
      class_levels: teacher.class_levels || [],
      bio: teacher.bio || 'Enseignant expérimenté',
      experience: teacher.experience_years || 0,
      education: teacher.education || 'Formation pédagogique',
      certifications: teacher.certifications || []
    }))

    console.log('✅ Enseignants transformés:', transformedTeachers)

    return NextResponse.json({
      teachers: transformedTeachers,
      success: true
    })

  } catch (error) {
    console.error('❌ Erreur API Route enseignants:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}


