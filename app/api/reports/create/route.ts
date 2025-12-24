import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour créer un signalement d'incident
 * POST /api/reports/create
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des champs requis
    const { teacher_id, incident_type, severity, description } = body
    
    if (!teacher_id || !incident_type || !severity || !description) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

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

    // Appel API Django
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/reports/`

    logger.info('Creating incident report', { 
      teacher_id, 
      incident_type, 
      severity 
    }, { context: 'reports/create' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacher_id,
        booking_id: body.booking_id || null,
        incident_type,
        severity,
        description,
        evidence: body.evidence || [],
        metadata: body.metadata || {}
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('create report failed'), {
        context: 'reports/create',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la création du signalement' },
        { status: response.status }
      )
    }

    logger.info('Incident report created successfully', { report_id: data.id }, { context: 'reports/create' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating incident report', error as Error, { context: 'reports/create' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

