import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/courses/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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
    console.error("Erreur lors de la récupération des cours:", error)
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
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
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
        "Authorization": `Bearer ${token}`,
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
    console.error("Erreur lors de l'action sur le cours:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur le cours",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
