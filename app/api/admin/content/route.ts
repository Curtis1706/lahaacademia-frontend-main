import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Construire les paramètres de requête
    const params = new URLSearchParams()
    
    // Filtres
    const subject = searchParams.get('subject')
    const class_level = searchParams.get('class_level')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const content_type = searchParams.get('content_type') || 'video'
    
    if (subject && subject !== 'all') params.append('subject', subject)
    if (class_level && class_level !== 'all') params.append('class_level', class_level)
    if (status && status !== 'all') params.append('status', status)
    if (search) params.append('search', search)
    params.append('content_type', content_type)
    
    // Pagination
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    params.append('page', page)
    params.append('page_size', page_size)
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/public/videos/?${params.toString()}`
    
    console.log('🔍 Récupération du contenu éducatif:')
    console.log(`  Type: ${content_type}`)
    console.log(`  Endpoint: ${endpoint}`)
    
    let authHeader: Record<string, string> = {}
    try {
      const raw = (request as any)?.cookies?.get?.('user_session_client')?.value || ''
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.token) authHeader = { 'Authorization': `Token ${parsed.token}` }
      }
    } catch {}

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        'Cookie': (request as any)?.headers?.get?.('cookie') || '',
        ...authHeader,
      },
      cache: 'no-store',
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)
    console.log(`📋 Nombre d'éléments: ${data.count || data.results?.length || 0}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du contenu' },
        { status: response.status }
      )
    }

    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')

    return nextResponse
  } catch (error) {
    console.error('Erreur API content GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/educational-content/`

    console.log('📝 Création de contenu éducatif:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Données:`, body)

    let authHeader: Record<string, string> = {}
    try {
      const raw = (request as any)?.cookies?.get?.('user_session_client')?.value || ''
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.token) authHeader = { 'Authorization': `Token ${parsed.token}` }
      }
    } catch {}

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // @ts-ignore
        'Cookie': (request as any)?.headers?.get?.('cookie') || '',
        ...authHeader,
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la création du contenu' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API content POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
