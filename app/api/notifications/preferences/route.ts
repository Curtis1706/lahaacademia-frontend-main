import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les préférences de notification
 * GET /api/notifications/preferences
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/preferences/GET' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/preferences/`

    logger.debug('Fetching notification preferences', {}, { context: 'notifications/preferences/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch notification preferences', new Error('Django API error'), {
        context: 'notifications/preferences/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des préférences' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching notification preferences', error as Error, { context: 'notifications/preferences/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

/**
 * API pour mettre à jour les préférences de notification
 * PUT /api/notifications/preferences
 */
export async function PUT(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/preferences/PUT' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/preferences/`

    logger.info('Updating notification preferences', {}, { context: 'notifications/preferences/PUT' })

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to update notification preferences', new Error('Django API error'), {
        context: 'notifications/preferences/PUT',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la mise à jour des préférences' },
        { status: response.status }
      )
    }

    logger.info('Notification preferences updated', {}, { context: 'notifications/preferences/PUT' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating notification preferences', error as Error, { context: 'notifications/preferences/PUT' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
