"use client"

import { useState } from 'react'
import { StudentSidebar } from '@/components/student/student-sidebar'

export default function StudentLinkParentPage() {
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

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
    <StudentSidebar>
      <div className="p-6 bg-laha-background min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">
              Liens Parentaux
            </h1>
            <p className="text-laha-text-secondary">
              Connectez votre compte à celui de vos parents pour un suivi partagé.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de liaison */}
            <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border">
              <h2 className="text-xl font-semibold text-laha-text mb-4">
                Lier votre compte
              </h2>
              
              <form onSubmit={validateCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-laha-text-secondary mb-2">
                    Code d'invitation parent
                  </label>
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Entrez le code reçu de vos parents"
                    className="w-full px-4 py-3 bg-laha-background border border-laha-border rounded-lg text-laha-text placeholder-laha-text-secondary focus:outline-none focus:ring-2 focus:ring-laha-gold focus:border-transparent"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-laha-gold hover:bg-laha-gold-warm text-laha-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Validation...' : 'Valider le code'}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm">
                    ✅ Compte lié avec succès ! Vos parents peuvent maintenant suivre votre progression.
                  </p>
                </div>
              )}

              {toast && (
                <div className="fixed top-4 right-4 bg-laha-gold text-laha-black px-4 py-2 rounded-lg shadow-lg z-50">
                  {toast}
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border">
                <h3 className="text-lg font-semibold text-laha-text mb-3">
                  Comment ça marche ?
                </h3>
                <ul className="space-y-2 text-laha-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-laha-gold">1.</span>
                    Demandez à vos parents de créer un compte parent
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laha-gold">2.</span>
                    Ils recevront un code d'invitation unique
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laha-gold">3.</span>
                    Entrez ce code ici pour lier les comptes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-laha-gold">4.</span>
                    Vos parents pourront suivre votre progression
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md rounded-xl p-6 border border-laha-border">
                <h3 className="text-lg font-semibold text-laha-text mb-3">
                  Avantages du lien parental
                </h3>
                <ul className="space-y-2 text-laha-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="text-laha-gold">📊</span>
                    Suivi de votre progression en temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-laha-gold">📈</span>
                    Rapports de performance détaillés
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-laha-gold">💬</span>
                    Communication facilitée avec les enseignants
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-laha-gold">🎯</span>
                    Objectifs d'apprentissage partagés
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentSidebar>
  )
}