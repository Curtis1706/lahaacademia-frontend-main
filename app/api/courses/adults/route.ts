import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer les cours destinés aux adultes
 * GET /api/courses/adults
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({
      target_audience: 'adult',
      page,
      limit
    })
    const endpoint = `${baseApi}/api/courses/?${queryParams}`

    logger.debug('Fetching adult courses', { page, limit }, { context: 'courses/adults' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch adult courses failed'), {
        context: 'courses/adults',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération des cours pour adultes' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching adult courses', error as Error, { context: 'courses/adults' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

