"use client"

import { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from '@/components/ui/sidebar'
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
} from '@tabler/icons-react'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { AuthGuard } from '@/components/auth-guard'

export default function StudentLinkParentPage() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(true)
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const links = [
    { label: 'Tableau de bord', href: '/dashboard/student', icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Cours', href: '#', icon: <IconBook className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Vidéos', href: '#', icon: <IconVideo className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Ouvrages', href: '#', icon: <IconBook2 className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Entraînements', href: '#', icon: <IconBarbell className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Réservation de cours', href: '#', icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mon Enseignant IA', href: '#', icon: <IconRobot className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Favoris', href: '#', icon: <IconHeart className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Alertes', href: '#', icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Planning', href: '#', icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Mes Notes', href: '#', icon: <IconTrophy className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Communauté', href: '#', icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Statistiques', href: '#', icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Liens parentals', href: '/dashboard/student/link-parent', icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Profil', href: '#', icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Paramètres', href: '#', icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
    { label: 'Déconnexion', href: '#', icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />, onClick: logout },
  ]

  const validateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/students/link-parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: invitationCode }),
      })
      
      // Vérifier d'abord si la réponse est OK
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Erreur serveur:', errorText)
        setError(`Erreur ${res.status}: Code invalide ou expiré`)
        return
      }
      
      // Essayer de parser le JSON seulement si la réponse est OK
      let data
      try {
        const responseText = await res.text()
        if (responseText.trim()) {
          data = JSON.parse(responseText)
        } else {
          data = { message: 'Liaison réussie' }
        }
      } catch (jsonError) {
        console.error('Erreur parsing JSON:', jsonError)
        setError('Réponse serveur invalide')
        return
      }
      
      if (data.error) {
        setError(data.error)
      } else {
        setSuccess(true)
        setToast('Compte lié avec succès au parent !')
      }
      
    } catch (err) {
      console.error('Erreur réseau:', err)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requiredRole="student">
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
                <SidebarLink link={{ label: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(), href: '#', icon: <img src="/placeholder.svg?height=50&width=50&text=S" className="h-7 w-7 shrink-0 rounded-full" width={50} height={50} alt="Avatar" /> }} />
              </div>
            </SidebarBody>
          </Sidebar>
          <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Lier mon compte à un parent</h1>
              <p className="text-laha-gold-light/70">Entrez le code d'invitation que vous avez reçu.</p>
            </div>
            <form onSubmit={validateCode} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 space-y-4 max-w-xl">
              <div>
                <label className="block text-sm text-laha-gold-light/80 mb-1">Code d'invitation</label>
                <input value={invitationCode} onChange={e => setInvitationCode(e.target.value)} className="w-full rounded bg-white/10 border border-white/10 focus:border-laha-gold/60 p-3 text-white outline-none" placeholder="ex: A1B2C3D4" />
              </div>
              <button disabled={loading || !invitationCode} className="px-5 py-3 rounded bg-laha-gold text-laha-black font-medium hover:bg-laha-gold/90 disabled:opacity-50">{loading ? 'Validation…' : 'Valider le code'}</button>
              {error && <p className="text-laha-gold-light/80">{error}</p>}
              {success && <p className="text-laha-gold-light/80">{toast}</p>}
            </form>
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



