import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour bannir un utilisateur (admin uniquement)
 * POST /api/admin/security/ban-user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, reason, permanent } = body

    if (!user_id || !reason) {
      return NextResponse.json(
        { error: 'user_id et reason requis' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const userSessionCookie = cookieStore.get('user_session_client')
    
    if (!userSessionCookie?.value) {
      return NextResponse.json(
        { error: 'Authentication requise' },
        { status: 401 }
      )
    }

    const userSession = JSON.parse(userSessionCookie.value)
    const token = userSession?.token
    const userRole = userSession?.user?.role

    if (!token || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Accès réservé aux administrateurs' },
        { status: 403 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/admin/security/ban-user/`

    logger.warn('Banning user', { 
      user_id, 
      reason, 
      permanent,
      admin_id: userSession.user.id 
    }, { context: 'admin/security/ban-user' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        reason,
        permanent: permanent || false,
        admin_id: userSession.user.id
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('ban user failed'), {
        context: 'admin/security/ban-user',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors du bannissement' },
        { status: response.status }
      )
    }

    logger.warn('User banned successfully', { user_id }, { context: 'admin/security/ban-user' })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error banning user', error as Error, { context: 'admin/security/ban-user' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

