import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour gérer les posts d'un forum
 * GET /api/forums/:id/posts - Liste des posts du forum
 * POST /api/forums/:id/posts - Créer un nouveau post
 */
export async function GET(
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'forums/posts/GET' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const forumId = params.id

    if (!forumId) {
      return NextResponse.json(
        { error: 'ID du forum requis' },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    const sort = searchParams.get('sort') || 'recent' // recent, popular, oldest

    const searchParams2 = new URLSearchParams()
    searchParams2.append('page', page)
    searchParams2.append('page_size', page_size)
    searchParams2.append('sort', sort)

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/forums/${forumId}/posts/?${searchParams2.toString()}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to fetch forum posts', new Error('Django API error'), {
        context: 'forums/posts/GET',
        data: { status: response.status, forumId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des posts' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logger.error('Error fetching forum posts', error as Error, { context: 'forums/posts/GET' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

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
    let user: any = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
        user = sessionData
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'forums/posts/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const forumId = params.id

    if (!forumId) {
      return NextResponse.json(
        { error: 'ID du forum requis' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, content } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Données manquantes: title et content requis' },
        { status: 400 }
      )
    }

    // Filtrage basique des mots inappropriés (sera amélioré côté Django)
    const inappropriateWords = ['spam', 'abuse', 'hack'] // Liste simplifiée
    const hasInappropriateContent = inappropriateWords.some(word => 
      title.toLowerCase().includes(word) || content.toLowerCase().includes(word)
    )

    if (hasInappropriateContent) {
      logger.warn('Inappropriate content detected', { forumId, user_id: user?.id }, { context: 'forums/posts/POST' })
    }

    logger.info('Creating forum post', { forumId, title, user_id: user?.id }, { context: 'forums/posts/POST' })

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/forums/${forumId}/posts/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content
      })
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Failed to create forum post', new Error('Django API error'), {
        context: 'forums/posts/POST',
        data: { status: response.status, forumId, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du post' },
        { status: response.status }
      )
    }

    logger.info('Forum post created successfully', { post_id: data.id, forumId }, { context: 'forums/posts/POST' })

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating forum post', error as Error, { context: 'forums/posts/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


