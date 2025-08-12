"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Users as UsersIcon,
  BookOpen,
  Bell,
  ShieldCheck,
  Settings,
  ChartBar,
  Home,
  Shield,
  BarChart3,
  TrendingUp,
  Activity,
  Target,
  DollarSign,
  Zap,
} from "lucide-react"

export default function SimpleAdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30j')

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">Dashboard Admin</h1>
                <p className="text-laha-gold-light/70">Version simplifiée pour tester</p>
              </div>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="mt-4 sm:mt-0 bg-laha-black-light/60 border border-laha-gold-dark/30 rounded-lg px-4 py-2 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
              >
                <option value="7j">7 jours</option>
                <option value="30j">30 jours</option>
                <option value="90j">90 jours</option>
                <option value="année">Cette année</option>
              </select>
            </div>
          </div>

          {/* Stats Grid Simple */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-laha-gold-light/70 mb-1">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-laha-gold">2,134</p>
                  <p className="text-xs text-green-400 mt-1">+12% ce mois</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-laha-gold" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-laha-gold-light/70 mb-1">Cours Actifs</p>
                  <p className="text-2xl font-bold text-laha-gold">456</p>
                  <p className="text-xs text-green-400 mt-1">+8% ce mois</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-laha-gold" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-laha-gold-light/70 mb-1">Signalements</p>
                  <p className="text-2xl font-bold text-laha-gold">5</p>
                  <p className="text-xs text-orange-400 mt-1">-2 cette semaine</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-laha-gold" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-laha-gold-light/70 mb-1">Satisfaction</p>
                  <p className="text-2xl font-bold text-laha-gold">92%</p>
                  <p className="text-xs text-green-400 mt-1">+3% ce mois</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                  <ChartBar className="h-6 w-6 text-laha-gold" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Gestion des Utilisateurs
              </h2>
              <p className="text-laha-gold-light/80 text-sm mb-4">Créer/éditer les comptes, gérer les rôles, modérer l'activité.</p>
              <div className="space-y-3">
                <button className="w-full p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                  Créer un utilisateur
                </button>
                <button className="w-full p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                  Voir tous les utilisateurs
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rôles & Permissions
              </h2>
              <p className="text-laha-gold-light/80 text-sm mb-4">Configurer les accès pour tous les types d'utilisateurs.</p>
              <div className="space-y-3">
                <div className="bg-laha-black/40 rounded-lg p-3">
                  <span className="text-laha-gold-light text-sm">Matrices de permissions</span>
                </div>
                <div className="bg-laha-black/40 rounded-lg p-3">
                  <span className="text-laha-gold-light text-sm">Politiques de sécurité & 2FA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
