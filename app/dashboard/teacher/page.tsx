"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconCalendar,
  IconUsers,
  IconChartBar,
  IconCurrencyDollar,
  IconVideo,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { BookOpen, Users, DollarSign, Star, Calendar, Video, MessageSquare } from "lucide-react"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import logger from "@/lib/logger"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [teacherData, setTeacherData] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch('/api/teachers/me', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Impossible de charger le profil professeur')
        }
        const data = await res.json()
        setTeacherData(data)
      } catch (error) {
        logger.error('Erreur lors du chargement des données professeur', error as Error, { context: 'teacher/dashboard' })
        setError('Impossible de charger le profil professeur.')
      } finally {
        setLoading(false)
      }
    }

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/teachers/courses', { cache: 'no-store' })
        if (!res.ok) {
          throw new Error('Impossible de charger les cours')
        }
        const data = await res.json()
        setCourses(data.courses || [])
      } catch (error) {
        logger.error('Erreur lors du chargement des cours', error as Error, { context: 'teacher/dashboard' })
        setError('Impossible de charger les cours.')
      } finally {
        setLoading(false)
      }
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/teachers/messages-recent', { cache: 'no-store', credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setRecentMessages(data.messages || data || [])
        }
      } catch (error) {
        logger.error('Error fetching teacher messages', error as Error, { context: 'teacher/dashboard' })
      }
    }

    fetchTeacherData()
    fetchCourses()
    fetchMessages()
  }, [])

  const links = [
    {
      label: "Tableau de bord",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/teacher/courses",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservations",
      href: "/dashboard/bookings",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Messagerie",
      href: "/dashboard/messages",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Forums",
      href: "/dashboard/forums",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes apprenants",
      href: "#",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Planning",
      href: "#",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Cours en direct",
      href: "#",
      icon: <IconVideo className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Revenus",
      href: "#",
      icon: <IconCurrencyDollar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Favoris",
      href: "#",
      icon: <IconHeart className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Alertes",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="teacher">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
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
              
              {/* Profil professeur */}
              <SidebarLink
                link={{
                  label: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Mon profil' : 'Mon profil',
                  href: "#",
                  icon: (
                    <img
                      src="/placeholder.svg?height=50&width=50&text=P"
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
        <TeacherDashboardContent teacherData={teacherData} user={user} loading={loading} />
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white font-heading"
      >
        Lahacademia
      </motion.span>
    </a>
  )
}

const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    </a>
  )
}

const TeacherDashboardContent = ({ teacherData, user, loading }: { teacherData: any, user: any, loading: boolean }) => {
  const { courses = [], error } = useMemo(() => {
    // This hook is only used in parent; we pass down via closure using latest state
    return { courses: (teacherData as any)?.courses || [], error: null }
  }, [teacherData])

  // Si le professeur n'est pas validé, afficher la page d'attente
  if (!loading && teacherData && !teacherData.is_validated) {
    return <TeacherWaitingPage teacherData={teacherData} user={user} />
  }
  const myCourses = courses
  const upcomingClasses = courses.slice(0, 3).map((course) => ({
    title: course.title,
    time: 'À planifier',
    students: course.students || course.students_count || 0,
    type: course.course_type || 'individual',
  }))

  const stats = useMemo(() => {
    const totalCourses = myCourses.length
    const totalStudents = myCourses.reduce((sum, c) => sum + (c.students || c.students_count || 0), 0)
    const avgRating = totalCourses
      ? (myCourses.reduce((sum, c) => sum + (c.rating || c.average_rating || 0), 0) / totalCourses).toFixed(1)
      : '—'
    const totalEarnings = myCourses.reduce((sum, c) => sum + (c.earnings_value || 0), 0)
    return { totalCourses, totalStudents, avgRating, totalEarnings }
  }, [myCourses])

  return (
    <div className="flex flex-1">
              <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Professeur</h1>
          <p className="text-laha-text-secondary">
            {loading ? (
              'Chargement...'
            ) : (
              <>
                Bienvenue, {teacherData ? 
                  `${teacherData.user?.first_name || ''}` : 
                  (user ? `${user.first_name || ''}` : 'Professeur')
                } ! Gérez vos cours et suivez vos performances.
              </>
            )}
          </p>
          {error && (
            <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Cours actifs</p>
                <p className="text-laha-text text-xl font-bold">{loading ? '…' : stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                <Users className="h-5 w-5 text-laha-gold-warm" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Total apprenants</p>
                <p className="text-laha-text text-xl font-bold">{loading ? '…' : stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-laha-gold-soft" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Revenus ce mois</p>
                <p className="text-laha-text text-xl font-bold">{loading ? '…' : `${stats.totalEarnings || 0} FCFA`}</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-surface/20 backdrop-blur-md rounded-xl p-4 border border-laha-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Star className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-text-secondary text-sm">Note moyenne</p>
                <p className="text-laha-text text-xl font-bold">{loading ? '…' : stats.avgRating}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* My Courses */}
          <div className="lg:col-span-2 bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border">
            <h2 className="text-xl font-semibold text-laha-text mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-laha-gold" />
              Mes Cours
            </h2>
            <div className="space-y-4">
              {myCourses.map((course, index) => (
                <div key={course.id || index} className="bg-gradient-to-br from-laha-surface/20 to-laha-surface/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-laha-text font-medium">{course.title}</h3>
                    <span className="text-laha-gold text-sm font-medium">
                      {course.price ? `${course.price} FCFA` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students || course.students_count || 0} apprenants
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-laha-gold" />
                      {course.rating || course.average_rating || '—'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-3 py-1 rounded-lg text-sm transition-colors">
                      Gérer
                    </button>
                    <button className="bg-laha-gold-warm/20 hover:bg-laha-gold-warm/30 text-laha-gold-warm px-3 py-1 rounded-lg text-sm transition-colors">
                      Statistiques
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-laha-gold-warm" />
              Cours à venir
            </h2>
            <div className="space-y-3">
              {upcomingClasses.map((class_, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-laha-gold-light font-medium text-sm">{class_.title}</p>
                    <span className="text-laha-gold-warm text-sm font-medium">{class_.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-laha-gold-light/70 text-xs">{class_.students} apprenants</span>
                    <div className="flex items-center gap-1">
                      <Video className="h-3 w-3 text-laha-gold" />
                      <span className="text-laha-gold text-xs">{class_.type}</span>
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
              {loading ? (
                <div className="text-center text-laha-text-secondary text-sm py-4">
                  Chargement...
                </div>
              ) : recentMessages.length === 0 ? (
                <div className="text-center text-laha-text-secondary text-sm py-4">
                  Aucun message pour l'instant
                </div>
              ) : (
                recentMessages.slice(0, 3).map((message, index) => (
                  <div key={message.id || index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-laha-gold-light font-medium text-sm">
                          {message.student_name || message.student || message.sender_name || 'Élève'}
                        </p>
                        {message.unread && <div className="w-2 h-2 bg-laha-gold rounded-full" />}
                      </div>
                      <span className="text-laha-gold-light/50 text-xs">
                        {message.time || message.created_at || ''}
                      </span>
                    </div>
                    <p className="text-laha-gold-light/70 text-xs">
                      {message.message || message.content || message.body || ''}
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
  )
}

const TeacherWaitingPage = ({ teacherData, user }: { teacherData: any, user: any }) => {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">
            En attente de validation
          </h1>
          <p className="text-laha-text-secondary text-lg">
            Votre compte professeur est en cours de validation
          </p>
        </div>

        {/* Status Card */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-8 border border-laha-border text-center">
            {/* Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-laha-gold/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-laha-gold animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Status Message */}
            <h2 className="text-2xl font-bold text-laha-gold mb-4">
              Compte en attente de validation
            </h2>
            
            <p className="text-laha-text-secondary mb-6 leading-relaxed">
              Bonjour <span className="font-semibold text-laha-gold">
                {teacherData?.user?.first_name || user?.first_name || 'Professeur'}
              </span> ! 
              <br />
              Votre demande d'inscription en tant que professeur a été reçue avec succès. 
              Notre équipe examine actuellement votre dossier et vos documents.
            </p>

            {/* Process Steps */}
            <div className="bg-laha-surface/10 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-laha-text mb-4">
                Processus de validation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-laha-gold rounded-full flex items-center justify-center text-xs font-bold text-laha-black">
                    ✓
                  </div>
                  <span className="text-laha-text-secondary">Inscription terminée</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-laha-gold rounded-full flex items-center justify-center text-xs font-bold text-laha-black">
                    ✓
                  </div>
                  <span className="text-laha-text-secondary">Documents déposés</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-laha-gold/50 rounded-full flex items-center justify-center text-xs font-bold text-laha-text">
                    ⏳
                  </div>
                  <span className="text-laha-text-secondary">Examen en cours par notre équipe</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-laha-surface border-2 border-laha-border rounded-full flex items-center justify-center text-xs font-bold text-laha-text-secondary">
                    4
                  </div>
                  <span className="text-laha-text-secondary">Validation finale</span>
                </div>
              </div>
            </div>

            {/* Expected Time */}
            <div className="bg-laha-gold/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-laha-gold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Délai de traitement : 24-48 heures</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <p className="text-laha-text-secondary text-sm">
                Vous recevrez une notification par email dès que votre compte sera validé. 
                En attendant, vous pouvez :
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-6 py-3 rounded-lg font-medium transition-colors">
                  Modifier mes documents
                </button>
                <button className="bg-laha-surface/20 hover:bg-laha-surface/30 text-laha-text px-6 py-3 rounded-lg font-medium transition-colors">
                  Contacter le support
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-laha-border">
              <p className="text-laha-text-secondary text-sm">
                <strong>Besoin d'aide ?</strong> Contactez notre équipe support à 
                <span className="text-laha-gold"> support@lahaacademia.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

