import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      )
    }
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/${contentId}/`
      : `${baseApi}/api/educational-content/${contentId}/`
    
    console.log('🔍 Récupération du contenu pédagogique:')
    console.log(`  ID: ${contentId}`)
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
    
    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Contenu non trouvé' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API educational-content GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id
    const body = await request.json()
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      )
    }
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/${contentId}/`
      : `${baseApi}/api/educational-content/${contentId}/`
    
    console.log('🔍 Mise à jour du contenu pédagogique:')
    console.log(`  ID: ${contentId}`)
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Données: ${JSON.stringify(body, null, 2)}`)
    
    // Utiliser le token admin
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const response = await fetch(endpoint, {
      method: 'PUT',
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
        data || { error: 'Erreur lors de la mise à jour du contenu' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API educational-content PUT:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentId = params.id
    
    if (!contentId) {
      return NextResponse.json(
        { error: 'ID du contenu requis' },
        { status: 400 }
      )
    }
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/${contentId}/`
      : `${baseApi}/api/educational-content/${contentId}/`
    
    console.log('🔍 Suppression du contenu pédagogique:')
    console.log(`  ID: ${contentId}`)
    console.log(`  Endpoint: ${endpoint}`)
    
    // Utiliser le token admin
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`📊 Réponse Django: ${response.status}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erreur API Django:', response.status, errorData)
      return NextResponse.json(
        errorData || { error: 'Erreur lors de la suppression du contenu' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({ message: 'Contenu supprimé avec succès' })
  } catch (error) {
    console.error('Erreur API educational-content DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





