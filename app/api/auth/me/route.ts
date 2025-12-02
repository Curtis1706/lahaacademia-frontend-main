import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur depuis les cookies
    const userSession = request.cookies.get('user_session_client')?.value || request.cookies.get('user_session')?.value
    
    console.log('🔍 Debug API auth/me:')
    console.log('  - user_session_client exists:', !!request.cookies.get('user_session_client')?.value)
    console.log('  - user_session exists:', !!request.cookies.get('user_session')?.value)
    console.log('  - All cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    
    if (!userSession) {
      console.log('❌ Pas de session utilisateur dans auth/me')
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
    console.error('Erreur lors de la vérification de la session:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}