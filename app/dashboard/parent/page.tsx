"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AlertTriangle, MessageSquare, Calendar, TrendingUp, Users, BookOpen } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"

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
  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">Tableau de bord Parent</h1>
          <p className="text-slate-600 dark:text-slate-400">Bienvenue ! Suivez les progrès de vos enfants.</p>
        </div>

        {/* Résumé des enfants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Koffi Diop</h3>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full font-medium">Excellent</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Terminale S</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Moyenne générale</span>
                <span className="text-slate-800 dark:text-slate-100 font-medium">16.5/20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Assiduité</span>
                <span className="text-slate-800 dark:text-slate-100 font-medium">95%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Aïcha Diop</h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">Bien</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Première L</p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Moyenne générale</span>
                <span className="text-slate-800 dark:text-slate-100 font-medium">14.2/20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Assiduité</span>
                <span className="text-slate-800 dark:text-slate-100 font-medium">88%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </motion.div>
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
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Koffi a obtenu 18/20 en Mathématiques</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Il y a 2h</p>
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

              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Aïcha absente au cours de Français</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Il y a 4j</p>
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

              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Paiement cours particuliers dû</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Il y a 2j</p>
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
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-center min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">15 Déc</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">14:00</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Réunion parent-professeur</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Koffi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-center min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">18 Déc</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">08:00</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Examen de Mathématiques</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Koffi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-center min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">20 Déc</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">10:00</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Présentation projet</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Aïcha</p>
                  </div>
                </div>
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
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium">AD</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-100 text-sm font-medium">Dr. Aminata Diallo</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">Il y a 1h</p>
                    <p className="text-slate-700 dark:text-slate-300 text-xs mt-1">Koffi a fait d'excellents progrès...</p>
                  </div>
                </div>
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
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">2</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enfants</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">5</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cours actifs</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">91%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Assiduité moy.</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">15.4</p>
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