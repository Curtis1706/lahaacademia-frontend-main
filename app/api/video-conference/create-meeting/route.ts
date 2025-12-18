import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour créer une réunion Zoom
 * POST /api/video-conference/create-meeting
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null
    let user: any = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
        user = sessionData
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'video-conference/create-meeting' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { topic, start_time, duration, booking_id, session_type } = body

    // Validation
    if (!topic || !start_time || !duration) {
      return NextResponse.json(
        { error: 'Données manquantes: topic, start_time et duration requis' },
        { status: 400 }
      )
    }

    logger.info('Creating Zoom meeting', {
      topic,
      start_time,
      duration,
      booking_id,
      session_type,
      user_id: user?.id
    }, { context: 'video-conference/create-meeting' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/video-conference/create-meeting/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        start_time,
        duration, // en minutes
        booking_id,
        session_type: session_type || 'individual', // individual, group, stage
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          waiting_room: true,
          audio: 'both', // both, telephony, voip
          auto_recording: 'cloud', // local, cloud, none
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create Zoom meeting', new Error('Django API error'), {
        context: 'video-conference/create-meeting',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création de la réunion' },
        { status: response.status }
      )
    }

    logger.info('Zoom meeting created successfully', {
      meeting_id: data.meeting_id,
      join_url: data.join_url
    }, { context: 'video-conference/create-meeting' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating Zoom meeting', error as Error, { context: 'video-conference/create-meeting' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


