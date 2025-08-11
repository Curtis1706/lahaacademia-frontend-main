import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    console.log('Récupération des données professeur pour:', user.email)
    
    const response = await fetch(`${apiBase}/teachers/me/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Réponse API teacher/me status:', response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log('Données professeur récupérées:', data)
      return NextResponse.json(data)
    }

    // Fallback avec données de test si l'API Django n'est pas accessible
    console.log('Erreur API, utilisation des données de fallback')
    const fallbackTeacher = {
      id: 1,
      user: {
        first_name: user.first_name || 'Professeur',
        last_name: user.last_name || '',
        email: user.email
      },
      subjects: ['Mathématiques'],
      bio: 'Professeur expérimenté',
      hourly_rate: 5000,
      experience_years: 5
    }

    return NextResponse.json(fallbackTeacher)
  } catch (error) {
    console.error('Error fetching teacher data:', error)
    
    // En cas d'erreur, retourner des données minimales
    const fallbackTeacher = {
      id: 1,
      user: {
        first_name: 'Professeur',
        last_name: '',
        email: 'professeur@example.com'
      }
    }
    
    return NextResponse.json(fallbackTeacher)
  }
}
