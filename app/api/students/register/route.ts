import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Adapter la charge utile au format attendu par le backend (plat)
    const payload = {
      email: body.email,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      country: body.country,
      city: body.city,
      school_level: body.school_level,
      current_grade: body.current_grade,
      ...(body.school_name ? { school_name: body.school_name } : {}),
      ...(body.phone ? { phone: body.phone } : {}),
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const response = await fetch(`${apiBase}/students/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.detail || JSON.stringify(data) || 'Erreur lors de l\'inscription de l\'étudiant' },
        { status: response.status }
      )
    }

    // Stocker l'utilisateur en cookie pour la session côté front
    const res = NextResponse.json(data, { status: 201 })
    if (data && data.user) {
      res.cookies.set('user_session', JSON.stringify(data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })
    }
    return res
  } catch (error) {
    console.error('Erreur lors de l\'inscription de l\'étudiant:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

