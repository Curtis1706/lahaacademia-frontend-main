import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les messages récents d'un étudiant
 * GET /api/student/messages-recent
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    let token: string | null = null

    if (authHeader && authHeader.startsWith('Token ')) {
      token = authHeader.substring(6)
    } else {
      const cookieTokenRaw = 
        request.cookies.get('user_session_client')?.value || 
        request.cookies.get('user_session')?.value

      if (cookieTokenRaw) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
          token = sessionData?.token || null
        } catch (e) {
          logger.error('Failed to parse session cookie', e as Error, { context: 'student/messages-recent/GET' })
        }
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/students/messages/recent/`

    logger.debug('Fetching recent messages', {}, { context: 'student/messages-recent/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch recent messages', new Error('Django API error'), {
        context: 'student/messages-recent/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des messages' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching recent messages', error as Error, { context: 'student/messages-recent/GET' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}


