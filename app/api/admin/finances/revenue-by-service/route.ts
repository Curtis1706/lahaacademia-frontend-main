import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer le CA par service
 * GET /api/admin/finances/revenue-by-service
 * Query params: ?period=monthly|yearly&year=2024&month=12
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/finances/revenue-by-service' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    // Construire les query params
    const params = new URLSearchParams()
    const period = searchParams.get('period')
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    
    if (period) params.append('period', period)
    if (year) params.append('year', year)
    if (month) params.append('month', month)
    
    const endpoint = `${baseApi}/admin/finances/revenue-by-service/?${params.toString()}`

    logger.debug('Fetching revenue by service', { period, year, month }, { context: 'admin/finances/revenue-by-service' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch revenue by service', new Error('Django API error'), {
        context: 'admin/finances/revenue-by-service',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des revenus' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching revenue by service', error as Error, { context: 'admin/finances/revenue-by-service' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}



