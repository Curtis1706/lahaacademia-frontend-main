import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour activer la double authentification (2FA)
 * POST /api/auth/2fa/enable
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
        logger.error('Failed to parse session cookie', e as Error, { context: '2fa/enable' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { method, phone_number, email } = body

    // Validation
    if (!method || (method === 'sms' && !phone_number) || (method === 'email' && !email)) {
      return NextResponse.json(
        { error: 'Données manquantes: method requis, et phone_number (pour SMS) ou email (pour Email)' },
        { status: 400 }
      )
    }

    logger.info('Enabling 2FA', {
      user_id: user?.id,
      method,
      masked_phone: phone_number ? `***${phone_number.slice(-4)}` : undefined
    }, { context: '2fa/enable' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/auth/2fa/enable/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method, // 'sms', 'email', or 'app'
        phone_number,
        email
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to enable 2FA', new Error('Django API error'), {
        context: '2fa/enable',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'activation de la 2FA' },
        { status: response.status }
      )
    }

    logger.info('2FA enabled successfully', {
      user_id: user?.id,
      method
    }, { context: '2fa/enable' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error enabling 2FA', error as Error, { context: '2fa/enable' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




