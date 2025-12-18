"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Star, TrendingUp, Award, Play, Calendar, MessageSquare, RefreshCcw } from "lucide-react"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { useStudentData } from "@/hooks/use-student-data"
import logger from "@/lib/logger"

export default function StudentDashboard() {
  return (
    <StudentSidebar>
      <StudentDashboardContent />
    </StudentSidebar>
  )
}

const StudentDashboardContent = () => {
  const { courses, videos, books, exercises, loading, error, refreshData } = useStudentData()
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)

  // Charger les messages récents
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setMessagesLoading(true)
        const response = await fetch('/api/student/messages-recent', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          setRecentMessages(data.messages || data || [])
        } else {
          logger.error('Failed to fetch messages', new Error('API error'), { context: 'StudentDashboard' })
          setRecentMessages([])
        }
      } catch (error) {
        logger.error('Error fetching messages', error as Error, { context: 'StudentDashboard' })
        setRecentMessages([])
      } finally {
        setMessagesLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const recentCourses = courses.slice(0, 4)
  const upcomingClasses = courses
    .filter((c) => c.is_enrolled)
    .slice(0, 3)
    .map((c) => ({
      subject: c.title,
      time: "À planifier",
      teacher: c.teacher?.name || "Enseignant",
    }))

  const achievements = [
    { title: "Cours suivis", description: `${courses.length} cours`, icon: "📚" },
    { title: "Vidéos vues", description: `${videos.length} vidéos`, icon: "🎬" },
    { title: "Entraînements", description: `${exercises.length} sessions`, icon: "🏋️" },
  ]

  const stats = {
    coursesCount: courses.length,
    studyHours: Math.max(
      ...courses.map((c) => c.duration || 0),
      ...exercises.map((e) => e.duration || 0),
      0
    ),
    averageRating: courses.length
      ? (
          courses.reduce((sum, c) => sum + (c.rating || 0), 0) / Math.max(courses.length, 1)
        ).toFixed(1)
      : "—",
    progression: courses.length
      ? `${Math.round(
          courses.reduce((sum, c) => sum + (c.progress || 0), 0) / Math.max(courses.length, 1)
        )}%`
      : "—",
  }

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Élève</h1>
          <p className="text-laha-text-secondary">
            Bienvenue ! Continuez votre parcours d'excellence.
          </p>
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Cours suivis</p>
                <p className="text-laha-text text-xl font-bold">{loading ? "…" : stats.coursesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                <Clock className="h-5 w-5 text-laha-gold-warm" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Heures d'étude</p>
                <p className="text-laha-text text-xl font-bold">{loading ? "…" : `${stats.studyHours} min`}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                <Star className="h-5 w-5 text-laha-gold-soft" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Moyenne générale</p>
                <p className="text-laha-text text-xl font-bold">{loading ? "…" : stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Progression</p>
                <p className="text-laha-text text-xl font-bold">{loading ? "…" : stats.progression}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
          {loading && <span className="text-sm text-laha-text-secondary">Chargement des données…</span>}
          <button
            onClick={refreshData}
            className="flex items-center gap-2 text-sm text-laha-gold hover:text-laha-gold-light transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Rafraîchir
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Recent Courses */}
          <div className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            <h2 className="text-xl font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-laha-gold" />
              Mes Cours Récents
            </h2>
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <div key={course.id || index} className="bg-laha-black-light/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-laha-gold-light font-medium">{course.title}</h3>
                    <span className="text-laha-gold text-sm">{Math.round(course.progress || 0)}%</span>
                  </div>
                  <div className="w-full bg-laha-black-light/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-laha-gold to-laha-gold-warm h-2 rounded-full"
                      style={{ width: `${Math.round(course.progress || 0)}%` }}
                    />
                  </div>
                  <p className="text-laha-gold-light/70 text-sm">Progression en cours</p>
                  <button className="mt-2 bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    Continuer
                  </button>
                </div>
              ))}
              {!loading && recentCourses.length === 0 && (
                <p className="text-sm text-laha-text-secondary">Aucun cours pour l'instant.</p>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-laha-gold-warm" />
                Cours à venir
              </h2>
              <div className="space-y-3">
                {upcomingClasses.map((class_, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-laha-gold-light font-medium text-sm">{class_.subject}</p>
                        <p className="text-laha-gold-light/70 text-xs">{class_.teacher}</p>
                      </div>
                      <span className="text-laha-gold-warm text-sm font-medium">{class_.time}</span>
                    </div>
                  </div>
                ))}
                {!loading && upcomingClasses.length === 0 && (
                  <p className="text-sm text-laha-text-secondary">Pas de cours planifiés.</p>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-laha-gold-soft" />
                Récompenses
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="text-laha-gold-light font-medium text-sm">{achievement.title}</p>
                        <p className="text-laha-gold-light/70 text-xs">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-laha-gold-soft" />
                Messages récents
              </h2>
              <div className="space-y-3">
                {messagesLoading ? (
                  <div className="text-center text-laha-text-secondary text-sm py-4">
                    Chargement...
                  </div>
                ) : recentMessages.length === 0 ? (
                  <div className="text-center text-laha-text-secondary text-sm py-4">
                    Aucun message pour l'instant
                  </div>
                ) : (
                  recentMessages.slice(0, 3).map((msg, index) => (
                    <div key={msg.id || index} className="bg-laha-black-light/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-laha-gold-light font-medium text-sm">
                          {msg.sender_name || msg.sender || 'Expéditeur inconnu'}
                        </p>
                        <span className="text-laha-gold-light/50 text-xs">
                          {msg.time || msg.created_at || ''}
                        </span>
                      </div>
                      <p className="text-laha-gold-light/70 text-xs">
                        {msg.message || msg.content || msg.body || ''}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <button className="w-full mt-3 bg-laha-gold-soft/20 hover:bg-laha-gold-soft/30 text-laha-gold-soft p-2 rounded-lg text-sm transition-colors">
                Voir tous les messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








