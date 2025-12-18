import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API Webhook pour recevoir les callbacks de Mobile Money (MTN/Orange)
 * POST /api/payments/mobile-money/callback
 * 
 * Cette route est appelée par les providers Mobile Money pour notifier
 * du statut du paiement (succès, échec, en attente)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    logger.info('Received mobile money callback', { 
      transaction_id: body.transaction_id,
      status: body.status,
      provider: body.provider 
    }, { context: 'mobile-money/callback' })

    // Vérifier la signature/authenticity du callback (sécurité)
    const signature = request.headers.get('X-Mobile-Money-Signature')
    
    // NOTE: La validation de signature est effectuée côté Django backend
    // Le backend Django vérifie la signature selon le provider (MTN Money, Orange Money)
    // en utilisant les clés secrètes configurées dans les settings

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/payments/mobile-money/callback/`

    // Transférer le callback au backend Django
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Transférer la signature pour validation côté Django
        ...(signature ? { 'X-Mobile-Money-Signature': signature } : {})
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to process mobile money callback', new Error('Django API error'), {
        context: 'mobile-money/callback',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors du traitement du callback' },
        { status: response.status }
      )
    }

    logger.info('Mobile money callback processed successfully', { 
      transaction_id: body.transaction_id 
    }, { context: 'mobile-money/callback' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error processing mobile money callback', error as Error, { context: 'mobile-money/callback' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


