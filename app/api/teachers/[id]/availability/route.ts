import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const teacherId = params.id

    console.log(`Récupération disponibilités pour teacher ${teacherId} date ${date}`)

    // Pour l'instant, retournons des créneaux par défaut
    // Plus tard, cela interrogera Django pour les vraies disponibilités
    const defaultSlots = [
      { id: 1, slot: '08:00-09:00', available: true },
      { id: 2, slot: '09:00-10:00', available: true },
      { id: 3, slot: '10:00-11:00', available: false },
      { id: 4, slot: '11:00-12:00', available: true },
      { id: 5, slot: '14:00-15:00', available: true },
      { id: 6, slot: '15:00-16:00', available: true },
      { id: 7, slot: '16:00-17:00', available: false },
      { id: 8, slot: '17:00-18:00', available: true }
    ]

    return NextResponse.json(defaultSlots)
    
  } catch (error) {
    console.error('Error fetching teacher availability:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    )
  }
}