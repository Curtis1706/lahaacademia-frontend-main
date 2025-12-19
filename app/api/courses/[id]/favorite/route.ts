import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour ajouter/supprimer un cours des favoris
 * POST /api/courses/{id}/favorite - Ajouter aux favoris
 * DELETE /api/courses/{id}/favorite - Retirer des favoris
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'courses/favorite' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/courses/${courseId}/favorite/`

    logger.info('Adding course to favorites', { courseId }, { context: 'courses/favorite' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to add to favorites', new Error('Django API error'), {
        context: 'courses/favorite',
        data: { status: response.status, error: data, courseId }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'ajout aux favoris' },
        { status: response.status }
      )
    }

    logger.info('Course added to favorites', { courseId }, { context: 'courses/favorite' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error adding to favorites', error as Error, { context: 'courses/favorite' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'courses/favorite' })
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 })
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/courses/${courseId}/favorite/`

    logger.info('Removing course from favorites', { courseId }, { context: 'courses/favorite' })

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 204) {
      logger.info('Course removed from favorites', { courseId }, { context: 'courses/favorite' })
      return new NextResponse(null, { status: 204 })
    }

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to remove from favorites', new Error('Django API error'), {
        context: 'courses/favorite',
        data: { status: response.status, error: data, courseId }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la suppression des favoris' },
        { status: response.status }
      )
    }

    logger.info('Course removed from favorites', { courseId }, { context: 'courses/favorite' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error removing from favorites', error as Error, { context: 'courses/favorite' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}



