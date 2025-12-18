import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const qcmId = params.id
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/qcm/${qcmId}/`

    logger.debug('Fetching QCM', { qcmId, endpoint }, { context: 'admin/qcm/GET' })

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
      logger.error('Failed to parse cookie', e as Error, { context: 'admin/qcm/PUT' })
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      cache: 'no-store',
    })

    const data = await response.json()

    logger.debug('Django response', { status: response.status }, { context: 'admin/qcm/PUT' })

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch error'), { context: 'admin/qcm/PUT', data: { status: response.status, error: data } })
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du QCM' },
        { status: response.status }
      )
    }

    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')

    return nextResponse
  } catch (error) {
    logger.error('Error fetching QCM', error as Error, { context: 'admin/qcm/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const qcmId = params.id
    const body = await request.json()

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/qcm/${qcmId}/`

    logger.info('Updating QCM', { qcmId }, { context: 'admin/qcm/PUT' })

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
      logger.error('Failed to parse cookie', e as Error, { context: 'admin/qcm/PUT' })
    }

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    logger.debug('Django response', { status: response.status }, { context: 'admin/qcm/PUT' })

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch error'), { context: 'admin/qcm/PUT', data: { status: response.status, error: data } })
      return NextResponse.json(
        { error: 'Erreur lors de la modification du QCM' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error updating QCM', error as Error, { context: 'admin/qcm/PUT' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const qcmId = params.id

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/qcm/${qcmId}/`

    logger.info('Deleting QCM', { qcmId }, { context: 'admin/qcm/DELETE' })

    let authHeader: Record<string, string> = {}
    try {
      const cookieStore = cookies()
      const userSessionCookie = cookieStore.get('user_session_client')
      
      if (userSessionCookie?.value) {
        const parsed = JSON.parse(userSessionCookie.value)
        if (parsed?.token) {
          authHeader = { 'Authorization': `Token ${parsed.token}` }
          logger.debug('Auth token found', {}, { context: 'admin/qcm/DELETE' })
        } else {
          logger.warn('No token in cookie', {}, { context: 'admin/qcm/DELETE' })
        }
      } else {
        logger.warn('No user_session_client cookie', {}, { context: 'admin/qcm/DELETE' })
      }
    } catch (e) {
      logger.error('Failed to parse cookie', e as Error, { context: 'admin/qcm/PUT' })
    }

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      }
    })

    logger.debug('Django response', { status: response.status }, { context: 'admin/qcm/PUT' })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      logger.error('Django API error', new Error('fetch error'), { context: 'admin/qcm/PUT', data: { status: response.status, error: data } })
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du QCM' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, message: 'QCM supprimé avec succès' })
  } catch (error) {
    logger.error('Error deleting QCM', error as Error, { context: 'admin/qcm/DELETE' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

