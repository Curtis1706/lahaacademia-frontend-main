import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// Fonction utilitaire pour récupérer le token d'authentification
async function getAuthToken() {
  try {
    const cookieStore = cookies()
    const userSessionCookie = cookieStore.get('user_session_client')
    
    if (userSessionCookie?.value) {
      const parsed = JSON.parse(userSessionCookie.value)
      if (parsed?.token) {
        return parsed.token
      }
    }
  } catch (e) {
    console.error('Erreur lors du parsing du cookie:', e)
  }
  return null
}

// Récupérer la progression de l'utilisateur pour une vidéo
export async function GET(request: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({
        error: 'Authentification requise'
      }, { status: 401 })
    }
    
    const endpoint = `${baseApi}/api/admin-panel/video-progress/${videoId}/`
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Erreur API video progress:', error)
    return NextResponse.json({
      error: 'Une erreur est survenue lors de la récupération de la progression.'
    }, { status: 500 })
  }
}

// Mettre à jour la progression de l'utilisateur pour une vidéo
export async function POST(request: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const videoId = params.videoId
    const token = await getAuthToken()
    
    if (!token) {
      return NextResponse.json({
        error: 'Authentification requise'
      }, { status: 401 })
    }
    
    const body = await request.json()
    const endpoint = `${baseApi}/api/admin-panel/update-progress/${videoId}/`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Erreur API update progress:', error)
    return NextResponse.json({
      error: 'Une erreur est survenue lors de la mise à jour de la progression.'
    }, { status: 500 })
  }
}

