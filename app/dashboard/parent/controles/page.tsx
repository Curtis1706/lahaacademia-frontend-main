'use client'
import { useState, useEffect } from 'react'
import { Shield, Clock, Monitor, AlertTriangle, Settings, Save, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

interface Child {
  id: number
  user: {
    first_name: string
    last_name: string
    email: string
  }
  is_blocked: boolean
  blocked_until?: string
  blocked_reason?: string
  allowed_hours_start: string
  allowed_hours_end: string
  screen_time_limit: number
  daily_screen_time: number
  allowed_websites: string[]
  blocked_websites: string[]
}

interface ChildSettings {
  is_blocked?: boolean
  blocked_until?: string
  blocked_reason?: string
  allowed_hours_start?: string
  allowed_hours_end?: string
  screen_time_limit?: number
  allowed_websites?: string[]
  blocked_websites?: string[]
}

interface ComponentProps {
  child: Child
  onUpdate: (settings: ChildSettings) => void
  saving: boolean
}

export default function ControlesParentaux() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/parents/children')
      const data = await res.json()
      setChildren(data)
      if (data.length > 0) setSelectedChild(data[0])
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateChildSettings = async (childId: number, settings: Partial<Child>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/parents/children/${childId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (res.ok) {
        const updatedChild = await res.json()
        setChildren(prev => prev.map(child => 
          child.id === childId ? updatedChild : child
        ))
        setSelectedChild(updatedChild)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const blockChild = async (childId: number, reason: string, duration: number) => {
    const blockedUntil = new Date()
    blockedUntil.setHours(blockedUntil.getHours() + duration)
    
    await updateChildSettings(childId, {
      is_blocked: true,
      blocked_until: blockedUntil.toISOString(),
      blocked_reason: reason
    })
  }

  const unblockChild = async (childId: number) => {
    await updateChildSettings(childId, {
      is_blocked: false,
      blocked_until: undefined,
      blocked_reason: undefined
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-gray-900 to-laha-black p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Contrôles Parentaux</h1>
          <p className="text-white/70">Gérez l'accès et les restrictions de vos enfants</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des enfants */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Mes Enfants</h2>
              <div className="space-y-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedChild?.id === child.id
                        ? 'bg-laha-gold/20 border border-laha-gold/30'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">
                          {child.user.first_name} {child.user.last_name}
                        </p>
                        <p className="text-sm text-white/60">{child.user.email}</p>
                      </div>
                      {child.is_blocked && (
                        <Shield className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contrôles détaillés */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {selectedChild && (
              <div className="space-y-6">
                {/* Statut et actions rapides */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      {selectedChild.user.first_name} {selectedChild.user.last_name}
                    </h3>
                    <div className="flex gap-3">
                      {selectedChild.is_blocked ? (
                        <button
                          onClick={() => unblockChild(selectedChild.id)}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          Débloquer
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => blockChild(selectedChild.id, 'Pause demandée par le parent', 1)}
                            disabled={saving}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            Pause 1h
                          </button>
                          <button
                            onClick={() => blockChild(selectedChild.id, 'Fin de session', 24)}
                            disabled={saving}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            Bloquer 24h
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedChild.is_blocked && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-red-300 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Compte bloqué</span>
                      </div>
                      <p className="text-red-200 text-sm mb-2">{selectedChild.blocked_reason}</p>
                      {selectedChild.blocked_until && (
                        <p className="text-red-200 text-xs">
                          Jusqu'au {new Date(selectedChild.blocked_until).toLocaleString('fr-FR')}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Horaires autorisés */}
                <TimeRestrictionsCard 
                  child={selectedChild}
                  onUpdate={(settings) => updateChildSettings(selectedChild.id, settings)}
                  saving={saving}
                />

                {/* Temps d'écran */}
                <ScreenTimeCard 
                  child={selectedChild}
                  onUpdate={(settings) => updateChildSettings(selectedChild.id, settings)}
                  saving={saving}
                />

                {/* Contrôle de contenu */}
                <ContentControlCard 
                  child={selectedChild}
                  onUpdate={(settings) => updateChildSettings(selectedChild.id, settings)}
                  saving={saving}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Composant pour les restrictions horaires
function TimeRestrictionsCard({ child, onUpdate, saving }: ComponentProps) {
  const [startTime, setStartTime] = useState(child.allowed_hours_start)
  const [endTime, setEndTime] = useState(child.allowed_hours_end)

  const handleSave = () => {
    onUpdate({
      allowed_hours_start: startTime,
      allowed_hours_end: endTime
    })
  }

  return (
    <div className="bg-laha-black-light/50 backdrop-blur-sm rounded-2xl border border-laha-gold-dark/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-laha-gold" />
        <h3 className="text-xl font-semibold text-laha-gold">Restrictions Horaires</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-time" className="text-laha-gold-light">Heure de début</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
            />
          </div>
          <div>
            <Label htmlFor="end-time" className="text-laha-gold-light">Heure de fin</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  )
}

// Composant pour le temps d'écran
function ScreenTimeCard({ child, onUpdate, saving }: ComponentProps) {
  const [screenTimeLimit, setScreenTimeLimit] = useState(child.screen_time_limit)

  const handleSave = () => {
    onUpdate({ screen_time_limit: screenTimeLimit })
  }

  return (
    <div className="bg-laha-black-light/50 backdrop-blur-sm rounded-2xl border border-laha-gold-dark/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Monitor className="h-6 w-6 text-laha-gold" />
        <h3 className="text-xl font-semibold text-laha-gold">Temps d'Écran</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="screen-time" className="text-laha-gold-light">
            Limite quotidienne (minutes)
          </Label>
          <Input
            id="screen-time"
            type="number"
            min="0"
            max="1440"
            value={screenTimeLimit}
            onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
            className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
            placeholder="120"
          />
        </div>

        <div className="bg-laha-black-light/20 rounded-lg p-4">
          <p className="text-sm text-laha-gold-light">
            Temps utilisé aujourd'hui: <span className="font-semibold text-laha-gold">{child.daily_screen_time} min</span>
          </p>
          <div className="w-full bg-laha-black-light/30 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-laha-gold to-laha-gold-warm h-2 rounded-full"
              style={{ width: `${Math.min((child.daily_screen_time / screenTimeLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  )
}

// Composant pour le contrôle de contenu
function ContentControlCard({ child, onUpdate, saving }: ComponentProps) {
  const [allowedSites, setAllowedSites] = useState(child.allowed_websites?.join('\n') || '')
  const [blockedSites, setBlockedSites] = useState(child.blocked_websites?.join('\n') || '')

  const handleSave = () => {
    onUpdate({
      allowed_websites: allowedSites.split('\n').filter((site: string) => site.trim()),
      blocked_websites: blockedSites.split('\n').filter((site: string) => site.trim())
    })
  }

  return (
    <div className="bg-laha-black-light/50 backdrop-blur-sm rounded-2xl border border-laha-gold-dark/30 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-laha-gold" />
        <h3 className="text-xl font-semibold text-laha-gold">Contrôle de Contenu</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="allowed-sites" className="text-laha-gold-light">
            Sites autorisés (un par ligne)
          </Label>
          <Textarea
            id="allowed-sites"
            value={allowedSites}
            onChange={(e) => setAllowedSites(e.target.value)}
            placeholder="youtube.com&#10;wikipedia.org&#10;khanacademy.org"
            className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="blocked-sites" className="text-laha-gold-light">
            Sites bloqués (un par ligne)
          </Label>
          <Textarea
            id="blocked-sites"
            value={blockedSites}
            onChange={(e) => setBlockedSites(e.target.value)}
            placeholder="facebook.com&#10;instagram.com&#10;tiktok.com"
            className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light min-h-[100px]"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>
    </div>
  )
}

