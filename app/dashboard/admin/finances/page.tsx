"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Download, 
  Calendar,
  CreditCard,
  UserCheck,
  UserX,
  RefreshCcw
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import logger from "@/lib/logger"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

interface FinancialOverview {
  total_revenue: number
  monthly_revenue: number
  yearly_revenue: number
  revenue_growth: number
  total_transactions: number
  pending_payments: number
}

interface RevenueByService {
  service: string
  revenue: number
  percentage: number
  transactions_count: number
}

interface UsersStats {
  total_users: number
  paying_users: number
  trial_users: number
  active_users: number
  conversion_rate: number
  churn_rate: number
}

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#F0E68C', '#EEE8AA']

export default function AdminFinancesPage() {
  const [overview, setOverview] = useState<FinancialOverview | null>(null)
  const [revenueByService, setRevenueByService] = useState<RevenueByService[]>([])
  const [usersStats, setUsersStats] = useState<UsersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('monthly')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString())

  useEffect(() => {
    loadFinancialData()
  }, [period, year, month])

  const loadFinancialData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [overviewRes, revenueRes, usersRes] = await Promise.all([
        fetch('/api/admin/finances/overview', { credentials: 'include' }),
        fetch(`/api/admin/finances/revenue-by-service?period=${period}&year=${year}&month=${month}`, { credentials: 'include' }),
        fetch('/api/admin/finances/users-stats', { credentials: 'include' })
      ])

      if (overviewRes.ok) {
        const data = await overviewRes.json()
        setOverview(data)
      } else {
        logger.error('Failed to load overview', new Error('API error'), { context: 'admin/finances' })
      }

      if (revenueRes.ok) {
        const data = await revenueRes.json()
        setRevenueByService(data.services || data || [])
      } else {
        logger.error('Failed to load revenue by service', new Error('API error'), { context: 'admin/finances' })
      }

      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsersStats(data)
      } else {
        logger.error('Failed to load users stats', new Error('API error'), { context: 'admin/finances' })
      }
    } catch (err) {
      logger.error('Error loading financial data', err as Error, { context: 'admin/finances' })
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      logger.info('Exporting financial data', { format }, { context: 'admin/finances' })
      
      const response = await fetch(
        `/api/admin/finances/export?format=${format}&period=${period}&year=${year}&month=${month}`,
        { credentials: 'include' }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `finances-${year}-${month}.${format === 'excel' ? 'xlsx' : 'csv'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        logger.info('Export successful', { format }, { context: 'admin/finances' })
      } else {
        logger.error('Export failed', new Error('API error'), { context: 'admin/finances' })
        alert('Erreur lors de l\'export')
      }
    } catch (error) {
      logger.error('Error exporting', error as Error, { context: 'admin/finances' })
      alert('Erreur lors de l\'export')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
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
                    Dashboard Financier
                  </h1>
                  <p className="text-laha-text-secondary">
                    Suivi des revenus et performances financières
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={loadFinancialData}
                    disabled={loading}
                    variant="outline"
                    className="border-laha-gold text-laha-gold hover:bg-laha-gold/10"
                  >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Button
                    onClick={() => handleExport('csv')}
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Période Selector */}
            <div className="mb-6 flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm text-laha-text-secondary mb-2 block">Période</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="bg-laha-surface border-laha-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="yearly">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm text-laha-text-secondary mb-2 block">Année</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-laha-surface border-laha-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {period === 'monthly' && (
                <div className="flex-1">
                  <label className="text-sm text-laha-text-secondary mb-2 block">Mois</label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="bg-laha-surface border-laha-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                      ].map((m, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Revenu Total</p>
                      <p className="text-2xl font-bold text-laha-gold">
                        {loading ? '...' : formatCurrency(overview?.total_revenue || 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-laha-gold/20 rounded-full">
                      <DollarSign className="h-6 w-6 text-laha-gold" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-green-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Croissance</p>
                      <p className="text-2xl font-bold text-green-500">
                        {loading ? '...' : `+${overview?.revenue_growth || 0}%`}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-blue-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Transactions</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {loading ? '...' : overview?.total_transactions || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-purple-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Utilisateurs Payants</p>
                      <p className="text-2xl font-bold text-purple-500">
                        {loading ? '...' : usersStats?.paying_users || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <UserCheck className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue by Service - Bar Chart */}
              <Card className="bg-laha-surface/80 border border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-gold">Revenus par Service</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                      Chargement...
                    </div>
                  ) : revenueByService.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                      Aucune donnée disponible
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueByService}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="service" stroke="#D4AF37" />
                        <YAxis stroke="#D4AF37" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                          formatter={(value: any) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#D4AF37" name="Revenu" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Revenue by Service - Pie Chart */}
              <Card className="bg-laha-surface/80 border border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-gold">Répartition des Revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                      Chargement...
                    </div>
                  ) : revenueByService.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                      Aucune donnée disponible
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={revenueByService}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.service}: ${entry.percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {revenueByService.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                          formatter={(value: any) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Users Stats Table */}
            <Card className="bg-laha-surface/80 border border-laha-border">
              <CardHeader>
                <CardTitle className="text-laha-gold">Statistiques Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center text-laha-text-secondary py-8">
                    Chargement...
                  </div>
                ) : !usersStats ? (
                  <div className="text-center text-laha-text-secondary py-8">
                    Aucune donnée disponible
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-laha-gold" />
                        <p className="text-sm text-laha-text-secondary">Total Utilisateurs</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.total_users}</p>
                    </div>
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <UserCheck className="h-5 w-5 text-green-500" />
                        <p className="text-sm text-laha-text-secondary">Utilisateurs Actifs</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.active_users}</p>
                    </div>
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <p className="text-sm text-laha-text-secondary">Taux de Conversion</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.conversion_rate}%</p>
                    </div>
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="h-5 w-5 text-purple-500" />
                        <p className="text-sm text-laha-text-secondary">Utilisateurs Payants</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.paying_users}</p>
                    </div>
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-yellow-500" />
                        <p className="text-sm text-laha-text-secondary">Utilisateurs Essai</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.trial_users}</p>
                    </div>
                    <div className="p-4 bg-laha-black-light/20 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <UserX className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-laha-text-secondary">Taux de Désabonnement</p>
                      </div>
                      <p className="text-2xl font-bold text-laha-text">{usersStats.churn_rate}%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}

