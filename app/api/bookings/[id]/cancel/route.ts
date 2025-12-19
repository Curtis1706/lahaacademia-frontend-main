import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour annuler une réservation
 * POST /api/bookings/:id/cancel
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'bookings/cancel' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const bookingId = params.id

    if (!bookingId) {
      return NextResponse.json(
        { error: 'ID de réservation requis' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const reason = body.reason || ''

    logger.info('Cancelling booking', { bookingId, reason }, { context: 'bookings/cancel' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/bookings/${bookingId}/cancel/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to cancel booking', new Error('Django API error'), {
        context: 'bookings/cancel',
        data: { status: response.status, bookingId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'annulation de la réservation' },
        { status: response.status }
      )
    }

    logger.info('Booking cancelled successfully', { bookingId }, { context: 'bookings/cancel' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error cancelling booking', error as Error, { context: 'bookings/cancel' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




