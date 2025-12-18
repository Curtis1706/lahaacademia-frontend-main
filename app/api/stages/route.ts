import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les stages intensifs
 * GET /api/stages - Liste des stages
 * POST /api/stages - Créer un nouveau stage (teacher/admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'stages/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') // exam_prep, remedial, vacation, etc.
    const level = searchParams.get('level')
    const status = searchParams.get('status') // upcoming, ongoing, completed
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'

    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (level) params.append('level', level)
    if (status) params.append('status', status)
    params.append('page', page)
    params.append('page_size', page_size)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/stages/?${params.toString()}`

    logger.debug('Fetching intensive stages', { filters: Object.fromEntries(params) }, { context: 'stages/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch stages', new Error('Django API error'), {
        context: 'stages/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des stages' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching stages', error as Error, { context: 'stages/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null
    let user: any = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
        user = sessionData
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'stages/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      level,
      subjects, // Array of subjects covered
      start_date,
      end_date,
      daily_schedule, // Array of daily sessions
      max_students,
      price,
      includes_exam, // Boolean
      certification, // Boolean
    } = body

    // Validation
    if (!title || !category || !level || !start_date || !end_date || !max_students || !price) {
      return NextResponse.json(
        { error: 'Données manquantes: title, category, level, start_date, end_date, max_students et price requis' },
        { status: 400 }
      )
    }

    logger.info('Creating intensive stage', {
      title,
      category,
      level,
      start_date,
      end_date,
      max_students,
      organizer_id: user?.id
    }, { context: 'stages/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/stages/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        category,
        level,
        subjects,
        start_date,
        end_date,
        daily_schedule,
        max_students,
        price,
        includes_exam: includes_exam || false,
        certification: certification || false,
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create stage', new Error('Django API error'), {
        context: 'stages/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du stage' },
        { status: response.status }
      )
    }

    logger.info('Stage created successfully', { stage_id: data.id }, { context: 'stages/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating stage', error as Error, { context: 'stages/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


