import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les disponibilités d'un professeur
 * GET /api/teachers/availability - Récupérer les disponibilités
 * POST /api/teachers/availability - Définir/Mettre à jour les disponibilités
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'teachers/availability/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const teacher_id = searchParams.get('teacher_id')
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')

    const params = new URLSearchParams()
    if (teacher_id) params.append('teacher_id', teacher_id)
    if (start_date) params.append('start_date', start_date)
    if (end_date) params.append('end_date', end_date)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/teachers/availability/?${params.toString()}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch teacher availability', new Error('Django API error'), {
        context: 'teachers/availability/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des disponibilités' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher availability', error as Error, { context: 'teachers/availability/GET' })
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

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'teachers/availability/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { availability_slots } = body

    // Validation
    if (!availability_slots || !Array.isArray(availability_slots)) {
      return NextResponse.json(
        { error: 'availability_slots requis (array)' },
        { status: 400 }
      )
    }

    logger.info('Updating teacher availability', {
      slots_count: availability_slots.length
    }, { context: 'teachers/availability/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/teachers/availability/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ availability_slots })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to update teacher availability', new Error('Django API error'), {
        context: 'teachers/availability/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la mise à jour des disponibilités' },
        { status: response.status }
      )
    }

    logger.info('Teacher availability updated successfully', {}, { context: 'teachers/availability/POST' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating teacher availability', error as Error, { context: 'teachers/availability/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


