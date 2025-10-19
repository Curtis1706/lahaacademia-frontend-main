import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; filename: string } }
) {
  try {
    const teacherId = params.id
    const filename = params.filename
    
    if (!teacherId || !filename) {
      return NextResponse.json(
        { error: 'ID du professeur et nom de fichier requis' },
        { status: 400 }
      )
    }

    // Utiliser le token admin actuel
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    
    // Construire l'URL du fichier
    const fileUrl = `${baseApi}/media/teacher_documents/${teacherId}/${filename}`
    
    console.log('🔍 Tentative de récupération du fichier:', fileUrl)
    
    // Récupérer le fichier depuis Django
    const response = await fetch(fileUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${adminToken}`,
      }
    })

    if (!response.ok) {
      console.error('❌ Erreur lors de la récupération du fichier:', response.status)
      return NextResponse.json(
        { error: 'Fichier non trouvé ou accès refusé' },
        { status: response.status }
      )
    }

    // Récupérer le contenu du fichier
    const fileBuffer = await response.arrayBuffer()
    
    // Déterminer le type de contenu
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600', // Cache pendant 1 heure
      }
    })
    
  } catch (error) {
    console.error('❌ Erreur API documents:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





