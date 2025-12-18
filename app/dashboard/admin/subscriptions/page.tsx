"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  RefreshCcw,
  Plus,
  MoreVertical
} from "lucide-react"
import logger from "@/lib/logger"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Subscription {
  id: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  plan: {
    id: string
    name: string
    price: number
    duration_days: number
  }
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  start_date: string
  end_date: string
  auto_renew: boolean
  payment_method?: string
  created_at: string
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    action: 'activate' | 'cancel' | 'extend' | null
    subscription: Subscription | null
  }>({
    open: false,
    action: null,
    subscription: null
  })
  const [extendDays, setExtendDays] = useState('30')

  useEffect(() => {
    loadSubscriptions()
  }, [statusFilter, searchQuery])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/admin/subscriptions?${params.toString()}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.results || data.subscriptions || data || [])
      } else {
        const error = await response.json()
        setError(error.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      logger.error('Error loading subscriptions', err as Error, { context: 'admin/subscriptions' })
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!actionDialog.action || !actionDialog.subscription) return

    try {
      setLoading(true)
      const { action, subscription } = actionDialog

      let endpoint = ''
      let body = {}

      switch (action) {
        case 'activate':
          endpoint = `/api/admin/subscriptions/${subscription.id}/activate`
          break
        case 'cancel':
          endpoint = `/api/admin/subscriptions/${subscription.id}/cancel`
          body = { reason: 'Annulation administrative' }
          break
        case 'extend':
          endpoint = `/api/admin/subscriptions/${subscription.id}/extend`
          body = { days: parseInt(extendDays) }
          break
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok || response.status === 204) {
        logger.info(`Subscription ${action} successful`, { subscriptionId: subscription.id }, { context: 'admin/subscriptions' })
        await loadSubscriptions()
        setActionDialog({ open: false, action: null, subscription: null })
        alert(`Abonnement ${action === 'activate' ? 'activé' : action === 'cancel' ? 'annulé' : 'prolongé'} avec succès`)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'action')
      }
    } catch (error) {
      logger.error('Error performing action', error as Error, { context: 'admin/subscriptions' })
      alert(error instanceof Error ? error.message : 'Erreur lors de l\'action')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Actif', className: 'bg-green-500/20 text-green-500' },
      expired: { label: 'Expiré', className: 'bg-red-500/20 text-red-500' },
      cancelled: { label: 'Annulé', className: 'bg-gray-500/20 text-gray-500' },
      pending: { label: 'En attente', className: 'bg-yellow-500/20 text-yellow-500' }
    }
    const { label, className } = config[status as keyof typeof config] || config.pending
    return <Badge className={className}>{label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto bg-laha-surface">
          <div className="w-full px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">
                    Gestion des Abonnements
                  </h1>
                  <p className="text-laha-text-secondary">
                    Gérez les abonnements des utilisateurs
                  </p>
                </div>
                <Button
                  onClick={loadSubscriptions}
                  disabled={loading}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Total</p>
                      <p className="text-2xl font-bold text-laha-gold">{stats.total}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-laha-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-green-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Actifs</p>
                      <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-red-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Expirés</p>
                      <p className="text-2xl font-bold text-red-500">{stats.expired}</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-gray-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Annulés</p>
                      <p className="text-2xl font-bold text-gray-500">{stats.cancelled}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-laha-surface/80 border border-laha-border mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                      <Input
                        placeholder="Rechercher par email ou nom..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-laha-black-light/20 border-laha-border"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-laha-black-light/20 border-laha-border">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actifs</SelectItem>
                      <SelectItem value="expired">Expirés</SelectItem>
                      <SelectItem value="cancelled">Annulés</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-laha-surface/80 border border-laha-border">
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center text-laha-text-secondary py-12">
                    Chargement...
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center text-laha-text-secondary py-12">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun abonnement trouvé</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-laha-border hover:bg-laha-black-light/20">
                        <TableHead className="text-laha-text">Utilisateur</TableHead>
                        <TableHead className="text-laha-text">Plan</TableHead>
                        <TableHead className="text-laha-text">Statut</TableHead>
                        <TableHead className="text-laha-text">Date début</TableHead>
                        <TableHead className="text-laha-text">Date fin</TableHead>
                        <TableHead className="text-laha-text">Auto-renouvellement</TableHead>
                        <TableHead className="text-laha-text">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((subscription) => (
                        <TableRow key={subscription.id} className="border-laha-border hover:bg-laha-black-light/20">
                          <TableCell className="text-laha-text">
                            <div>
                              <p className="font-medium">
                                {subscription.user.first_name} {subscription.user.last_name}
                              </p>
                              <p className="text-xs text-laha-text-secondary">
                                {subscription.user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-laha-text">
                            <div>
                              <p className="font-medium">{subscription.plan.name}</p>
                              <p className="text-xs text-laha-text-secondary">
                                {formatCurrency(subscription.plan.price)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(subscription.status)}
                          </TableCell>
                          <TableCell className="text-laha-text text-sm">
                            {formatDate(subscription.start_date)}
                          </TableCell>
                          <TableCell className="text-laha-text text-sm">
                            {formatDate(subscription.end_date)}
                          </TableCell>
                          <TableCell>
                            {subscription.auto_renew ? (
                              <Badge className="bg-green-500/20 text-green-500">Oui</Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-500">Non</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-laha-surface border-laha-border">
                                {subscription.status !== 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => setActionDialog({ open: true, action: 'activate', subscription })}
                                    className="text-laha-text hover:bg-laha-black-light/20"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Activer
                                  </DropdownMenuItem>
                                )}
                                {subscription.status === 'active' && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => setActionDialog({ open: true, action: 'extend', subscription })}
                                      className="text-laha-text hover:bg-laha-black-light/20"
                                    >
                                      <Calendar className="h-4 w-4 mr-2 text-laha-gold" />
                                      Prolonger
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setActionDialog({ open: true, action: 'cancel', subscription })}
                                      className="text-laha-text hover:bg-laha-black-light/20"
                                    >
                                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                      Annuler
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </AdminSidebar>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, action: null, subscription: null })}>
        <DialogContent className="bg-laha-surface border-laha-border">
          <DialogHeader>
            <DialogTitle className="text-laha-gold">
              {actionDialog.action === 'activate' && 'Activer l\'abonnement'}
              {actionDialog.action === 'cancel' && 'Annuler l\'abonnement'}
              {actionDialog.action === 'extend' && 'Prolonger l\'abonnement'}
            </DialogTitle>
            <DialogDescription className="text-laha-text-secondary">
              {actionDialog.action === 'activate' && 'Confirmer l\'activation de cet abonnement ?'}
              {actionDialog.action === 'cancel' && 'Confirmer l\'annulation de cet abonnement ? Cette action est irréversible.'}
              {actionDialog.action === 'extend' && 'Choisissez le nombre de jours de prolongation'}
            </DialogDescription>
          </DialogHeader>
          {actionDialog.action === 'extend' && (
            <div className="py-4">
              <label className="text-sm text-laha-text mb-2 block">Nombre de jours</label>
              <Input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
                min="1"
                className="bg-laha-black-light/20 border-laha-border"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, action: null, subscription: null })}
              className="border-laha-border"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={loading}
              className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}

