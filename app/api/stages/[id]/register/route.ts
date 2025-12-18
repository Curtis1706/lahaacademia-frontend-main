import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour s'inscrire à un stage intensif
 * POST /api/stages/:id/register
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'stages/register' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const stageId = params.id

    if (!stageId) {
      return NextResponse.json(
        { error: 'ID du stage requis' },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { payment_method } = body

    logger.info('Registering for intensive stage', {
      stage_id: stageId,
      student_id: user?.id,
      payment_method
    }, { context: 'stages/register' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/stages/${stageId}/register/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ payment_method: payment_method || 'mobile_money' })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to register for stage', new Error('Django API error'), {
        context: 'stages/register',
        data: { status: response.status, stageId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'inscription au stage' },
        { status: response.status }
      )
    }

    logger.info('Successfully registered for stage', {
      stage_id: stageId,
      registration_id: data.id
    }, { context: 'stages/register' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error registering for stage', error as Error, { context: 'stages/register' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


