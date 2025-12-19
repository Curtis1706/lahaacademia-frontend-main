import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour récupérer les revenus d'un enseignant
 * GET /api/teachers/earnings?period=month&page=1&limit=20
 */
export async function GET(request: NextRequest) {
  try {
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
    const userId = userSession?.user?.id

    if (!token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, week, year, all
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({
      period,
      page,
      limit
    })
    const endpoint = `${baseApi}/api/teachers/earnings/?${queryParams}`

    logger.debug('Fetching teacher earnings', { period, page }, { context: 'teachers/earnings' })

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
      logger.error('Django API error', new Error('fetch earnings failed'), {
        context: 'teachers/earnings',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération des revenus' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher earnings', error as Error, { context: 'teachers/earnings' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

