import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (prioritaire) ou headers
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value
    const authHeader = request.headers.get('Authorization')

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/courses' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/courses/`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django courses', new Error('fetch error'), {
        context: 'parent/courses',
        data: { status: response.status, errorData }
      })
      throw new Error(`Erreur API: ${response.status}`)
    }

    const courses = await response.json()
    
    // Normaliser les données pour le frontend avec informations enseignants
    const normalizedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      class_level: course.class_level,
      duration: course.duration,
      price: course.price,
      max_students: course.max_students,
      current_students: course.current_students || 0,
      rating: course.rating || 0,
      reviews_count: course.reviews_count || 0,
      teacher: {
        id: course.teacher?.id,
        name: course.teacher?.user?.first_name + " " + course.teacher?.user?.last_name,
        avatar: course.teacher?.profile_photo,
        location: course.teacher?.location || "Non spécifié",
        country: course.teacher?.country || "Non spécifié",
        languages: course.teacher?.languages_spoken || [],
        rating: course.teacher?.rating || 0,
        students_count: course.teacher?.students_count || 0,
        hourly_rate: course.teacher?.hourly_rate || 0,
        subjects: course.teacher?.subjects || [],
        class_levels: course.teacher?.class_levels || [],
        availability: course.teacher?.availability || [],
        profile: {
          bio: course.teacher?.bio || "",
          experience: course.teacher?.experience || 0,
          education: course.teacher?.education || "",
          certifications: course.teacher?.certifications || []
        }
      },
      schedule: course.schedule || [],
      created_at: course.created_at
    }))

    return NextResponse.json({
      success: true,
      data: normalizedCourses,
      count: normalizedCourses.length
    })

  } catch (error) {
    logger.error("Erreur lors de la récupération des cours", error as Error, { context: 'parent/courses' })
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des cours",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis les cookies (prioritaire) ou headers
    const cookieTokenRaw =
      request.cookies.get('user_session_client')?.value ||
      request.cookies.get('user_session')?.value
    const authHeader = request.headers.get('Authorization')

    let token: string | null = null

    if (cookieTokenRaw) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(cookieTokenRaw))
        token = sessionData?.token || null
      } catch (e) {
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/courses/POST' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const body = await request.json()
    const { course_id, child_id, action, schedule_slot } = body

    if (!course_id || !child_id || !action) {
      return NextResponse.json({ error: "course_id, child_id et action requis" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "book":
        endpoint = `/api/courses/${course_id}/book/`
        break
      case "cancel":
        endpoint = `/api/courses/${course_id}/cancel/`
        method = "DELETE"
        break
      case "reschedule":
        endpoint = `/api/courses/${course_id}/reschedule/`
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const requestBody = {
      child_id,
      ...(schedule_slot && { schedule_slot })
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django action cours', new Error('fetch error'), {
        context: 'parent/courses/POST',
        data: { status: response.status, errorData }
      })
      throw new Error(`Erreur API: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    logger.error("Erreur lors de l'action sur le cours", error as Error, { context: 'parent/courses/POST' })
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur le cours",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
