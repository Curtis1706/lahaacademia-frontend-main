import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour vérifier un code 2FA
 * POST /api/auth/2fa/verify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, session_token } = body

    // Validation
    if (!code || (!email && !session_token)) {
      return NextResponse.json(
        { error: 'Données manquantes: code et (email ou session_token) requis' },
        { status: 400 }
      )
    }

    logger.info('Verifying 2FA code', {
      email,
      code_length: code.length
    }, { context: '2fa/verify' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/auth/2fa/verify/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        code,
        session_token
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to verify 2FA code', new Error('Django API error'), {
        context: '2fa/verify',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Code invalide ou expiré' },
        { status: response.status }
      )
    }

    logger.info('2FA verification successful', {
      email
    }, { context: '2fa/verify' })

    // Si la vérification réussit, retourner le token d'authentification
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error verifying 2FA code', error as Error, { context: '2fa/verify' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


