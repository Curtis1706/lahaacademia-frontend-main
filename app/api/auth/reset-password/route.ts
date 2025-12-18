import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour réinitialiser le mot de passe avec un token
 * POST /api/auth/reset-password
 * Body: { token: string, password: string, password_confirm: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, password_confirm } = body

    if (!token || !password || !password_confirm) {
      return NextResponse.json(
        { error: 'Token et mots de passe requis' },
        { status: 400 }
      )
    }

    if (password !== password_confirm) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/auth/password/reset/confirm/`

    logger.info('Password reset confirmation', {}, { context: 'auth/reset-password' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        password,
        password_confirm
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to reset password', new Error('Django API error'), {
        context: 'auth/reset-password',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la réinitialisation' },
        { status: response.status }
      )
    }

    logger.info('Password reset successful', {}, { context: 'auth/reset-password' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error in reset-password', error as Error, { context: 'auth/reset-password' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

