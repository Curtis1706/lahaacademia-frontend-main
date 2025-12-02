"use client"

import { useState } from "react"
import { 
  Sidebar, 
  SidebarBody, 
  SidebarProvider,
  SidebarLink
} from "@/components/ui/sidebar"
import { 
  Home, 
  UsersIcon, 
  Shield, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Settings,
  Book,
  HelpCircle,
  Video,
  FileText,
  User,
  GraduationCap,
  Plus,
  Brain,
  Library,
  Trophy,
  FolderOpen,
  Users
} from "lucide-react"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import Image from "next/image"

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
          <span className="text-xs text-white/70">Administration</span>
        </div>
      )}
    </div>
  )
}

interface AdminSidebarProps {
  children: React.ReactNode
}

export function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationLinks = [
    {
      label: "Aperçu",
      href: "/dashboard/admin",
      icon: <Home className="h-5 w-5 shrink-0" />
    },
    {
      label: "Utilisateurs",
      href: "/dashboard/admin/users",
      icon: <UsersIcon className="h-5 w-5 shrink-0" />
    },
    {
      label: "Validation Enseignants",
      href: "/dashboard/admin/teachers/validation",
      icon: <Shield className="h-5 w-5 shrink-0" />
    },
    {
      label: "Cours",
      href: "/dashboard/admin/content/courses",
      icon: <BookOpen className="h-5 w-5 shrink-0" />
    },
    {
      label: "Contenus",
      href: "/dashboard/admin/content",
      icon: <Book className="h-5 w-5 shrink-0" />
    },
    {
      label: "QCM",
      href: "/dashboard/admin/content/qcm",
      icon: <HelpCircle className="h-5 w-5 shrink-0" />
    },
    {
      label: "Live",
      href: "/dashboard/admin/live",
      icon: <Video className="h-5 w-5 shrink-0" />
    },
    {
      label: "Victoires",
      href: "/dashboard/admin/victories",
      icon: <Trophy className="h-5 w-5 shrink-0" />
    },
    {
      label: "Documents",
      href: "/dashboard/admin/documents",
      icon: <FolderOpen className="h-5 w-5 shrink-0" />
    },
    {
      label: "Parents",
      href: "/dashboard/admin/parents",
      icon: <Users className="h-5 w-5 shrink-0" />
    },
    {
      label: "Paramètres",
      href: "/dashboard/admin/settings",
      icon: <Settings className="h-5 w-5 shrink-0" />
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
