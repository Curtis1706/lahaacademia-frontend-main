import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les réservations de professeurs
 * GET /api/bookings/teachers - Liste les professeurs disponibles avec leurs créneaux
 * POST /api/bookings/teachers - Réserver un créneau avec un professeur
 */
export async function GET(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'bookings/teachers/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const level = searchParams.get('level')
    const date = searchParams.get('date') // Format: YYYY-MM-DD
    const country = searchParams.get('country')

    const params = new URLSearchParams()
    if (subject) params.append('subject', subject)
    if (level) params.append('level', level)
    if (date) params.append('date', date)
    if (country) params.append('country', country)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/bookings/teachers/available/?${params.toString()}`

    logger.debug('Fetching available teachers', { filters: Object.fromEntries(params) }, { context: 'bookings/teachers/GET' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch available teachers', new Error('Django API error'), {
        context: 'bookings/teachers/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des professeurs disponibles' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching available teachers', error as Error, { context: 'bookings/teachers/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

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
        logger.error('Failed to parse session cookie', e as Error, { context: 'bookings/teachers/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { teacher_id, slot_id, subject, duration, notes, booking_type } = body

    // Validation
    if (!teacher_id || !slot_id || !subject) {
      return NextResponse.json(
        { error: 'Données manquantes: teacher_id, slot_id et subject requis' },
        { status: 400 }
      )
    }

    logger.info('Creating teacher booking', {
      teacher_id,
      slot_id,
      subject,
      duration,
      booking_type,
      student_id: user?.id
    }, { context: 'bookings/teachers/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/bookings/teachers/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teacher_id,
        slot_id,
        subject,
        duration: duration || 60, // 60 minutes par défaut
        notes: notes || '',
        booking_type: booking_type || 'individual', // individual or group
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create booking', new Error('Django API error'), {
        context: 'bookings/teachers/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création de la réservation' },
        { status: response.status }
      )
    }

    logger.info('Booking created successfully', { booking_id: data.id }, { context: 'bookings/teachers/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating booking', error as Error, { context: 'bookings/teachers/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


