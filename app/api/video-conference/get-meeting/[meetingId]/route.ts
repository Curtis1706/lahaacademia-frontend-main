import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les informations d'une réunion Zoom
 * GET /api/video-conference/get-meeting/:meetingId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'video-conference/get-meeting' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const meetingId = params.meetingId

    if (!meetingId) {
      return NextResponse.json(
        { error: 'ID de réunion requis' },
        { status: 400 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/video-conference/get-meeting/${meetingId}/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch Zoom meeting', new Error('Django API error'), {
        context: 'video-conference/get-meeting',
        data: { status: response.status, meetingId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération de la réunion' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching Zoom meeting', error as Error, { context: 'video-conference/get-meeting' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




