import { useState, useEffect } from 'react'
import logger from '@/lib/logger'

interface Course {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  difficulty: string
  price: number
  rating: number
  students_count: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  progress?: number
  is_enrolled: boolean
  is_favorite: boolean
  created_at: string
  lessons_count: number
}

interface Video {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  quality: string
  language: string
  price: number
  rating: number
  views: number
  teacher: {
    name: string
    avatar?: string
  }
  thumbnail?: string
  video_url?: string
  progress?: number
  is_watched: boolean
  is_favorite: boolean
  created_at: string
  subtitles: boolean
  allow_download: boolean
}

interface Book {
  id: string
  title: string
  author: string
  description: string
  subject: string
  class_level: string
  pages: number
  year: number
  language: string
  price: number
  rating: number
  downloads: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  file_url?: string
  file_format: string
  file_size: number
  progress?: number
  is_read: boolean
  is_favorite: boolean
  created_at: string
  isbn?: string
  allow_download: boolean
  allow_preview: boolean
}

interface Exercise {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  type: string
  difficulty: string
  duration: number
  questions_count: number
  max_score: number
  price: number
  rating: number
  attempts: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  progress?: number
  best_score?: number
  is_completed: boolean
  is_favorite: boolean
  created_at: string
  last_attempt?: string
  average_score: number
}

interface StudentData {
  courses: Course[]
  videos: Video[]
  books: Book[]
  exercises: Exercise[]
  loading: boolean
  error: string | null
}

export function useStudentData() {
  const [data, setData] = useState<StudentData>({
    courses: [],
    videos: [],
    books: [],
    exercises: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Récupérer le token depuis le cookie user_session_client
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('user_session_client='))
        if (!cookie) {
          throw new Error('Session utilisateur manquante')
        }
        const sessionValue = decodeURIComponent(cookie.split('=')[1] || '')
        const session = JSON.parse(sessionValue)
        const token = session?.token
        if (!token) {
          throw new Error('Token d\'authentification manquant')
        }

        // Récupérer toutes les données en parallèle
        const [coursesResponse, videosResponse, booksResponse, exercisesResponse] = await Promise.allSettled([
          fetch('/api/student/courses'),
          fetch('/api/student/videos'),
          fetch('/api/student/books'),
          fetch('/api/student/exercises')
        ])

        const courses = coursesResponse.status === 'fulfilled' 
          ? await coursesResponse.value.json()
          : { data: [] }
        
        const videos = videosResponse.status === 'fulfilled' 
          ? await videosResponse.value.json()
          : { data: [] }
        
        const books = booksResponse.status === 'fulfilled' 
          ? await booksResponse.value.json()
          : { data: [] }
        
        const exercises = exercisesResponse.status === 'fulfilled' 
          ? await exercisesResponse.value.json()
          : { data: [] }

        setData({
          courses: courses.data || [],
          videos: videos.data || [],
          books: books.data || [],
          exercises: exercises.data || [],
          loading: false,
          error: null
        })

      } catch (error) {
        logger.error('Erreur lors de la récupération des données étudiantes', error as Error, { context: 'useStudentData' })
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }))
      }
    }

    fetchData()
  }, [])

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setData(prev => ({
      ...prev,
      courses: prev.courses.map(course => 
        course.id === courseId ? { ...course, ...updates } : course
      )
    }))
  }

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(video => 
        video.id === videoId ? { ...video, ...updates } : video
      )
    }))
  }

  const updateBook = (bookId: string, updates: Partial<Book>) => {
    setData(prev => ({
      ...prev,
      books: prev.books.map(book => 
        book.id === bookId ? { ...book, ...updates } : book
      )
    }))
  }

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setData(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise => 
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      )
    }))
  }

  const refreshData = () => {
    setData(prev => ({ ...prev, loading: true, error: null }))
    // Relancer la récupération sans recharger la page
    // en recréant la promesse de fetch
    ;(async () => {
      try {
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('user_session_client='))
        if (!cookie) {
          throw new Error('Session utilisateur manquante')
        }
        const sessionValue = decodeURIComponent(cookie.split('=')[1] || '')
        const session = JSON.parse(sessionValue)
        const token = session?.token
        if (!token) {
          throw new Error('Token d\'authentification manquant')
        }

        const [coursesResponse, videosResponse, booksResponse, exercisesResponse] = await Promise.allSettled([
          fetch('/api/student/courses'),
          fetch('/api/student/videos'),
          fetch('/api/student/books'),
          fetch('/api/student/exercises')
        ])

        const courses = coursesResponse.status === 'fulfilled' 
          ? await coursesResponse.value.json()
          : { data: [] }
        const videos = videosResponse.status === 'fulfilled' 
          ? await videosResponse.value.json()
          : { data: [] }
        const books = booksResponse.status === 'fulfilled' 
          ? await booksResponse.value.json()
          : { data: [] }
        const exercises = exercisesResponse.status === 'fulfilled' 
          ? await exercisesResponse.value.json()
          : { data: [] }

        setData({
          courses: courses.data || [],
          videos: videos.data || [],
          books: books.data || [],
          exercises: exercises.data || [],
          loading: false,
          error: null
        })
      } catch (error) {
        logger.error('Erreur lors du rafraîchissement des données étudiantes', error as Error, { context: 'useStudentData' })
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }))
      }
    })()
  }

  return {
    ...data,
    updateCourse,
    updateVideo,
    updateBook,
    updateExercise,
    refreshData
  }
}
