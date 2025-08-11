import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({} as any))

    // Le backend Django attend des champs plats
    const payload = {
      email: body.email ?? '',
      password: body.password ?? '',
      first_name: body.first_name ?? '',
      last_name: body.last_name ?? '',
      bio: body.bio ?? '',
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const response = await fetch(`${baseApi}/authors/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        data && Object.keys(data).length ? data : { error: "Erreur lors de l'inscription de l'auteur" },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'inscription de l\'auteur:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


