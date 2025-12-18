"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  Download,
  Filter,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  CreditCard,
  DollarSign,
} from "lucide-react"
import logger from "@/lib/logger"

interface Payment {
  id: string
  transaction_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  payment_type: "subscription" | "course" | "stage"
  payment_method: string
  description: string
  created_at: string
  completed_at?: string
}

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  },
  completed: {
    label: "Complété",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  failed: {
    label: "Échoué",
    icon: XCircle,
    className: "bg-red-500/10 text-red-700 border-red-500/20",
  },
}

const paymentTypeLabels = {
  subscription: "Abonnement",
  course: "Cours",
  stage: "Stage",
}

export default function PaymentsHistoryPage() {
  return (
    <AuthGuard>
      <PaymentsHistoryContent />
    </AuthGuard>
  )
}

function PaymentsHistoryContent() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    fetchPayments()
  }, [filterStatus, filterType])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (filterType !== "all") params.append("payment_type", filterType)

      const response = await fetch(`/api/payments/history?${params.toString()}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement de l'historique")
      }

      const data = await response.json()
      setPayments(data.results || data || [])

      // Calculer les stats
      const allPayments = data.results || data || []
      setStats({
        total: allPayments.length,
        completed: allPayments.filter((p: Payment) => p.status === "completed").length,
        pending: allPayments.filter((p: Payment) => p.status === "pending").length,
        failed: allPayments.filter((p: Payment) => p.status === "failed").length,
        totalAmount: allPayments
          .filter((p: Payment) => p.status === "completed")
          .reduce((sum: number, p: Payment) => sum + p.amount, 0),
      })
    } catch (error) {
      logger.error("Error fetching payment history", error as Error, { context: "PaymentsHistoryPage" })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    try {
      logger.info("Exporting payment history", {}, { context: "PaymentsHistoryPage" })
      
      // Générer le CSV
      const headers = ['Date', 'Type', 'Montant', 'Statut', 'Méthode', 'Référence']
      const csvRows = [headers.join(',')]
      
      payments.forEach(payment => {
        const row = [
          new Date(payment.created_at).toLocaleDateString('fr-FR'),
          payment.payment_type || 'N/A',
          `${payment.amount} FCFA`,
          payment.status || 'N/A',
          payment.method || 'N/A',
          payment.transaction_id || payment.reference || 'N/A'
        ]
        csvRows.push(row.join(','))
      })
      
      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `historique-paiements-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      logger.info("Payment history exported successfully", {}, { context: "PaymentsHistoryPage" })
    } catch (error) {
      logger.error("Error exporting payment history", error as Error, { context: "PaymentsHistoryPage" })
      alert('Erreur lors de l\'export')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-laha-gold mb-2">Historique des paiements</h1>
              <p className="text-laha-text-secondary">
                Consultez tous vos paiements et transactions
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchPayments} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-500" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Complétés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Échoués
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-laha-gold" />
                Total payé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-laha-gold">
                {stats.totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-laha-text-secondary">XOF</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="completed">Complétés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="failed">Échoués</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="subscription">Abonnements</SelectItem>
                    <SelectItem value="course">Cours</SelectItem>
                    <SelectItem value="stage">Stages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des paiements */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des transactions</CardTitle>
            <CardDescription>
              {payments.length} transaction{payments.length > 1 ? "s" : ""} trouvée{payments.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 text-laha-text-secondary">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune transaction trouvée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => {
                      const StatusIcon = statusConfig[payment.status].icon
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                            <br />
                            <span className="text-xs text-laha-text-secondary">
                              {new Date(payment.created_at).toLocaleTimeString("fr-FR")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-laha-surface/20 px-2 py-1 rounded">
                              {payment.transaction_id.substring(0, 12)}...
                            </code>
                          </TableCell>
                          <TableCell>{payment.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {paymentTypeLabels[payment.payment_type]}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{payment.payment_method}</TableCell>
                          <TableCell className="font-semibold">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[payment.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[payment.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


