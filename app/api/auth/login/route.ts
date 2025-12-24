import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Transformer email en username pour le backend Django
    // Pour le compte admin, utiliser directement le username 'admin'
    // Pour les autres comptes, utiliser l'email comme username
    const djangoBody = {
      username: body.email === 'admin@lahaacademia.com' ? 'admin' : body.email,
      password: body.password
    }
    
    // Rediriger vers le backend Django
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') ? `${baseApi}/auth/login/` : `${baseApi}/api/auth/login/`
    
    console.log('🔍 Connexion admin:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Username: ${djangoBody.username}`)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(djangoBody),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Identifiants invalides' },
        { status: response.status }
      )
    }

    // Créer une session ou un cookie pour maintenir la connexion
    const responseWithCookie = NextResponse.json(data, { status: 200 })
    
    // Stocker les informations utilisateur dans un cookie sécurisé (httpOnly pour la sécurité)
    responseWithCookie.cookies.set('user_session', JSON.stringify({ ...data.user, token: data.token }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/', // S'assurer que le cookie est disponible sur tout le site
    })

    // Créer aussi un cookie non-httpOnly pour le côté client
    responseWithCookie.cookies.set('user_session_client', JSON.stringify({ ...data.user, token: data.token }), {
      httpOnly: false, // Accessible par JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return responseWithCookie
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


