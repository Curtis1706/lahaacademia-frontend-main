import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

async function getAuthHeaders() {
  let authHeader: Record<string, string> = {}
  try {
    const cookieStore = cookies()
    const userSessionCookie = cookieStore.get('user_session_client')
    
    if (userSessionCookie?.value) {
      const parsed = JSON.parse(userSessionCookie.value)
      if (parsed?.token) {
        authHeader = { 'Authorization': `Token ${parsed.token}` }
      }
    }
  } catch (e) {
    console.error("Failed to parse user_session_client cookie:", e)
  }
  return authHeader
}

export async function GET(request: NextRequest) {
  try {
    const endpoint = `${baseApi}/api/auth/me/`
    
    console.log('🔍 Récupération du profil utilisateur:')
    console.log(`  Endpoint: ${endpoint}`)
    
    const authHeaders = await getAuthHeaders()
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      credentials: 'include',
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
      console.error(`Erreur lors de la récupération du profil:`, res.status, errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération du profil' }, { status: res.status })
    }

    const userData = await res.json()
    
    // Récupérer les données spécifiques selon le rôle
    let profileData = null
    if (userData.role === 'student') {
      const studentRes = await fetch(`${baseApi}/api/students/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        credentials: 'include',
      })
      if (studentRes.ok) {
        const studentData = await studentRes.json()
        profileData = Array.isArray(studentData) ? studentData[0] : studentData.results?.[0]
      }
    } else if (userData.role === 'teacher') {
      const teacherRes = await fetch(`${baseApi}/api/teachers/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        credentials: 'include',
      })
      if (teacherRes.ok) {
        const teacherData = await teacherRes.json()
        profileData = Array.isArray(teacherData) ? teacherData[0] : teacherData.results?.[0]
      }
    } else if (userData.role === 'parent') {
      const parentRes = await fetch(`${baseApi}/api/parents/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        credentials: 'include',
      })
      if (parentRes.ok) {
        const parentData = await parentRes.json()
        profileData = Array.isArray(parentData) ? parentData[0] : parentData.results?.[0]
      }
    }

    const response = {
      user: userData,
      profile: profileData
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erreur API profil utilisateur GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = `${baseApi}/api/auth/me/`

    console.log('📝 Mise à jour du profil utilisateur:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log('  Payload:', body)

    const authHeaders = await getAuthHeaders()
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      credentials: 'include',
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('Erreur détaillée Django (PUT profil):', errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || `Erreur HTTP ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API profil utilisateur PUT:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

