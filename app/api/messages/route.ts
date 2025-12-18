import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour la messagerie interne
 * GET /api/messages - Liste des conversations
 * POST /api/messages - Envoyer un nouveau message
 */
export async function GET(request: NextRequest) {
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'messages/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversation_id = searchParams.get('conversation_id')
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '50'

    const params = new URLSearchParams()
    if (conversation_id) params.append('conversation_id', conversation_id)
    params.append('page', page)
    params.append('page_size', page_size)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/messages/?${params.toString()}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch messages', new Error('Django API error'), {
        context: 'messages/GET',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des messages' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching messages', error as Error, { context: 'messages/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value

    let token: string | null = null
    let user: any = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
        user = sessionData
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'messages/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { recipient_id, content, conversation_id } = body

    // Validation
    if (!recipient_id || !content) {
      return NextResponse.json(
        { error: 'Données manquantes: recipient_id et content requis' },
        { status: 400 }
      )
    }

    // Filtrage automatique des contenus inappropriés
    const inappropriatePatterns = [
      /\b(spam|abuse|hack|scam)\b/i,
      /\b\d{10,}\b/, // Numéros de téléphone
      /\b[\w\.-]+@[\w\.-]+\.\w+\b/, // Emails
      /https?:\/\/[^\s]+/, // Liens externes
    ]

    let filteredContent = content
    let hasInappropriateContent = false

    inappropriatePatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasInappropriateContent = true
        filteredContent = content.replace(pattern, '[CONTENU MODÉRÉ]')
      }
    })

    if (hasInappropriateContent) {
      logger.warn('Inappropriate content filtered in message', {
        sender_id: user?.id,
        recipient_id
      }, { context: 'messages/POST' })
    }

    logger.info('Sending message', {
      sender_id: user?.id,
      recipient_id,
      conversation_id,
      filtered: hasInappropriateContent
    }, { context: 'messages/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/messages/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient_id,
        content: filteredContent,
        conversation_id
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to send message', new Error('Django API error'), {
        context: 'messages/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de l\'envoi du message' },
        { status: response.status }
      )
    }

    logger.info('Message sent successfully', { message_id: data.id }, { context: 'messages/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error sending message', error as Error, { context: 'messages/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


