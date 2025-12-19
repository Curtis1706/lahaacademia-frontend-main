import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour récupérer la liste des utilisateurs bannis (admin uniquement)
 * GET /api/admin/security/banned-list
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
    const userRole = userSession?.user?.role

    if (!token || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({ page, limit })
    const endpoint = `${baseApi}/api/admin/security/banned-list/?${queryParams}`

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
      logger.error('Django API error', new Error('fetch banned list failed'), {
        context: 'admin/security/banned-list',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching banned list', error as Error, { context: 'admin/security/banned-list' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

