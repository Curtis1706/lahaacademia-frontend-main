// Configuration API pour le backend Django via Axios
import axios, { AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    const status = err.response?.status ?? 500
    const message = (err.response?.data as any)?.error || err.message || 'Erreur réseau'
    return Promise.reject(new ApiError(status, message))
  }
)

// API pour l'authentification
export const authApi = {
  // Inscription
  register: async (userData: any) => {
    const { data } = await http.post('/users/register/', userData)
    return data
  },

  // Connexion
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await http.post('/users/login/', credentials)
    return data
  },

  // Déconnexion
  logout: async () => {
    const { data } = await http.post('/users/logout/')
    return data
  },
};

// API pour les étudiants
export const studentApi = {
  // Inscription d'un étudiant
  register: async (studentData: any) => {
    const { data } = await http.post('/students/register/', studentData)
    return data
  },

  // Obtenir la progression
  getProgress: async (studentId: string) => {
    const { data } = await http.get(`/students/${studentId}/progress/`)
    return data
  },
};

// API pour les enseignants
export const teacherApi = {
  // Inscription d'un enseignant
  register: async (teacherData: any) => {
    const formData = new FormData();
    
    // Ajouter les données textuelles
    Object.keys(teacherData).forEach(key => {
      if (key !== 'criminalRecord' && key !== 'diploma' && key !== 'identityDocument' && 
          key !== 'proofOfAddress' && key !== 'profilePhoto' && key !== 'cv') {
        formData.append(key, teacherData[key]);
      }
    });

    // Ajouter les fichiers
    if (teacherData.criminalRecord) {
      formData.append('criminal_record_file', teacherData.criminalRecord);
    }
    if (teacherData.diploma) {
      formData.append('diploma_file', teacherData.diploma);
    }
    if (teacherData.identityDocument) {
      formData.append('identity_document_file', teacherData.identityDocument);
    }
    if (teacherData.proofOfAddress) {
      formData.append('proof_of_address_file', teacherData.proofOfAddress);
    }
    if (teacherData.profilePhoto) {
      formData.append('profile_photo', teacherData.profilePhoto);
    }
    if (teacherData.cv) {
      formData.append('cv_file', teacherData.cv);
    }

    const { data } = await http.post('/teachers/register/', formData, {
      headers: {},
    })
    return data
  },

  // Obtenir les sessions
  getSessions: async (teacherId: string) => {
    const { data } = await http.get(`/teachers/${teacherId}/sessions/`)
    return data
  },

  // Obtenir les revenus
  getEarnings: async (teacherId: string) => {
    const { data } = await http.get(`/teachers/${teacherId}/earnings/`)
    return data
  },
};

// API pour les auteurs
export const authorApi = {
  // Inscription d'un auteur
  register: async (authorData: any) => {
    const { data } = await http.post('/authors/register/', authorData)
    return data
  },

  // Obtenir le contenu
  getContent: async (authorId: string) => {
    const { data } = await http.get(`/authors/${authorId}/content/`)
    return data
  },
};

// API pour les parents
export const parentApi = {
  // Inscription d'un parent
  register: async (parentData: any) => {
    const { data } = await http.post('/parents/register/', parentData)
    return data
  },

  // Obtenir la progression des enfants
  getChildrenProgress: async (parentId: string) => {
    const { data } = await http.get(`/parents/${parentId}/children_progress/`)
    return data
  },

  // Ajouter un enfant
  addChild: async (parentId: string, childData: any) => {
    const { data } = await http.post(`/parents/${parentId}/add_child/`, childData)
    return data
  },
};

// API pour les cours
export const courseApi = {
  // Obtenir tous les cours
  getAll: async (filters?: any) => {
    const params = new URLSearchParams(filters)
    const { data } = await http.get(`/courses/?${params}`)
    return data
  },

  // Obtenir un cours
  getById: async (courseId: string) => {
    const { data } = await http.get(`/courses/${courseId}/`)
    return data
  },

  // Obtenir les inscriptions
  getEnrollments: async (courseId: string) => {
    const { data } = await http.get(`/courses/${courseId}/enrollments/`)
    return data
  },
};

// API pour les sessions
export const sessionApi = {
  // Obtenir toutes les sessions
  getAll: async () => {
    const { data } = await http.get('/sessions/')
    return data
  },

  // Rejoindre une session
  join: async (sessionId: string) => {
    const { data } = await http.post(`/sessions/${sessionId}/join/`)
    return data
  },

  // Obtenir les participants
  getParticipants: async (sessionId: string) => {
    const { data } = await http.get(`/sessions/${sessionId}/participants/`)
    return data
  },
};

// API pour les réservations
export const bookingApi = {
  // Créer une réservation
  create: async (bookingData: any) => {
    const { data } = await http.post('/bookings/', bookingData)
    return data
  },

  // Annuler une réservation
  cancel: async (bookingId: string) => {
    const { data } = await http.post(`/bookings/${bookingId}/cancel/`)
    return data
  },
};

// API pour les notifications
export const notificationApi = {
  // Obtenir les notifications
  getAll: async () => {
    const { data } = await http.get('/notifications/')
    return data
  },

  // Marquer comme lu
  markAsRead: async (notificationId: string) => {
    const { data } = await http.post(`/notifications/${notificationId}/mark_as_read/`)
    return data
  },

  // Obtenir le nombre de notifications non lues
  getUnreadCount: async () => {
    const { data } = await http.get('/notifications/unread_count/')
    return data
  },
};

export default {
  auth: authApi,
  student: studentApi,
  teacher: teacherApi,
  author: authorApi,
  parent: parentApi,
  course: courseApi,
  session: sessionApi,
  booking: bookingApi,
  notification: notificationApi,
};



