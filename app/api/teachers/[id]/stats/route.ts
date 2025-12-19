import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour récupérer les statistiques d'un enseignant (admin ou enseignant lui-même)
 * GET /api/teachers/[id]/stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id

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

    if (!token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/teachers/${teacherId}/stats/`

    logger.debug('Fetching teacher stats', { teacherId }, { context: 'teachers/stats' })

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
      logger.error('Django API error', new Error('fetch teacher stats failed'), {
        context: 'teachers/stats',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de récupérer les statistiques' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher stats', error as Error, { context: 'teachers/stats' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

