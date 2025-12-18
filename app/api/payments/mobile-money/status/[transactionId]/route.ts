import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour vérifier le statut d'un paiement Mobile Money
 * GET /api/payments/mobile-money/status/:transactionId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'mobile-money/status' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const transactionId = params.transactionId

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID de transaction requis' },
        { status: 400 }
      )
    }

    logger.debug('Checking mobile money payment status', { transactionId }, { context: 'mobile-money/status' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/payments/mobile-money/status/${transactionId}/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to check payment status', new Error('Django API error'), {
        context: 'mobile-money/status',
        data: { status: response.status, transactionId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la vérification du statut' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error checking payment status', error as Error, { context: 'mobile-money/status' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


