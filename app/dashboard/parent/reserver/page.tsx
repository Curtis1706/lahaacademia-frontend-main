"use client"

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AuthGuard } from '@/components/auth-guard'
import { useAuth } from '@/hooks/use-auth'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
import { IconArrowLeft, IconBell, IconCalendar, IconChartBar, IconHeart, IconSettings, IconUserBolt, IconUsers, IconBrandTabler, IconMessage, IconPlus } from '@tabler/icons-react'

type TeacherItem = {
  id: number
  user: { first_name: string; last_name: string; email: string }
  subjects?: string[]
}

type ChildItem = {
  id: number
  user: { first_name: string; last_name: string; email: string }
  school_level?: string
  school_name?: string
}

export default function ParentReservePage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)
  
  // Récupérer l'ID de l'enfant depuis l'URL si présent
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const childId = urlParams.get('child_id')
    if (childId) {
      setStudentId(childId)
    }
  }, [])

  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [teacherId, setTeacherId] = useState<string>('')
  const [children, setChildren] = useState<ChildItem[]>([])
  const [studentId, setStudentId] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [isSubmitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [availability, setAvailability] = useState<Record<string, Array<{ start: string; end: string }>> | null>(null)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/teachers/list', { cache: 'no-store' })
        
        if (!res.ok) {
          console.error('Failed to fetch teachers:', res.status)
          setTeachers([])
          return
        }
        
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON')
          setTeachers([])
          return
        }
        
        const text = await res.text()
        if (!text.trim()) {
          console.error('Empty response')
          setTeachers([])
          return
        }
        
        const data = JSON.parse(text)
        setTeachers(Array.isArray(data) ? data : [])
        
      } catch (error) {
        console.error('Error fetching teachers:', error)
        setTeachers([])
      }
    }
    
    fetchTeachers()
  }, [])

  useEffect(() => {
    // Récupérer l'ID de l'enfant depuis l'URL si présent
    const urlParams = new URLSearchParams(window.location.search)
    const preSelectedStudent = urlParams.get('student')
    
    ;(async () => {
      try {
        const res = await fetch('/api/parents/me', { cache: 'no-store' })
        const data = await res.json()
        const kids = Array.isArray(data?.children) ? data.children : []
        setChildren(kids)
        
        if (preSelectedStudent && kids.find((k: any) => k.id === parseInt(preSelectedStudent))) {
          setStudentId(preSelectedStudent)
        } else if (kids.length > 0) {
          setStudentId(String(kids[0].id))
        }
      } catch (_) {
        setChildren([])
      }
    })()
  }, [])

  const selectedTeacher = useMemo(() => teachers.find(t => String(t.id) === teacherId), [teachers, teacherId])

  useEffect(() => {
    if (!teacherId) {
      setAvailability(null)
      return
    }
    ;(async () => {
      try {
        const res = await fetch(`/api/teachers/${teacherId}/availability`, { cache: 'no-store' })
        const data = await res.json()
        setAvailability(data?.availability || null)
      } catch (_) {
        setAvailability(null)
      }
    })()
  }, [teacherId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      const startIso = new Date(`${date}T${start}:00`).toISOString()
      const endIso = new Date(`${date}T${end}:00`).toISOString()
      const body: any = {
        teacher_id: teacherId,
        start_time: startIso,
        end_time: endIso,
      }
      if (user?.role === 'parent') body.student_id = studentId || undefined
      const res = await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Réservation impossible')
      setMessage('Réservation confirmée')
    } catch (err: any) {
      setMessage(err?.message || 'Erreur')
    } finally {
      setSubmitting(false)
    }
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
    { label: 'Mes Alertes', href: '#', icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
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

          <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Réserver un cours</h1>
              <p className="text-laha-gold-light/70">Choisissez un professeur, une date et un créneau.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche: formulaire */}
              <form onSubmit={submit} className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 space-y-5">
                {user?.role === 'parent' && (
                  <div>
                    <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                      Sélectionner un enfant
                    </label>
                    {children.length === 0 ? (
                      <div className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <IconUsers className="h-8 w-8 text-laha-gold/50" />
                          <p className="text-laha-gold-light/60 text-sm">Aucun enfant associé</p>
                          <a
                            href="/dashboard/parent/invitations"
                            className="inline-flex items-center gap-1 text-xs text-laha-gold hover:text-laha-gold-light transition-colors"
                          >
                            <IconPlus className="h-3 w-3" />
                            Inviter un enfant
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={studentId}
                          onChange={e => setStudentId(e.target.value)}
                          className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 focus:border-laha-gold/60 focus:ring-2 focus:ring-laha-gold/20 p-4 text-laha-gold-light outline-none appearance-none cursor-pointer transition-all hover:border-laha-gold/40"
                          style={{
                            colorScheme: 'dark',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          }}
                        >
                          <option value="" className="bg-laha-black text-laha-gold" disabled>
                            Choisir un enfant...
                          </option>
                          {children.map(c => (
                            <option 
                              key={c.id} 
                              value={c.id}
                              className="bg-laha-black text-laha-gold-light py-2"
                            >
                              {c.user.first_name} {c.user.last_name}{c.school_level ? ` • ${c.school_level}` : ''}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg className="h-5 w-5 text-laha-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Affichage des détails de l'enfant sélectionné */}
                    {studentId && children.find(c => c.id.toString() === studentId) && (
                      <div className="mt-3 p-4 bg-laha-gold/10 border border-laha-gold/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-laha-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-laha-gold font-semibold text-sm">
                              {children.find(c => c.id.toString() === studentId)?.user.first_name.charAt(0)}
                              {children.find(c => c.id.toString() === studentId)?.user.last_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-laha-gold font-medium">
                              {children.find(c => c.id.toString() === studentId)?.user.first_name} {children.find(c => c.id.toString() === studentId)?.user.last_name}
                            </p>
                            <p className="text-laha-gold-light/70 text-sm">
                              {children.find(c => c.id.toString() === studentId)?.school_level || 'Niveau non spécifié'}
                              {children.find(c => c.id.toString() === studentId)?.school_name && 
                                ` • ${children.find(c => c.id.toString() === studentId)?.school_name}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-laha-gold-light/80 mb-1">Professeur</label>
                  <select
                    value={teacherId}
                    onChange={e => setTeacherId(e.target.value)}
                    className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none"
                  >
                    <option value="">Choisir…</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.user.first_name} {t.user.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-laha-gold-light/80 mb-1">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-laha-gold-light/80 mb-1">Début</label>
                    <input
                      type="time"
                      value={start}
                      onChange={e => setStart(e.target.value)}
                      className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-laha-gold-light/80 mb-1">Fin</label>
                    <input
                      type="time"
                      value={end}
                      onChange={e => setEnd(e.target.value)}
                      className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isSubmitting || !teacherId || !date || !start || !end}
                    className="px-5 py-3 rounded bg-laha-gold text-laha-black font-medium hover:bg-laha-gold/90 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Réservation…' : 'Confirmer la réservation'}
                  </button>
                </div>

                {message && (
                  <div className="mt-2 text-sm text-laha-gold-light/80">
                    {message}
                  </div>
                )}
              </form>

              {/* Colonne droite: résumé + disponibilités */}
              <div className="space-y-6">
                <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
                  <h2 className="text-lg font-semibold text-laha-gold-light mb-4">Résumé</h2>
                  <div className="space-y-3 text-sm text-laha-gold-light/80">
                    <div>
                      <span className="text-laha-gold-light/60">Professeur: </span>
                      <span>{selectedTeacher ? `${selectedTeacher.user.first_name} ${selectedTeacher.user.last_name}` : '—'}</span>
                    </div>
                    <div>
                      <span className="text-laha-gold-light/60">Date: </span>
                      <span>{date || '—'}</span>
                    </div>
                    <div>
                      <span className="text-laha-gold-light/60">Début: </span>
                      <span>{start || '—'}</span>
                    </div>
                    <div>
                      <span className="text-laha-gold-light/60">Fin: </span>
                      <span>{end || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
                  <h2 className="text-lg font-semibold text-laha-gold-light mb-2">Disponibilités</h2>
                  {!teacherId && (
                    <p className="text-sm text-laha-gold-light/60">Choisissez d’abord un professeur pour voir ses créneaux.</p>
                  )}
                  {teacherId && !availability && (
                    <p className="text-sm text-laha-gold-light/60">Chargement des disponibilités…</p>
                  )}
                  {availability && (
                    <div className="space-y-3 text-sm">
                      {Object.entries(availability).map(([day, slots]) => (
                        <div key={day}>
                          <p className="text-laha-gold-light/70 mb-1 capitalize">{day}</p>
                          {slots.length === 0 ? (
                            <p className="text-laha-gold-light/50">—</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {slots.map((s, i) => (
                                <button
                                  key={`${day}-${i}`}
                                  type="button"
                                  onClick={() => {
                                    // si on clique un slot, préremplir la date du jour sélectionné si elle correspond au prochain jour de ce nom, sinon laisser l’heure
                                    setStart(s.start)
                                    setEnd(s.end)
                                  }}
                                  className="px-2 py-1 rounded bg-laha-gold/20 text-laha-gold hover:bg-laha-gold/30"
                                >
                                  {s.start} - {s.end}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

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













