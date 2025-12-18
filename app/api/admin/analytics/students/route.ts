import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les statistiques des étudiants
 * GET /api/admin/analytics/students?period=month|year
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/analytics/students' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    const params = new URLSearchParams()
    const period = searchParams.get('period')
    if (period) params.append('period', period)
    
    const endpoint = `${baseApi}/admin/analytics/students/?${params.toString()}`

    logger.debug('Fetching student analytics', { period }, { context: 'admin/analytics/students' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch student analytics', new Error('Django API error'), {
        context: 'admin/analytics/students',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des statistiques' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching student analytics', error as Error, { context: 'admin/analytics/students' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

