import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const userSessionClient = request.cookies.get('user_session_client')?.value || request.cookies.get('user_session')?.value
    
    if (!userSessionClient) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    let token: string | null = null
    try {
      const userData = JSON.parse(userSessionClient)
      token = userData?.token || null
    } catch (e) {
      logger.error('Erreur parsing session', e as Error, { context: 'teachers/list' })
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
    }

    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') ? `${baseApi}/teachers/` : `${baseApi}/api/teachers/`

    const djangoResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      cache: 'no-store',
    })

    if (djangoResponse.status === 401) {
      return NextResponse.json(
        { error: 'Session Django expirée' },
        { status: 401 }
      )
    }

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json().catch(() => ({}))
      logger.error('Django teachers error', new Error('fetch error'), { context: 'teachers/list', data: { status: djangoResponse.status, errorData } })
      return NextResponse.json({ error: 'Erreur côté serveur' }, { status: djangoResponse.status })
    }

    const teachersData = await djangoResponse.json()

    // Transformer les données Django en format frontend
    const transformedTeachers = teachersData.map((teacher: any) => ({
      id: teacher.id.toString(),
      name: `${teacher.user.first_name} ${teacher.user.last_name}`,
      avatar: teacher.profile_photo || null,
      location: teacher.city || 'Non spécifié',
      country: teacher.country || 'Non spécifié',
      languages: teacher.languages || ['Français'],
      rating: teacher.average_rating || 0,
      students_count: teacher.students_count || 0,
      hourly_rate: teacher.hourly_rate || 0,
      subjects: teacher.subjects || [],
      class_levels: teacher.class_levels || [],
      bio: teacher.bio || '',
      experience: teacher.experience_years || 0,
      education: teacher.education || '',
      certifications: teacher.certifications || []
    }))

    return NextResponse.json({
      teachers: transformedTeachers,
      success: true
    })

  } catch (error) {
    logger.error('Erreur API Route enseignants', error as Error, { context: 'teachers/list' })
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}


