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
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

    console.log(`🔍 Récupération des disponibilités pour le cours ${courseId}`)

    const response = await fetch(`${apiBase}/courses/${courseId}/availabilities/`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const availabilities = await response.json()
      console.log(`✅ Disponibilités trouvées:`, availabilities.length)
      return NextResponse.json(availabilities)
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
    const body = await request.json()
    const courseId = params.id
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

    const payload = {
      course: courseId,
      day_of_week: body.day_of_week,
      start_time: body.start_time,
      end_time: body.end_time,
      is_active: true
    }

    console.log(`📝 Création d'une disponibilité pour le cours ${courseId}:`, payload)

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
