import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session_client')?.value || cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()
    const courseId = params.id
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

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

    const response = await fetch(`${apiBase}/courses/${courseId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(djangoPayload)
    })

    if (response.ok) {
      const data = await response.json()
      
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
      logger.error('Erreur Django update course', new Error('fetch error'), {
        context: 'teachers/courses/[id]',
        data: { status: response.status, errorData }
      })
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la modification du cours' 
      }, { status: response.status })
    }
  } catch (error) {
    logger.error('Error updating course', error as Error, { context: 'teachers/courses/[id]' })
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userSession = cookies().get('user_session_client')?.value || cookies().get('user_session')?.value
    if (!userSession) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = JSON.parse(userSession)
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const courseId = params.id
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

    const response = await fetch(`${apiBase}/courses/${courseId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok || response.status === 204) {
      return NextResponse.json({ message: 'Cours supprimé avec succès' })
    } else {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur Django suppression course', new Error('fetch error'), {
        context: 'teachers/courses/[id]',
        data: { status: response.status, errorData }
      })
      return NextResponse.json({ 
        error: errorData?.detail || 'Erreur lors de la suppression du cours' 
      }, { status: response.status })
    }
  } catch (error) {
    logger.error('Error deleting course', error as Error, { context: 'teachers/courses/[id]' })
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
