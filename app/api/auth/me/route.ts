import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur depuis les cookies
    const userSession = request.cookies.get('user_session_client')?.value || request.cookies.get('user_session')?.value
    
    if (!userSession) {
      logger.debug('Pas de session utilisateur dans auth/me', { context: 'auth/me' })
      return NextResponse.json(
        { authenticated: false, error: 'Session utilisateur requise' },
        { status: 401 }
      )
    }

    let userData
    try {
      userData = JSON.parse(userSession)
    } catch (parseError) {
      return NextResponse.json(
        { authenticated: false, error: 'Session utilisateur invalide' },
        { status: 401 }
      )
    }

    // Vérifier la session avec Django
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const cookieHeader = request.headers.get('cookie') || ''
    
    const response = await fetch(`${apiBase}/auth/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false, error: 'Session expirée' },
        { status: 401 }
      )
    }

    const djangoUserData = await response.json()
    
    return NextResponse.json({
      authenticated: true,
      user: {
        ...userData,
        ...djangoUserData
      }
    })
  } catch (error) {
    logger.error('Erreur lors de la vérification de la session', error, { context: 'auth/me' })
    return NextResponse.json(
      { authenticated: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}