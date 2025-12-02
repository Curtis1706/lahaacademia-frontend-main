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
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams(searchParams.toString())

    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    params.append('page', page)
    params.append('page_size', page_size)
    
    const endpoint = `${baseApi}/api/qcm/?${params.toString()}`
    
    console.log('🔍 Récupération des QCM:')
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
      console.error(`Erreur lors de la récupération des QCM:`, res.status, errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération des QCM' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API admin QCM GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = `${baseApi}/api/qcm/`

    console.log('🚀 Création de QCM:')
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
      console.error('Erreur détaillée Django (POST QCM):', errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || `Erreur HTTP ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur API admin QCM POST:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}