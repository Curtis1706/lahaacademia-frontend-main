import { NextRequest, NextResponse } from 'next/server'

const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams(searchParams.toString())

    const page = searchParams.get('page') || '1'
    const page_size = searchParams.get('page_size') || '20'
    params.append('page', page)
    params.append('page_size', page_size)
    
    const endpoint = `${baseApi}/public/videos/?${params.toString()}`
    
    console.log('🔍 Récupération des vidéos publiques:')
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
      console.error(`Erreur lors de la récupération des vidéos publiques:`, res.status, errorData)
      return NextResponse.json({ error: errorData.detail || errorData.message || 'Erreur lors de la récupération des vidéos' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API vidéos publiques GET:', error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

