import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const courseId = params.id
    // Sécuriser la base API pour éviter les boucles (ne jamais pointer sur le port 3000)
    const envBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
    const apiBase = (envBase.includes('localhost:3000') || envBase.includes('127.0.0.1:3000'))
      ? 'http://127.0.0.1:8000/api'
      : envBase

    console.log(`🔍 Récupération des disponibilités pour le cours ${courseId}`)

    const response = await fetch(`${apiBase}/course-availabilities/?course=${courseId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json().catch(() => null)
      const items = Array.isArray(data)
        ? data
        : (data && Array.isArray((data as any).results) ? (data as any).results : [])
      console.log(`✅ Disponibilités trouvées:`, items.length)
      return NextResponse.json(items)
    } else {
      console.log(`❌ Erreur récupération disponibilités:`, response.status)
      return NextResponse.json([], { status: 200 }) // Retourner tableau vide si pas de disponibilités
    }
  } catch (error) {
    console.error('Error fetching availabilities:', error)
    return NextResponse.json([], { status: 200 }) // Retourner tableau vide en cas d'erreur
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    console.log(`🔍 Utilisateur connecté côté frontend:`, {
      email: user.email,
      role: user.role,
      id: user.id,
      hasToken: !!user.token
    })
    
    const body = await request.json()
    const courseId = params.id
    // Sécuriser la base API pour éviter les boucles (ne jamais pointer sur le port 3000)
    const envBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
    const apiBase = (envBase.includes('localhost:3000') || envBase.includes('127.0.0.1:3000'))
      ? 'http://127.0.0.1:8000/api'
      : envBase

    const payload: any = {
      course: courseId,
      day_of_week: body.day_of_week,
      start_time: body.start_time,
      end_time: body.end_time,
      is_active: true
    }
    if (body.specific_date && String(body.specific_date).trim() !== '') {
      payload.specific_date = body.specific_date
    }

    console.log(`📝 Création d'une disponibilité pour le cours ${courseId}:`, payload)

    console.log(`📝 Token utilisé:`, user.token ? 'Présent' : 'Manquant')
    console.log(`📝 Payload envoyé:`, JSON.stringify(payload, null, 2))

    const response = await fetch(`${apiBase}/course-availabilities/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (response.ok) {
      const availability = await response.json()
      console.log(`✅ Disponibilité créée:`, availability)
      return NextResponse.json(availability, { status: 201 })
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ ERREUR Django:', response.status, response.statusText, errorData)
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la création de la disponibilité' 
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error creating availability:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
