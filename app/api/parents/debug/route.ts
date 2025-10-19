import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    console.log('Debug - Utilisateur connecté:', {
      id: user.id,
      email: user.email,
      role: user.role,
      token: user.token?.substring(0, 10) + '...'
    })

    if (user.role !== 'parent') {
      return NextResponse.json({ error: 'Accès refusé - pas un parent' }, { status: 403 })
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    // Test de connexion basique à l'API
    console.log('Test connexion API Django:', apiBase)
    
    const testResponse = await fetch(`${apiBase}/parents/me/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    const debugInfo: {
      user: {
        id: any;
        email: string;
        role: string;
        hasToken: boolean;
      };
      api: {
        baseUrl: string;
        status: number;
        statusText: string;
        ok: boolean;
      };
      data: any;
    } = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        hasToken: !!user.token
      },
      api: {
        baseUrl: apiBase,
        status: testResponse.status,
        statusText: testResponse.statusText,
        ok: testResponse.ok
      },
      data: null
    }

    if (testResponse.ok) {
      const data = await testResponse.json()
      debugInfo.data = {
        parent: {
          id: data.id,
          user: data.user,
          hasChildren: !!data.children,
          childrenCount: data.children?.length || 0,
          children: data.children || []
        }
      }
    } else {
      const errorText = await testResponse.text()
      debugInfo.data = { error: errorText }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Error in debug route:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur', 
      details: error instanceof Error ? error.message : 'Erreur inconnue' 
    }, { status: 500 })
  }
}
