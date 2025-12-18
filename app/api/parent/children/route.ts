import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Récupérer la session utilisateur depuis les cookies
    const userSession = request.cookies.get('user_session_client')?.value || request.cookies.get('user_session')?.value
    
    if (!userSession) {
      logger.debug('Pas de session utilisateur', { context: 'parent/children' })
      return NextResponse.json(
        { error: 'Session utilisateur requise' },
        { status: 401 }
      )
    }

    let userData
    try {
      userData = JSON.parse(userSession)
    } catch (parseError) {
      logger.error('Erreur parsing session', parseError, { context: 'parent/children' })
      return NextResponse.json(
        { error: 'Session utilisateur invalide' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur est un parent
    if (userData.role !== 'parent') {
      logger.warn('Accès refusé - rôle incorrect', { context: 'parent/children', data: { role: userData.role } })
      return NextResponse.json(
        { error: 'Accès refusé - rôle parent requis' },
        { status: 403 }
      )
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    
    // Transmettre tous les cookies de session à Django
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Récupérer les informations du parent et ses enfants
    const response = await fetch(`${apiBase}/parents/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      logger.error('Erreur API Django', new Error(errorText), { 
        context: 'parent/children',
        data: { status: response.status, statusText: response.statusText }
      })
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des données parent' },
        { status: response.status }
      )
    }

    const parentData = await response.json()
    
    // Transformer les données pour le frontend
    const children = parentData.children?.map((child: any) => ({
      id: child.id,
      name: `${child.user?.first_name || ''} ${child.user?.last_name || ''}`.trim(),
      age: child.user?.date_of_birth ? calculateAge(child.user.date_of_birth) : null,
      class_level: child.current_grade || 'Non spécifié',
      subjects: child.preferred_subjects || [],
      avatar: child.user?.profile_photo || null,
      email: child.user?.email || '',
      phone: child.user?.phone || '',
      birth_date: child.user?.date_of_birth || '',
      school_name: child.school_name || '',
      country: child.country || '',
      city: child.city || '',
      school_level: child.school_level || '',
      average_score: child.average_score || 0,
      courses_completed: child.courses_completed || 0,
      study_time_total: child.study_time_total || 0,
      last_activity: child.last_activity || null,
      is_blocked: child.is_blocked || false,
      learning_style: child.learning_style || '',
      goals: child.goals || '',
      streak_days: child.streak_days || 0,
      total_exams_taken: child.total_exams_taken || 0,
      average_exam_score: child.average_exam_score || 0,
    })) || []

    return NextResponse.json({
      children,
      parent: {
        id: parentData.id,
        name: `${parentData.user?.first_name || ''} ${parentData.user?.last_name || ''}`.trim(),
        email: parentData.user?.email || '',
        phone: parentData.user?.phone || '',
        occupation: parentData.occupation || '',
        education_level: parentData.education_level || '',
        total_children: parentData.total_children || 0,
        total_payments: parentData.total_payments || 0,
        monitoring_enabled: parentData.monitoring_enabled || true,
        weekly_reports: parentData.weekly_reports || true,
        exam_notifications: parentData.exam_notifications || true,
      }
    })

  } catch (error) {
    logger.error('Erreur lors de la récupération des enfants', error, { context: 'parent/children' })
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour calculer l'âge
function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}