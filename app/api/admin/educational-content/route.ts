import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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
    
    console.log('🔍 Récupération des contenus pédagogiques:')
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
    console.log(`📋 Nombre de contenus: ${data.count || data.results?.length || 0}`)
    
    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
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
    console.error('Erreur API educational-content:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire (FormData)
    const formData = await request.formData()
    
    // Créer un nouveau FormData pour Django
    const djangoFormData = new FormData()
    
    // Debug: Afficher les données reçues
    console.log('🔍 Création d\'un nouveau contenu pédagogique:')
    console.log('📝 Données reçues:')
    
    // Traiter chaque champ
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [FILE] ${value.name} (${value.size} bytes)`)
        djangoFormData.append(key, value)
      } else {
        console.log(`  ${key}: ${value}`)
        
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
    
    console.log(`  Endpoint: ${endpoint}`)
    
    // Utiliser le token admin
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${adminToken}`,
        // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      },
      body: djangoFormData // Envoyer FormData traité
    })
    
    const data = await response.json()
    
    console.log(`📊 Réponse Django: ${response.status}`)
    
    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du contenu' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur API educational-content POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
