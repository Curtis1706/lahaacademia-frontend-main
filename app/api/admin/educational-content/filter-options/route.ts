import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/educational-content/filter_options/`
      : `${baseApi}/api/educational-content/filter_options/`
    
    console.log('🔍 Récupération des options de filtrage:')
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
        { error: 'Erreur lors de la récupération des options de filtrage' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API filter-options:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





