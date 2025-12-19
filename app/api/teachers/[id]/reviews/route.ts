import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les avis d'un enseignant
 * GET /api/teachers/[id]/reviews
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/teachers/${teacherId}/reviews/?page=${page}&limit=${limit}`

    logger.debug('Fetching teacher reviews', { teacherId, page }, { context: 'teachers/reviews' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch reviews failed'), {
        context: 'teachers/reviews',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Impossible de récupérer les avis' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher reviews', error as Error, { context: 'teachers/reviews' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

