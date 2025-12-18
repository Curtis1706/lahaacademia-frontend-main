'use client'

import { useState, useEffect } from 'react'
import logger from '@/lib/logger'

interface Teacher {
  id: string
  name: string
  avatar?: string | null
  location: string
  country: string
  languages: string[]
  rating: number
  students_count: number
  hourly_rate: number
  subjects: string[]
  class_levels: string[]
  bio: string
  experience: number
  education: string
  certifications: string[]
}

interface Course {
  id: string
  title: string
  subject: string
  duration: number
  price: number
  available_slots: string[]
  teacher_id: string
  class_level: string
  country: string
  language: string
  description: string
  teacher: {
    id: string
    name: string
    country: string
    languages: string[]
    rating: number
  }
}

interface TeachersAndCoursesData {
  teachers: Teacher[]
  courses: Course[]
}

export function useTeachersAndCourses() {
  const [data, setData] = useState<TeachersAndCoursesData>({ teachers: [], courses: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier si le cookie existe
        const cookies = document.cookie.split(';')
        const userSessionCookie = cookies.find(cookie => 
          cookie.trim().startsWith('user_session_client=')
        )

        if (!userSessionCookie) {
          setError('Non authentifié')
          setIsLoading(false)
          return
        }

        // Parser les données du cookie
        const sessionValue = userSessionCookie.split('=')[1]
        const userData = JSON.parse(decodeURIComponent(sessionValue))
        const token = userData?.token
        if (!token) {
          setError('Token manquant')
          setIsLoading(false)
          return
        }

        // Récupérer les enseignants et cours en parallèle
        const [teachersResponse, coursesResponse] = await Promise.all([
          fetch('/api/teachers', {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`
            },
            cache: 'no-store',
          }),
          fetch('/api/courses', {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`
            },
            cache: 'no-store',
          })
        ])

        // Traiter les réponses
        let teachers: Teacher[] = []
        let courses: Course[] = []

        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json()
          teachers = teachersData.teachers || []
        } else {
          logger.warn('Erreur récupération enseignants', { context: 'useTeachersAndCourses', data: { status: teachersResponse.status } })
        }

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          courses = coursesData.courses || []
        } else {
          logger.warn('Erreur récupération cours', { context: 'useTeachersAndCourses', data: { status: coursesResponse.status } })
        }

        // Si aucune donnée récupérée, utiliser les données mockées en fallback
        if (teachers.length === 0 && courses.length === 0) {
          logger.warn('Aucune donnée récupérée (enseignants/cours)', { context: 'useTeachersAndCourses' })
        }

        setData({ teachers, courses })
        setError(null)
        
      } catch (err) {
        logger.error('Erreur lors du chargement des données enseignants/cours', err as Error, { context: 'useTeachersAndCourses' })
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    teachers: data.teachers,
    courses: data.courses,
    isLoading,
    error,
  }
}


