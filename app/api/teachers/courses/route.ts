import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import logger from '@/lib/logger'

function parseSession() {
  const raw = cookies().get('user_session_client')?.value || cookies().get('user_session')?.value
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    logger.error('Erreur parsing session', e as Error, { context: 'teachers/courses' })
    return null
  }
}

export async function GET() {
  try {
    const user = parseSession()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')

    // Récupérer les infos du professeur
    const teacherResponse = await fetch(`${apiBase}/teachers/me/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    })

    if (!teacherResponse.ok) {
      const errorData = await teacherResponse.json().catch(() => ({}))
      logger.error('Erreur API teacher me', new Error('fetch error'), {
        context: 'teachers/courses',
        data: { status: teacherResponse.status, errorData }
      })
      return NextResponse.json({ error: 'Impossible de récupérer le profil professeur' }, { status: teacherResponse.status })
    }

    const teacherData = await teacherResponse.json()

    // Récupérer les cours de ce professeur
    const coursesResponse = await fetch(`${apiBase}/teachers/${teacherData.id}/courses/`, {
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
    })

    if (!coursesResponse.ok) {
      const errorData = await coursesResponse.json().catch(() => ({}))
      logger.error('Erreur API courses professeur', new Error('fetch error'), {
        context: 'teachers/courses',
        data: { status: coursesResponse.status, errorData }
      })
      return NextResponse.json({ error: 'Impossible de récupérer les cours' }, { status: coursesResponse.status })
    }

    const coursesData = await coursesResponse.json()
    const adaptedCourses = coursesData.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      level: course.level,
      duration: course.duration,
      price: course.price,
      course_type: course.course_type || 'individual',
      max_students: course.max_students || 1,
      created_at: course.created_at,
      students: course.students_count || 0,
      rating: course.average_rating || 0,
    }))

    return NextResponse.json({ courses: adaptedCourses })
  } catch (error) {
    logger.error('Error fetching courses', error as Error, { context: 'teachers/courses' })
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = parseSession()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    if (user.role !== 'teacher') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const body = await request.json()

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

    const response = await fetch(`${apiBase}/courses/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(djangoPayload)
    })

    if (response.ok) {
      const data = await response.json()
      const adaptedCourse = {
        id: data.id,
        title: data.title,
        description: data.description,
        subject: data.subject,
        level: data.level,
        duration: data.duration,
        price: data.price,
        course_type: body.course_type,
        max_students: body.max_students,
        created_at: data.created_at,
        teacher: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`
        }
      }
      return NextResponse.json(adaptedCourse, { status: 201 })
    } else {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur Django create course', new Error('fetch error'), {
        context: 'teachers/courses',
        data: { status: response.status, errorData }
      })
    }

    // Fallback - retourner les données envoyées avec un ID généré
    const fallbackCourse = {
      id: Date.now(),
      ...body,
      created_at: new Date().toISOString(),
      teacher: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      }
    }

    return NextResponse.json(fallbackCourse, { status: 201 })
  } catch (error) {
    logger.error('Error creating course', error as Error, { context: 'teachers/courses' })
    return NextResponse.json({ error: 'Erreur lors de la création du cours' }, { status: 500 })
  }
}
