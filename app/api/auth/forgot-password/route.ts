import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour demander la réinitialisation du mot de passe
 * POST /api/auth/forgot-password
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/auth/password/reset/`

    logger.info('Password reset requested', { email }, { context: 'auth/forgot-password' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to send reset email', new Error('Django API error'), {
        context: 'auth/forgot-password',
        data: { status: response.status, error: data, email }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: response.status }
      )
    }

    logger.info('Password reset email sent', { email }, { context: 'auth/forgot-password' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error in forgot-password', error as Error, { context: 'auth/forgot-password' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}



