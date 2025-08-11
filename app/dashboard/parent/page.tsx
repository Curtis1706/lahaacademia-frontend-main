"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AlertCircle, MessageSquare, Calendar } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent-sidebar"

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
    <div className="h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Parent</h1>
        <p className="text-laha-gold-light/70">Bienvenue ! Suivez les progrès de vos enfants.</p>
      </div>

      {/* Résumé des enfants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gradient-to-br from-laha-gold/10 to-laha-gold/5 rounded-xl p-6 border border-laha-gold/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-laha-gold">Koffi Diop</h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Excellent</span>
          </div>
          <p className="text-sm text-laha-gold-light/70 mb-4">Terminale S</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-laha-gold-light/70">Moyenne générale</span>
              <span className="text-laha-gold font-medium">16.5/20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-laha-gold-light/70">Assiduité</span>
              <span className="text-laha-gold font-medium">95%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gradient-to-br from-laha-gold/10 to-laha-gold/5 rounded-xl p-6 border border-laha-gold/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-laha-gold">Aïcha Diop</h3>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Bien</span>
          </div>
          <p className="text-sm text-laha-gold-light/70 mb-4">Première L</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-laha-gold-light/70">Moyenne générale</span>
              <span className="text-laha-gold font-medium">14.2/20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-laha-gold-light/70">Assiduité</span>
              <span className="text-laha-gold font-medium">88%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alertes & Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="xl:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-laha-gold-light">Alertes & Notifications</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-laha-gold-light text-sm">Koffi a obtenu 18/20 en Mathématiques</p>
                <p className="text-laha-gold-light/60 text-xs mt-1">Il y a 2h</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-laha-gold/20 text-laha-gold text-xs rounded hover:bg-laha-gold/30">
                  Voir détails
                </button>
                <button className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20">
                  Marquer comme lu
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-laha-gold-light text-sm">Aïcha absente au cours de Français</p>
                <p className="text-laha-gold-light/60 text-xs mt-1">Il y a 4j</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-laha-gold/20 text-laha-gold text-xs rounded hover:bg-laha-gold/30">
                  Voir détails
                </button>
                <button className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20">
                  Marquer comme lu
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-laha-gold-light text-sm">Paiement cours particuliers dû</p>
                <p className="text-laha-gold-light/60 text-xs mt-1">Il y a 2j</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-laha-gold/20 text-laha-gold text-xs rounded hover:bg-laha-gold/30">
                  Voir détails
                </button>
                <button className="px-3 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20">
                  Marquer comme lu
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Événements à venir */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-laha-gold" />
              <h3 className="text-lg font-semibold text-laha-gold-light">Événements à venir</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-laha-gold/10 rounded-lg">
                <div className="text-center min-w-0">
                  <p className="text-laha-gold font-semibold text-sm">15 Déc</p>
                  <p className="text-laha-gold/70 text-xs">14:00</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-laha-gold-light text-sm font-medium">Réunion parent-professeur</p>
                  <p className="text-laha-gold-light/60 text-xs">Koffi</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-laha-gold/10 rounded-lg">
                <div className="text-center min-w-0">
                  <p className="text-laha-gold font-semibold text-sm">18 Déc</p>
                  <p className="text-laha-gold/70 text-xs">08:00</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-laha-gold-light text-sm font-medium">Examen de Mathématiques</p>
                  <p className="text-laha-gold-light/60 text-xs">Koffi</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-laha-gold/10 rounded-lg">
                <div className="text-center min-w-0">
                  <p className="text-laha-gold font-semibold text-sm">20 Déc</p>
                  <p className="text-laha-gold/70 text-xs">10:00</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-laha-gold-light text-sm font-medium">Présentation projet</p>
                  <p className="text-laha-gold-light/60 text-xs">Aïcha</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Messages enseignants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-laha-gold" />
              <h3 className="text-lg font-semibold text-laha-gold-light">Messages enseignants</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-laha-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-laha-gold text-xs font-medium">AD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-laha-gold-light text-sm font-medium">Dr. Aminata Diallo</p>
                  <p className="text-laha-gold-light/60 text-xs">Il y a 1h</p>
                  <p className="text-laha-gold-light/80 text-xs mt-1">Koffi a fait d'excellents progrès...</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}