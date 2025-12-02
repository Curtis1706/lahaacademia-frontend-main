'use client'

import { useState, useEffect } from 'react'

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
        console.log('🔄 Chargement des données enseignants et cours...')
        
        // Vérifier si le cookie existe
        const cookies = document.cookie.split(';')
        const userSessionCookie = cookies.find(cookie => 
          cookie.trim().startsWith('user_session_client=')
        )

        if (!userSessionCookie) {
          console.error('❌ Pas de cookie user_session_client trouvé')
          setError('Non authentifié')
          setIsLoading(false)
          return
        }

        // Parser les données du cookie
        const sessionValue = userSessionCookie.split('=')[1]
        const userData = JSON.parse(decodeURIComponent(sessionValue))
        console.log('✅ Données utilisateur du cookie:', userData)

        // Récupérer les enseignants et cours en parallèle
        const [teachersResponse, coursesResponse] = await Promise.all([
          fetch('/api/teachers', {
            method: 'GET',
            credentials: 'include',
          }),
          fetch('/api/courses', {
            method: 'GET',
            credentials: 'include',
          })
        ])

        console.log('📡 Réponses API:', {
          teachers: teachersResponse.status,
          courses: coursesResponse.status
        })

        // Traiter les réponses
        let teachers: Teacher[] = []
        let courses: Course[] = []

        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json()
          teachers = teachersData.teachers || []
          console.log('✅ Enseignants récupérés:', teachers.length)
        } else {
          console.warn('⚠️ Erreur récupération enseignants:', teachersResponse.status)
        }

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          courses = coursesData.courses || []
          console.log('✅ Cours récupérés:', courses.length)
        } else {
          console.warn('⚠️ Erreur récupération cours:', coursesResponse.status)
        }

        // Si aucune donnée récupérée, utiliser les données mockées en fallback
        if (teachers.length === 0 && courses.length === 0) {
          console.log('⚠️ Aucune donnée récupérée, utilisation des données mockées')
          
          // Données mockées de fallback
          teachers = [
            {
              id: "1",
              name: "Prof. Ndiaye",
              avatar: null,
              location: "Dakar",
              country: "Sénégal",
              languages: ["Français", "Wolof"],
              rating: 4.8,
              students_count: 45,
              hourly_rate: 5000,
              subjects: ["Mathématiques", "Physique"],
              class_levels: ["Seconde", "Première", "Terminale"],
              bio: "Enseignant expérimenté avec plus de 10 ans d'expérience dans l'enseignement des mathématiques et de la physique.",
              experience: 10,
              education: "Master en Mathématiques",
              certifications: ["Certification pédagogique", "Formation continue"]
            }
          ]

          courses = [
            {
              id: "1",
              title: "Mathématiques Seconde - Algèbre",
              subject: "Mathématiques",
              duration: 60,
              price: 5000,
              available_slots: ["09:00", "14:00", "16:00"],
              teacher_id: "1",
              class_level: "Seconde",
              country: "Sénégal",
              language: "Français",
              description: "Cours complet d'algèbre pour la seconde",
              teacher: {
                id: "1",
                name: "Prof. Ndiaye",
                country: "Sénégal",
                languages: ["Français", "Wolof"],
                rating: 4.8
              }
            }
          ]
        }

        setData({ teachers, courses })
        setError(null)
        
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        
        // Fallback avec données mockées en cas d'erreur
        setData({
          teachers: [
            {
              id: "1",
              name: "Prof. Ndiaye",
              avatar: null,
              location: "Dakar",
              country: "Sénégal",
              languages: ["Français", "Wolof"],
              rating: 4.8,
              students_count: 45,
              hourly_rate: 5000,
              subjects: ["Mathématiques", "Physique"],
              class_levels: ["Seconde", "Première", "Terminale"],
              bio: "Enseignant expérimenté avec plus de 10 ans d'expérience dans l'enseignement des mathématiques et de la physique.",
              experience: 10,
              education: "Master en Mathématiques",
              certifications: ["Certification pédagogique", "Formation continue"]
            }
          ],
          courses: [
            {
              id: "1",
              title: "Mathématiques Seconde - Algèbre",
              subject: "Mathématiques",
              duration: 60,
              price: 5000,
              available_slots: ["09:00", "14:00", "16:00"],
              teacher_id: "1",
              class_level: "Seconde",
              country: "Sénégal",
              language: "Français",
              description: "Cours complet d'algèbre pour la seconde",
              teacher: {
                id: "1",
                name: "Prof. Ndiaye",
                country: "Sénégal",
                languages: ["Français", "Wolof"],
                rating: 4.8
              }
            }
          ]
        })
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


