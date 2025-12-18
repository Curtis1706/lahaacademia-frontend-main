import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les forums de discussion
 * GET /api/forums - Liste des forums disponibles
 * POST /api/forums - Créer un nouveau forum (admin only)
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'forums/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') // Niveau scolaire
    const country = searchParams.get('country')
    const subject = searchParams.get('subject')
    const category = searchParams.get('category') // general, homework_help, exam_prep, etc.

    const params = new URLSearchParams()
    if (level) params.append('level', level)
    if (country) params.append('country', country)
    if (subject) params.append('subject', subject)
    if (category) params.append('category', category)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/forums/?${params.toString()}`

    logger.debug('Fetching forums', { filters: Object.fromEntries(params) }, { context: 'forums/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch forums', new Error('Django API error'), {
        context: 'forums/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des forums' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching forums', error as Error, { context: 'forums/GET' })
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

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'forums/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, category, level, country, subject } = body

    // Validation
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Données manquantes: name et category requis' },
        { status: 400 }
      )
    }

    logger.info('Creating forum', { name, category, level, country }, { context: 'forums/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/forums/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        category,
        level,
        country,
        subject
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create forum', new Error('Django API error'), {
        context: 'forums/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du forum' },
        { status: response.status }
      )
    }

    logger.info('Forum created successfully', { forum_id: data.id }, { context: 'forums/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating forum', error as Error, { context: 'forums/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


