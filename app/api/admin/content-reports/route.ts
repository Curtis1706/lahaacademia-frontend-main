import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Token ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    let endpoint = `${baseApi}/admin/content-reports/`
    
    if (status && status !== 'all') {
      endpoint += `?status=${status}`
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        data || { error: 'Erreur lors de la récupération des signalements' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API content-reports:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Token ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/admin/content-reports/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        data || { error: 'Erreur lors de la création du signalement' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur API content-reports POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}









