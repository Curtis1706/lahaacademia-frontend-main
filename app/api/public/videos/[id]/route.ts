import { NextRequest, NextResponse } from 'next/server'

const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = params.id
    const endpoint = `${baseApi}/public/videos/${videoId}/`
    
    console.log('🔍 Récupération de la vidéo:', videoId)
    console.log(`  Endpoint: ${endpoint}`)
    
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
      console.error(`Erreur lors de la récupération de la vidéo:`, res.status, errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération de la vidéo' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API vidéo publique GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

