import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les matières (subjects)
 * GET /api/admin/config/subjects - Liste des matières
 * POST /api/admin/config/subjects - Créer une nouvelle matière
 */
export async function GET(request: NextRequest) {
  try {
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/config/subjects/GET' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/config/subjects/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch subjects', new Error('Django API error'), {
        context: 'admin/config/subjects/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des matières' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching subjects', error as Error, { context: 'admin/config/subjects/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/config/subjects/POST' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const body = await request.json()
    const { name, code, description, color } = body

    if (!name || !code) {
      return NextResponse.json({ error: 'name et code requis' }, { status: 400 })
    }

    logger.info('Creating subject', { name, code }, { context: 'admin/config/subjects/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/config/subjects/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, code, description, color })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create subject', new Error('Django API error'), {
        context: 'admin/config/subjects/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création de la matière' },
        { status: response.status }
      )
    }

    logger.info('Subject created successfully', { subject_id: data.id }, { context: 'admin/config/subjects/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating subject', error as Error, { context: 'admin/config/subjects/POST' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}


