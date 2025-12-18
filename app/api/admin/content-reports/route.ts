import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/content-reports' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    let endpoint = `${baseApi}/admin/content-reports/`
    
    if (status && status !== 'all') {
      endpoint += `?status=${status}`
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des signalements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching content reports', error as Error, { context: 'admin/content-reports' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/content-reports/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    logger.info('Creating content report', body, { context: 'admin/content-reports/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/content-reports/`

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
      logger.error('Failed to create content report', new Error('Django API error'), {
        context: 'admin/content-reports/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du signalement' },
        { status: response.status }
      )
    }

    logger.info('Content report created successfully', { id: data.id }, { context: 'admin/content-reports/POST' })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating content report', error as Error, { context: 'admin/content-reports/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}









