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
    logger.error('Failed to parse admin session cookie', e as Error, { context: 'teachers/reject' })
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
      ? `${baseApi}/teachers/${teacherId}/reject/`
      : `${baseApi}/api/teachers/${teacherId}/reject/`

    const body = await request.json().catch(() => ({}))
    
    logger.info('Rejecting teacher', { teacherId, reason: body.reason }, { context: 'teachers/reject' })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Django API error rejecting teacher', new Error('fetch error'), {
        context: 'teachers/reject',
        data: { status: response.status, errorData, teacherId }
      })
      return NextResponse.json(
        errorData || { error: 'Erreur lors du rejet' },
        { status: response.status }
      )
    }

    const data = await response.json()
    logger.info('Teacher rejected successfully', { teacherId }, { context: 'teachers/reject' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error rejecting teacher', error as Error, { context: 'teachers/reject' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
