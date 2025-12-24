import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour lister les signalements (admin uniquement)
 * GET /api/reports?status=pending&severity=high&page=1&limit=20
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

    // Construction de l'URL avec les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const severity = searchParams.get('severity') || ''
    const teacher_id = searchParams.get('teacher_id') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({
      ...(status && { status }),
      ...(severity && { severity }),
      ...(teacher_id && { teacher_id }),
      page,
      limit
    })
    const endpoint = `${baseApi}/api/reports/?${queryParams}`

    logger.debug('Fetching incident reports', { 
      status, severity, teacher_id, page 
    }, { context: 'reports/list' })

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
      logger.error('Django API error', new Error('fetch reports failed'), {
        context: 'reports/list',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération des signalements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching incident reports', error as Error, { context: 'reports/list' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

