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
    
    if (subject && subject !== 'all') params.append('subject', subject)
    if (class_level && class_level !== 'all') params.append('class_level', class_level)
    if (status && status !== 'all') params.append('status', status)
    if (search) params.append('search', search)
    
    // Pagination
    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    params.append('page', page)
    params.append('page_size', page_size)
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/videos/?${params.toString()}`
      : `${baseApi}/api/videos/?${params.toString()}`
    
    console.log('🔍 Récupération des vidéos:')
    console.log(`  Endpoint: ${endpoint}`)
    
    // Utiliser le token admin
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    console.log(`📊 Réponse Django: ${response.status}`)
    console.log(`📋 Nombre de vidéos: ${data.count || data.results?.length || 0}`)
    
    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des vidéos' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API videos:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/videos/`
      : `${baseApi}/api/videos/`
    
    console.log('📝 Création d\'une vidéo:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Données:`, body)
    
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    const data = await response.json()
    
    console.log(`📊 Réponse Django: ${response.status}`)
    
    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la création de la vidéo' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API videos POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
