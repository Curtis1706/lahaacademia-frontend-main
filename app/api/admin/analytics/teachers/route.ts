import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les performances des enseignants
 * GET /api/admin/analytics/teachers?period=month|year
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/analytics/teachers' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    const params = new URLSearchParams()
    const period = searchParams.get('period')
    if (period) params.append('period', period)
    
    const endpoint = `${baseApi}/admin/analytics/teachers/?${params.toString()}`

    logger.debug('Fetching teacher analytics', { period }, { context: 'admin/analytics/teachers' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch teacher analytics', new Error('Django API error'), {
        context: 'admin/analytics/teachers',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des performances' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher analytics', error as Error, { context: 'admin/analytics/teachers' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

