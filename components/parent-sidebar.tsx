"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Plus 
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface ParentSidebarProps {
  children: React.ReactNode
}

export function ParentSidebar({ children }: ParentSidebarProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  const links = [
    { 
      label: 'Tableau de bord', 
      href: '/dashboard/parent', 
      icon: <LayoutDashboard className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent'
    },
    { 
      label: 'Invitations', 
      href: '/dashboard/parent/invitations', 
      icon: <Plus className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/invitations'
    },
    { 
      label: 'Mes Enfants', 
      href: '/dashboard/parent/enfants', 
      icon: <Users className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/enfants'
    },
    { 
      label: 'Réserver un cours', 
      href: '/dashboard/parent/reserver', 
      icon: <Calendar className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/reserver'
    },
    { 
      label: 'Notifications', 
      href: '/dashboard/parent/notifications', 
      icon: <Bell className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/notifications'
    },
    { 
      label: 'Messages', 
      href: '/dashboard/parent/messages', 
      icon: <MessageSquare className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/messages'
    },
    { 
      label: 'Statistiques', 
      href: '/dashboard/parent/statistiques', 
      icon: <BarChart3 className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/statistiques'
    },
    { 
      label: 'Profil', 
      href: '/dashboard/parent/profil', 
      icon: <User className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/profil'
    },
    { 
      label: 'Paramètres', 
      href: '/dashboard/parent/parametres', 
      icon: <Settings className="h-5 w-5 shrink-0 text-white" />,
      active: pathname === '/dashboard/parent/parametres'
    },
    // La déconnexion doit passer par une action JS pour effacer l'état côté client
  ]

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-laha-black">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLinkWithActive key={idx} link={link} />
                ))}
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' })
                    } finally {
                      // Forcer un rechargement dur pour éviter tout état fantôme
                      window.location.href = '/login'
                    }
                  }}
                  className="flex items-center justify-start gap-2 py-2 px-3 rounded-lg text-white hover:bg-white/10 text-left"
                >
                  <LogOut className="h-5 w-5 shrink-0 text-white" />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Mon profil',
                  href: '/dashboard/parent/profil',
                  icon: (
                    <img src="/placeholder.svg?height=50&width=50&text=P" className="h-7 w-7 shrink-0 rounded-full" width={50} height={50} alt="Avatar" />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

interface SidebarLinkWithActiveProps {
  link: {
    label: string
    href: string
    icon: React.ReactNode
    active: boolean
  }
}

function SidebarLinkWithActive({ link }: SidebarLinkWithActiveProps) {
  return (
    <Link
      href={link.href}
      className={`flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-lg transition-colors ${
        link.active 
          ? 'bg-laha-gold/20 text-laha-gold border border-laha-gold/30' 
          : 'text-white hover:bg-white/10'
      }`}
    >
      {link.icon}
      <span className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre !p-0 !m-0">
        {link.label}
      </span>
    </Link>
  )
}

const Logo = () => (
  <Link href="/dashboard/parent" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    <span className="font-medium whitespace-pre text-white font-heading">Lahacademia</span>
  </Link>
)

const LogoIcon = () => (
  <Link href="/dashboard/parent" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
  </Link>
)
