import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any))

    // Backend Django expects flat fields (email, password, first_name, last_name)
    const bUser = (body && typeof body === 'object' ? (body.user || {}) : {}) as any
    const payload = {
      email: (body.email ?? bUser.email ?? '') as string,
      password: (body.password ?? bUser.password ?? '') as string,
      first_name: (body.first_name ?? bUser.first_name ?? '') as string,
      last_name: (body.last_name ?? bUser.last_name ?? '') as string,
      // Note: occupation/education_level are ignored by the current Django serializer
      // If needed later, extend the backend ParentRegistrationSerializer to accept them
    }

    // Normalize backend base URL (avoid double slashes) and forward the payload
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/parents/register/`

    let response: Response
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err: any) {
      // Backend injoignable (ECONNREFUSED, DNS, etc.)
      return NextResponse.json(
        { error: 'Service indisponible', details: String(err?.message || err) },
        { status: 502 }
      )
    }

    // Tenter de parser la réponse backend (JSON ou texte)
    let data: any = {}
    const text = await response.text().catch(() => '')
    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { message: text }
    }

    if (!response.ok) {
      // Renvoie les erreurs du backend; le frontend pourra les afficher
      const errPayload = data && Object.keys(data).length ? data : { error: "Erreur lors de l'inscription du parent" }
      return NextResponse.json(errPayload, { status: response.status })
    }

    // Définir le cookie de session avec l'utilisateur créé
    const res = NextResponse.json(data, { status: 201 })
    const user = (data && (data.user || data?.user)) || undefined
    if (user) {
      res.cookies.set('user_session', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }

    return res
  } catch (error) {
    console.error('Erreur lors de l\'inscription du parent:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


