"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { AlertTriangle, CheckCircle, Clock, Eye, Loader2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import logger from '@/lib/logger'

interface Report {
  id: string
  teacher_id: string
  teacher_name: string
  reporter_id: string
  reporter_name: string
  reporter_role: 'student' | 'parent'
  booking_id?: string
  incident_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  evidence: string[]
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  admin_notes?: string
  created_at: string
  updated_at: string
  resolution_date?: string
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [resolving, setResolving] = useState(false)
  const { toast } = useToast()

  // Filtres
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [open, setOpen] = useState(false)

  // Formulaire de résolution
  const [resolutionForm, setResolutionForm] = useState({
    admin_notes: '',
    resolution: 'resolved',
    action_taken: ''
  })

  useEffect(() => {
    fetchReports()
  }, [filterStatus, filterSeverity])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterSeverity !== 'all') params.append('severity', filterSeverity)

      const response = await fetch(`/api/reports?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des signalements')
      }

      setReports(data.results || data)
    } catch (error) {
      logger.error('Error fetching reports', error as Error, { context: 'AdminReportsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les signalements',
      })
    } finally {
      setLoading(false)
    }
  }

  const openReportDialog = (report: Report) => {
    setSelectedReport(report)
    setResolutionForm({
      admin_notes: report.admin_notes || '',
      resolution: report.status === 'resolved' ? 'resolved' : 'resolved',
      action_taken: ''
    })
    setDialogOpen(true)
  }

  const handleResolve = async () => {
    if (!selectedReport) return

    try {
      setResolving(true)
      const response = await fetch(`/api/reports/${selectedReport.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resolutionForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la résolution')
      }

      toast({
        title: '✅ Signalement résolu',
        description: 'Le signalement a été marqué comme résolu',
      })

      setDialogOpen(false)
      fetchReports()
    } catch (error) {
      logger.error('Error resolving report', error as Error, { context: 'AdminReportsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de résoudre le signalement',
      })
    } finally {
      setResolving(false)
    }
  }

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour')
      }

      toast({
        title: 'Statut mis à jour',
        description: `Le signalement est maintenant : ${getStatusLabel(newStatus)}`,
      })

      fetchReports()
    } catch (error) {
      logger.error('Error updating report status', error as Error, { context: 'AdminReportsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: React.ReactNode }> = {
      pending: { variant: 'secondary', icon: <Clock className="h-3 w-3 mr-1" /> },
      investigating: { variant: 'default', icon: <Eye className="h-3 w-3 mr-1" /> },
      resolved: { variant: 'success', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      dismissed: { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" /> },
    }
    const config = variants[status] || variants.pending
    return (
      <Badge variant={config.variant as any} className="flex items-center w-fit">
        {config.icon}
        {getStatusLabel(status)}
      </Badge>
    )
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      investigating: 'En investigation',
      resolved: 'Résolu',
      dismissed: 'Rejeté'
    }
    return labels[status] || status
  }

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    const labels: Record<string, string> = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[severity]}`}>
        {labels[severity]}
      </span>
    )
  }

  const getIncidentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      absence: 'Absence',
      late: 'Retard',
      behavior: 'Comportement',
      content: 'Contenu',
      quality: 'Qualité',
      technical: 'Technique',
      other: 'Autre'
    }
    return labels[type] || type
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
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                  Signalements d'Incidents
                </h1>
                <p className="text-gray-400 mt-2">
                  Gérez les signalements des parents et élèves concernant les enseignants
                </p>
              </div>

              {/* Stats rapides */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'En attente', count: reports.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
                  { label: 'En cours', count: reports.filter(r => r.status === 'investigating').length, color: 'bg-blue-500' },
                  { label: 'Résolus', count: reports.filter(r => r.status === 'resolved').length, color: 'bg-green-500' },
                  { label: 'Total', count: reports.length, color: 'bg-gray-500' },
                ].map((stat, index) => (
                  <Card key={index} className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-gray-400">{stat.label}</CardDescription>
                      <CardTitle className="text-3xl text-white">{stat.count}</CardTitle>
                    </CardHeader>
                    <div className={`h-1 ${stat.color}`} />
                  </Card>
                ))}
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
                          <SelectItem value="investigating">En investigation</SelectItem>
                          <SelectItem value="resolved">Résolus</SelectItem>
                          <SelectItem value="dismissed">Rejetés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Gravité</Label>
                      <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="low">Faible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={fetchReports} className="w-full" variant="outline">
                        Actualiser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des signalements */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
                </div>
              ) : reports.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <AlertTriangle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun signalement trouvé</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <Card key={report.id} className="bg-gray-900 border-gray-800 hover:border-laha-blue transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                              {getSeverityBadge(report.severity)}
                              {getStatusBadge(report.status)}
                              <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                                {getIncidentTypeLabel(report.incident_type)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(report.created_at).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Infos */}
                            <div className="text-sm space-y-1">
                              <p className="text-white">
                                <strong>Enseignant :</strong> {report.teacher_name || `ID ${report.teacher_id}`}
                              </p>
                              <p className="text-gray-400">
                                <strong>Signalé par :</strong> {report.reporter_name} ({report.reporter_role === 'parent' ? 'Parent' : 'Élève'})
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm line-clamp-2">
                              {report.description}
                            </p>

                            {report.evidence && report.evidence.length > 0 && (
                              <p className="text-xs text-laha-blue">
                                📎 {report.evidence.length} preuve(s) jointe(s)
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReportDialog(report)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </Button>
                            {report.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateReportStatus(report.id, 'investigating')}
                              >
                                Traiter
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

      {/* Dialog de détails et résolution */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du signalement</DialogTitle>
            <DialogDescription>
              Signalement #{selectedReport?.id?.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-4">
              {/* Infos principales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Enseignant</Label>
                  <p className="font-medium">{selectedReport.teacher_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Signalé par</Label>
                  <p className="font-medium">
                    {selectedReport.reporter_name} ({selectedReport.reporter_role === 'parent' ? 'Parent' : 'Élève'})
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p>{getIncidentTypeLabel(selectedReport.incident_type)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gravité</Label>
                  <div className="mt-1">{getSeverityBadge(selectedReport.severity)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Statut</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="text-sm">
                    {new Date(selectedReport.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="mt-1 text-sm bg-muted p-3 rounded">
                  {selectedReport.description}
                </p>
              </div>

              {/* Preuves */}
              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Preuves ({selectedReport.evidence.length})</Label>
                  <div className="mt-1 space-y-1">
                    {selectedReport.evidence.map((file, index) => (
                      <div key={index} className="text-sm bg-muted p-2 rounded">
                        📎 {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire de résolution */}
              {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                <>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Résoudre le signalement</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="action_taken">Action entreprise</Label>
                        <Textarea
                          id="action_taken"
                          placeholder="Décrivez les actions entreprises..."
                          value={resolutionForm.action_taken}
                          onChange={(e) => setResolutionForm(prev => ({ ...prev, action_taken: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="admin_notes">Notes administratives</Label>
                        <Textarea
                          id="admin_notes"
                          placeholder="Notes internes..."
                          value={resolutionForm.admin_notes}
                          onChange={(e) => setResolutionForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => updateReportStatus(selectedReport.id, 'dismissed')}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                    <Button
                      onClick={handleResolve}
                      disabled={resolving}
                      className="flex-1"
                    >
                      {resolving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Résolution...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marquer comme résolu
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}

              {/* Infos de résolution si déjà résolu */}
              {(selectedReport.status === 'resolved' || selectedReport.status === 'dismissed') && selectedReport.admin_notes && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <Label className="text-xs text-muted-foreground">Notes de résolution</Label>
                  <p className="mt-1 text-sm">{selectedReport.admin_notes}</p>
                  {selectedReport.resolution_date && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Résolu le {new Date(selectedReport.resolution_date).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}

