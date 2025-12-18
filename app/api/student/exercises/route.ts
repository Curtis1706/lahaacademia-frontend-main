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
    logger.error("Failed to parse user session", e, { context: "student/exercises" })
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/exercises/`, {
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
    logger.error("Erreur lors de la récupération des entraînements", error as Error, { context: "student/exercises" })
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
    const token = getToken(request)
    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
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
        Authorization: `Token ${token}`,
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
    logger.error("Erreur lors de l'action sur l'entraînement", error as Error, { context: "student/exercises", data: { action } })
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur l'entraînement",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
