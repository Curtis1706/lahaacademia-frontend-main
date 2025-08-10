'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
import { IconBrandTabler, IconUsers, IconBell, IconMessage, IconCalendar, IconHeart, IconChartBar, IconUserBolt, IconSettings, IconArrowLeft, IconPlus, IconEye, IconTrash, IconMail, IconPhone, IconMapPin, IconSchool, IconCalendarEvent } from '@tabler/icons-react'
import Image from 'next/image'

interface Child {
  id: number
  user: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  school_level: string
  school_name?: string
  birth_date?: string
  address?: string
  emergency_contact?: string
  medical_info?: string
  subjects_of_interest: string[]
  learning_goals: string[]
  total_sessions: number
  total_hours: number
  average_rating: number
  created_at: string
}

export default function MesEnfants() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/parents/me')
      const data = await res.json()
      setChildren(data.children || [])
    } catch (error) {
      console.error('Erreur lors du chargement des enfants:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'Non renseigné'
    const today = new Date()
    const birth = new Date(birthDate)
    const age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1
    }
    return age
  }

  const links = [
    { label: 'Tableau de bord', href: '/dashboard/parent', icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Invitations', href: '/dashboard/parent/invitations', icon: <IconPlus className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Enfants', href: '/dashboard/parent/enfants', icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Notifications', href: '#', icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Messages', href: '#', icon: <IconMessage className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Planning', href: '#', icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Réserver un cours', href: '/dashboard/parent/reserver', icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Favoris', href: '#', icon: <IconHeart className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Statistiques', href: '#', icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Profil', href: '#', icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Paramètres', href: '#', icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Déconnexion', href: '/', icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" /> },
  ]

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
                    href: '#',
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

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-laha-gold">Mes Enfants</h1>
                  <p className="text-laha-gold-light/80 mt-2">
                    Gérez les profils de vos enfants et suivez leur progression.
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold"></div>
                  </div>
                ) : children.length === 0 ? (
                  <div className="text-center py-12">
                    <IconUsers className="h-16 w-16 text-laha-gold/50 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Aucun enfant lié</h3>
                    <p className="text-laha-gold-light/60 mb-6">
                      Vous n'avez pas encore d'enfants associés à votre compte.
                    </p>
                    <a
                      href="/dashboard/parent/invitations"
                      className="inline-flex items-center px-4 py-2 bg-laha-gold text-laha-black rounded-lg hover:bg-laha-gold-light transition-colors"
                    >
                      <IconPlus className="h-4 w-4 mr-2" />
                      Inviter un enfant
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/40 transition-all cursor-pointer"
                        onClick={() => setSelectedChild(child)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-laha-gold/20 rounded-full flex items-center justify-center">
                              <span className="text-laha-gold font-semibold text-lg">
                                {child.user.first_name.charAt(0)}{child.user.last_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">
                                {child.user.first_name} {child.user.last_name}
                              </h3>
                              <p className="text-laha-gold-light/60 text-sm">{child.school_level}</p>
                            </div>
                          </div>
                          <IconEye className="h-5 w-5 text-laha-gold/60" />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-laha-gold-light/80">
                            <IconMail className="h-4 w-4 mr-2" />
                            {child.user.email}
                          </div>
                          {child.school_name && (
                            <div className="flex items-center text-laha-gold-light/80">
                              <IconSchool className="h-4 w-4 mr-2" />
                              {child.school_name}
                            </div>
                          )}
                          {child.birth_date && (
                            <div className="flex items-center text-laha-gold-light/80">
                              <IconCalendarEvent className="h-4 w-4 mr-2" />
                              {calculateAge(child.birth_date)} ans
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-laha-gold-dark/20">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-laha-gold font-semibold">{child.total_sessions || 0}</p>
                              <p className="text-laha-gold-light/60 text-xs">Sessions</p>
                            </div>
                            <div>
                              <p className="text-laha-gold font-semibold">{child.total_hours || 0}h</p>
                              <p className="text-laha-gold-light/60 text-xs">Heures</p>
                            </div>
                            <div>
                              <p className="text-laha-gold font-semibold">{(child.average_rating || 0).toFixed(1)}</p>
                              <p className="text-laha-gold-light/60 text-xs">Note</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal de détails de l'enfant */}
                {selectedChild && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-laha-black-light rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-laha-gold-dark/20">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-laha-gold">
                          {selectedChild.user.first_name} {selectedChild.user.last_name}
                        </h2>
                        <button
                          onClick={() => setSelectedChild(null)}
                          className="text-laha-gold-light/60 hover:text-white"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Informations personnelles */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Informations personnelles</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center text-laha-gold-light/80">
                              <IconMail className="h-4 w-4 mr-2" />
                              {selectedChild.user.email}
                            </div>
                            {selectedChild.user.phone && (
                              <div className="flex items-center text-laha-gold-light/80">
                                <IconPhone className="h-4 w-4 mr-2" />
                                {selectedChild.user.phone}
                              </div>
                            )}
                            {selectedChild.birth_date && (
                              <div className="flex items-center text-laha-gold-light/80">
                                <IconCalendarEvent className="h-4 w-4 mr-2" />
                                {calculateAge(selectedChild.birth_date)} ans
                              </div>
                            )}
                            {selectedChild.address && (
                              <div className="flex items-center text-laha-gold-light/80">
                                <IconMapPin className="h-4 w-4 mr-2" />
                                {selectedChild.address}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Informations scolaires */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Informations scolaires</h3>
                          <div className="space-y-2">
                            <p className="text-laha-gold-light/80">
                              <span className="font-medium">Niveau:</span> {selectedChild.school_level}
                            </p>
                            {selectedChild.school_name && (
                              <p className="text-laha-gold-light/80">
                                <span className="font-medium">École:</span> {selectedChild.school_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Matières d'intérêt */}
                        {selectedChild.subjects_of_interest && selectedChild.subjects_of_interest.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Matières d'intérêt</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedChild.subjects_of_interest.map((subject, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-laha-gold/20 text-laha-gold rounded-full text-sm"
                                >
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Statistiques */}
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Statistiques</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-laha-gold/10 rounded-lg">
                              <p className="text-2xl font-bold text-laha-gold">{selectedChild.total_sessions || 0}</p>
                              <p className="text-laha-gold-light/60 text-sm">Sessions totales</p>
                            </div>
                            <div className="text-center p-4 bg-laha-gold/10 rounded-lg">
                              <p className="text-2xl font-bold text-laha-gold">{selectedChild.total_hours || 0}h</p>
                              <p className="text-laha-gold-light/60 text-sm">Heures d'étude</p>
                            </div>
                            <div className="text-center p-4 bg-laha-gold/10 rounded-lg">
                              <p className="text-2xl font-bold text-laha-gold">{(selectedChild.average_rating || 0).toFixed(1)}</p>
                              <p className="text-laha-gold-light/60 text-sm">Note moyenne</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                          <button
                            onClick={() => {
                              setSelectedChild(null)
                              window.location.href = `/dashboard/parent/reserver?student=${selectedChild.id}`
                            }}
                            className="flex-1 bg-laha-gold text-laha-black py-2 px-4 rounded-lg hover:bg-laha-gold-light transition-colors"
                          >
                            Réserver un cours
                          </button>
                          <button
                            onClick={() => setSelectedChild(null)}
                            className="px-4 py-2 border border-laha-gold-dark/40 text-laha-gold-light rounded-lg hover:bg-laha-gold-dark/20 transition-colors"
                          >
                            Fermer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

// Composants Logo
const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <span className="font-medium whitespace-pre text-white font-heading">Lahacademia</span>
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
