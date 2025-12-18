import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

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

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/content-reports/review' })
      }
    }

    const reportId = params.id
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    if (!reportId) {
      return NextResponse.json(
        { error: 'ID du signalement requis' },
        { status: 400 }
      )
    }

    const body = await request.json()

    logger.info('Reviewing content report', { reportId, action: body }, { context: 'admin/content-reports/review' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/content-reports/${reportId}/review/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to review content report', new Error('Django API error'), {
        context: 'admin/content-reports/review',
        data: { status: response.status, reportId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'examen du signalement' },
        { status: response.status }
      )
    }

    logger.info('Content report reviewed successfully', { reportId }, { context: 'admin/content-reports/review' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error reviewing content report', error as Error, { context: 'admin/content-reports/review' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

