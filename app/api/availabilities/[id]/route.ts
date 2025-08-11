import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    const availabilityId = params.id
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

    console.log(`🗑️ Suppression de la disponibilité ${availabilityId}`)

    const response = await fetch(`${apiBase}/course-availabilities/${availabilityId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok || response.status === 204) {
      console.log(`✅ Disponibilité supprimée avec succès`)
      return NextResponse.json({ message: 'Disponibilité supprimée avec succès' })
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ ERREUR Django:', response.status, response.statusText, errorData)
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la suppression de la disponibilité' 
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
