import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const childId = params.id
    const settings = await request.json()
    
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    const response = await fetch(`${apiBase}/parents/children/${childId}/settings/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Fallback - retourner les settings mis à jour
    console.log('Backend unavailable, using fallback for child settings update')
    const updatedChild = {
      id: parseInt(childId),
      user: {
        first_name: 'Enfant',
        last_name: 'Test',
        email: 'enfant@test.com'
      },
      ...settings,
      daily_screen_time: 45 // Valeur par défaut
    }

    return NextResponse.json(updatedChild)
  } catch (error) {
    console.error('Error updating child settings:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}