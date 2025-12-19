import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour le système de parrainage
 * GET /api/referrals - Récupérer les infos de parrainage de l'utilisateur
 * POST /api/referrals - Appliquer un code de parrainage
 */
export async function GET(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'referrals/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/referrals/my-referrals/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch referral data', new Error('Django API error'), {
        context: 'referrals/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des données de parrainage' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching referral data', error as Error, { context: 'referrals/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

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
        logger.error('Failed to parse session cookie', e as Error, { context: 'referrals/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { referral_code } = body

    // Validation
    if (!referral_code) {
      return NextResponse.json(
        { error: 'Code de parrainage requis' },
        { status: 400 }
      )
    }

    logger.info('Applying referral code', {
      user_id: user?.id,
      referral_code
    }, { context: 'referrals/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/referrals/apply/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ referral_code })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to apply referral code', new Error('Django API error'), {
        context: 'referrals/POST',
        data: { status: response.status, referral_code, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'application du code de parrainage' },
        { status: response.status }
      )
    }

    logger.info('Referral code applied successfully', {
      user_id: user?.id,
      bonus: data.bonus
    }, { context: 'referrals/POST' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error applying referral code', error as Error, { context: 'referrals/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




