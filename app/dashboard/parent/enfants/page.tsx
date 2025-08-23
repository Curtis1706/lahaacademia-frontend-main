"use client"

import { useEffect, useState } from 'react'
import { Users, Plus, User, Settings, Clock, TrendingUp } from 'lucide-react'
import { AuthGuard } from '@/components/auth-guard'
import { ParentSidebar } from '@/components/parent-sidebar'

interface Child {
  id: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
  current_grade: string
  school_level: string
  study_time_total: number
  courses_completed: number
  average_score: number
  last_activity: string
  is_blocked: boolean
  blocked_until?: string
  blocked_reason?: string
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/parents/children', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setChildren(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Erreur lors du chargement des enfants:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChildren() }, [])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  const formatLastActivity = (dateString: string) => {
    if (!dateString) return 'Jamais'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR')
  }

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">Mes Enfants</h1>
            <p className="text-slate-600 dark:text-slate-400">Gérez les profils de vos enfants et suivez leur progression.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 dark:border-slate-400"></div>
            </div>
          ) : children.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Aucun enfant lié</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Vous n'avez pas encore d'enfants associés à votre compte.</p>
              <a href="/dashboard/parent/invitations" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 font-medium transition-colors">
                <Plus className="h-4 w-4" />
                Inviter un enfant
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {children.map((child) => (
                <div key={child.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {child.user.first_name} {child.user.last_name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{child.current_grade}</p>
                      </div>
                    </div>
                    {child.is_blocked && (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full font-medium">
                        Bloqué
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Temps d'étude total</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">
                        {formatTime(child.study_time_total || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Cours complétés</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">
                        {child.courses_completed || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Note moyenne</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">
                        {child.average_score ? `${child.average_score.toFixed(1)}/20` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Dernière activité</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">
                        {formatLastActivity(child.last_activity)}
                      </span>
                    </div>
                  </div>

                  {child.is_blocked && child.blocked_reason && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                      <p className="text-red-700 dark:text-red-300 text-sm">{child.blocked_reason}</p>
                      {child.blocked_until && (
                        <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                          Jusqu'à {new Date(child.blocked_until).toLocaleString('fr-FR')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <a 
                      href={`/dashboard/parent/enfants/${child.id}/settings`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 font-medium text-sm transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </a>
                    <a 
                      href={`/dashboard/parent/suivi/${child.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-500 font-medium text-sm transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Suivi
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}