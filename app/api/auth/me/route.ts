import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cette route lit uniquement le cookie httpOnly 'user_session'
// et renvoie l'utilisateur sérialisé s'il est présent
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('user_session')
    if (!cookie) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    try {
      const user = JSON.parse(cookie.value)
      return NextResponse.json(user, { status: 200 })
    } catch {
      return NextResponse.json({ error: 'Session invalide' }, { status: 401 })
    }
  } catch (error) {
    console.error("/api/auth/me error", error)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}
