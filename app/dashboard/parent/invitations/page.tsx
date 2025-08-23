"use client"

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/auth-guard'
import { ParentSidebar } from '@/components/parent-sidebar'

export default function ParentInvitationsPage() {
  const [childEmail, setChildEmail] = useState('')
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string>('')

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
      <ParentSidebar>
        <div className="h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">Invitations Parent → Enfant</h1>
            <p className="text-slate-600 dark:text-slate-400">Invitez votre enfant à lier son compte à votre profil.</p>
          </div>

          <form onSubmit={createInvitation} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 max-w-xl mb-8">
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-1">Email de l'enfant</label>
              <input 
                type="email" 
                value={childEmail} 
                onChange={e => setChildEmail(e.target.value)} 
                className="w-full rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500 p-3 text-slate-800 dark:text-slate-100 outline-none" 
                placeholder="ex: eleve@example.com" 
              />
            </div>
            <button 
              disabled={loading || !childEmail} 
              className="px-5 py-3 rounded-lg bg-slate-800 dark:bg-slate-700 text-white font-medium hover:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Création…' : 'Générer une invitation'}
            </button>
          </form>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Invitations émises</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {invitations.length === 0 && <p>Aucune invitation</p>}
              {invitations.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <div>
                    <p className="text-slate-800 dark:text-slate-100">Code: <span className="text-slate-600 dark:text-slate-400 font-mono">{inv.code}</span></p>
                    <p className="text-slate-600 dark:text-slate-400">Email: {inv.child_email} • Statut: {inv.status === 'pending' ? 'En attente' : inv.status}</p>
                  </div>
                  {inv.status === 'student_accepted' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={async () => {
                          const res = await fetch(`/api/parents/invitations/${inv.id}/approve/`, { method: 'POST' })
                          const data = await res.json().catch(() => ({}))
                          if (res.ok) {
                            setToast(data?.message || "Il est maintenant considéré comme votre enfant sur Lahacadémia")
                            setInvitations(prev => prev.filter(i => i.id !== inv.id))
                          } else {
                            setToast(data?.error || 'Une erreur est survenue lors de l\'approbation')
                          }
                        }} 
                        className="px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        Approuver
                      </button>
                      <button 
                        onClick={async () => {
                          const res = await fetch(`/api/parents/invitations/${inv.id}/reject/`, { method: 'POST' })
                          const data = await res.json().catch(() => ({}))
                          if (res.ok) {
                            setToast(data?.message || 'Invitation rejetée')
                            setInvitations(prev => prev.filter(i => i.id !== inv.id))
                          } else {
                            setToast(data?.error || 'Une erreur est survenue lors du rejet')
                          }
                        }} 
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {toast && <p className="mt-3 text-slate-600 dark:text-slate-400">{toast}</p>}
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}


