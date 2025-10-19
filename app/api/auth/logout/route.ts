import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Supprimer le cookie de session
    const response = NextResponse.json({ message: 'Déconnexion réussie' })
    response.cookies.delete('user_session')
    
    return response
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}




































