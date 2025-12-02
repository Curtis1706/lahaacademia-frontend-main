"use client"

import { useState } from "react"
import { 
  Sidebar, 
  SidebarBody, 
  SidebarProvider,
  SidebarLink
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard,
  Users, 
  Calendar,
  GraduationCap,
  DollarSign,
  Mail,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Plus
} from "lucide-react"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

// Logo component
function Logo({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg">
        <Image 
          src="/logo.png" 
          alt="LAHA Academia" 
          width={32} 
          height={32} 
          className="rounded"
        />
      </div>
      {open && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">LA Lahacademia</span>
          <span className="text-xs text-white/70">Parents</span>
        </div>
      )}
    </div>
  )
}

interface ParentSidebarProps {
  children: React.ReactNode
}

export function ParentSidebar({ children }: ParentSidebarProps) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationLinks = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />
    },
    {
      label: "Invitations",
      href: "/dashboard/parent/invitations",
      icon: <Plus className="h-5 w-5 shrink-0" />
    },
    {
      label: "Mes Enfants",
      href: "/dashboard/parent/enfants",
      icon: <Users className="h-5 w-5 shrink-0" />
    },
    {
      label: "Réserver un cours",
      href: "/dashboard/parent/reserver",
      icon: <Calendar className="h-5 w-5 shrink-0" />
    },
    {
      label: "Mes Réservations",
      href: "/dashboard/parent/reservations",
      icon: <Calendar className="h-5 w-5 shrink-0" />
    },
    {
      label: "Suivi des progrès",
      href: "/dashboard/parent/suivi",
      icon: <GraduationCap className="h-5 w-5 shrink-0" />
    },
    {
      label: "Paiements",
      href: "/dashboard/parent/paiements",
      icon: <DollarSign className="h-5 w-5 shrink-0" />
    },
    {
      label: "Notifications",
      href: "/dashboard/parent/notifications",
      icon: <Bell className="h-5 w-5 shrink-0" />
    },
    {
      label: "Messages",
      href: "/dashboard/parent/messages",
      icon: <Mail className="h-5 w-5 shrink-0" />
    },
    {
      label: "Statistiques",
      href: "/dashboard/parent/statistiques",
      icon: <BarChart3 className="h-5 w-5 shrink-0" />
    },
    {
      label: "Profil",
      href: "/dashboard/parent/profil",
      icon: <Users className="h-5 w-5 shrink-0" />
    },
    {
      label: "Paramètres",
      href: "/dashboard/parent/parametres",
      icon: <Settings className="h-5 w-5 shrink-0" />
    },
    {
      label: "Déconnexion",
      href: "/logout",
      icon: <LogOut className="h-5 w-5 shrink-0" />
    }
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-laha-background">
        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          setOpen={setSidebarOpen} 
          className="bg-gradient-to-b from-slate-900 to-blue-900 border-r border-white/10 flex-shrink-0"
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-white/10 p-4">
              <Logo open={sidebarOpen} />
            </div>
            
            {/* Navigation */}
            <SidebarBody className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {navigationLinks.map((link, index) => (
                  <SidebarLink 
                    key={index}
                    link={link}
                    className="text-white hover:text-laha-gold"
                  />
                ))}
              </div>
            </SidebarBody>
            
            {/* Bottom section */}
            <div className="space-y-4 p-4 border-t border-white/10">
              {/* Bouton de thème */}
              <div className="flex justify-center">
                <AnimatedThemeToggler />
              </div>
              
              {/* Profil parent */}
              <SidebarLink
                link={{
                  label: `${user?.first_name} ${user?.last_name}`,
                  href: "#",
                  icon: (
                    <img
                      src="/placeholder.svg?height=50&width=50&text=PA"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
                className="text-white hover:text-laha-gold"
              />
            </div>
          </div>
        </Sidebar>
        
        {/* Main content */}
        <div className="flex-1 w-full overflow-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
