import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Route: Récupération des utilisateurs')
    
    // Récupérer le cookie user_session_client
    const userSessionClient = request.cookies.get('user_session_client')?.value
    
    if (!userSessionClient) {
      console.error('❌ Pas de cookie user_session_client')
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Parser les données du cookie
    const userData = JSON.parse(userSessionClient)
    console.log('✅ Données utilisateur du cookie:', userData)

    // Vérifier que l'utilisateur est admin
    if (userData.role !== 'admin') {
      console.error('❌ Accès refusé - rôle non admin')
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    // Construire l'URL Django (port et /api configurables)
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    // Le projet Django expose déjà /api/users/ via router (voir django_backend/core/urls.py)
    const endpoint = baseApi.includes('/api')
      ? `${baseApi}/users/`
      : `${baseApi}/api/users/`

    console.log('🔗 Appel Django:', endpoint)

    // Récupérer un éventuel token depuis la session côté client (créé à la connexion)
    // user_session_client contient { user, token }
    let authHeader: Record<string, string> = {}
    try {
      const parsed = JSON.parse(request.cookies.get('user_session_client')?.value || '{}')
      if (parsed?.token) {
        authHeader = { 'Authorization': `Token ${parsed.token}` }
      }
    } catch {}

    // Appel Django avec les cookies pour les sessions + token si présent
    let usersResponse
    try {
      usersResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
          ...authHeader,
        },
        cache: 'no-store',
      })
    } catch (networkError) {
      console.error('🌐 Erreur réseau vers Django:', networkError)
      return NextResponse.json({
        error: 'Impossible de joindre Django (network error)',
        details: networkError instanceof Error ? networkError.message : 'unknown',
        endpoint,
      }, { status: 500 })
    }

    console.log('📡 Réponse Django:', usersResponse.status, usersResponse.statusText)

    if (usersResponse.status === 401) {
      return NextResponse.json({ error: 'Session Django expirée', endpoint }, { status: 401 })
    }
    if (usersResponse.status === 403) {
      return NextResponse.json({ error: 'Accès interdit (Django)', endpoint }, { status: 403 })
    }
    if (!usersResponse.ok) {
      let errorBody: any = null
      try { errorBody = await usersResponse.json() } catch {}
      return NextResponse.json({
        error: `Erreur Django ${usersResponse.status}`,
        endpoint,
        django: errorBody || null,
      }, { status: 500 })
    }

    // Tenter aussi de récupérer étudiants/enseignants/parents pour enrichir
    const endpoints = {
      users: endpoint,
      students: endpoint.replace(/\/users\/$/, '/students/'),
      teachers: endpoint.replace(/\/users\/$/, '/teachers/'),
      parents: endpoint.replace(/\/users\/$/, '/parents/'),
    }

    const fetchJson = async (url: string) => {
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': request.headers.get('cookie') || '',
            ...authHeader,
          },
          cache: 'no-store',
        })
        if (!res.ok) return []
        const j = await res.json()
        return Array.isArray(j) ? j : (j.results || j.users || [])
      } catch { return [] }
    }

    const [rawUsers, rawStudents, rawTeachers, rawParents] = await Promise.all([
      fetchJson(endpoints.users),
      fetchJson(endpoints.students),
      fetchJson(endpoints.teachers),
      fetchJson(endpoints.parents),
    ])

    const normalizeFromUser = (u: any) => ({
      id: (u?.id ?? u?.user?.id ?? 'unknown').toString(),
      username: u?.username ?? u?.user?.username ?? '',
      email: u?.email ?? u?.user?.email ?? '',
      first_name: u?.first_name ?? u?.user?.first_name ?? '',
      last_name: u?.last_name ?? u?.user?.last_name ?? '',
      role: u?.role ?? 'user',
      is_active: (u?.is_active ?? u?.user?.is_active) !== false,
      date_joined: u?.date_joined ?? u?.user?.date_joined ?? '',
      last_login: u?.last_login ?? u?.user?.last_login ?? '',
      phone: u?.phone ?? u?.user?.phone ?? '',
      profile: {
        avatar: u?.profile_photo ?? u?.user?.profile_photo ?? null,
        bio: u?.bio ?? '',
        location: u?.city ?? '',
        country: u?.country ?? u?.user?.country ?? '',
        date_of_birth: u?.date_of_birth ?? '',
        school_level: u?.school_level ?? '',
        subjects: u?.subjects ?? [],
        languages: u?.languages ?? ['Français'],
        experience_years: u?.experience_years ?? 0,
        education: u?.education ?? '',
        certifications: u?.certifications ?? [],
        hourly_rate: u?.hourly_rate ?? 0,
        average_rating: u?.average_rating ?? 0,
        students_count: u?.students_count ?? 0,
        is_verified: u?.is_verified ?? false,
        is_approved: u?.is_approved ?? false,
      },
    })

    const transformedUsers = [
      ...rawUsers.map((u: any) => normalizeFromUser(u)),
      ...rawStudents.map((s: any) => ({ ...normalizeFromUser(s), role: 'student' })),
      ...rawTeachers.map((t: any) => ({ ...normalizeFromUser(t), role: 'teacher' })),
      ...rawParents.map((p: any) => ({ ...normalizeFromUser(p), role: 'parent' })),
    ]

    // Supprimer doublons par id (garde la première occurrence la plus riche)
    const uniqueMap = new Map<string, any>()
    for (const u of transformedUsers) {
      if (!uniqueMap.has(u.id)) uniqueMap.set(u.id, u)
    }
    const uniqueUsers = Array.from(uniqueMap.values())

    console.log('✅ Utilisateurs transformés (fusionnés):', {
      users: uniqueUsers.length,
      users_raw: rawUsers.length,
      students: rawStudents.length,
      teachers: rawTeachers.length,
      parents: rawParents.length,
    })

    return NextResponse.json({
      users: uniqueUsers,
      total: uniqueUsers.length,
      success: true,
    })

  } catch (error) {
    console.error('❌ Erreur API Route utilisateurs:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
