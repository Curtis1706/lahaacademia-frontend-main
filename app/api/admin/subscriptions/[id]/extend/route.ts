import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour prolonger un abonnement
 * POST /api/admin/subscriptions/{id}/extend
 * Body: { days: number }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id
    const body = await request.json()
    
    if (!body.days || body.days <= 0) {
      return NextResponse.json(
        { error: 'Nombre de jours invalide' },
        { status: 400 }
      )
    }
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/subscriptions/extend' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/subscriptions/${subscriptionId}/extend/`

    logger.info('Extending subscription', { subscriptionId, days: body.days }, { context: 'admin/subscriptions/extend' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ days: body.days })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to extend subscription', new Error('Django API error'), {
        context: 'admin/subscriptions/extend',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la prolongation' },
        { status: response.status }
      )
    }

    logger.info('Subscription extended', { subscriptionId, days: body.days }, { context: 'admin/subscriptions/extend' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error extending subscription', error as Error, { context: 'admin/subscriptions/extend' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

