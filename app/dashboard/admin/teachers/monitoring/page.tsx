"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Loader2,
  AlertCircle,
  XCircle,
  CheckCircle,
  ShieldAlert
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import logger from '@/lib/logger'

interface TeacherAtRisk {
  id: string
  first_name: string
  last_name: string
  email: string
  photo_url?: string
  
  // Métriques
  total_bookings: number
  completed: number
  cancelled_by_teacher: number
  cancelled_by_student: number
  cancellation_rate: number
  last_minute_cancellations: number
  average_rating: number
  
  // Alertes
  alert_level: 'safe' | 'warning' | 'danger' | 'critical'
  warnings_issued: number
  last_warning_date?: string
  
  // Status
  status: string
  is_suspended: boolean
}

export default function TeacherMonitoringPage() {
  const [teachers, setTeachers] = useState<TeacherAtRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherAtRisk | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [issuing, setIssuing] = useState(false)
  const { toast } = useToast()

  // Filtres
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('cancellation_rate')
  const [open, setOpen] = useState(false)

  // Formulaire d'avertissement
  const [warningForm, setWarningForm] = useState({
    warning_type: 'cancellation_rate',
    severity: 'medium',
    message: '',
    action_taken: 'warning'
  })

  useEffect(() => {
    fetchAtRiskTeachers()
  }, [filterRisk, sortBy])

  const fetchAtRiskTeachers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterRisk !== 'all') params.append('risk_level', filterRisk)
      params.append('sort_by', sortBy)

      const response = await fetch(`/api/admin/teachers/at-risk?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setTeachers(data.results || data)
    } catch (error) {
      logger.error('Error fetching at-risk teachers', error as Error, { 
        context: 'TeacherMonitoringPage' 
      })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les données',
      })
    } finally {
      setLoading(false)
    }
  }

  const openTeacherDetails = async (teacher: TeacherAtRisk) => {
    setSelectedTeacher(teacher)
    setDialogOpen(true)
  }

  const openWarningDialog = (teacher: TeacherAtRisk) => {
    setSelectedTeacher(teacher)
    setWarningForm({
      warning_type: 'cancellation_rate',
      severity: teacher.alert_level === 'critical' ? 'high' : 
                teacher.alert_level === 'danger' ? 'medium' : 'low',
      message: '',
      action_taken: teacher.alert_level === 'critical' ? 'temporary_suspension' : 'warning'
    })
    setWarningDialogOpen(true)
  }

  const issueWarning = async () => {
    if (!selectedTeacher) return

    try {
      setIssuing(true)
      const response = await fetch(`/api/admin/teachers/${selectedTeacher.id}/warnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(warningForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'émission de l\'avertissement')
      }

      toast({
        title: '✅ Avertissement émis',
        description: `L'enseignant a été notifié de l'avertissement`,
      })

      setWarningDialogOpen(false)
      fetchAtRiskTeachers()
    } catch (error) {
      logger.error('Error issuing warning', error as Error, { context: 'TeacherMonitoringPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible d\'émettre l\'avertissement',
      })
    } finally {
      setIssuing(false)
    }
  }

  const getAlertBadge = (level: string) => {
    const config: Record<string, { variant: any; icon: React.ReactNode; label: string }> = {
      safe: { variant: 'success', icon: <CheckCircle className="h-3 w-3 mr-1" />, label: 'Normal' },
      warning: { variant: 'secondary', icon: <AlertCircle className="h-3 w-3 mr-1" />, label: 'Attention' },
      danger: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3 mr-1" />, label: 'Danger' },
      critical: { variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" />, label: 'Critique' },
    }
    const cfg = config[level] || config.safe
    return (
      <Badge variant={cfg.variant as any} className="flex items-center w-fit">
        {cfg.icon}
        {cfg.label}
      </Badge>
    )
  }

  const stats = {
    total: teachers.length,
    safe: teachers.filter(t => t.alert_level === 'safe').length,
    warning: teachers.filter(t => t.alert_level === 'warning').length,
    danger: teachers.filter(t => t.alert_level === 'danger').length,
    critical: teachers.filter(t => t.alert_level === 'critical').length,
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
                  <ShieldAlert className="h-8 w-8 text-orange-500" />
                  Surveillance des Enseignants
                </h1>
                <p className="text-gray-400 mt-2">
                  Détection automatique des comportements à risque (annulations fréquentes)
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Total</CardDescription>
                    <CardTitle className="text-2xl text-white">{stats.total}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Normaux</CardDescription>
                    <CardTitle className="text-2xl text-green-500">{stats.safe}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-yellow-500/30">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Attention</CardDescription>
                    <CardTitle className="text-2xl text-yellow-500">{stats.warning}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-orange-500/30">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Danger</CardDescription>
                    <CardTitle className="text-2xl text-orange-500">{stats.danger}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="bg-gray-900 border-red-500/30">
                  <CardHeader className="pb-3">
                    <CardDescription className="text-gray-400">Critique</CardDescription>
                    <CardTitle className="text-2xl text-red-500">{stats.critical}</CardTitle>
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
                      <Label className="text-gray-300">Niveau de risque</Label>
                      <Select value={filterRisk} onValueChange={setFilterRisk}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                          <SelectItem value="danger">Danger</SelectItem>
                          <SelectItem value="warning">Attention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Trier par</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cancellation_rate">Taux d'annulation</SelectItem>
                          <SelectItem value="last_minute_cancellations">Annulations dernière minute</SelectItem>
                          <SelectItem value="warnings_issued">Avertissements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={fetchAtRiskTeachers} className="w-full" variant="outline">
                        Actualiser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des enseignants */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
                </div>
              ) : teachers.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun enseignant à surveiller</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {teachers.map((teacher) => (
                    <Card key={teacher.id} className="bg-gray-900 border-gray-800 hover:border-laha-blue transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            {/* Header */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-lg font-semibold text-white">
                                {teacher.first_name} {teacher.last_name}
                              </h3>
                              {getAlertBadge(teacher.alert_level)}
                              {teacher.is_suspended && (
                                <Badge variant="destructive">Suspendu</Badge>
                              )}
                              {teacher.warnings_issued > 0 && (
                                <Badge variant="outline" className="text-orange-500">
                                  {teacher.warnings_issued} avertissement(s)
                                </Badge>
                              )}
                            </div>

                            {/* Métriques */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Taux d'annulation :</span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`font-bold ${
                                    teacher.cancellation_rate >= 25 ? 'text-red-500' :
                                    teacher.cancellation_rate >= 15 ? 'text-orange-500' :
                                    'text-green-500'
                                  }`}>
                                    {teacher.cancellation_rate}%
                                  </span>
                                  {teacher.cancellation_rate >= 15 ? (
                                    <TrendingUp className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Dernière minute :</span>
                                <div className="font-bold text-white mt-1">
                                  {teacher.last_minute_cancellations}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Cours complétés :</span>
                                <div className="font-bold text-white mt-1">
                                  {teacher.completed}/{teacher.total_bookings}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-400">Note moyenne :</span>
                                <div className="font-bold text-white mt-1">
                                  {teacher.average_rating.toFixed(1)}/5
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openTeacherDetails(teacher)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                            {teacher.alert_level !== 'safe' && !teacher.is_suspended && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openWarningDialog(teacher)}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Avertir
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

      {/* Dialog Avertissement */}
      <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Émettre un avertissement
            </DialogTitle>
            <DialogDescription>
              {selectedTeacher && (
                <>Avertir <strong>{selectedTeacher.first_name} {selectedTeacher.last_name}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedTeacher && (
            <div className="space-y-4 mt-4">
              {/* Type d'avertissement */}
              <div>
                <Label>Type d'avertissement</Label>
                <Select
                  value={warningForm.warning_type}
                  onValueChange={(value) => setWarningForm(prev => ({ ...prev, warning_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cancellation_rate">Taux d'annulation élevé</SelectItem>
                    <SelectItem value="late_cancellations">Annulations de dernière minute</SelectItem>
                    <SelectItem value="quality">Qualité des cours</SelectItem>
                    <SelectItem value="behavior">Comportement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gravité */}
              <div>
                <Label>Gravité</Label>
                <Select
                  value={warningForm.severity}
                  onValueChange={(value) => setWarningForm(prev => ({ ...prev, severity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action */}
              <div>
                <Label>Action</Label>
                <Select
                  value={warningForm.action_taken}
                  onValueChange={(value) => setWarningForm(prev => ({ ...prev, action_taken: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Avertissement simple</SelectItem>
                    <SelectItem value="temporary_suspension">Suspension temporaire (7 jours)</SelectItem>
                    <SelectItem value="permanent_ban">Bannissement permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label>Message à l'enseignant</Label>
                <Textarea
                  placeholder="Expliquez la raison de l'avertissement..."
                  value={warningForm.message}
                  onChange={(e) => setWarningForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Statistiques actuelles */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Statistiques actuelles :</p>
                <ul className="text-sm space-y-1">
                  <li>• Taux d'annulation : <strong>{selectedTeacher.cancellation_rate}%</strong></li>
                  <li>• Annulations dernière minute : <strong>{selectedTeacher.last_minute_cancellations}</strong></li>
                  <li>• Avertissements précédents : <strong>{selectedTeacher.warnings_issued}</strong></li>
                </ul>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setWarningDialogOpen(false)}
                  disabled={issuing}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={issueWarning}
                  disabled={issuing || !warningForm.message}
                  className="flex-1"
                >
                  {issuing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    'Émettre l\'avertissement'
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

