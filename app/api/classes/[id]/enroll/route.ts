import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour s'inscrire à un cours collectif
 * POST /api/classes/:id/enroll
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'classes/enroll' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const classId = params.id

    if (!classId) {
      return NextResponse.json(
        { error: 'ID du cours requis' },
        { status: 400 }
      )
    }

    logger.info('Enrolling in group class', {
      class_id: classId,
      student_id: user?.id
    }, { context: 'classes/enroll' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/classes/${classId}/enroll/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to enroll in group class', new Error('Django API error'), {
        context: 'classes/enroll',
        data: { status: response.status, classId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'inscription au cours collectif' },
        { status: response.status }
      )
    }

    logger.info('Successfully enrolled in group class', {
      class_id: classId,
      enrollment_id: data.id
    }, { context: 'classes/enroll' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error enrolling in group class', error as Error, { context: 'classes/enroll' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




