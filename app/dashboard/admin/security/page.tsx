"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  Eye, 
  Loader2,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import logger from '@/lib/logger'

interface SuspiciousUser {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  risk_score: number
  risk_factors: {
    duplicate_email: boolean
    duplicate_phone: boolean
    duplicate_device: boolean
    vpn_detected: boolean
    suspicious_activity: boolean
    previously_banned: boolean
  }
  action: 'allow' | 'review' | 'block'
  status: 'pending' | 'reviewed' | 'banned'
  created_at: string
}

interface BannedUser {
  id: string
  email: string
  phone: string
  first_name: string
  last_name: string
  ban_reason: string
  banned_at: string
  permanent: boolean
  banned_by: string
}

export default function SecurityPage() {
  const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousUser[]>([])
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<SuspiciousUser | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [banning, setBanning] = useState(false)
  const { toast } = useToast()

  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [minScore, setMinScore] = useState<string>('30')
  const [open, setOpen] = useState(false)

  const [banForm, setBanForm] = useState({
    reason: '',
    permanent: false
  })

  useEffect(() => {
    fetchSuspiciousUsers()
    fetchBannedUsers()
  }, [filterStatus, minScore])

  const fetchSuspiciousUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        min_score: minScore,
        status: filterStatus
      })

      const response = await fetch(`/api/admin/security/suspicious-users?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setSuspiciousUsers(data.results || data)
    } catch (error) {
      logger.error('Error fetching suspicious users', error as Error, { context: 'SecurityPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs suspects',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBannedUsers = async () => {
    try {
      const response = await fetch('/api/admin/security/banned-list')
      const data = await response.json()

      if (response.ok) {
        setBannedUsers(data.results || data)
      }
    } catch (error) {
      logger.error('Error fetching banned users', error as Error, { context: 'SecurityPage' })
    }
  }

  const openUserDetails = (user: SuspiciousUser) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const openBanDialog = (user: SuspiciousUser) => {
    setSelectedUser(user)
    setBanForm({ reason: '', permanent: false })
    setBanDialogOpen(true)
  }

  const handleBan = async () => {
    if (!selectedUser) return

    try {
      setBanning(true)
      const response = await fetch('/api/admin/security/ban-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          reason: banForm.reason,
          permanent: banForm.permanent
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du bannissement')
      }

      toast({
        title: '✅ Utilisateur banni',
        description: `L'utilisateur ${selectedUser.email} a été banni`,
      })

      setBanDialogOpen(false)
      fetchSuspiciousUsers()
      fetchBannedUsers()
    } catch (error) {
      logger.error('Error banning user', error as Error, { context: 'SecurityPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de bannir l\'utilisateur',
      })
    } finally {
      setBanning(false)
    }
  }

  const getRiskBadge = (score: number) => {
    if (score >= 70) {
      return <Badge variant="destructive" className="flex items-center w-fit">
        <XCircle className="h-3 w-3 mr-1" />
        Critique ({score}%)
      </Badge>
    } else if (score >= 50) {
      return <Badge variant="destructive" className="flex items-center w-fit bg-orange-500">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Élevé ({score}%)
      </Badge>
    } else if (score >= 30) {
      return <Badge variant="secondary" className="flex items-center w-fit bg-yellow-500">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Moyen ({score}%)
      </Badge>
    } else {
      return <Badge variant="success" className="flex items-center w-fit">
        <CheckCircle className="h-3 w-3 mr-1" />
        Faible ({score}%)
      </Badge>
    }
  }

  const stats = {
    suspicious: suspiciousUsers.length,
    high_risk: suspiciousUsers.filter(u => u.risk_score >= 70).length,
    banned: bannedUsers.length,
    pending: suspiciousUsers.filter(u => u.status === 'pending').length,
  }

  return (
    <AuthGuard requiredRole="admin">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <AdminSidebar open={open} setOpen={setOpen} />
          
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Shield className="h-8 w-8 text-red-500" />
                  Sécurité & Détection Anti-Fraude
                </h1>
                <p className="text-gray-400 mt-2">
                  Surveillez et gérez les risques de fraude et les utilisateurs suspects
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Utilisateurs suspects</CardDescription>
                    <CardTitle className="text-2xl text-white">{stats.suspicious}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-red-500/30">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Risque élevé</CardDescription>
                    <CardTitle className="text-2xl text-red-500">{stats.high_risk}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-orange-500/30">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">En attente</CardDescription>
                    <CardTitle className="text-2xl text-orange-500">{stats.pending}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Bannis</CardDescription>
                    <CardTitle className="text-2xl text-white">{stats.banned}</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Filtres */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Filtres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Statut</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="reviewed">Révisés</SelectItem>
                          <SelectItem value="banned">Bannis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Score minimum</Label>
                      <Select value={minScore} onValueChange={setMinScore}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Tous</SelectItem>
                          <SelectItem value="30">30%+</SelectItem>
                          <SelectItem value="50">50%+</SelectItem>
                          <SelectItem value="70">70%+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={fetchSuspiciousUsers} className="w-full" variant="outline">
                        Actualiser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des utilisateurs suspects */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
                </div>
              ) : suspiciousUsers.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun utilisateur suspect</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {suspiciousUsers.map((user) => (
                    <Card key={user.id} className="bg-gray-900 border-gray-800 hover:border-laha-blue transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-semibold text-white">
                                {user.first_name} {user.last_name}
                              </h3>
                              {getRiskBadge(user.risk_score)}
                              <Badge variant="outline">
                                {user.action === 'block' ? 'Bloqué' : user.action === 'review' ? 'À réviser' : 'Autorisé'}
                              </Badge>
                            </div>

                            <div className="text-sm space-y-1">
                              <p className="text-gray-400">
                                <strong>Email :</strong> {user.email}
                              </p>
                              <p className="text-gray-400">
                                <strong>Téléphone :</strong> {user.phone}
                              </p>
                            </div>

                            {/* Facteurs de risque */}
                            <div className="flex flex-wrap gap-2">
                              {user.risk_factors.duplicate_email && (
                                <Badge variant="destructive" className="text-xs">Email dupliqué</Badge>
                              )}
                              {user.risk_factors.duplicate_phone && (
                                <Badge variant="destructive" className="text-xs">Téléphone dupliqué</Badge>
                              )}
                              {user.risk_factors.duplicate_device && (
                                <Badge variant="destructive" className="text-xs">Appareil dupliqué</Badge>
                              )}
                              {user.risk_factors.vpn_detected && (
                                <Badge variant="secondary" className="text-xs">VPN détecté</Badge>
                              )}
                              {user.risk_factors.previously_banned && (
                                <Badge variant="destructive" className="text-xs">Déjà banni</Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUserDetails(user)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                            {user.risk_score >= 50 && user.status !== 'banned' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openBanDialog(user)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Bannir
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>

      {/* Dialog Bannissement */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Bannir un utilisateur
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Bannir <strong>{selectedUser.email}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Raison du bannissement</Label>
                <Textarea
                  placeholder="Expliquez la raison du bannissement..."
                  value={banForm.reason}
                  onChange={(e) => setBanForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permanent"
                  checked={banForm.permanent}
                  onChange={(e) => setBanForm(prev => ({ ...prev, permanent: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="permanent" className="cursor-pointer">
                  Bannissement permanent
                </Label>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>⚠️ Attention :</strong> Cette action est irréversible si le bannissement est permanent.
                  L'utilisateur ne pourra plus accéder à la plateforme.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setBanDialogOpen(false)}
                  disabled={banning}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleBan}
                  disabled={banning || !banForm.reason}
                  variant="destructive"
                  className="flex-1"
                >
                  {banning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Bannissement...
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Bannir
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}

