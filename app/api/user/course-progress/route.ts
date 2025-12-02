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
    const endpoint = `${baseApi}/api/user/course-progress/`
    
    console.log('🔍 Récupération de la progression des cours:')
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
      console.error(`Erreur lors de la récupération de la progression:`, res.status, errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération de la progression' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API progression cours GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

