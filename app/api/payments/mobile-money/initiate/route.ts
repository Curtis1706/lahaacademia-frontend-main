import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour initier un paiement Mobile Money (MTN ou Orange)
 * POST /api/payments/mobile-money/initiate
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'mobile-money/initiate' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { provider, phone_number, amount, currency, description, payment_type } = body

    // Validation des données
    if (!provider || !phone_number || !amount) {
      return NextResponse.json(
        { error: 'Données manquantes: provider, phone_number, amount requis' },
        { status: 400 }
      )
    }

    if (!['mtn', 'orange'].includes(provider.toLowerCase())) {
      return NextResponse.json(
        { error: 'Provider non supporté. Utilisez "mtn" ou "orange"' },
        { status: 400 }
      )
    }

    logger.info('Initiating mobile money payment', { 
      provider, 
      phone_number: phone_number.substring(0, 4) + '****', // Masquer le numéro
      amount, 
      currency,
      user_id: user?.id 
    }, { context: 'mobile-money/initiate' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/payments/mobile-money/initiate/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: provider.toLowerCase(),
        phone_number,
        amount,
        currency: currency || 'XOF', // Franc CFA par défaut
        description: description || 'Paiement LAHACADEMIA',
        payment_type: payment_type || 'subscription', // subscription, course, stage
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to initiate mobile money payment', new Error('Django API error'), {
        context: 'mobile-money/initiate',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'initiation du paiement' },
        { status: response.status }
      )
    }

    logger.info('Mobile money payment initiated successfully', { 
      transaction_id: data.transaction_id,
      provider,
      status: data.status 
    }, { context: 'mobile-money/initiate' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error initiating mobile money payment', error as Error, { context: 'mobile-money/initiate' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


