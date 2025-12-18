import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les notifications de l'utilisateur
 * GET /api/notifications?page=1&unread_only=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/GET' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    // Construire les query params
    const params = new URLSearchParams()
    const page = searchParams.get('page')
    const unreadOnly = searchParams.get('unread_only')
    
    if (page) params.append('page', page)
    if (unreadOnly) params.append('unread_only', unreadOnly)
    
    const endpoint = `${baseApi}/notifications/?${params.toString()}`

    logger.debug('Fetching notifications', { page, unreadOnly }, { context: 'notifications/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch notifications', new Error('Django API error'), {
        context: 'notifications/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des notifications' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching notifications', error as Error, { context: 'notifications/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

/**
 * API pour créer une notification (admin uniquement)
 * POST /api/notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/POST' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/`

    logger.info('Creating notification', { type: body.type }, { context: 'notifications/POST' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create notification', new Error('Django API error'), {
        context: 'notifications/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création de la notification' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error creating notification', error as Error, { context: 'notifications/POST' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

