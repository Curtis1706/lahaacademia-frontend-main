import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = params.id
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/educational-content/${bookId}/`

    console.log('🔍 Récupération du livre:', bookId)
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
        'Cookie': (request as any)?.headers?.get?.('cookie') || '',
        ...authHeader,
      },
      cache: 'no-store',
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du livre' },
        { status: response.status }
      )
    }

    const nextResponse = NextResponse.json(data)
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')

    return nextResponse
  } catch (error) {
    console.error('Erreur API book GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = params.id
    const body = await request.json()

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/educational-content/${bookId}/`

    console.log('📝 Modification du livre:', bookId)
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
      method: 'PUT',
      headers: {
        'Authorization': `Token ${authHeader['Authorization'] || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la modification du livre' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API book PUT:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookId = params.id

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/educational-content/${bookId}/`

    console.log('🗑️ Suppression du livre:', bookId)
    console.log(`  Endpoint: ${endpoint}`)

    let authHeader: Record<string, string> = {}
    try {
      const cookieStore = cookies()
      const userSessionCookie = cookieStore.get('user_session_client')
      
      if (userSessionCookie?.value) {
        const parsed = JSON.parse(userSessionCookie.value)
        if (parsed?.token) {
          authHeader = { 'Authorization': `Token ${parsed.token}` }
        }
      }
    } catch (e) {
      console.log('❌ Erreur lors du parsing du cookie:', e)
    }

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      }
    })

    console.log(`📊 Réponse Django: ${response.status}`)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression du livre' },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Livre supprimé avec succès' })
  } catch (error) {
    console.error('Erreur API book DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
