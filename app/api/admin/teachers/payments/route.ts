import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

/**
 * API pour gérer les paiements aux enseignants (admin uniquement)
 * GET /api/admin/teachers/payments - Liste des paiements
 * POST /api/admin/teachers/payments - Effectuer un paiement
 */
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all' // all, pending, ready, paid
    const teacher_id = searchParams.get('teacher_id') || ''
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const queryParams = new URLSearchParams({
      ...(status !== 'all' && { status }),
      ...(teacher_id && { teacher_id }),
      page,
      limit
    })
    const endpoint = `${baseApi}/api/admin/teachers/payments/?${queryParams}`

    logger.debug('Fetching teacher payments', { status, teacher_id, page }, { context: 'admin/teachers/payments' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch payments failed'), {
        context: 'admin/teachers/payments',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors de la récupération des paiements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching teacher payments', error as Error, { context: 'admin/teachers/payments' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
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
    const endpoint = `${baseApi}/api/admin/teachers/payments/`

    logger.info('Processing teacher payment', { 
      teacher_id: body.teacher_id,
      amount: body.amount,
      method: body.payment_method 
    }, { context: 'admin/teachers/payments/POST' })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacher_id: body.teacher_id,
        amount: body.amount,
        payment_method: body.payment_method, // 'mtn', 'orange', 'bank'
        payment_proof: body.payment_proof || '',
        notes: body.notes || ''
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('process payment failed'), {
        context: 'admin/teachers/payments/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Erreur lors du paiement' },
        { status: response.status }
      )
    }

    logger.info('Payment processed successfully', { payment_id: data.id }, { context: 'admin/teachers/payments/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error processing payment', error as Error, { context: 'admin/teachers/payments/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

