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
import { DollarSign, TrendingUp, Clock, CheckCircle, Loader2, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import TeacherSidebar from '@/components/teacher/teacher-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import logger from '@/lib/logger'

interface Earning {
  id: string
  booking_id: string
  course_title: string
  gross_amount: number
  commission_rate: number
  commission_amount: number
  net_amount: number
  status: 'pending' | 'ready' | 'paid' | 'disputed'
  payment_date?: string
  payment_method?: string
  created_at: string
}

interface EarningsSummary {
  total_earnings: number
  pending_amount: number
  paid_amount: number
  ready_to_pay: number
  this_month: number
  this_week: number
}

export default function TeacherEarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<string>('month')
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchEarnings()
  }, [period])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teachers/earnings?period=${period}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setEarnings(data.earnings || data.results || [])
      setSummary(data.summary || null)
    } catch (error) {
      logger.error('Error fetching earnings', error as Error, { context: 'TeacherEarningsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les revenus',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string; icon: React.ReactNode }> = {
      pending: { variant: 'secondary', label: 'En attente', icon: <Clock className="h-3 w-3 mr-1" /> },
      ready: { variant: 'default', label: 'Prêt à payer', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      paid: { variant: 'success', label: 'Payé', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      disputed: { variant: 'destructive', label: 'Litige', icon: <Clock className="h-3 w-3 mr-1" /> },
    }
    const cfg = config[status] || config.pending
    return (
      <Badge variant={cfg.variant as any} className="flex items-center w-fit">
        {cfg.icon}
        {cfg.label}
      </Badge>
    )
  }

  return (
    <AuthGuard requiredRole="teacher">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <TeacherSidebar open={open} setOpen={setOpen} />
          
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    Mes Revenus
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Suivez vos revenus et paiements
                  </p>
                </div>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                    <SelectItem value="all">Tout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-gray-400">Total gagné</CardDescription>
                      <CardTitle className="text-2xl text-white">
                        {summary.total_earnings.toLocaleString()} FCFA
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-gray-900 border-yellow-500/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-gray-400">En attente</CardDescription>
                      <CardTitle className="text-2xl text-yellow-500">
                        {summary.pending_amount.toLocaleString()} FCFA
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-gray-900 border-green-500/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-gray-400">Prêt à payer</CardDescription>
                      <CardTitle className="text-2xl text-green-500">
                        {summary.ready_to_pay.toLocaleString()} FCFA
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-gray-900 border-blue-500/30">
                    <CardHeader className="pb-3">
                      <CardDescription className="text-gray-400">Déjà payé</CardDescription>
                      <CardTitle className="text-2xl text-blue-500">
                        {summary.paid_amount.toLocaleString()} FCFA
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              )}

              {/* Liste des revenus */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
                </div>
              ) : earnings.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="py-12 text-center">
                    <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Aucun revenu pour cette période</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Historique des revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {earnings.map((earning) => (
                        <div
                          key={earning.id}
                          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-white">{earning.course_title}</h3>
                              {getStatusBadge(earning.status)}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Montant brut :</span>
                                <div className="font-semibold text-white">{earning.gross_amount.toLocaleString()} FCFA</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Commission ({earning.commission_rate}%) :</span>
                                <div className="font-semibold text-laha-blue">{earning.commission_amount.toLocaleString()} FCFA</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Net :</span>
                                <div className="font-semibold text-green-500">{earning.net_amount.toLocaleString()} FCFA</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Date :</span>
                                <div className="text-white">
                                  {new Date(earning.created_at).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </div>
                            {earning.payment_date && (
                              <p className="text-xs text-gray-500 mt-2">
                                Payé le {new Date(earning.payment_date).toLocaleDateString('fr-FR')} via {earning.payment_method}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

