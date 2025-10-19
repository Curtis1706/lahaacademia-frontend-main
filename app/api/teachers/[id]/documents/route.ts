import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = params.id
    
    if (!teacherId) {
      return NextResponse.json(
        { error: 'ID du professeur requis' },
        { status: 400 }
      )
    }

    // Utiliser le token admin actuel
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'
    
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/teachers/${teacherId}/`

    console.log('🔍 Récupération des documents du professeur:', teacherId)

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Erreur API Django:', response.status, data)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des informations du professeur' },
        { status: response.status }
      )
    }

    // Extraire les informations des documents
    const documents = []
    
    if (data.diploma_file) {
      documents.push({
        type: 'diploma_file',
        name: 'Diplôme Certifié',
        filename: data.diploma_file.split('/').pop(),
        url: data.diploma_file,
        size: null, // Taille non disponible via l'API actuelle
      })
    }
    
    if (data.criminal_record_file) {
      documents.push({
        type: 'criminal_record_file',
        name: 'Extrait de Casier Judiciaire',
        filename: data.criminal_record_file.split('/').pop(),
        url: data.criminal_record_file,
        size: null,
      })
    }
    
    if (data.identity_document_file) {
      documents.push({
        type: 'identity_document_file',
        name: 'Pièce d\'Identité',
        filename: data.identity_document_file.split('/').pop(),
        url: data.identity_document_file,
        size: null,
      })
    }
    
    if (data.proof_of_address_file) {
      documents.push({
        type: 'proof_of_address_file',
        name: 'Justificatif de Domicile',
        filename: data.proof_of_address_file.split('/').pop(),
        url: data.proof_of_address_file,
        size: null,
      })
    }
    
    if (data.profile_photo) {
      documents.push({
        type: 'profile_photo',
        name: 'Photo de Profil',
        filename: data.profile_photo.split('/').pop(),
        url: data.profile_photo,
        size: null,
      })
    }
    
    if (data.cv_file) {
      documents.push({
        type: 'cv_file',
        name: 'CV Professionnel',
        filename: data.cv_file.split('/').pop(),
        url: data.cv_file,
        size: null,
      })
    }

    return NextResponse.json({
      teacher_id: teacherId,
      teacher_name: `${data.user?.first_name || ''} ${data.user?.last_name || ''}`.trim(),
      documents: documents,
      total_documents: documents.length
    })
    
  } catch (error) {
    console.error('❌ Erreur API documents:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}





