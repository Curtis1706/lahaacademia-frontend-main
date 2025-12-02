"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'

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
        // Solution temporaire : lire directement depuis le cookie
        console.log('🔍 Vérification de l\'authentification...')
        
        // Essayer de lire le cookie user_session_client directement
        const cookies = document.cookie.split(';')
        const userSessionCookie = cookies.find(cookie => cookie.trim().startsWith('user_session_client='))
        
        if (userSessionCookie) {
          try {
            const sessionValue = userSessionCookie.split('=')[1]
            const userData = JSON.parse(decodeURIComponent(sessionValue))
            console.log('✅ Session trouvée dans le cookie client:', userData)
            setUser(userData)
          } catch (parseError) {
            console.log('❌ Erreur parsing cookie client:', parseError)
            setUser(null)
          }
        } else {
          console.log('❌ Pas de cookie user_session_client trouvé')
          setUser(null)
        }
        
        // Code original commenté temporairement
        /*
        const response = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user || null)
        } else {
          setUser(null)
        }
        */
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
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
      console.error('Erreur lors de la connexion:', error)
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
      console.error('Erreur lors de l\'inscription:', error)
      return { success: false, error: 'Erreur interne du serveur' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
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
