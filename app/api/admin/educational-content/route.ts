import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

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
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/educational-content' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Construire les paramètres de requête
    const params = new URLSearchParams()
    
    // Filtres
    const content_type = searchParams.get('content_type')
    const subject = searchParams.get('subject')
    const class_level = searchParams.get('class_level')
    const country = searchParams.get('country')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    if (content_type) params.append('content_type', content_type)
    if (subject) params.append('subject', subject)
    if (class_level) params.append('class_level', class_level)
    if (country) params.append('country', country)
    if (status) params.append('status', status)
    if (search) params.append('search', search)
    
    // Pagination
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    params.append('page', page)
    params.append('page_size', page_size)
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/?${params.toString()}`
      : `${baseApi}/api/educational-content/?${params.toString()}`
    
    logger.debug('Fetching educational content', { endpoint, filters: Object.fromEntries(params) }, { context: 'admin/educational-content' })
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    logger.debug('Django response received', { status: response.status, count: data.count || data.results?.length || 0 }, { context: 'admin/educational-content' })
    
    if (!response.ok) {
      logger.error('Django API error', new Error('fetch error'), {
        context: 'admin/educational-content',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des contenus' },
        { status: response.status }
      )
    }
    
    // Créer la réponse avec headers anti-cache
    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')
    
    return nextResponse
  } catch (error) {
    logger.error('Error fetching educational content', error as Error, { context: 'admin/educational-content' })
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

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'admin/educational-content/POST' })
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    // Récupérer les données du formulaire (FormData)
    const formData = await request.formData()
    
    // Créer un nouveau FormData pour Django
    const djangoFormData = new FormData()
    
    logger.info('Creating new educational content', null, { context: 'admin/educational-content/POST' })
    
    // Traiter chaque champ
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        logger.debug(`File upload: ${key}`, { name: value.name, size: value.size }, { context: 'admin/educational-content/POST' })
        djangoFormData.append(key, value)
      } else {
        // Traitement spécial pour les champs JSON
        if (key === 'tags' && value) {
          // Convertir les tags séparés par virgules en tableau JSON
          const tagsArray = String(value).split(',').map(tag => tag.trim()).filter(tag => tag)
          djangoFormData.append(key, JSON.stringify(tagsArray))
        } else {
          djangoFormData.append(key, value)
        }
      }
    }
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/`
      : `${baseApi}/api/educational-content/`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      },
      body: djangoFormData // Envoyer FormData traité
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      logger.error('Failed to create educational content', new Error('Django API error'), {
        context: 'admin/educational-content/POST',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du contenu' },
        { status: response.status }
      )
    }
    
    logger.info('Educational content created successfully', { id: data.id }, { context: 'admin/educational-content/POST' })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    logger.error('Error creating educational content', error as Error, { context: 'admin/educational-content/POST' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
