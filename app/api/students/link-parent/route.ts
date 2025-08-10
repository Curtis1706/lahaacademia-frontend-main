import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body
    
    if (!code) {
      return NextResponse.json(
        { error: 'Code d\'invitation requis' },
        { status: 400 }
      )
    }
    
    // Récupérer le token d'authentification
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('user_session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    let token
    try {
      const session = JSON.parse(sessionCookie.value)
      token = session.token
    } catch {
      return NextResponse.json(
        { error: 'Session invalide' },
        { status: 401 }
      )
    }
    
    // Appeler le backend Django
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const response = await fetch(`${apiUrl}/students/link_parent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ code }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || 'Code invalide ou expiré' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Erreur API link-parent:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


