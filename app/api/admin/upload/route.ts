import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'content', 'thumbnail', 'video'
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    console.log('📁 Upload de fichier:')
    console.log(`  Nom: ${file.name}`)
    console.log(`  Taille: ${file.size} bytes`)
    console.log(`  Type: ${file.type}`)
    console.log(`  Catégorie: ${type}`)

    // Validation de la taille
    const maxSize = type === 'video' ? 500 * 1024 * 1024 : // 500MB pour vidéos
                   type === 'content' ? 50 * 1024 * 1024 : // 50MB pour autres fichiers
                   5 * 1024 * 1024 // 5MB pour thumbnails

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Fichier trop volumineux. Taille max: ${Math.round(maxSize / 1024 / 1024)}MB` },
        { status: 400 }
      )
    }

    // Validation du type de fichier
    const allowedTypes = {
      content: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'],
      thumbnail: ['image/jpeg', 'image/png', 'image/webp'],
      video: ['video/mp4', 'video/avi', 'video/mov', 'video/quicktime']
    }

    if (!allowedTypes[type as keyof typeof allowedTypes]?.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé pour ${type}` },
        { status: 400 }
      )
    }

    // Préparer le FormData pour Django
    const djangoFormData = new FormData()
    djangoFormData.append('file', file)
    djangoFormData.append('type', type)

    // Récupérer le token d'authentification
    let authHeader: Record<string, string> = {}
    try {
      const raw = (request as any)?.cookies?.get?.('user_session_client')?.value || ''
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.token) authHeader = { 'Authorization': `Token ${parsed.token}` }
      }
    } catch {}

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/upload/`

    console.log(`🔗 Envoi vers Django: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Cookie': (request as any)?.headers?.get?.('cookie') || '',
        ...authHeader,
      },
      body: djangoFormData
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      file_url: data.file_url,
      file_name: data.file_name,
      file_size: data.file_size,
      file_type: data.file_type,
      message: 'Fichier uploadé avec succès'
    })

  } catch (error) {
    console.error('Erreur API upload:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

