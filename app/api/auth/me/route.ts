import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cette route lit uniquement le cookie httpOnly 'user_session'
// et renvoie l'utilisateur sérialisé s'il est présent
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('user_session')
    console.log('Cookie user_session:', cookie ? 'présent' : 'absent')
    
    if (!cookie) {
      console.log('Aucun cookie user_session trouvé')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    try {
      const user = JSON.parse(cookie.value)
      console.log('Utilisateur trouvé dans le cookie:', user.username, user.role)
      return NextResponse.json({ user }, { status: 200 })
    } catch (parseError) {
      console.error('Erreur de parsing du cookie:', parseError)
      return NextResponse.json({ user: null }, { status: 200 })
    }
  } catch (error) {
    console.error("/api/auth/me error", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
