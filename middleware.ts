import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Vérifier si l'utilisateur est authentifié
  const userSession = request.cookies.get('user_session')
  
  // Si pas de session et on essaie d'accéder à une page protégée
  if (!userSession && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('message', 'Session expirée - veuillez vous reconnecter')
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Temporairement désactivé pour debug
    // '/dashboard/:path*',
    // '/api/parent/:path*',
    // '/api/student/:path*',
    // '/api/admin/:path*',
  ],
}
