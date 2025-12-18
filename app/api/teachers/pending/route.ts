import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

function getAdminToken(request: NextRequest) {
  const raw =
    request.cookies.get('user_session_client')?.value ||
    request.cookies.get('user_session')?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch (e) {
    logger.error('Failed to parse admin session cookie', e, { context: 'teachers/pending' })
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getAdminToken(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.endsWith('/api')
      ? `${baseApi}/teachers/pending/`
      : `${baseApi}/api/teachers/pending/`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django (teachers/pending)', new Error('fetch error'), {
        context: 'teachers/pending',
        data: { status: response.status, errorData }
      })
      return NextResponse.json(
        { error: 'Erreur lors du chargement des enseignants' },
        { status: response.status }
      )
    }

    const data = await response.json()

    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')
    return nextResponse
  } catch (error) {
    logger.error('Erreur API teachers/pending', error, { context: 'teachers/pending' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
