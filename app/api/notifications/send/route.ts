import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour envoyer des notifications (SMS, Email, WhatsApp)
 * POST /api/notifications/send
 */
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'notifications/send' })
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
      recipient_id,
      channels, // Array: ['email', 'sms', 'whatsapp']
      notification_type, // 'booking_reminder', 'payment_confirmation', 'course_update', etc.
      title,
      message,
      data, // Additional data for the notification
      schedule_time, // Optional: schedule for later
    } = body

    // Validation
    if (!recipient_id || !channels || !notification_type || !message) {
      return NextResponse.json(
        { error: 'Données manquantes: recipient_id, channels, notification_type et message requis' },
        { status: 400 }
      )
    }

    logger.info('Sending notification', {
      sender_id: user?.id,
      recipient_id,
      channels,
      notification_type,
      scheduled: !!schedule_time
    }, { context: 'notifications/send' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/notifications/send/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient_id,
        channels,
        notification_type,
        title,
        message,
        data,
        schedule_time
      })
    })

    const responseData = await response.json()

    if (!response.ok) {
      logger.error('Failed to send notification', new Error('Django API error'), {
        context: 'notifications/send',
        data: { status: response.status, error: responseData }
      })
      return NextResponse.json(
        responseData || { error: 'Erreur lors de l\'envoi de la notification' },
        { status: response.status }
      )
    }

    logger.info('Notification sent successfully', {
      notification_ids: responseData.notification_ids,
      channels_sent: responseData.channels_sent
    }, { context: 'notifications/send' })

    return NextResponse.json(responseData)
  } catch (error) {
    logger.error('Error sending notification', error as Error, { context: 'notifications/send' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




