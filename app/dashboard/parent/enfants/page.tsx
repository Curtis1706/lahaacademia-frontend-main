"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
import { IconBrandTabler, IconUsers, IconBell, IconMessage, IconCalendar, IconHeart, IconChartBar, IconUserBolt, IconSettings, IconArrowLeft, IconPlus, IconUser, IconClock, IconTrendingUp } from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'

interface Child {
  id: string
  user: {
    first_name: string
    last_name: string
    email: string
  }
  current_grade: string
  school_level: string
  study_time_total: number
  courses_completed: number
  average_score: number
  last_activity: string
  is_blocked: boolean
  blocked_until?: string
  blocked_reason?: string
}

export default function ParentChildrenPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  const links = [
    { label: 'Tableau de bord', href: '/dashboard/parent', icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Invitations', href: '/dashboard/parent/invitations', icon: <IconPlus className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Enfants', href: '/dashboard/parent/enfants', icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Réserver un cours', href: '/dashboard/parent/reserver', icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Notifications', href: '#', icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Messages', href: '#', icon: <IconMessage className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Statistiques', href: '#', icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Profil', href: '#', icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Paramètres', href: '#', icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Déconnexion', href: '/', icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" /> },
  ]

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/parents/children', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setChildren(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Erreur lors du chargement des enfants:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChildren() }, [])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  const formatLastActivity = (dateString: string) => {
    if (!dateString) return 'Jamais'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR')
  }

  return (
    <AuthGuard requiredRole="parent">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black">
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
                    href: '#',
                    icon: (
                      <img src="/placeholder.svg?height=50&width=50&text=P" className="h-7 w-7 shrink-0 rounded-full" width={50} height={50} alt="Avatar" />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>

          <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Mes Enfants</h1>
              <p className="text-laha-gold-light/70">Gérez les profils de vos enfants et suivez leur progression.</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : children.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <IconUsers className="h-16 w-16 text-laha-gold/50 mb-4" />
                <h2 className="text-xl font-semibold text-laha-gold-light mb-2">Aucun enfant lié</h2>
                <p className="text-laha-gold-light/60 mb-6">Vous n'avez pas encore d'enfants associés à votre compte.</p>
                <a href="/dashboard/parent/invitations" className="inline-flex items-center gap-2 px-4 py-2 bg-laha-gold text-laha-black rounded-lg hover:bg-laha-gold/90 font-medium">
                  <IconPlus className="h-4 w-4" />
                  Inviter un enfant
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {children.map((child) => (
                  <div key={child.id} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/40 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-laha-gold/20 rounded-full flex items-center justify-center">
                          <IconUser className="h-6 w-6 text-laha-gold" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-laha-gold-light">
                            {child.user.first_name} {child.user.last_name}
                          </h3>
                          <p className="text-sm text-laha-gold-light/60">{child.current_grade}</p>
                        </div>
                      </div>
                      {child.is_blocked && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Bloqué
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-laha-gold-light/70">Temps d'étude total</span>
                        <span className="text-laha-gold-light font-medium">
                          {formatTime(child.study_time_total || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-laha-gold-light/70">Cours complétés</span>
                        <span className="text-laha-gold-light font-medium">
                          {child.courses_completed || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-laha-gold-light/70">Note moyenne</span>
                        <span className="text-laha-gold-light font-medium">
                          {child.average_score ? `${child.average_score.toFixed(1)}/20` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-laha-gold-light/70">Dernière activité</span>
                        <span className="text-laha-gold-light font-medium">
                          {formatLastActivity(child.last_activity)}
                        </span>
                      </div>
                    </div>

                    {child.is_blocked && child.blocked_reason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm">{child.blocked_reason}</p>
                        {child.blocked_until && (
                          <p className="text-red-400/70 text-xs mt-1">
                            Jusqu'à {new Date(child.blocked_until).toLocaleString('fr-FR')}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <a 
                        href={`/dashboard/parent/reserver?child_id=${child.id}`}
                        className="flex-1 px-3 py-2 bg-laha-gold/20 text-laha-gold text-sm rounded-lg hover:bg-laha-gold/30 transition-colors text-center"
                      >
                        Réserver un cours
                      </a>
                      <a
                        href={`/dashboard/parent/enfants/${child.id}/settings`}
                        className="px-3 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <IconSettings className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    <span className="font-medium whitespace-pre text-white font-heading">Lahacademia</span>
  </a>
)

const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
  </a>
)