import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies ou headers
    const authHeader = request.headers.get('Authorization')
    
    // Essayer d'abord le header Authorization
    let token = authHeader?.replace('Token ', '')
    
    // Si pas de token dans le header, essayer le cookie user_session
    if (!token) {
      const userSessionCookie = request.cookies.get('user_session')?.value
      if (userSessionCookie) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(userSessionCookie))
          token = sessionData.token
          console.log(`🍪 Token extrait du cookie: ${token ? token.substring(0, 10) + '...' : 'Aucun'}`)
        } catch (e) {
          console.log('❌ Erreur parsing cookie user_session:', e)
        }
      }
    }

    console.log('🔍 Authentification professeur:')
    console.log(`  Authorization header: ${authHeader ? 'Présent' : 'Absent'}`)
    console.log(`  Cookie user_session: ${request.cookies.get('user_session')?.value ? 'Présent' : 'Absent'}`)
    console.log(`  Token extrait: ${token ? token.substring(0, 10) + '...' : 'Aucun'}`)

    if (!token) {
      console.log('❌ Aucun token trouvé')
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    // Si baseApi contient déjà /api, ne pas l'ajouter
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/teachers/me/`
      : `${baseApi}/api/teachers/me/`

    console.log('🔍 Récupération des informations du professeur:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Token: ${token.substring(0, 10)}...`)

    console.log(`📡 Envoi vers Django: ${endpoint}`)
    console.log(`🔑 Token envoyé: ${token.substring(0, 10)}...`)
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log(`📊 Réponse Django: ${response.status}`)

    const data = await response.json()

    if (!response.ok) {
      console.error('Erreur API Django me:', response.status, data)
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des informations du professeur' },
        { status: response.status }
      )
    }

    console.log(`✅ Informations professeur récupérées: ${data.user?.email}`)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API teachers/me:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}