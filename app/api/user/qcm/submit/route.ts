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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = `${baseApi}/api/user/qcm/submit/`

    console.log('🚀 Soumission du QCM:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log('  Payload:', body)

    const authHeaders = await getAuthHeaders()
    const res = await fetch(endpoint, {
      method: 'POST',
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
      console.error('Erreur détaillée Django (POST QCM submit):', errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || `Erreur HTTP ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur API soumission QCM POST:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

