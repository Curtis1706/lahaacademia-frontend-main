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
      { id: 1, time: '08:00', available: true },
      { id: 2, time: '09:00', available: true },
      { id: 3, time: '10:00', available: false },
      { id: 4, time: '11:00', available: true },
      { id: 5, time: '14:00', available: true },
      { id: 6, time: '15:00', available: true },
      { id: 7, time: '16:00', available: false },
      { id: 8, time: '17:00', available: true }
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