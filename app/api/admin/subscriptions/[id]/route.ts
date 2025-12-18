import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer un abonnement spécifique
 * GET /api/admin/subscriptions/{id}
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/subscriptions/id/GET' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/subscriptions/${subscriptionId}/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch subscription', new Error('Django API error'), {
        context: 'admin/subscriptions/id/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération de l\'abonnement' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching subscription', error as Error, { context: 'admin/subscriptions/id/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

/**
 * API pour mettre à jour un abonnement
 * PUT /api/admin/subscriptions/{id}
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = params.id
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/subscriptions/id/PUT' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/subscriptions/${subscriptionId}/`

    logger.info('Updating subscription', { subscriptionId, action: body.action }, { context: 'admin/subscriptions/id/PUT' })

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
      logger.error('Failed to update subscription', new Error('Django API error'), {
        context: 'admin/subscriptions/id/PUT',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la mise à jour de l\'abonnement' },
        { status: response.status }
      )
    }

    logger.info('Subscription updated', { subscriptionId }, { context: 'admin/subscriptions/id/PUT' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating subscription', error as Error, { context: 'admin/subscriptions/id/PUT' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

