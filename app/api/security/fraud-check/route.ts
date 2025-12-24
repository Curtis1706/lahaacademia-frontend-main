import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour vérifier les risques de fraude lors d'une inscription
 * POST /api/security/fraud-check
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password, device_fingerprint, ip_address } = body

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email et téléphone requis' },
        { status: 400 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/security/fraud-check/`

    logger.info('Checking fraud risk', { email, phone }, { context: 'security/fraud-check' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        phone,
        password_hash: password, // Django hash le mot de passe
        device_fingerprint,
        ip_address: ip_address || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || '',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fraud check failed'), {
        context: 'security/fraud-check',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la vérification' },
        { status: response.status }
      )
    }

    logger.info('Fraud check completed', { 
      risk_score: data.risk_score,
      action: data.action 
    }, { context: 'security/fraud-check' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error checking fraud', error as Error, { context: 'security/fraud-check' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

