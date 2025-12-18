import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour désactiver la double authentification (2FA)
 * POST /api/auth/2fa/disable
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
        logger.error('Failed to parse session cookie', e as Error, { context: '2fa/disable' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { password } = body

    // Validation - Demander le mot de passe pour confirmation
    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis pour désactiver la 2FA' },
        { status: 400 }
      )
    }

    logger.info('Disabling 2FA', {
      user_id: user?.id
    }, { context: '2fa/disable' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/auth/2fa/disable/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to disable 2FA', new Error('Django API error'), {
        context: '2fa/disable',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la désactivation de la 2FA' },
        { status: response.status }
      )
    }

    logger.info('2FA disabled successfully', {
      user_id: user?.id
    }, { context: '2fa/disable' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error disabling 2FA', error as Error, { context: '2fa/disable' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


