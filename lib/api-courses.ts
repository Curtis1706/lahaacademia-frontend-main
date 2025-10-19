import { http } from './api'

export interface Teacher {
  id: string
  name: string
  avatar: string | null
  subjects: string[]
  rating: number
  experience: string
  hourly_rate: number
  country: string
  total_students: number
  total_sessions: number
  bio: string
  specializations?: string[]
  certifications?: string[]
}

// Fonction utilitaire pour normaliser les données des professeurs
const normalizeTeacherData = (teacher: any): Teacher => {
  return {
    ...teacher,
    subjects: Array.isArray(teacher.subjects) 
      ? teacher.subjects 
      : typeof teacher.subjects === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.subjects)
            } catch {
              return [teacher.subjects]
            }
          })()
        : [],
    name: teacher.name || `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() || 'Professeur inconnu',
    avatar: teacher.avatar || teacher.profile_photo || '/placeholder-user.jpg',
    rating: teacher.rating || teacher.average_rating || 0,
    experience: teacher.experience || `${teacher.experience_years || 0} ans d'expérience`,
    hourly_rate: teacher.hourly_rate || 0,
    country: teacher.country || 'Non spécifié',
    total_students: teacher.total_students || 0,
    total_sessions: teacher.total_sessions || 0,
    bio: teacher.bio || '',
    specializations: Array.isArray(teacher.specializations) 
      ? teacher.specializations 
      : typeof teacher.specializations === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.specializations)
            } catch {
              return [teacher.specializations]
            }
          })()
        : [],
    certifications: Array.isArray(teacher.certifications) 
      ? teacher.certifications 
      : typeof teacher.certifications === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.certifications)
            } catch {
              return [teacher.certifications]
            }
          })()
        : []
  }
}

export interface Course {
  id: string
  title: string
  description: string
  subject: string
  level: string
  country: string
  duration: number
  price: number
  difficulty_level: string
  teachers: Teacher[]
  available_spots: number
  max_capacity: number
  next_session: string | null
}

export interface CourseFilters {
  subject?: string
  level?: string
  country?: string
  search?: string
}

export interface TeacherFilters {
  subject?: string
  country?: string
  search?: string
  min_rating?: number
  max_price?: number
}

export interface ApiResponse<T> {
  data: T
  total: number
  filters_applied: Record<string, any>
}

// Récupérer les cours avec les détails des professeurs
export const getCoursesWithTeachers = async (filters: CourseFilters = {}): Promise<ApiResponse<Course[]>> => {
  try {
    const params = new URLSearchParams()
    
    if (filters.subject && filters.subject !== 'all') params.append('subject', filters.subject)
    if (filters.level && filters.level !== 'all') params.append('level', filters.level)
    if (filters.country && filters.country !== 'all') params.append('country', filters.country)
    if (filters.search) params.append('search', filters.search)
    
    const response = await http.get(`courses/courses-with-teachers/?${params.toString()}`)
    // Django backend returns { courses: [], total: number, filters_applied: {} }
    // but we need { data: [], total: number, filters_applied: {} }
    return {
      data: response.data.courses || response.data,
      total: response.data.total || 0,
      filters_applied: response.data.filters_applied || {}
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error)
    throw error
  }
}

// Récupérer les professeurs disponibles
export const getAvailableTeachers = async (filters: TeacherFilters = {}): Promise<ApiResponse<Teacher[]>> => {
  try {
    const params = new URLSearchParams()
    
    if (filters.subject && filters.subject !== 'all') params.append('subject', filters.subject)
    if (filters.country && filters.country !== 'all') params.append('country', filters.country)
    if (filters.search) params.append('search', filters.search)
    if (filters.min_rating) params.append('min_rating', filters.min_rating.toString())
    if (filters.max_price) params.append('max_price', filters.max_price.toString())
    
    const response = await http.get(`teachers/available-for-booking/?${params.toString()}`)
    // Django backend returns { teachers: [], total: number, filters_applied: {} }
    // but we need { data: [], total: number, filters_applied: {} }
    const teachers = response.data.teachers || response.data || []
    const normalizedTeachers = teachers.map((teacher: any) => normalizeTeacherData(teacher))
    
    return {
      data: normalizedTeachers,
      total: response.data.total || 0,
      filters_applied: response.data.filters_applied || {}
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs:', error)
    throw error
  }
}

// Récupérer les détails d'un cours spécifique
export const getCourseDetails = async (courseId: string): Promise<Course> => {
  try {
    const response = await http.get(`courses/${courseId}/`)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du cours:', error)
    throw error
  }
}

// Récupérer les détails d'un professeur spécifique
export const getTeacherDetails = async (teacherId: string): Promise<Teacher> => {
  try {
    const response = await http.get(`teachers/${teacherId}/`)
    return normalizeTeacherData(response.data)
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du professeur:', error)
    throw error
  }
}

// Interface pour les données de réservation
export interface BookingData {
  teacher_id: string
  course_id?: string
  start_time: string
  end_time: string
  student_id?: string
  special_requirements?: string
}

// Interface pour la réponse de réservation
export interface BookingResponse {
  booking_id: string
  session_id: string
  booking_reference: string
  status: string
  message: string
  student: {
    id: string
    name: string
    email: string
  }
  teacher: {
    id: string
    name: string
    email: string
  }
  course?: {
    id: string
    name: string
    description: string
  }
  session: {
    start_time: string
    end_time: string
    type: string
    max_capacity: number
    current_enrollment: number
  }
}

// Réserver une session
export const reserveSession = async (bookingData: BookingData): Promise<BookingResponse> => {
  try {
    const response = await http.post(`/bookings/reserve/`, bookingData)
    return response.data
  } catch (error) {
    console.error('Erreur lors de la réservation:', error)
    throw error
  }
}
