import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any))

    const bUser = body.user || {}
    const payload = {
      user: {
        first_name: bUser.first_name ?? body.first_name ?? '',
        last_name: bUser.last_name ?? body.last_name ?? '',
        email: bUser.email ?? body.email ?? '',
        phone: bUser.phone ?? body.phone ?? '',
        password: bUser.password ?? body.password ?? '',
      },
      occupation: body.occupation ?? '',
      education_level: body.education_level ?? '',
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
      // Renvoyer tout le payload d'erreurs du backend pour un debug facile
      return NextResponse.json(
        data && Object.keys(data).length ? data : { error: "Erreur lors de l'inscription du parent" },
        { status: response.status }
      )
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


