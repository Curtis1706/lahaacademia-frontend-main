import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les cours collectifs
 * GET /api/classes - Liste des cours collectifs
 * POST /api/classes - Créer un nouveau cours collectif
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'classes/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const level = searchParams.get('level')
    const status = searchParams.get('status') // upcoming, ongoing, completed
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'

    const params = new URLSearchParams()
    if (subject) params.append('subject', subject)
    if (level) params.append('level', level)
    if (status) params.append('status', status)
    params.append('page', page)
    params.append('page_size', page_size)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/classes/?${params.toString()}`

    logger.debug('Fetching group classes', { filters: Object.fromEntries(params) }, { context: 'classes/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch group classes', new Error('Django API error'), {
        context: 'classes/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des cours collectifs' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching group classes', error as Error, { context: 'classes/GET' })
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'classes/POST' })
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
      subject,
      level,
      start_date,
      end_date,
      schedule, // Array of sessions
      max_students,
      price,
      teacher_id
    } = body

    // Validation
    if (!title || !subject || !level || !start_date || !max_students) {
      return NextResponse.json(
        { error: 'Données manquantes: title, subject, level, start_date et max_students requis' },
        { status: 400 }
      )
    }

    logger.info('Creating group class', {
      title,
      subject,
      level,
      max_students,
      teacher_id: teacher_id || user?.id
    }, { context: 'classes/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/classes/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description,
        subject,
        level,
        start_date,
        end_date,
        schedule,
        max_students,
        price,
        teacher_id: teacher_id || user?.id
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create group class', new Error('Django API error'), {
        context: 'classes/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du cours collectif' },
        { status: response.status }
      )
    }

    logger.info('Group class created successfully', { class_id: data.id }, { context: 'classes/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating group class', error as Error, { context: 'classes/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


