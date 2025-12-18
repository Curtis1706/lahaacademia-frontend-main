import { NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getToken(request: NextRequest) {
  const raw =
    request.cookies.get("user_session_client")?.value ||
    request.cookies.get("user_session")?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.token || null
  } catch (e) {
    logger.error("Failed to parse user session", e, { context: "student/courses" })
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/courses/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const courses = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      subject: course.subject,
      class_level: course.class_level,
      duration: course.duration,
      difficulty: course.difficulty,
      price: course.price,
      rating: course.rating || 0,
      students_count: course.students_count || 0,
      teacher: {
        name: course.teacher?.user?.first_name + " " + course.teacher?.user?.last_name,
        avatar: course.teacher?.profile_photo
      },
      cover_image: course.cover_image,
      progress: course.progress || 0,
      is_enrolled: course.is_enrolled || false,
      is_favorite: course.is_favorite || false,
      created_at: course.created_at,
      lessons_count: course.lessons?.length || 0
    }))

    return NextResponse.json({
      success: true,
      data: normalizedCourses,
      count: normalizedCourses.length
    })

  } catch (error) {
    logger.error("Erreur lors de la récupération des cours", error as Error, { context: "student/courses" })
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
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const body = await request.json()
    const { course_id, action } = body

    if (!course_id || !action) {
      return NextResponse.json({ error: "course_id et action requis" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "enroll":
        endpoint = `/api/courses/${course_id}/enroll/`
        break
      case "favorite":
        endpoint = `/api/courses/${course_id}/favorite/`
        method = "POST"
        break
      case "unfavorite":
        endpoint = `/api/courses/${course_id}/favorite/`
        method = "DELETE"
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    logger.error("Erreur lors de l'action sur le cours", error as Error, { context: "student/courses", data: { action } })
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur le cours",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
