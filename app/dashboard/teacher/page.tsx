"use client"

import { useState, useEffect } from "react"
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

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await fetch('/api/teachers/me')
        if (res.ok) {
          const data = await res.json()
          setTeacherData(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données professeur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [])

  const links = [
    {
      label: "Tableau de bord",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "#",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
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
            <div>
              <SidebarLink
                link={{
                  label: teacherData ? 
                    `${teacherData.user?.first_name || ''} ${teacherData.user?.last_name || ''}`.trim() || 'Mon profil' :
                    (user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Mon profil' : 'Mon profil'),
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
  const myCourses = [
    { title: "Mathématiques Terminale", students: 45, rating: 4.8, earnings: "2,500 FCFA" },
    { title: "Algèbre Première", students: 32, rating: 4.9, earnings: "1,800 FCFA" },
    { title: "Géométrie Seconde", students: 28, rating: 4.7, earnings: "1,400 FCFA" },
  ]

  const upcomingClasses = [
    { title: "Mathématiques Terminale", time: "14:00", students: 45, type: "live" },
    { title: "Algèbre Première", time: "16:00", students: 32, type: "recorded" },
    { title: "Géométrie Seconde", time: "09:00", students: 28, type: "live" },
  ]

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Professeur</h1>
          <p className="text-laha-gold-light/70">
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-gold-light/70 text-sm">Cours actifs</p>
                <p className="text-laha-gold-light text-xl font-bold">8</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                <Users className="h-5 w-5 text-laha-gold-warm" />
              </div>
              <div>
                <p className="text-laha-gold-light/70 text-sm">Total apprenants</p>
                <p className="text-laha-gold-light text-xl font-bold">156</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-laha-gold-soft" />
              </div>
              <div>
                <p className="text-laha-gold-light/70 text-sm">Revenus ce mois</p>
                <p className="text-laha-gold-light text-xl font-bold">45,000 FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Star className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <p className="text-laha-gold-light/70 text-sm">Note moyenne</p>
                <p className="text-laha-gold-light text-xl font-bold">4.8/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* My Courses */}
          <div className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            <h2 className="text-xl font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-laha-gold" />
              Mes Cours
            </h2>
            <div className="space-y-4">
              {myCourses.map((course, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-laha-gold-light font-medium">{course.title}</h3>
                    <span className="text-laha-gold text-sm font-medium">{course.earnings}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-laha-gold-light/70">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students} apprenants
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-laha-gold" />
                      {course.rating}
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
              {[
                { student: "Koffi Asante", message: "Question sur les dérivées", time: "Il y a 2h", unread: true },
                { student: "Aïcha Traoré", message: "Demande de cours particulier", time: "Il y a 4h", unread: true },
                { student: "Mamadou Diop", message: "Merci pour le cours d'hier", time: "Il y a 1j", unread: false },
              ].map((message, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <p className="text-laha-gold-light font-medium text-sm">{message.student}</p>
                      {message.unread && <div className="w-2 h-2 bg-laha-gold rounded-full" />}
                    </div>
                    <span className="text-laha-gold-light/50 text-xs">{message.time}</span>
                  </div>
                  <p className="text-laha-gold-light/70 text-xs">{message.message}</p>
                </div>
              ))}
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



