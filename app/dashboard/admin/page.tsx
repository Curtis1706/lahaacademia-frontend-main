"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import Image from "next/image"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
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
  Zap,
  TrendingUp,
  Activity,
  Target,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Eye,
  Plus,
  Upload,
} from "lucide-react"
import { UsersEvolutionChart } from '@/components/charts/users-evolution-chart'
import { RolesDistributionChart } from '@/components/charts/roles-distribution-chart'
import { ActivityChart } from '@/components/charts/activity-chart'
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart'
import { PerformanceRadarChart } from '@/components/charts/performance-radar-chart'

export default function AdminDashboard() {
  const [open, setOpen] = useState(true)

  const links = [
    { label: "Aperçu", href: "#", icon: <Home className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Utilisateurs", href: "#users", icon: <UsersIcon className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rôles & Permissions", href: "#roles", icon: <Shield className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Cours & Sessions", href: "#courses", icon: <BookOpen className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Notifications", href: "#notifications", icon: <Bell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rapports & Statistiques", href: "#reports", icon: <BarChart3 className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Paramètres", href: "#settings", icon: <Settings className="h-5 w-5 shrink-0 text-white" /> },
  ]

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
                <Logo open={open} />
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {/* Bouton de thème */}
                <div className="flex justify-center">
                  <AnimatedThemeToggler />
                </div>
                
                {/* Profil administrateur */}
                <SidebarLink
                  link={{
                    label: "Administrateur",
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=AD"
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <AdminContent />
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

function Logo({ open }: { open: boolean }) {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      {open && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-white font-heading">
          Lahacademia Admin
        </motion.span>
      )}
    </a>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-4 border border-laha-border">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-laha-gold/20 rounded-lg">{icon}</div>
        <div>
          <p className="text-laha-text-secondary text-sm">{title}</p>
          <p className="text-laha-gold text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-6 border border-laha-border">
      <h2 className="text-xl font-semibold text-laha-text mb-4">{title}</h2>
      {children}
    </div>
  )
}

function AdminContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('30j')

  return (
          <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header modernisé */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">Dashboard Admin</h1>
              <p className="text-laha-text-secondary">Pilotez votre plateforme éducative avec intelligence.</p>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mt-4 sm:mt-0 bg-laha-surface/60 border border-laha-border rounded-lg px-4 py-2 text-laha-text focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
            >
              <option value="7j">7 jours</option>
              <option value="30j">30 jours</option>
              <option value="90j">90 jours</option>
              <option value="année">Cette année</option>
            </select>
          </div>
        </motion.div>

        {/* Statistiques modernisées avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-laha-gold/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-laha-gold">2,134</p>
                <p className="text-xs text-green-400 mt-1">+12% ce mois</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-laha-gold" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-laha-gold/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Cours Actifs</p>
                <p className="text-2xl font-bold text-laha-gold">456</p>
                <p className="text-xs text-green-400 mt-1">+8% ce mois</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-laha-gold" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-laha-gold/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Signalements</p>
                <p className="text-2xl font-bold text-laha-gold">5</p>
                <p className="text-xs text-orange-400 mt-1">-2 cette semaine</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-laha-gold" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-laha-gold/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-laha-gold">92%</p>
                <p className="text-xs text-green-400 mt-1">+3% ce mois</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                <ChartBar className="h-6 w-6 text-laha-gold" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Graphiques Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Évolution Multi-Métriques
            </h3>
            <UsersEvolutionChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Répartition des Rôles
            </h3>
            <RolesDistributionChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité Hebdomadaire
            </h3>
            <ActivityChart />
          </motion.div>
        </div>

        {/* Graphiques Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tendances Financières
            </h3>
            <RevenueTrendChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-lg font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Globale
            </h3>
            <PerformanceRadarChart />
          </motion.div>
        </div>

        {/* Sections modernisées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Gestion des Utilisateurs
            </h2>
            <p className="text-laha-gold-light/80 text-sm mb-4">Créer/éditer les comptes, gérer les rôles, modérer l'activité.</p>
            <div className="grid grid-cols-1 gap-3">
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Créer un utilisateur</span>
                  </div>
                  <span className="text-xs bg-laha-gold/20 px-2 py-1 rounded">Nouveau</span>
                </div>
              </button>
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">Importer (CSV)</span>
                </div>
              </button>
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Voir tous les utilisateurs</span>
                  </div>
                  <span className="text-xs bg-laha-gold text-laha-black px-2 py-1 rounded font-medium">2,134</span>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Rôles & Permissions
            </h2>
            <p className="text-laha-gold-light/80 text-sm mb-4">Configurer les accès pour tous les types d'utilisateurs.</p>
            <div className="space-y-3">
              <div className="bg-laha-black/40 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-laha-gold-light text-sm">Matrices de permissions</span>
                  <Bell className="h-4 w-4 text-laha-gold-light/50" />
                </div>
              </div>
              <div className="bg-laha-black/40 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-laha-gold-light text-sm">Politiques de sécurité & 2FA</span>
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                </div>
              </div>
              <div className="bg-laha-black/40 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-laha-gold-light text-sm">Audit des actions sensibles</span>
                  <Settings className="h-4 w-4 text-laha-gold-light/50" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cours & Sessions
            </h2>
            <p className="text-laha-gold-light/80 text-sm mb-4">Valider les contenus, gérer la qualité, planifier les sessions.</p>
            <div className="grid grid-cols-1 gap-3">
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm font-medium">Créer un cours</span>
                </div>
              </button>
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Modérer les cours</span>
                  </div>
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">3 en attente</span>
                </div>
              </button>
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Calendrier des sessions</span>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications & Communication
            </h2>
            <p className="text-laha-gold-light/80 text-sm mb-4">Campagnes, annonces, alertes système.</p>
            <div className="grid grid-cols-1 gap-3">
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Nouvelle annonce</span>
                </div>
              </button>
              <button className="p-3 bg-laha-gold/10 hover:bg-laha-gold/20 text-laha-gold rounded-lg transition-colors text-left border border-laha-gold/20 hover:border-laha-gold/40">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Campagnes email/SMS</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}







