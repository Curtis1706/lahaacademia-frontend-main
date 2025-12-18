"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import logger from '@/lib/logger'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'teacher' | 'parent' | 'author' | 'admin' | 'super_admin'
  phone?: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  reputation_score: number
  badges: string[]
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  register: (userData: any) => Promise<LoginResponse>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        logger.debug('Checking authentication', {}, { context: 'useAuth' })
        
        // Essayer de lire le cookie user_session_client directement
        const cookies = document.cookie.split(';')
        const userSessionCookie = cookies.find(cookie => cookie.trim().startsWith('user_session_client='))
        
        if (userSessionCookie) {
          try {
            const sessionValue = userSessionCookie.split('=')[1]
            const userData = JSON.parse(decodeURIComponent(sessionValue))
            logger.debug('Session found in client cookie', { userId: userData.id, role: userData.role }, { context: 'useAuth' })
            setUser(userData)
          } catch (parseError) {
            logger.error('Error parsing client cookie', parseError as Error, { context: 'useAuth' })
            setUser(null)
          }
        } else {
          logger.debug('No user_session_client cookie found', {}, { context: 'useAuth' })
          setUser(null)
        }
      } catch (error) {
        logger.error('Error checking authentication', error as Error, { context: 'useAuth' })
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Rafraîchir la session quand l'onglet reprend le focus
    const onFocus = () => { checkAuth() }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur de connexion' }
      }

      // Mettre à jour immédiatement le contexte avec le bon utilisateur
      setUser(data.user)
      return { success: true, user: data.user as User }
    } catch (error) {
      logger.error('Error during login', error as Error, { context: 'useAuth/login' })
      return { success: false, error: 'Erreur interne du serveur' }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Erreur lors de l\'inscription' }
      }

      setUser(data.user)
      return { success: true, user: data.user as User }
    } catch (error) {
      logger.error('Error during registration', error as Error, { context: 'useAuth/register' })
      return { success: false, error: 'Erreur interne du serveur' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      logger.error('Error during logout', error as Error, { context: 'useAuth/logout' })
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
