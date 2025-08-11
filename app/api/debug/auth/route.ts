import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const userSession = cookies().get('user_session')?.value
    
    if (!userSession) {
      return NextResponse.json({ 
        error: 'Non authentifié',
        hasSession: false 
      }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    
    // Test de connexion à Django avec le token
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
    
    let djangoCheck = null
    if (user.token) {
      try {
        const response = await fetch(`${apiBase}/users/me/`, {
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          djangoCheck = await response.json()
        } else {
          djangoCheck = { error: `${response.status}: ${response.statusText}` }
        }
      } catch (err) {
        djangoCheck = { error: err instanceof Error ? err.message : 'Unknown error' }
      }
    }

    // Test de récupération du profil Teacher
    let teacherProfile = null
    if (user.token && user.role === 'teacher') {
      try {
        const response = await fetch(`${apiBase}/teachers/me/`, {
          headers: {
            'Authorization': `Token ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          teacherProfile = await response.json()
        } else {
          teacherProfile = { error: `${response.status}: ${response.statusText}` }
        }
      } catch (err) {
        teacherProfile = { error: err instanceof Error ? err.message : 'Unknown error' }
      }
    }

    return NextResponse.json({
      hasSession: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hasToken: !!user.token
      },
      djangoUserCheck: djangoCheck,
      teacherProfile: teacherProfile,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error in debug auth:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur interne',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
