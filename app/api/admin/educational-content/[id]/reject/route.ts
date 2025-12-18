import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/educational-content/reject' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      )
    }

    // Optionnel : Récupérer la raison du rejet depuis le body
    const body = await request.json().catch(() => ({}))
    const reason = body.reason || ''
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/${contentId}/reject/`
      : `${baseApi}/api/educational-content/${contentId}/reject/`
    
    logger.warn('Rejecting educational content', { contentId, reason }, { context: 'admin/educational-content/reject' })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: reason ? JSON.stringify({ reason }) : undefined
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      logger.error('Failed to reject content', new Error('Django API error'), {
        context: 'admin/educational-content/reject',
        data: { status: response.status, contentId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors du rejet du contenu' },
        { status: response.status }
      )
    }
    
    logger.info('Content rejected successfully', { contentId }, { context: 'admin/educational-content/reject' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error rejecting content', error as Error, { context: 'admin/educational-content/reject' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





