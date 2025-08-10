"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
import { IconBrandTabler, IconUsers, IconBell, IconMessage, IconCalendar, IconHeart, IconChartBar, IconUserBolt, IconSettings, IconArrowLeft, IconPlus } from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'

export default function ParentInvitationsPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)
  const [childEmail, setChildEmail] = useState('')
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string>('')

  const links = [
    { label: 'Tableau de bord', href: '/dashboard/parent', icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Invitations', href: '/dashboard/parent/invitations', icon: <IconPlus className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Réserver un cours', href: '/dashboard/parent/reserver', icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Enfants', href: '#', icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Notifications', href: '#', icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Messages', href: '#', icon: <IconMessage className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Statistiques', href: '#', icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Profil', href: '#', icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Paramètres', href: '#', icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Déconnexion', href: '/', icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" /> },
  ]

  const fetchMe = async () => {
    const res = await fetch('/api/parents/me', { cache: 'no-store' })
    const data = await res.json()
    setInvitations(Array.isArray(data?.link_requests) ? data.link_requests : [])
  }

  useEffect(() => { fetchMe() }, [])

  const createInvitation = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/parents/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_email: childEmail }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Erreur')
      setChildEmail('')
      await fetchMe()
    } catch (err) {
      // noop: message UI minimal
    } finally { setLoading(false) }
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
              <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Invitations Parent → Enfant</h1>
              <p className="text-laha-gold-light/70">Invitez votre enfant à lier son compte à votre profil.</p>
            </div>

            <form onSubmit={createInvitation} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 space-y-4 max-w-xl">
              <div>
                <label className="block text-sm text-laha-gold-light/80 mb-1">Email de l'enfant</label>
                <input type="email" value={childEmail} onChange={e => setChildEmail(e.target.value)} className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none" placeholder="ex: eleve@example.com" />
              </div>
              <button disabled={loading || !childEmail} className="px-5 py-3 rounded bg-laha-gold text-laha-black font-medium hover:bg-laha-gold/90 disabled:opacity-50">{loading ? 'Création…' : 'Générer une invitation'}</button>
            </form>

            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4">Invitations émises</h2>
              <div className="space-y-3 text-sm text-laha-gold-light/80">
                {invitations.length === 0 && <p>Aucune invitation</p>}
                {invitations.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between bg-laha-black-light/10 rounded-lg p-3">
                    <div>
                      <p className="text-laha-gold-light">Code: <span className="text-laha-gold">{inv.code}</span></p>
                      <p className="text-laha-gold-light/60">Email: {inv.child_email} • Statut: {inv.status === 'pending' ? 'En attente' : inv.status}</p>
                    </div>
                    {inv.status === 'student_accepted' && (
                      <div className="flex gap-2">
                        <button onClick={async () => {
                          const res = await fetch(`/api/parents/invitations/${inv.id}/approve/`, { method: 'POST' })
                          const data = await res.json().catch(() => ({}))
                          if (res.ok) {
                            setToast(data?.message || "Il est maintenant considéré comme votre enfant sur Lahacadémia")
                            setInvitations(prev => prev.filter(i => i.id !== inv.id))
                          } else {
                            setToast(data?.error || 'Une erreur est survenue lors de l\'approbation')
                          }
                        }} className="px-3 py-1 rounded bg-laha-gold text-laha-black">Approuver</button>
                        <button onClick={async () => {
                          const res = await fetch(`/api/parents/invitations/${inv.id}/reject/`, { method: 'POST' })
                          const data = await res.json().catch(() => ({}))
                          if (res.ok) {
                            setToast(data?.message || 'Invitation rejetée')
                            setInvitations(prev => prev.filter(i => i.id !== inv.id))
                          } else {
                            setToast(data?.error || 'Une erreur est survenue lors du rejet')
                          }
                        }} className="px-3 py-1 rounded bg-white/10 text-white">Rejeter</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {toast && <p className="mt-3 text-laha-gold-light/80">{toast}</p>}
            </div>
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


