import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour récupérer la liste des enseignants à surveiller (admin uniquement)
 * GET /api/admin/teachers/at-risk
 */
export async function GET(request: NextRequest) {
  try {
    // Récupération du token d'authentification
    const cookieStore = cookies()
    const userSessionCookie = cookieStore.get('user_session_client')
    
    if (!userSessionCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication requise' },
        { status: 401 }
      )
    }

    const userSession = JSON.parse(userSessionCookie.value)
    const token = userSession?.token
    const userRole = userSession?.user?.role

    if (!token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Vérification que l'utilisateur est admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const riskLevel = searchParams.get('risk_level') || 'all' // all, warning, danger, critical
    const sortBy = searchParams.get('sort_by') || 'cancellation_rate' // cancellation_rate, last_minute_cancellations
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({
      ...(riskLevel !== 'all' && { risk_level: riskLevel }),
      sort_by: sortBy,
      page,
      limit
    })
    const endpoint = `${baseApi}/api/admin/teachers/at-risk/?${queryParams}`

    logger.debug('Fetching at-risk teachers', { 
      riskLevel, sortBy, page 
    }, { context: 'admin/teachers/at-risk' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch at-risk teachers failed'), {
        context: 'admin/teachers/at-risk',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de récupérer les données' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching at-risk teachers', error as Error, { context: 'admin/teachers/at-risk' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

