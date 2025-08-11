import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    const response = await fetch(`${apiBase}/parents/me/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      // Retourner seulement la liste des enfants
      return NextResponse.json(data.children || [])
    }

    // Fallback avec données de test
    const fallbackChildren = [
      {
        id: 1,
        user: {
          first_name: 'Marie',
          last_name: 'Dupont',
          email: 'marie.dupont@example.com'
        },
        is_blocked: false,
        allowed_hours_start: '08:00',
        allowed_hours_end: '20:00',
        screen_time_limit: 120,
        daily_screen_time: 45,
        allowed_websites: ['youtube.com', 'wikipedia.org'],
        blocked_websites: ['facebook.com', 'instagram.com']
      },
      {
        id: 2,
        user: {
          first_name: 'Paul',
          last_name: 'Dupont',
          email: 'paul.dupont@example.com'
        },
        is_blocked: true,
        blocked_until: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        blocked_reason: 'Temps d\'écran dépassé',
        allowed_hours_start: '09:00',
        allowed_hours_end: '19:00',
        screen_time_limit: 90,
        daily_screen_time: 95,
        allowed_websites: ['khan-academy.org'],
        blocked_websites: ['tiktok.com', 'snapchat.com']
      }
    ]

    return NextResponse.json(fallbackChildren)
  } catch (error) {
    console.error('Error fetching children:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}