import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

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
    logger.error("Failed to parse user_session_client cookie", e, { context: 'user/progress' })
  }
  return authHeader
}

export async function GET(request: NextRequest) {
  try {
    const endpoint = `${baseApi}/api/user/progress/`
    
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
      logger.error('Erreur lors de la récupération de la progression', new Error(errorData.message || 'Unknown error'), { 
        context: 'user/progress',
        data: { status: res.status, errorData }
      })
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération de la progression' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Erreur API progression utilisateur GET', error, { context: 'user/progress' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const endpoint = `${baseApi}/api/user/progress/`

    logger.debug('Mise à jour de la progression utilisateur', { context: 'user/progress', data: { endpoint, body } })

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
      logger.error('Erreur détaillée Django (POST progression)', new Error(errorData.message || 'Unknown error'), { 
        context: 'user/progress',
        data: { status: res.status, errorData }
      })
      return NextResponse.json({ error: errorData.detail || errorData.message || `Erreur HTTP ${res.status}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Erreur API progression utilisateur POST', error, { context: 'user/progress' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

