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
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/progress' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const response = await fetch(`${API_BASE_URL}/api/parent/progress/`, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error('Erreur API Django progress', new Error('fetch error'), {
        context: 'parent/progress',
        data: { status: response.status, errorData }
      })
      throw new Error(`Erreur API: ${response.status}`)
    }

    const progressData = await response.json()
    
    // Normaliser les données pour le frontend
    const normalizedData = {
      children: progressData.children?.map((child: any) => ({
        id: child.id,
        name: child.name,
        age: child.age,
        class_level: child.class_level,
        avatar: child.avatar,
        overall_progress: child.overall_progress || 0,
        courses_enrolled: child.courses_enrolled || 0,
        courses_completed: child.courses_completed || 0,
        average_grade: child.average_grade || 0,
        attendance_rate: child.attendance_rate || 0,
        last_activity: child.last_activity
      })) || [],
      courseProgress: progressData.course_progress?.map((course: any) => ({
        id: course.id,
        title: course.title,
        subject: course.subject,
        teacher: {
          name: course.teacher?.name,
          avatar: course.teacher?.avatar
        },
        progress: course.progress || 0,
        grade: course.grade || 0,
        attendance: course.attendance || 0,
        last_session: course.last_session,
        next_session: course.next_session,
        status: course.status,
        lessons_completed: course.lessons_completed || 0,
        total_lessons: course.total_lessons || 0,
        assignments_pending: course.assignments_pending || 0,
        upcoming_exams: course.upcoming_exams || 0
      })) || [],
      performanceMetrics: progressData.performance_metrics?.map((metric: any) => ({
        subject: metric.subject,
        grade: metric.grade || 0,
        trend: metric.trend || "stable",
        improvement: metric.improvement || 0,
        last_exam_score: metric.last_exam_score || 0,
        average_score: metric.average_score || 0,
        rank_in_class: metric.rank_in_class
      })) || [],
      attendanceRecords: progressData.attendance_records?.map((record: any) => ({
        date: record.date,
        course: record.course,
        teacher: record.teacher,
        status: record.status,
        duration: record.duration || 0,
        notes: record.notes
      })) || []
    }

    return NextResponse.json({
      success: true,
      data: normalizedData
    })

  } catch (error) {
    logger.error("Erreur lors de la récupération des progrès", error as Error, { context: 'parent/progress' })
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des progrès",
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
        logger.error('Failed to parse session cookie', e as Error, { context: 'parent/progress/POST' })
      }
    }

    if (!token && authHeader?.startsWith('Bearer ') || authHeader?.startsWith('Token ')) {
      token = authHeader.replace('Bearer ', '').replace('Token ', '')
    }
    
    if (!token) {
      return NextResponse.json({ error: "Token d'authentification requis" }, { status: 401 })
    }

    const body = await request.json()
    const { action, child_id, course_id, data } = body

    if (!action) {
      return NextResponse.json({ error: "Action requise" }, { status: 400 })
    }

    let endpoint = ""
    let method = "POST"

    switch (action) {
      case "get_report":
        endpoint = `/api/parent/progress/report/`
        break
      case "export_data":
        endpoint = `/api/parent/progress/export/`
        break
      case "contact_teacher":
        endpoint = `/api/parent/progress/contact-teacher/`
        break
      default:
        return NextResponse.json({ error: "Action non supportée" }, { status: 400 })
    }

    const requestBody = {
      child_id,
      course_id,
      ...data
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
      logger.error('Erreur API Django action progress', new Error('fetch error'), {
        context: 'parent/progress/POST',
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
    logger.error("Erreur lors de l'action sur les progrès", error as Error, { context: 'parent/progress/POST' })
    return NextResponse.json(
      { 
        error: "Erreur lors de l'action sur les progrès",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      }, 
      { status: 500 }
    )
  }
}
