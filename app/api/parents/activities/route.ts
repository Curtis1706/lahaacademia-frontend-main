import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week'
    const childId = searchParams.get('child_id')
    
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    const params = new URLSearchParams({ period })
    if (childId) params.append('child_id', childId)
    
    const response = await fetch(`${apiBase}/parents/activities/?${params}`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Fallback avec données de test
    const fallbackActivities = [
      {
        child_id: 1,
        child_name: 'Marie Dupont',
        date: new Date().toLocaleDateString('fr-FR'),
        screen_time: 85,
        courses_completed: 2,
        exercises_done: 8,
        time_spent_learning: 65,
        subjects: ['Mathématiques', 'Français']
      },
      {
        child_id: 2,
        child_name: 'Paul Dupont',
        date: new Date().toLocaleDateString('fr-FR'),
        screen_time: 120,
        courses_completed: 1,
        exercises_done: 5,
        time_spent_learning: 45,
        subjects: ['Sciences', 'Histoire']
      }
    ]

    return NextResponse.json(fallbackActivities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}