"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUsers,
  IconChartBar,
  IconBell,
  IconMessage,
  IconCalendar,
  IconHeart,
  IconPlus,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AlertCircle, MessageSquare, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"

export default function ParentDashboard() {
  const { user } = useAuth()
  const links = [
    { label: "Tableau de bord", href: "/dashboard/parent", icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Invitations", href: "/dashboard/parent/invitations", icon: <IconPlus className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Mes Enfants", href: "/dashboard/parent/enfants", icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Notifications", href: "#", icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Messages", href: "#", icon: <IconMessage className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Planning", href: "#", icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Réserver un cours", href: "/dashboard/parent/reserver", icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Mes Favoris", href: "#", icon: <IconHeart className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Mes Alertes", href: "#", icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Statistiques", href: "#", icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Profil", href: "#", icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Paramètres", href: "#", icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Déconnexion", href: "/", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" /> },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="parent">
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
                  label: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Mon profil',
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
        <ParentDashboardContent firstName={user?.first_name} />
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

const ParentDashboardContent = ({ firstName }: { firstName?: string }) => {
  const children = [
    { name: "Koffi Diop", class: "Terminale S", average: 16.5, attendance: 95, status: "excellent" },
    { name: "Aïcha Diop", class: "Première L", average: 14.2, attendance: 88, status: "good" },
  ]

  const recentAlerts = [
    { type: "grade", message: "Koffi a obtenu 18/20 en Mathématiques", time: "Il y a 2h", priority: "high" },
    { type: "absence", message: "Aïcha absente au cours de Français", time: "Il y a 1j", priority: "medium" },
    { type: "payment", message: "Paiement cours particuliers dû", time: "Il y a 2j", priority: "high" },
  ]

  const upcomingEvents = [
    { title: "Réunion parent-professeur", date: "15 Déc", time: "14:00", child: "Koffi" },
    { title: "Examen de Mathématiques", date: "18 Déc", time: "08:00", child: "Koffi" },
    { title: "Présentation projet", date: "20 Déc", time: "10:00", child: "Aïcha" },
  ]

  const teacherMessages = [
    {
      teacher: "Dr. Aminata Diallo",
      subject: "Mathématiques",
      message: "Koffi montre d'excellents progrès",
      time: "Il y a 1h",
    },
    { teacher: "Prof. Jean-Baptiste", subject: "Physique", message: "Demande de rendez-vous", time: "Il y a 3h" },
    {
      teacher: "Dr. Fatou Ndiaye",
      subject: "Français",
      message: "Aïcha doit rattraper le cours manqué",
      time: "Il y a 1j",
    },
  ]

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Parent</h1>
          <p className="text-laha-gold-light/70">Bienvenue, {firstName || 'Parent'} ! Suivez les progrès de vos enfants.</p>
        </div>

        {/* Children Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {children.map((child, index) => (
            <div key={index} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-laha-gold-light">{child.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    child.status === "excellent" ? "bg-laha-gold/20 text-laha-gold" : "bg-laha-gold-warm/20 text-laha-gold-warm"
                  }`}
                >
                  {child.status === "excellent" ? "Excellent" : "Bien"}
                </span>
              </div>
              <p className="text-laha-gold-light/70 mb-4">{child.class}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-laha-gold-light/70 text-sm">Moyenne générale</p>
                  <p className="text-laha-gold text-2xl font-bold">{child.average}/20</p>
                </div>
                <div>
                  <p className="text-laha-gold-light/70 text-sm">Assiduité</p>
                  <p className="text-laha-gold text-2xl font-bold">{child.attendance}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Alerts & Notifications */}
          <div className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            <h2 className="text-xl font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-laha-gold-warm" />
              Alertes & Notifications
            </h2>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${alert.priority === "high" ? "bg-laha-gold" : "bg-laha-gold-warm"}`}
                      />
                      <span className="text-laha-gold-light font-medium text-sm">{alert.message}</span>
                    </div>
                    <span className="text-laha-gold-light/50 text-xs">{alert.time}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-3 py-1 rounded-lg text-sm transition-colors">
                      Voir détails
                    </button>
                    <button className="bg-laha-black-light/20 hover:bg-laha-black-light/30 text-laha-gold-light/70 px-3 py-1 rounded-lg text-sm transition-colors">
                      Marquer comme lu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-laha-gold-warm" />
                Événements à venir
              </h2>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-laha-gold-light font-medium text-sm">{event.title}</p>
                      <span className="text-laha-gold text-xs">{event.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-laha-gold-light/70 text-xs">{event.child}</span>
                      <span className="text-laha-gold-warm text-xs">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Teacher Messages */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-laha-gold-soft" />
                Messages enseignants
              </h2>
              <div className="space-y-3">
                {teacherMessages.map((message, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-laha-gold-light font-medium text-sm">{message.teacher}</p>
                      <span className="text-laha-gold-light/50 text-xs">{message.time}</span>
                    </div>
                    <p className="text-laha-gold-light/70 text-xs mb-1">{message.subject}</p>
                    <p className="text-laha-gold-light/60 text-xs">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








