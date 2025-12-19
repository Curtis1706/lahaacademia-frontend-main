import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour s'inscrire à un cours
 * POST /api/courses/{id}/enroll
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id
    if (!courseId) {
      return NextResponse.json(
        { error: 'ID du cours requis' },
        { status: 400 }
      )
    }

    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'courses/enroll' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/courses/${courseId}/enroll/`

    logger.info('Enrolling in course', { courseId }, { context: 'courses/enroll' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to enroll in course', new Error('Django API error'), {
        context: 'courses/enroll',
        data: { status: response.status, error: data, courseId }
      })
      return NextResponse.json(
        data || { error: "Erreur lors de l'inscription au cours" },
        { status: response.status }
      )
    }

    logger.info('Successfully enrolled in course', { courseId }, { context: 'courses/enroll' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error enrolling in course', error as Error, { context: 'courses/enroll' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}



