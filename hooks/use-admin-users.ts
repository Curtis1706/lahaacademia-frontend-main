'use client'

import { useState, useEffect } from 'react'
import logger from '@/lib/logger'

interface UserProfile {
  avatar: string | null
  bio: string
  location: string
  country: string
  date_of_birth: string
  school_level: string
  subjects: string[]
  languages: string[]
  experience_years: number
  education: string
  certifications: string[]
  hourly_rate: number
  average_rating: number
  students_count: number
  is_verified: boolean
  is_approved: boolean
}

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  is_active: boolean
  date_joined: string
  last_login: string | null
  phone: string
  profile: UserProfile
}

interface UsersData {
  users: User[]
  total: number
}

export function useAdminUsers() {
  const [data, setData] = useState<UsersData>({ users: [], total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      logger.debug('Chargement des données utilisateurs', { context: 'useAdminUsers' })
      
      // Vérifier si le cookie existe
      const cookies = document.cookie.split(';')
      const userSessionCookie = cookies.find(cookie => 
        cookie.trim().startsWith('user_session_client=')
      )

      if (!userSessionCookie) {
        logger.warn('Pas de cookie user_session_client trouvé', { context: 'useAdminUsers' })
        setError('Non authentifié')
        setIsLoading(false)
        return
      }

      // Parser les données du cookie
      const sessionValue = userSessionCookie.split('=')[1]
      const userData = JSON.parse(decodeURIComponent(sessionValue))

      // Vérifier que l'utilisateur est admin
      if (userData.role !== 'admin') {
        logger.warn('Accès refusé - rôle non admin', { context: 'useAdminUsers', data: { role: userData.role } })
        setError('Accès refusé - rôle admin requis')
        setIsLoading(false)
        return
      }

      // Récupérer les utilisateurs depuis l'API
      const response = await fetch('/api/admin/users', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.status === 401) {
        logger.warn('Session expirée', { context: 'useAdminUsers' })
        setError('Session expirée - veuillez vous reconnecter')
        setIsLoading(false)
        return
      }

      if (response.status === 403) {
        logger.warn('Accès refusé', { context: 'useAdminUsers' })
        setError('Accès refusé - rôle admin requis')
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const apiData = await response.json()

      setData({
        users: apiData.users || [],
        total: apiData.total || 0
      })
      setError(null)
      
    } catch (err) {
      logger.error('Erreur lors de la récupération des utilisateurs', err, { context: 'useAdminUsers' })
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      
      // Pas de fallback avec données mockées - afficher l'erreur
      setData({
        users: [],
        total: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users: data.users,
    total: data.total,
    isLoading,
    error,
    retry: fetchUsers,
  }
}
