import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour récupérer les métriques détaillées d'un enseignant (admin uniquement)
 * GET /api/admin/teachers/[id]/metrics
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
    const endpoint = `${baseApi}/api/admin/teachers/${teacherId}/metrics/`

    logger.debug('Fetching teacher metrics', { teacherId }, { context: 'admin/teachers/metrics' })

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
      logger.error('Django API error', new Error('fetch metrics failed'), {
        context: 'admin/teachers/metrics',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de récupérer les métriques' },
        { status: response.status }
      )
    }

    // Calculer le statut d'alerte
    const cancellationRate = data.cancellation_rate || 0
    const lastMinuteCancellations = data.last_minute_cancellations || 0
    
    let alertLevel: 'safe' | 'warning' | 'danger' | 'critical' = 'safe'
    let alertMessage = ''

    if (cancellationRate >= 40) {
      alertLevel = 'critical'
      alertMessage = 'Taux critique : Suspension recommandée'
    } else if (cancellationRate >= 25) {
      alertLevel = 'danger'
      alertMessage = 'Taux dangereux : Action immédiate requise'
    } else if (cancellationRate >= 15 || lastMinuteCancellations >= 5) {
      alertLevel = 'warning'
      alertMessage = 'Taux élevé : Surveillance nécessaire'
    } else {
      alertMessage = 'Taux acceptable'
    }

    return NextResponse.json({
      ...data,
      alert: {
        level: alertLevel,
        message: alertMessage,
        requires_action: alertLevel !== 'safe'
      }
    })
  } catch (error) {
    logger.error('Error fetching teacher metrics', error as Error, { context: 'admin/teachers/metrics' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

