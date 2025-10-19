import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les champs envoyés par le client (FormData avec fichiers)
    const form = await request.formData()

    const val = (key: string): string => {
      const v = form.get(key)
      return v === null || v === undefined ? '' : String(v)
    }

    // Debug: Afficher les champs reçus
    console.log('📝 Champs reçus pour inscription professeur:')
    for (const [key, value] of form.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [FILE] ${value.name} (${value.size} bytes)`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    // Créer un nouveau FormData pour envoyer au backend Django
    const formData = new FormData()

    // Ajouter les champs texte
    const email = val('email')
    const password = val('password')
    const firstName = val('firstName') || val('first_name')
    const lastName = val('lastName') || val('last_name')
    const bio = val('bio') || ''
    
    console.log('🔍 Mapping des champs:')
    console.log(`  email: "${email}"`)
    console.log(`  password: "${password}"`)
    console.log(`  firstName: "${firstName}"`)
    console.log(`  lastName: "${lastName}"`)
    console.log(`  bio: "${bio}"`)
    
    // Validation des champs requis
    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }
    if (!password) {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }
    if (!firstName) {
      return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
    }
    if (!lastName) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }
    
    formData.append('email', email)
    formData.append('password', password)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName)
    formData.append('bio', bio)

    // Champs optionnels numériques
    const exp = val('experience_years')
    const rate = val('hourly_rate')
    if (exp) formData.append('experience_years', exp)
    if (rate) formData.append('hourly_rate', rate)

    // subjects: liste attendue par le backend (JSON array)
    const specialization = val('specialization') || val('subjects')
    console.log(`  specialization: "${specialization}"`)
    
    if (!specialization) {
      return NextResponse.json({ error: 'Spécialisation requise' }, { status: 400 })
    }
    
    // Convertir en tableau JSON si ce n'est pas déjà le cas
    let subjectsArray
    try {
      subjectsArray = JSON.parse(specialization)
    } catch {
      // Si ce n'est pas du JSON, créer un tableau avec la valeur
      subjectsArray = [specialization]
    }
    
    console.log(`  subjectsArray: ${JSON.stringify(subjectsArray)}`)
    formData.append('subjects', JSON.stringify(subjectsArray))

    // Ajouter les fichiers si présents
    const diplomaFile = form.get('diploma_file') as File
    const criminalRecordFile = form.get('criminal_record_file') as File
    const identityDocumentFile = form.get('identity_document_file') as File
    const proofOfAddressFile = form.get('proof_of_address_file') as File
    const profilePhotoFile = form.get('profile_photo') as File
    const cvFile = form.get('cv_file') as File

    if (diplomaFile && diplomaFile.size > 0) {
      formData.append('diploma_file', diplomaFile)
    }
    if (criminalRecordFile && criminalRecordFile.size > 0) {
      formData.append('criminal_record_file', criminalRecordFile)
    }
    if (identityDocumentFile && identityDocumentFile.size > 0) {
      formData.append('identity_document_file', identityDocumentFile)
    }
    if (proofOfAddressFile && proofOfAddressFile.size > 0) {
      formData.append('proof_of_address_file', proofOfAddressFile)
    }
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      formData.append('profile_photo', profilePhotoFile)
    }
    if (cvFile && cvFile.size > 0) {
      formData.append('cv_file', cvFile)
    }

    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    const endpoint = `${baseApi}/api/teachers/register/`

    console.log('🚀 Envoi vers Django:', endpoint)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData, // Envoyer FormData au lieu de JSON
    })

    console.log('📡 Réponse Django:', response.status, response.statusText)

    const data = await response.json().catch((e) => {
      console.error('❌ Erreur parsing JSON:', e)
      return { error: 'Erreur de parsing de la réponse' }
    })

    if (!response.ok) {
      console.error('❌ Erreur inscription professeur:', response.status, data)
      return NextResponse.json(
        data && Object.keys(data).length ? data : { error: "Erreur lors de l'inscription de l'enseignant" },
        { status: response.status }
      )
    }

    console.log('✅ Inscription réussie:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'enseignant:", error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}


