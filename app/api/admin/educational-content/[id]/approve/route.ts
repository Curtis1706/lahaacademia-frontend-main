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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/educational-content/approve' })
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
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/${contentId}/approve/`
      : `${baseApi}/api/educational-content/${contentId}/approve/`
    
    logger.info('Approving educational content', { contentId }, { context: 'admin/educational-content/approve' })
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      logger.error('Failed to approve content', new Error('Django API error'), {
        context: 'admin/educational-content/approve',
        data: { status: response.status, contentId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'approbation du contenu' },
        { status: response.status }
      )
    }
    
    logger.info('Content approved successfully', { contentId }, { context: 'admin/educational-content/approve' })
    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error approving content', error as Error, { context: 'admin/educational-content/approve' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





