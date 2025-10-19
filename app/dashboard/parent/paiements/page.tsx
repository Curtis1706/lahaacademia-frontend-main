"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  DollarSign,
  CreditCard,
  Banknote,
  Receipt,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Lock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import Image from "next/image"
import Link from "next/link"

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "mobile"
  name: string
  details: string
  is_default: boolean
  is_verified: boolean
  expiry_date?: string
}

interface Transaction {
  id: string
  amount: number
  currency: string
  type: "payment" | "refund" | "credit"
  status: "completed" | "pending" | "failed" | "cancelled"
  description: string
  child_name: string
  course_title: string
  teacher_name: string
  payment_method: string
  transaction_date: string
  due_date?: string
  reference: string
  fees: number
  net_amount: number
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: "paid" | "pending" | "overdue" | "cancelled"
  due_date: string
  paid_date?: string
  child_name: string
  course_title: string
  teacher_name: string
  items: {
    description: string
    quantity: number
    unit_price: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  payment_method?: string
  created_at: string
}

interface PaymentSummary {
  total_spent: number
  monthly_spent: number
  pending_payments: number
  upcoming_payments: number
  active_subscriptions: number
  average_monthly_cost: number
}

export default function ParentPaymentsPage() {
  const { user } = useAuth()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")

  // Données de test
  useEffect(() => {
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: "1",
        type: "card",
        name: "Carte Visa",
        details: "**** **** **** 1234",
        is_default: true,
        is_verified: true,
        expiry_date: "12/26"
      },
      {
        id: "2",
        type: "bank",
        name: "Compte bancaire",
        details: "IBAN: SN08 00100 1234567890123456",
        is_default: false,
        is_verified: true
      },
      {
        id: "3",
        type: "mobile",
        name: "Orange Money",
        details: "+221 77 123 45 67",
        is_default: false,
        is_verified: false
      }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: "1",
        amount: 15000,
        currency: "FCFA",
        type: "payment",
        status: "completed",
        description: "Paiement cours Mathématiques",
        child_name: "Fatou Diallo",
        course_title: "Mathématiques Terminale S - Algèbre",
        teacher_name: "Dr. Aminata Diallo",
        payment_method: "Carte Visa",
        transaction_date: "2025-01-20",
        reference: "TXN-2025-001",
        fees: 150,
        net_amount: 14850
      },
      {
        id: "2",
        amount: 20000,
        currency: "FCFA",
        type: "payment",
        status: "completed",
        description: "Paiement cours Physique",
        child_name: "Fatou Diallo",
        course_title: "Physique Quantique - Introduction",
        teacher_name: "Prof. Jean-Baptiste",
        payment_method: "Carte Visa",
        transaction_date: "2025-01-18",
        reference: "TXN-2025-002",
        fees: 200,
        net_amount: 19800
      },
      {
        id: "3",
        amount: 12000,
        currency: "FCFA",
        type: "payment",
        status: "pending",
        description: "Paiement cours Français",
        child_name: "Amadou Traoré",
        course_title: "Français - Techniques de Dissertation",
        teacher_name: "Dr. Fatou Ndiaye",
        payment_method: "Orange Money",
        transaction_date: "2025-01-25",
        reference: "TXN-2025-003",
        fees: 120,
        net_amount: 11880
      },
      {
        id: "4",
        amount: 5000,
        currency: "FCFA",
        type: "refund",
        status: "completed",
        description: "Remboursement cours annulé",
        child_name: "Fatou Diallo",
        course_title: "Cours d'essai",
        teacher_name: "Dr. Aminata Diallo",
        payment_method: "Carte Visa",
        transaction_date: "2025-01-15",
        reference: "TXN-2025-004",
        fees: 0,
        net_amount: 5000
      }
    ]

    const mockInvoices: Invoice[] = [
      {
        id: "1",
        invoice_number: "INV-2025-001",
        amount: 15000,
        currency: "FCFA",
        status: "paid",
        due_date: "2025-01-20",
        paid_date: "2025-01-20",
        child_name: "Fatou Diallo",
        course_title: "Mathématiques Terminale S - Algèbre",
        teacher_name: "Dr. Aminata Diallo",
        items: [
          {
            description: "Cours Mathématiques - Janvier 2025",
            quantity: 1,
            unit_price: 15000,
            total: 15000
          }
        ],
        subtotal: 15000,
        tax: 0,
        total: 15000,
        payment_method: "Carte Visa",
        created_at: "2025-01-15"
      },
      {
        id: "2",
        invoice_number: "INV-2025-002",
        amount: 20000,
        currency: "FCFA",
        status: "paid",
        due_date: "2025-01-18",
        paid_date: "2025-01-18",
        child_name: "Fatou Diallo",
        course_title: "Physique Quantique - Introduction",
        teacher_name: "Prof. Jean-Baptiste",
        items: [
          {
            description: "Cours Physique - Janvier 2025",
            quantity: 1,
            unit_price: 20000,
            total: 20000
          }
        ],
        subtotal: 20000,
        tax: 0,
        total: 20000,
        payment_method: "Carte Visa",
        created_at: "2025-01-10"
      },
      {
        id: "3",
        invoice_number: "INV-2025-003",
        amount: 12000,
        currency: "FCFA",
        status: "pending",
        due_date: "2025-01-30",
        child_name: "Amadou Traoré",
        course_title: "Français - Techniques de Dissertation",
        teacher_name: "Dr. Fatou Ndiaye",
        items: [
          {
            description: "Cours Français - Janvier 2025",
            quantity: 1,
            unit_price: 12000,
            total: 12000
          }
        ],
        subtotal: 12000,
        tax: 0,
        total: 12000,
        created_at: "2025-01-22"
      }
    ]

    const mockPaymentSummary: PaymentSummary = {
      total_spent: 52000,
      monthly_spent: 47000,
      pending_payments: 12000,
      upcoming_payments: 25000,
      active_subscriptions: 3,
      average_monthly_cost: 15667
    }
    
    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods)
      setTransactions(mockTransactions)
      setInvoices(mockInvoices)
      setPaymentSummary(mockPaymentSummary)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || transaction.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || invoice.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const formatAmount = (amount: number, currency: string = "FCFA") => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ` ${currency}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      overdue: "bg-red-500/10 text-red-500 border-red-500/20"
    }
    return variants[status as keyof typeof variants] || variants.pending
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: "Terminé",
      paid: "Payé",
      pending: "En attente",
      failed: "Échoué",
      cancelled: "Annulé",
      overdue: "En retard"
    }
    return labels[status as keyof typeof labels] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "bank":
        return <Banknote className="h-4 w-4" />
      case "mobile":
        return <Phone className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/parent/reservations",
      icon: <Calendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Suivi des progrès",
      href: "/dashboard/parent/suivi",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes enfants",
      href: "/dashboard/parent/enfants",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paiements",
      href: "/dashboard/parent/paiements",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Messages",
      href: "/dashboard/parent/messages",
      icon: <Mail className="h-5 w-5 shrink-0 text-white" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="parent">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <AnimatedThemeToggler />
                </div>
                <SidebarLink
                  link={{
                    label: `${user?.first_name} ${user?.last_name}`,
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=KA"
                        className="h-7 w-7 shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-laha-gold mb-2">
                  Paiements et Facturation
                </h1>
                <p className="text-laha-text-secondary">
                  Gérez vos paiements et consultez votre historique financier
                </p>
              </div>

              {/* Payment Summary */}
              {paymentSummary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold/20 rounded-lg">
                          <DollarSign className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-laha-text-secondary text-sm">Total dépensé</p>
                          <p className="text-laha-text text-xl font-bold">{formatAmount(paymentSummary.total_spent)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                          <Calendar className="h-5 w-5 text-laha-gold-warm" />
                        </div>
                        <div>
                          <p className="text-laha-text-secondary text-sm">Ce mois</p>
                          <p className="text-laha-text text-xl font-bold">{formatAmount(paymentSummary.monthly_spent)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                          <Clock className="h-5 w-5 text-laha-gold-soft" />
                        </div>
                        <div>
                          <p className="text-laha-text-secondary text-sm">En attente</p>
                          <p className="text-laha-text text-xl font-bold">{formatAmount(paymentSummary.pending_payments)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold/20 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-laha-text-secondary text-sm">Moyenne mensuelle</p>
                          <p className="text-laha-text text-xl font-bold">{formatAmount(paymentSummary.average_monthly_cost)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="invoices" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Factures
                  </TabsTrigger>
                  <TabsTrigger value="methods" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Moyens de paiement
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Paiements récents */}
                  <Card className="bg-laha-surface/50 border-laha-border">
                    <CardHeader>
                      <CardTitle className="text-laha-text">Paiements récents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.slice(0, 5).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-laha-background/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(transaction.status)}
                              <div>
                                <p className="font-medium text-laha-text">{transaction.description}</p>
                                <p className="text-sm text-laha-text-secondary">
                                  {transaction.child_name} • {transaction.course_title}
                                </p>
                                <p className="text-xs text-laha-text-secondary">
                                  {formatDate(transaction.transaction_date)} • {transaction.reference}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${
                                transaction.type === "refund" ? "text-green-500" : "text-laha-gold"
                              }`}>
                                {transaction.type === "refund" ? "+" : "-"}{formatAmount(transaction.amount)}
                              </p>
                              <Badge className={getStatusBadge(transaction.status)}>
                                {getStatusLabel(transaction.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Factures en attente */}
                  <Card className="bg-laha-surface/50 border-laha-border">
                    <CardHeader>
                      <CardTitle className="text-laha-text">Factures en attente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {invoices.filter(invoice => invoice.status === "pending").map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 bg-laha-background/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <div>
                                <p className="font-medium text-laha-text">{invoice.invoice_number}</p>
                                <p className="text-sm text-laha-text-secondary">
                                  {invoice.child_name} • {invoice.course_title}
                                </p>
                                <p className="text-xs text-laha-text-secondary">
                                  Échéance: {formatDate(invoice.due_date)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-laha-gold">{formatAmount(invoice.amount)}</p>
                                <Badge className={getStatusBadge(invoice.status)}>
                                  {getStatusLabel(invoice.status)}
                                </Badge>
                              </div>
                              <Button size="sm" className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                                Payer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  {/* Filters */}
                  <Card className="bg-laha-surface/50 border-laha-border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                          <Input
                            placeholder="Rechercher une transaction..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-laha-background border-laha-border text-laha-text"
                          />
                        </div>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                        >
                          <option value="">Tous les statuts</option>
                          <option value="completed">Terminé</option>
                          <option value="pending">En attente</option>
                          <option value="failed">Échoué</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                        >
                          <option value="">Toutes les périodes</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois</option>
                          <option value="year">Cette année</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transactions List */}
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <Card key={transaction.id} className="bg-laha-surface/50 border-laha-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(transaction.status)}
                              <div>
                                <h3 className="font-medium text-laha-text">{transaction.description}</h3>
                                <p className="text-sm text-laha-text-secondary">
                                  {transaction.child_name} • {transaction.course_title}
                                </p>
                                <p className="text-xs text-laha-text-secondary">
                                  {formatDate(transaction.transaction_date)} • {transaction.reference}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className={`font-semibold ${
                                  transaction.type === "refund" ? "text-green-500" : "text-laha-gold"
                                }`}>
                                  {transaction.type === "refund" ? "+" : "-"}{formatAmount(transaction.amount)}
                                </p>
                                <p className="text-xs text-laha-text-secondary">
                                  Frais: {formatAmount(transaction.fees)}
                                </p>
                                <Badge className={getStatusBadge(transaction.status)}>
                                  {getStatusLabel(transaction.status)}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="invoices" className="space-y-4">
                  {/* Filters */}
                  <Card className="bg-laha-surface/50 border-laha-border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                          <Input
                            placeholder="Rechercher une facture..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-laha-background border-laha-border text-laha-text"
                          />
                        </div>
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                        >
                          <option value="">Tous les statuts</option>
                          <option value="paid">Payé</option>
                          <option value="pending">En attente</option>
                          <option value="overdue">En retard</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <select
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value)}
                          className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                        >
                          <option value="">Toutes les périodes</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois</option>
                          <option value="year">Cette année</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Invoices List */}
                  <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                      <Card key={invoice.id} className="bg-laha-surface/50 border-laha-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {getStatusIcon(invoice.status)}
                              <div>
                                <h3 className="font-medium text-laha-text">{invoice.invoice_number}</h3>
                                <p className="text-sm text-laha-text-secondary">
                                  {invoice.child_name} • {invoice.course_title}
                                </p>
                                <p className="text-xs text-laha-text-secondary">
                                  Échéance: {formatDate(invoice.due_date)}
                                  {invoice.paid_date && ` • Payé le: ${formatDate(invoice.paid_date)}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-laha-gold">{formatAmount(invoice.amount)}</p>
                                <Badge className={getStatusBadge(invoice.status)}>
                                  {getStatusLabel(invoice.status)}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Download className="h-4 w-4" />
                                </Button>
                                {invoice.status === "pending" && (
                                  <Button size="sm" className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                                    Payer
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="methods" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paymentMethods.map((method) => (
                      <Card key={method.id} className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-laha-text flex items-center gap-2">
                              {getPaymentMethodIcon(method.type)}
                              {method.name}
                            </CardTitle>
                            {method.is_default && (
                              <Badge className="bg-laha-gold/10 text-laha-gold border-laha-gold/20">
                                Par défaut
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm text-laha-text-secondary">Détails</p>
                            <p className="text-laha-text font-mono">{method.details}</p>
                          </div>
                          
                          {method.expiry_date && (
                            <div className="space-y-2">
                              <p className="text-sm text-laha-text-secondary">Expiration</p>
                              <p className="text-laha-text">{method.expiry_date}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {method.is_verified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className={`text-sm ${
                                method.is_verified ? "text-green-500" : "text-yellow-500"
                              }`}>
                                {method.is_verified ? "Vérifié" : "Non vérifié"}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            {!method.is_default && (
                              <Button variant="outline" size="sm" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-laha-surface/50 border-laha-border border-dashed">
                    <CardContent className="p-8 text-center">
                      <Plus className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary opacity-50" />
                      <h3 className="text-lg font-semibold text-laha-text mb-2">Ajouter un moyen de paiement</h3>
                      <p className="text-laha-text-secondary mb-4">
                        Ajoutez une nouvelle carte ou un compte bancaire pour faciliter vos paiements
                      </p>
                      <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <span className="font-medium whitespace-pre text-white font-heading">
        Lahacademia
      </span>
    </a>
  )
}

const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    </a>
  )
}
