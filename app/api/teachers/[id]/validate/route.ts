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
    logger.error('Failed to parse admin session cookie', e, { context: 'teachers/validate' })
    return null
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id
    if (!teacherId) {
      return NextResponse.json(
        { error: 'ID du professeur requis' },
        { status: 400 }
      )
    }

    const token = getAdminToken(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.endsWith('/api')
      ? `${baseApi}/teachers/${teacherId}/validate/`
      : `${baseApi}/api/teachers/${teacherId}/validate/`

    logger.info('Validating teacher', { teacherId }, { context: 'teachers/validate' })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django validation', new Error('fetch error'), {
        context: 'teachers/validate',
        data: { status: response.status, errorData }
      })
      return NextResponse.json(
        { error: 'Erreur lors de la validation' },
        { status: response.status }
      )
    }

    const data = await response.json()
    logger.info('Teacher validated successfully', { teacherId }, { context: 'teachers/validate' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error validating teacher', error as Error, { context: 'teachers/validate' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
