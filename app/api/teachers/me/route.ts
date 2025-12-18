import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (prioritaire) ou headers
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value
    const authHeader = request.headers.get('Authorization')

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'teachers/me' })
      }
    }

    if (!token && authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Token ', '')
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    // Si baseApi contient déjà /api, ne pas l'ajouter
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/teachers/me/`
      : `${baseApi}/api/teachers/me/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()

    if (!response.ok) {
      logger.error('Erreur API Django me', new Error('fetch error'), {
        context: 'teachers/me',
        data: { status: response.status, data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des informations du professeur' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Erreur API teachers/me', error as Error, { context: 'teachers/me' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}