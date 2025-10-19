import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/exercises/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const exercises = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedExercises = exercises.map((exercise: any) => ({
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      subject: exercise.subject,
      class_level: exercise.class_level,
      type: exercise.type,
      difficulty: exercise.difficulty,
      duration: exercise.duration,
      questions_count: exercise.questions_count,
      max_score: exercise.max_score,
      price: exercise.price,
      rating: exercise.rating || 0,
      attempts: exercise.attempts || 0,
      teacher: {
        name: exercise.teacher?.user?.first_name + " " + exercise.teacher?.user?.last_name,
        avatar: exercise.teacher?.profile_photo
      },
      cover_image: exercise.cover_image,
      progress: exercise.progress || 0,
      best_score: exercise.best_score || 0,
      is_completed: exercise.is_completed || false,
      is_favorite: exercise.is_favorite || false,
      created_at: exercise.created_at,
      last_attempt: exercise.last_attempt,
      average_score: exercise.average_score || 0
    }))

    return NextResponse.json({
      success: true,
      data: normalizedExercises,
      count: normalizedExercises.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des entraînements:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des entraînements",
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
    const { exercise_id, action, answers } = body

    if (!exercise_id || !action) {
      return NextResponse.json({ error: "exercise_id et action requis" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "start":
        endpoint = `/api/exercises/${exercise_id}/start/`
        break
      case "submit":
        endpoint = `/api/exercises/${exercise_id}/submit/`
        break
      case "favorite":
        endpoint = `/api/exercises/${exercise_id}/favorite/`
        method = "POST"
        break
      case "unfavorite":
        endpoint = `/api/exercises/${exercise_id}/favorite/`
        method = "DELETE"
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const requestBody = action === "submit" ? { answers } : {}

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: Object.keys(requestBody).length > 0 ? JSON.stringify(requestBody) : undefined,
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
    console.error("Erreur lors de l'action sur l'entraînement:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur l'entraînement",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
