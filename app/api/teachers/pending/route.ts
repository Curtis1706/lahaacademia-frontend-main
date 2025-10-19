import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    // Si baseApi contient déjà /api, ne pas l'ajouter
    const endpoint = baseApi.includes('/api') 
      ? `${baseApi}/teachers/pending/`
      : `${baseApi}/api/teachers/pending/`
    
    console.log(`🔍 Configuration:`)
    console.log(`  NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL}`)
    console.log(`  baseApi: ${baseApi}`)
    console.log(`  endpoint final: ${endpoint}`)

    // Utiliser le token admin actuel
    const adminToken = 'cee5456080015db2299344035fecdb5936469663'

    console.log('🔍 Récupération des enseignants en attente:')
    console.log(`  Endpoint: ${endpoint}`)
    console.log(`  Token: ${adminToken.substring(0, 10)}...`)

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${adminToken}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    console.log(`📊 Réponse Django: ${response.status}`)
    console.log(`📋 Nombre de professeurs Django: ${data.count || data.teachers?.length || 0}`)

    if (!response.ok) {
      console.error('Erreur API Django:', response.status, data)
      // Retourner des données de test si l'API Django ne fonctionne pas
      return NextResponse.json({
        teachers: [
          {
            id: 3,
            user: {
              id: "c3162950-fca2-4cd4-8230-449b606bdd94",
              first_name: "Nathan",
              last_name: "CLO",
              email: "nathan@gmail.com",
              phone: "+237 555 123 456"
            },
            bio: "Professeur de mathématiques avec 5 ans d'expérience",
            subjects: ["mathematics"],
            experience_years: 5,
            hourly_rate: 20000,
            is_validated: false,
            created_at: "2024-01-17T09:00:00Z",
            diploma_file: "/media/teacher_diplomas/diploma.pdf",
            criminal_record_file: "/media/teacher_criminal_records/criminal.pdf",
            identity_document_file: "/media/teacher_identity/identity.pdf",
            proof_of_address_file: "/media/teacher_address/address.pdf",
            profile_photo: "/media/teacher_photos/photo.jpg",
            cv_file: "/media/teacher_cvs/cv.pdf"
          }
        ]
      })
    }

    console.log(`📤 Envoi vers frontend: ${data.teachers?.length || 0} professeurs`)
    
    // Créer la réponse avec headers anti-cache pour forcer la synchronisation
    const nextResponse = NextResponse.json(data)
    
    // Headers pour empêcher la mise en cache
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    nextResponse.headers.set('Pragma', 'no-cache')
    nextResponse.headers.set('Expires', '0')
    
    return nextResponse
  } catch (error) {
    console.error('Erreur API teachers/pending:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
