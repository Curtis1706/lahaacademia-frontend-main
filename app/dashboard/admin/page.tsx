"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { motion } from "framer-motion"
import Image from "next/image"
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
  Star,
} from "lucide-react"
import { UsersEvolutionChart } from '@/components/charts/users-evolution-chart'
import { RolesDistributionChart } from '@/components/charts/roles-distribution-chart'
import { ActivityChart } from '@/components/charts/activity-chart'
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart'
import { PerformanceRadarChart } from '@/components/charts/performance-radar-chart'
import { getAvailableTeachers, getCoursesWithTeachers, Teacher, Course } from '@/lib/api-courses'
import logger from '@/lib/logger'

// Fonction utilitaire pour afficher les subjects
const displaySubjects = (subjects: any): string => {
  if (Array.isArray(subjects)) {
    const display = subjects.slice(0, 2).join(', ')
    return subjects.length > 2 ? display + '...' : display
  } else if (typeof subjects === 'string') {
    return subjects.length > 50 ? subjects.substring(0, 50) + '...' : subjects
  }
  return 'Non spécifié'
}

// Fonction utilitaire pour normaliser les données des enseignants
const normalizeTeacherData = (teachers: any[]): Teacher[] => {
  return teachers.map(teacher => ({
    ...teacher,
    subjects: Array.isArray(teacher.subjects) 
      ? teacher.subjects 
      : typeof teacher.subjects === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.subjects)
            } catch {
              return [teacher.subjects]
            }
          })()
        : [],
    name: teacher.name || `${teacher.user?.first_name || ''} ${teacher.user?.last_name || ''}`.trim() || 'Enseignant inconnu',
    avatar: teacher.avatar || teacher.profile_photo || '/placeholder-user.jpg',
    rating: teacher.rating || teacher.average_rating || 0,
    experience: teacher.experience || `${teacher.experience_years || 0} ans d'expérience`,
    hourly_rate: teacher.hourly_rate || 0,
    country: teacher.country || 'Non spécifié',
    total_students: teacher.total_students || 0,
    total_sessions: teacher.total_sessions || 0,
    bio: teacher.bio || '',
    specializations: Array.isArray(teacher.specializations) 
      ? teacher.specializations 
      : typeof teacher.specializations === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.specializations)
            } catch {
              return [teacher.specializations]
            }
          })()
        : [],
    certifications: Array.isArray(teacher.certifications) 
      ? teacher.certifications 
      : typeof teacher.certifications === 'string' 
        ? (() => {
            try {
              return JSON.parse(teacher.certifications)
            } catch {
              return [teacher.certifications]
            }
          })()
        : []
  }))
}

export default function AdminDashboard() {
  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <AdminSidebar>
        <AdminContent />
      </AdminSidebar>
    </AuthGuard>
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
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fonction pour charger les données
  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [teachersResponse, coursesResponse] = await Promise.all([
        getAvailableTeachers(),
        getCoursesWithTeachers()
      ])
      
      // Normaliser les données des enseignants
      const normalizedTeachers = normalizeTeacherData(teachersResponse.data || [])
      setTeachers(normalizedTeachers)
      setCourses(coursesResponse.data)
    } catch (err) {
      logger.error('Erreur lors du chargement des données admin dashboard', err as Error, { context: 'AdminContent/loadData' })
      setError('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])

  return (
          <div className="flex flex-1 w-full">
        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md px-6 py-6 overflow-y-auto">
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
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Enseignants Inscrits</p>
                <p className="text-2xl font-bold text-laha-gold">{isLoading ? '...' : teachers.length}</p>
                <p className="text-xs text-green-400 mt-1">Total des professeurs</p>
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
                <p className="text-sm font-medium text-laha-text-secondary mb-1">Cours Disponibles</p>
                <p className="text-2xl font-bold text-laha-gold">{isLoading ? '...' : courses.length}</p>
                <p className="text-xs text-green-400 mt-1">Total des cours</p>
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

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-sm font-medium">Erreur :</span>
              <span className="text-sm">{error}</span>
              <button 
                onClick={loadData}
                className="ml-auto text-sm underline hover:no-underline"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Sections pour afficher les professeurs et cours */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Section Professeurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Professeurs Inscrits ({teachers.length})
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : teachers.length === 0 ? (
              <p className="text-laha-text-secondary text-center py-8">
                Aucun professeur inscrit pour le moment
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {teachers.slice(0, 10).map((teacher) => (
                  <div key={teacher.id} className="bg-laha-black/40 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar || "/placeholder.svg?height=40&width=40&text=T"}
                          alt={teacher.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-laha-text">{teacher.name}</div>
                          <div className="text-sm text-laha-text-secondary">
                            {displaySubjects(teacher.subjects)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-laha-gold font-medium">{teacher.hourly_rate}FCFA/h</div>
                        <div className="text-sm text-laha-text-secondary flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {teacher.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {teachers.length > 10 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-laha-text-secondary">
                      +{teachers.length - 10} autres professeurs
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Section Cours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border hover:border-laha-gold/30 transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Cours Disponibles ({courses.length})
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : courses.length === 0 ? (
              <p className="text-laha-text-secondary text-center py-8">
                Aucun cours disponible pour le moment
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {courses.slice(0, 10).map((course) => (
                  <div key={course.id} className="bg-laha-black/40 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-laha-text mb-1">{course.title}</div>
                        <div className="text-sm text-laha-text-secondary mb-2">
                          {course.description.substring(0, 80)}...
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-laha-gold/20 text-laha-gold px-2 py-1 rounded">
                            {course.subject}
                          </span>
                          <span className="text-xs bg-laha-surface/60 text-laha-text-secondary px-2 py-1 rounded">
                            {course.level}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-laha-gold font-medium">{course.price}FCFA</div>
                        <div className="text-sm text-laha-text-secondary">{course.duration}min</div>
                      </div>
                    </div>
                  </div>
                ))}
                {courses.length > 10 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-laha-text-secondary">
                      +{courses.length - 10} autres cours
                    </span>
                  </div>
                )}
              </div>
            )}
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
                  <span className="text-xs bg-laha-gold text-laha-black px-2 py-1 rounded font-medium">{teachers.length}</span>
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







