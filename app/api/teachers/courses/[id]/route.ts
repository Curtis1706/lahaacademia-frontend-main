import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const courseId = params.id
  const envBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
  const apiBase = (envBase.includes('localhost:3000') || envBase.includes('127.0.0.1:3000'))
    ? 'http://127.0.0.1:8000/api'
    : envBase

    const djangoPayload = {
      title: body.title,
      description: body.description,
      subject: body.subject,
      level: body.level,
      duration: body.duration,
      price: body.price,
      country: body.country || 'Bénin',
      difficulty_level: body.difficulty_level || 'beginner'
    }

    console.log(`🔄 Modification du cours ${courseId}:`, djangoPayload)

    const response = await fetch(`${apiBase}/courses/${courseId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(djangoPayload)
    })

    console.log(`📊 Response status:`, response.status, response.statusText)

    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Cours modifié:`, data)
      
      // Adapter la réponse pour le frontend
      const adaptedCourse = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        level: data.level,
        duration: data.duration,
        price: data.price,
        course_type: body.course_type || 'individual',
        max_students: body.max_students || 1,
        created_at: data.created_at
      }
      return NextResponse.json(adaptedCourse)
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ ERREUR Django:', response.status, response.statusText, errorData)
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la modification du cours' 
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const courseId = params.id
  const envBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
  const apiBase = (envBase.includes('localhost:3000') || envBase.includes('127.0.0.1:3000'))
    ? 'http://127.0.0.1:8000/api'
    : envBase

    console.log(`🗑️ Suppression du cours ${courseId}`)

    const response = await fetch(`${apiBase}/courses/${courseId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(`📊 Response status:`, response.status, response.statusText)

    if (response.ok || response.status === 204) {
      console.log(`✅ Cours supprimé avec succès`)
      return NextResponse.json({ message: 'Cours supprimé avec succès' })
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.log('❌ ERREUR Django:', response.status, response.statusText, errorData)
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la suppression du cours' 
      }, { status: response.status })
    }
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
