"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'teacher' | 'parent' | 'author' | 'admin' | 'super_admin'
  requiredRoles?: Array<'student' | 'teacher' | 'parent' | 'author' | 'admin' | 'super_admin'>
}

export function AuthGuard({ children, requiredRole, requiredRoles }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        router.push('/login')
        return
      }

      // Supporte un seul rôle requis ou un ensemble de rôles permis
      const allowedRoles = requiredRoles && requiredRoles.length > 0 ? requiredRoles : (requiredRole ? [requiredRole] : [])
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Rediriger vers le dashboard approprié si l'utilisateur n'a pas le bon rôle
        router.push(`/dashboard/${user.role}`)
        return
      }
    }
  }, [user, loading, requiredRole, requiredRoles, router])

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-laha-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas authentifié, ne rien afficher (redirection en cours)
  if (!user) {
    return null
  }

  // Si un rôle spécifique est requis et que l'utilisateur n'a pas le bon rôle, ne rien afficher
  const allowedRoles = requiredRoles && requiredRoles.length > 0 ? requiredRoles : (requiredRole ? [requiredRole] : [])
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  // Afficher le contenu si l'utilisateur est authentifié et a le bon rôle
  return <>{children}</>
}


