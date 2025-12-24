import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour marquer une notification comme lue
 * POST /api/notifications/{id}/mark-read
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = params.id
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/mark-read' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/${notificationId}/mark-read/`

    logger.info('Marking notification as read', { notificationId }, { context: 'notifications/mark-read' })

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
      logger.error('Failed to mark notification as read', new Error('Django API error'), {
        context: 'notifications/mark-read',
        data: { status: response.status, error: data, notificationId }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors du marquage comme lu' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error marking notification as read', error as Error, { context: 'notifications/mark-read' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}



