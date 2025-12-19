import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le cookie user_session_client
    const userSessionClient = request.cookies.get('user_session_client')?.value
    
    if (!userSessionClient) {
      logger.error('No user session cookie', new Error('Unauthorized'), { context: 'courses/GET' })
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Parser les données du cookie
    const userData = JSON.parse(userSessionClient)
    
    // Construction des paramètres de recherche avancée
    const { searchParams } = new URL(request.url)
    const filters = {
      subject: searchParams.get('subject') || '',
      country: searchParams.get('country') || '',
      level: searchParams.get('level') || '',
      language: searchParams.get('language') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      min_rating: searchParams.get('min_rating') || '',
      availability: searchParams.get('availability') || '',
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      sort_by: searchParams.get('sort_by') || 'created_at', // created_at, price_asc, price_desc, rating
      search: searchParams.get('search') || '' // recherche texte libre
    }

    // Construire l'URL Django avec filtres
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })
    const endpoint = `${baseApi}/api/courses/?${queryParams}`

    logger.debug('Fetching courses with filters', filters, { context: 'courses/GET' })

    // Appeler Django pour récupérer les cours
    const djangoResponse = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '', // Transmettre tous les cookies
      },
      cache: 'no-store',
    })

    logger.debug('Django response', { status: djangoResponse.status }, { context: 'courses/GET' })

    if (djangoResponse.status === 401) {
      logger.error('Django unauthorized', new Error('Session expired'), { context: 'courses/GET' })
      return NextResponse.json(
        { error: 'Session Django expirée' },
        { status: 401 }
      )
    }

    const coursesData = await djangoResponse.json()

    if (!djangoResponse.ok) {
      logger.error('Django API error', new Error('fetch courses failed'), {
        context: 'courses/GET',
        data: { status: djangoResponse.status, error: coursesData }
      })
      return NextResponse.json(
        { error: coursesData.error || 'Erreur lors de la récupération des cours' },
        { status: djangoResponse.status }
      )
    }

    logger.debug('Courses fetched successfully', { count: coursesData.length || coursesData.results?.length }, { context: 'courses/GET' })

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
        name: course.teacher ? `${course.teacher.user?.first_name || ''} ${course.teacher.user?.last_name || ''}`.trim() : 'Enseignant',
        country: course.teacher?.country || 'Non spécifié',
        languages: course.teacher?.languages || ['Français'],
        rating: course.teacher?.average_rating || 4.0
      }
    }))

    return NextResponse.json({
      courses: transformedCourses,
      success: true,
      pagination: {
        page: parseInt(filters.page),
        limit: parseInt(filters.limit),
        total: coursesData.count || transformedCourses.length
      }
    })

  } catch (error) {
    logger.error('Error fetching courses', error as Error, { context: 'courses/GET' })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}


