import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour marquer toutes les notifications comme lues
 * POST /api/notifications/mark-all-read
 */
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/mark-all-read' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/mark-all-read/`

    logger.info('Marking all notifications as read', {}, { context: 'notifications/mark-all-read' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to mark all notifications as read', new Error('Django API error'), {
        context: 'notifications/mark-all-read',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors du marquage de toutes les notifications' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error marking all notifications as read', error as Error, { context: 'notifications/mark-all-read' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

