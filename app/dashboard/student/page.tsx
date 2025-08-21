"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconCalendar,
  IconTrophy,
  IconUsers,
  IconChartBar,
  IconVideo,
  IconBook2,
  IconBarbell,
  IconCalendarEvent,
  IconRobot,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { BookOpen, Clock, Star, TrendingUp, Award, Play, Calendar, MessageSquare } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  
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
      label: "Mes Vidéos",
      href: "#",
      icon: <IconVideo className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "#",
      icon: <IconBook2 className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Entraînements",
      href: "#",
      icon: <IconBarbell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/student/course-booking",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mon Enseignant IA",
      href: "#",
      icon: <IconRobot className="h-5 w-5 shrink-0 text-white" />,
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
      label: "Planning",
      href: "#",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Liens parentals",
      href: "/dashboard/student/link-parent",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Notes",
      href: "#",
      icon: <IconTrophy className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Communauté",
      href: "#",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
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
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
      onClick: logout,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="student">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
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
                
                {/* Profil étudiant */}
                <SidebarLink
                  link={{
                    label: `${user?.first_name} ${user?.last_name}`,
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=KA"
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
          <StudentDashboardContent user={user} />
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

const StudentDashboardContent = ({ user }: { user: any }) => {
  const recentCourses = [
    { title: "Mathématiques - Terminale", progress: 75, nextLesson: "Dérivées" },
    { title: "Physique - Terminale", progress: 60, nextLesson: "Électricité" },
    { title: "Français - Terminale", progress: 85, nextLesson: "Dissertation" },
    { title: "Histoire - Terminale", progress: 45, nextLesson: "Colonisation" },
  ]

  const upcomingClasses = [
    { subject: "Mathématiques", time: "14:00", teacher: "Dr. Aminata Diallo" },
    { subject: "Physique", time: "16:00", teacher: "Prof. Jean-Baptiste" },
    { subject: "Français", time: "09:00", teacher: "Dr. Fatou Ndiaye" },
  ]

  const achievements = [
    { title: "Premier de classe", description: "Mathématiques - Novembre", icon: "🏆" },
    { title: "Participation active", description: "Forums de discussion", icon: "💬" },
    { title: "Assidu", description: "100% de présence ce mois", icon: "⭐" },
  ]

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Élève</h1>
          <p className="text-laha-text-secondary">
            Bienvenue, {user?.first_name} {user?.last_name} ! Continuez votre parcours d'excellence.
          </p>
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
                <p className="text-laha-text text-xl font-bold">12</p>
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
                <p className="text-laha-text text-xl font-bold">45h</p>
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
                <p className="text-laha-text text-xl font-bold">16.5/20</p>
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
                <p className="text-laha-text text-xl font-bold">+12%</p>
              </div>
            </div>
          </div>
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
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-laha-gold-light font-medium">{course.title}</h3>
                    <span className="text-laha-gold text-sm">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-laha-black-light/20 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-laha-gold to-laha-gold-warm h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-laha-gold-light/70 text-sm">Prochaine leçon: {course.nextLesson}</p>
                  <button className="mt-2 bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    Continuer
                  </button>
                </div>
              ))}
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
                {[
                  { sender: "Dr. Aminata Diallo", message: "Excellent travail sur les dérivées !", time: "Il y a 1h" },
                  { sender: "Prof. Jean-Baptiste", message: "N'oubliez pas le devoir de physique", time: "Il y a 3h" },
                  { sender: "Support LAHA", message: "Votre certificat est prêt", time: "Il y a 1j" },
                ].map((msg, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-laha-gold-light font-medium text-sm">{msg.sender}</p>
                      <span className="text-laha-gold-light/50 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-laha-gold-light/70 text-xs">{msg.message}</p>
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
    </div>
  )
}








