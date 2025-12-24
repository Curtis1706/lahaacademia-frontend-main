import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour résoudre un signalement (admin uniquement)
 * POST /api/reports/[id]/resolve
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reportId = params.id
    const body = await request.json()

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
    const userRole = userSession?.user?.role

    if (!token) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      )
    }

    // Vérification que l'utilisateur est admin
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/reports/${reportId}/resolve/`

    logger.info('Resolving report', { 
      reportId, 
      resolution: body.resolution,
      action_taken: body.action_taken 
    }, { context: 'reports/resolve' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'resolved',
        admin_notes: body.admin_notes || '',
        resolution: body.resolution || 'resolved',
        action_taken: body.action_taken || '',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('resolve report failed'), {
        context: 'reports/resolve',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la résolution du signalement' },
        { status: response.status }
      )
    }

    logger.info('Report resolved successfully', { reportId }, { context: 'reports/resolve' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error resolving report', error as Error, { context: 'reports/resolve' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

