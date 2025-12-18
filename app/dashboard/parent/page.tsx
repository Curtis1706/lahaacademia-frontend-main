"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AlertTriangle, MessageSquare, Calendar, TrendingUp, Users, BookOpen, RefreshCw } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { useParentData } from "@/hooks/use-parent-data"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import logger from "@/lib/logger"

export default function ParentDashboard() {
  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <ParentDashboardContent />
      </ParentSidebar>
    </AuthGuard>
  )
}

const ParentDashboardContent = () => {
  const { user } = useAuth()
  const { children, courseProgress, performanceMetrics, attendanceRecords, paymentSummary, notifications, events, loading, error, refreshData } = useParentData()

  if (loading) {
    return (
      <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400 text-lg">Chargement de votre tableau de bord...</p>
      </div>
    )
  }

  if (error) {
    logger.error("Erreur lors du chargement du dashboard parent", new Error(error), { context: "ParentDashboardContent" })
    return (
      <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Erreur: {error}</p>
          <Button onClick={refreshData} className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black">
            <RefreshCw className="h-4 w-4 mr-2" /> Réessayer
          </Button>
        </div>
      </div>
    )
  }

  // Calculer les statistiques
  const totalChildren = children.length
  const totalCourses = courseProgress.length
  const avgAttendance = children.length > 0
    ? (children.reduce((sum, child) => sum + (child.performance_summary?.attendance_rate || 0), 0) / children.length)
    : 0
  const avgGrade = children.length > 0
    ? (children.reduce((sum, child) => sum + (child.performance_summary?.overall_grade || 0), 0) / children.length)
    : 0

  // Formater les événements à venir
  const upcomingEvents = events.filter(event => event.status === 'upcoming').map(event => ({
    date: new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    time: event.time,
    title: event.title,
    childName: event.child_name
  }))

  // Les notifications non lues comme alertes
  const alerts = notifications.filter(notif => !notif.is_read).map(notif => ({
    type: notif.type,
    message: notif.message,
    time: new Date(notif.timestamp).toLocaleDateString('fr-FR', { 
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    })
  }))

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">Tableau de bord Parent</h1>
          <p className="text-slate-600 dark:text-slate-400">Bienvenue {user?.first_name || ''} ! Suivez les progrès de vos enfants.</p>
        </div>

        {/* Résumé des enfants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {children.length > 0 ? (
            children.map((child, index) => {
              const grade = child.performance_summary?.overall_grade || 0
              const attendance = child.performance_summary?.attendance_rate || 0
              const status = grade >= 16 ? "Excellent" : grade >= 14 ? "Bien" : grade >= 12 ? "Assez bien" : "En progression"
              const statusColor = grade >= 16 ? "emerald" : grade >= 14 ? "blue" : grade >= 12 ? "yellow" : "orange"
              
              return (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{child.name}</h3>
                    <span className={`px-3 py-1 bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-700 dark:text-${statusColor}-300 text-xs rounded-full font-medium`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{child.class_level}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Moyenne générale</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">{grade.toFixed(1)}/20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Assiduité</span>
                      <span className="text-slate-800 dark:text-slate-100 font-medium">{attendance.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className={`bg-${statusColor}-500 h-2 rounded-full`} style={{ width: `${attendance}%` }}></div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-2 text-center text-slate-600 dark:text-slate-400">
              Aucun enfant enregistré. Ajoutez un enfant pour commencer.
            </div>
          )}
        </div>

        {/* Section principale - Layout équilibré */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Alertes & Notifications - Prend plus d'espace */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="xl:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Alertes & Notifications</h3>
            </div>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => {
                  const bgColor = alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                                 alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                                 alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                                 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  const dotColor = alert.type === 'success' ? 'bg-green-500' :
                                  alert.type === 'warning' ? 'bg-amber-500' :
                                  alert.type === 'error' ? 'bg-red-500' :
                                  'bg-blue-500'
                  return (
                    <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border ${bgColor}`}>
                      <div className={`w-2 h-2 ${dotColor} rounded-full mt-2 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">{alert.message}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">{alert.time}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          Voir détails
                        </button>
                        <button className="px-3 py-1 bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs rounded-md border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors">
                          Marquer comme lu
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-sm">Aucune alerte pour le moment.</p>
              )}
            </div>
          </motion.div>

          {/* Section de droite - Colonnes équilibrées */}
          <div className="xl:col-span-5 space-y-6">
            {/* Événements à venir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Événements à venir</h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="text-center min-w-0">
                        <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">{event.date}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">{event.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">{event.title}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs">{event.childName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Aucun événement à venir.</p>
                )}
              </div>
            </motion.div>

            {/* Messages enseignants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Messages enseignants</h3>
              </div>
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Consultez vos messages dans la{' '}
                  <a href="/dashboard/messages" className="text-laha-gold hover:underline">
                    messagerie
                  </a>
                </p>
              </div>
            </motion.div>

            {/* Statistiques rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Statistiques rapides</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalChildren}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enfants</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalCourses}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cours actifs</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{avgAttendance.toFixed(0)}%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assiduité moy.</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{avgGrade.toFixed(1)}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Moyenne</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}