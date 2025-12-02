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
import Image from "next/image"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"

interface StudentSidebarProps {
  children: React.ReactNode
}

export function StudentSidebar({ children }: StudentSidebarProps) {
  const { user, logout } = useAuth()
  
  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/student/mes-cours",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "/dashboard/student/mes-videos",
      icon: <IconVideo className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "/dashboard/student/mes-ouvrages",
      icon: <IconBook2 className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Entraînements",
      href: "/dashboard/student/mes-entrainements",
      icon: <IconBarbell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/student/course-booking",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mon Enseignant IA",
      href: "/dashboard/student/mon-enseignant-ia",
      icon: <IconRobot className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Favoris",
      href: "/dashboard/student/mes-favoris",
      icon: <IconHeart className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Alertes",
      href: "/dashboard/student/mes-alertes",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Planning",
      href: "/dashboard/student/planning",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Liens parentals",
      href: "/dashboard/student/link-parent",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Notes",
      href: "/dashboard/student/mes-notes",
      icon: <IconTrophy className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Communauté",
      href: "/dashboard/student/communaute",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "/dashboard/student/statistiques",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "/dashboard/student/profil",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "/dashboard/student/parametres",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
      onClick: logout,
    },
  ]

  const [open, setOpen] = useState(true)

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
                    label: `${user?.first_name || 'Spéro'} ${user?.last_name || 'ASHANTE'}`,
                    href: "/dashboard/student/profil",
                    icon: (
                      <div className="h-7 w-7 shrink-0 rounded-full bg-laha-gold flex items-center justify-center">
                        <span className="text-laha-black font-semibold text-sm">
                          {(user?.first_name?.[0] || 'S')}{(user?.last_name?.[0] || 'A')}
                        </span>
                      </div>
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="/dashboard/student" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
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
    <a href="/dashboard/student" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    </a>
  )
}

