import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour gérer les avertissements d'un enseignant
 * GET /api/admin/teachers/[id]/warnings - Liste des avertissements
 * POST /api/admin/teachers/[id]/warnings - Créer un avertissement
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id

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

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/admin/teachers/${teacherId}/warnings/`

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
      logger.error('Django API error', new Error('fetch warnings failed'), {
        context: 'admin/teachers/warnings/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de récupérer les avertissements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching warnings', error as Error, { context: 'admin/teachers/warnings/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id
    const body = await request.json()

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

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/admin/teachers/${teacherId}/warnings/`

    logger.info('Issuing warning to teacher', { 
      teacherId, 
      type: body.warning_type 
    }, { context: 'admin/teachers/warnings/POST' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        warning_type: body.warning_type, // 'cancellation_rate', 'late_cancellations', 'quality', 'behavior'
        severity: body.severity, // 'low', 'medium', 'high'
        message: body.message,
        action_taken: body.action_taken, // 'warning', 'temporary_suspension', 'permanent_ban'
        metadata: body.metadata || {}
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('create warning failed'), {
        context: 'admin/teachers/warnings/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de créer l\'avertissement' },
        { status: response.status }
      )
    }

    logger.info('Warning issued successfully', { 
      teacherId, 
      warning_id: data.id 
    }, { context: 'admin/teachers/warnings/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating warning', error as Error, { context: 'admin/teachers/warnings/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

