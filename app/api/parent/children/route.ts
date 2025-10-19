import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/parent/children/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`)
    }

    const children = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedChildren = children.map((child: any) => ({
      id: child.id,
      name: child.user?.first_name + " " + child.user?.last_name,
      age: child.age,
      class_level: child.class_level,
      subjects: child.subjects || [],
      avatar: child.avatar,
      email: child.user?.email,
      phone: child.phone,
      birth_date: child.birth_date,
      school: child.school,
      emergency_contact: child.emergency_contact || {
        name: "",
        phone: "",
        relationship: ""
      },
      medical_info: child.medical_info || {
        allergies: [],
        medications: [],
        conditions: []
      },
      learning_preferences: child.learning_preferences || {
        learning_style: "Mixte",
        preferred_schedule: [],
        difficulty_level: "Intermédiaire"
      },
      performance_summary: {
        overall_grade: child.overall_grade || 0,
        attendance_rate: child.attendance_rate || 0,
        courses_enrolled: child.courses_enrolled || 0,
        courses_completed: child.courses_completed || 0,
        last_activity: child.last_activity || new Date().toISOString()
      },
      created_at: child.created_at,
      updated_at: child.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: normalizedChildren,
      count: normalizedChildren.length
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des enfants:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des enfants",
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
    const { action, child_data, child_id } = body

    if (!action) {
      return NextResponse.json({ error: "Action requise" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "add":
        endpoint = `/api/parent/children/`
        break
      case "update":
        if (!child_id) {
          return NextResponse.json({ error: "child_id requis pour la mise à jour" }, { status: 400 })
        }
        endpoint = `/api/parent/children/${child_id}/`
        method = "PUT"
        break
      case "delete":
        if (!child_id) {
          return NextResponse.json({ error: "child_id requis pour la suppression" }, { status: 400 })
        }
        endpoint = `/api/parent/children/${child_id}/`
        method = "DELETE"
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const requestBody = action === "delete" ? undefined : child_data

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody ? JSON.stringify(requestBody) : undefined,
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
    console.error("Erreur lors de l'action sur l'enfant:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur l'enfant",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
