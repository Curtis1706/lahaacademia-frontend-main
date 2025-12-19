import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer la liste des abonnements
 * GET /api/admin/subscriptions?status=active|expired|cancelled&search=...
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/subscriptions/GET' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    
    // Construire les query params
    const params = new URLSearchParams()
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    
    if (status && status !== 'all') params.append('status', status)
    if (search) params.append('search', search)
    params.append('page', page)
    params.append('page_size', page_size)
    
    const endpoint = `${baseApi}/admin/subscriptions/?${params.toString()}`

    logger.debug('Fetching subscriptions', { status, search }, { context: 'admin/subscriptions/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch subscriptions', new Error('Django API error'), {
        context: 'admin/subscriptions/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des abonnements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching subscriptions', error as Error, { context: 'admin/subscriptions/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}



