import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

/**
 * API pour récupérer le profil public d'un enseignant
 * GET /api/teachers/[id]/public-profile
 * Accessible sans authentification pour permettre consultation par parents
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/teachers/${teacherId}/public-profile/`

    logger.debug('Fetching teacher public profile', { teacherId }, { context: 'teachers/public-profile' })

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      logger.error('Django API error', new Error('fetch teacher profile failed'), {
        context: 'teachers/public-profile',
        data: { status: response.status, error: data }
      })
      return NextResponse.json(
        { error: data.error || 'Enseignant non trouvé' },
        { status: response.status }
      )
    }

    // Enrichir avec données calculées
    const enrichedProfile = {
      ...data,
      // Calculs côté frontend si nécessaire
      years_of_experience: data.experience_start_year 
        ? new Date().getFullYear() - data.experience_start_year 
        : 0,
      is_verified: data.status === 'approved',
      total_hours: data.completed_bookings_count || 0,
    }

    return NextResponse.json(enrichedProfile)
  } catch (error) {
    logger.error('Error fetching teacher public profile', error as Error, { context: 'teachers/public-profile' })
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

