import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Pour les enseignants, nous devons gérer les fichiers
    const formData = await request.formData()

    // Mapper les noms pour compatibilité backend si le client envoie en clair
    const mapIfPresent = (from: string, to: string) => {
      const v = formData.get(from)
      if (v !== null && v !== undefined) {
        formData.append(to, v as Blob | string)
      }
    }

    // Champs user directs -> backend attend des champs au niveau racine pour create_user fallback
    mapIfPresent('firstName', 'first_name')
    mapIfPresent('lastName', 'last_name')
    mapIfPresent('email', 'email')
    mapIfPresent('phone', 'phone')
    mapIfPresent('password', 'password')
    
    // Rediriger vers le backend Django
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/teachers/register/`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Erreur lors de l\'inscription de l\'enseignant' },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de l\'inscription de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


