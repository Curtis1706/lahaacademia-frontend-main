import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les champs envoyés par le client
    const form = await request.formData()

    const val = (key: string): string => {
      const v = form.get(key)
      return v === null || v === undefined ? '' : String(v)
    }

    // Le backend Django attend des champs plats (JSON)
    const specialization = val('specialization') || val('subjects')
    const payload: any = {
      email: val('email'),
      password: val('password'),
      first_name: val('firstName') || val('first_name'),
      last_name: val('lastName') || val('last_name'),
      bio: val('bio') || '',
    }

    // Champs optionnels numériques
    const exp = val('experience_years')
    const rate = val('hourly_rate')
    if (exp) payload.experience_years = Number(exp)
    if (rate) payload.hourly_rate = Number(rate)

    // subjects: liste attendue par le backend
    payload.subjects = specialization ? [specialization] : []

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    const endpoint = `${baseApi}/teachers/register/`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(
        data && Object.keys(data).length ? data : { error: "Erreur lors de l'inscription de l'enseignant" },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'enseignant:", error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


