"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconCalendar,
  IconTrophy,
  IconUsers,
  IconChartBar,
  IconVideo,
  IconBook2,
  IconBarbell,
  IconCalendarEvent,
  IconRobot,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { Search, Filter, Calendar, Clock, User, BookOpen, CreditCard, CheckCircle, XCircle, AlertCircle, Eye, DollarSign, Star } from "lucide-react"
import Link from "next/link"

// Types pour les réservations
interface Booking {
  id: string
  reference: string
  child_name: string
  child_avatar?: string
  teacher_name: string
  teacher_avatar?: string
  course_title?: string
  subject: string
  level: string
  date: string
  time: string
  duration: number
  price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  special_requirements?: string
  created_at: string
  teacher_rating?: number
  teacher_experience?: string
}

export default function ParentReservationsPage() {
  const { user, logout } = useAuth()
  
  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Mes Enfants",
      href: "/dashboard/parent/enfants",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Mes Réservations",
      href: "/dashboard/parent/reservations",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-slate-400" />,
      isActive: true,
    },
    {
      label: "Invitations",
      href: "/dashboard/parent/invitations",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Notifications",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Messages",
      href: "#",
      icon: <IconBook className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-slate-400" />,
    },
    {
      label: "Déconnexion",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-slate-400" />,
      onClick: logout,
    },
  ]

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  // Données simulées pour les réservations
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      reference: "BK-2024-001",
      child_name: "Curtis Ahtd",
      child_avatar: "/placeholder-user.jpg",
      teacher_name: "Marie Dubois",
      teacher_avatar: "/placeholder-user.jpg",
      course_title: "Mathématiques - Niveau Collège",
      subject: "Mathématiques",
      level: "Collège",
      date: "2024-01-20",
      time: "14:00",
      duration: 60,
      price: 45.00,
      status: 'confirmed',
      payment_status: 'paid',
      special_requirements: "Concentration sur les équations du premier degré",
      created_at: "2024-01-15T10:30:00Z",
      teacher_rating: 4.8,
      teacher_experience: "8 ans"
    },
    {
      id: "2",
      reference: "BK-2024-002",
      child_name: "Curtis Ahtd",
      child_avatar: "/placeholder-user.jpg",
      teacher_name: "Jean Martin",
      teacher_avatar: "/placeholder-user.jpg",
      course_title: "Physique - Niveau Lycée",
      subject: "Physique",
      level: "Lycée",
      date: "2024-01-22",
      time: "16:00",
      duration: 90,
      price: 67.50,
      status: 'pending',
      payment_status: 'pending',
      special_requirements: "Mécanique classique",
      created_at: "2024-01-16T14:15:00Z",
      teacher_rating: 4.6,
      teacher_experience: "5 ans"
    },
    {
      id: "3",
      reference: "BK-2024-003",
      child_name: "Emma Ahtd",
      child_avatar: "/placeholder-user.jpg",
      teacher_name: "Sophie Bernard",
      teacher_avatar: "/placeholder-user.jpg",
      course_title: "Français - Niveau Primaire",
      subject: "Français",
      level: "Primaire",
      date: "2024-01-25",
      time: "10:00",
      duration: 45,
      price: 33.75,
      status: 'confirmed',
      payment_status: 'paid',
      created_at: "2024-01-17T09:45:00Z",
      teacher_rating: 4.9,
      teacher_experience: "12 ans"
    },
    {
      id: "4",
      reference: "BK-2024-004",
      child_name: "Curtis Ahtd",
      child_avatar: "/placeholder-user.jpg",
      teacher_name: "Pierre Durand",
      teacher_avatar: "/placeholder-user.jpg",
      course_title: "Histoire - Niveau Collège",
      subject: "Histoire",
      level: "Collège",
      date: "2024-01-18",
      time: "15:00",
      duration: 60,
      price: 45.00,
      status: 'completed',
      payment_status: 'paid',
      created_at: "2024-01-10T11:20:00Z",
      teacher_rating: 4.7,
      teacher_experience: "6 ans"
    },
    {
      id: "5",
      reference: "BK-2024-005",
      child_name: "Emma Ahtd",
      child_avatar: "/placeholder-user.jpg",
      teacher_name: "Claire Moreau",
      teacher_avatar: "/placeholder-user.jpg",
      course_title: "Anglais - Niveau Primaire",
      subject: "Anglais",
      level: "Primaire",
      date: "2024-01-28",
      time: "11:00",
      duration: 45,
      price: 33.75,
      status: 'pending',
      payment_status: 'pending',
      created_at: "2024-01-18T16:20:00Z",
      teacher_rating: 4.5,
      teacher_experience: "4 ans"
    }
  ])

  // Filtrer les réservations
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || booking.payment_status === selectedPaymentStatus
    const matchesChild = selectedChild === "all" || booking.child_name === selectedChild
    const matchesSubject = selectedSubject === "all" || booking.subject === selectedSubject

    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesChild && matchesSubject
  })

  // Statistiques
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const totalSpent = bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.price, 0)
  const pendingPayments = bookings.filter(b => b.payment_status === 'pending').length
  const totalPendingAmount = bookings.filter(b => b.payment_status === 'pending').reduce((sum, b) => sum + b.price, 0)

  // Obtenir la liste unique des enfants et matières
  const children = Array.from(new Set(bookings.map(b => b.child_name)))
  const subjects = Array.from(new Set(bookings.map(b => b.subject)))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">En attente</span>
      case 'confirmed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Confirmé</span>
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Terminé</span>
      case 'cancelled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Annulé</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{status}</span>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">En attente</span>
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Payé</span>
      case 'failed':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Échoué</span>
      case 'refunded':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Remboursé</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{status}</span>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'refunded':
        return <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    }
  }

  const handlePayment = (bookingId: string) => {
    console.log(`Paiement pour la réservation ${bookingId}`)
  }

  const handleCancel = (bookingId: string) => {
    console.log(`Annulation de la réservation ${bookingId}`)
  }

  const handleViewDetails = (bookingId: string) => {
    console.log(`Voir détails de la réservation ${bookingId}`)
  }

  return (
    <AuthGuard requiredRole="parent">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-slate-900 dark:bg-slate-950">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <CustomSidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <AnimatedThemeToggler />
                </div>
                
                                <CustomSidebarLink
                  link={{
                    label: `${user?.first_name} ${user?.last_name}`,
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=SA"      
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
          
          <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Mes Réservations</h1>
              <p className="text-slate-600 dark:text-slate-400">Gérez et suivez toutes vos réservations de cours pour vos enfants</p>
            </div>

            <div className="p-8">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Calendar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalBookings}</div>
                  </div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Réservations</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Toutes les réservations</p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Clock className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{pendingBookings}</div>
                  </div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">En Attente</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Réservations en attente</p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <DollarSign className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalSpent.toFixed(2)}€</div>
                  </div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Dépensé</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Montant total payé</p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <CreditCard className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{pendingPayments}</div>
                  </div>
                  <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Paiements en attente</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{totalPendingAmount.toFixed(2)}€ à payer</p>
                </div>
              </div>

              {/* Filtres et recherche */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>

                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Tous les paiements</option>
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="failed">Échoué</option>
                    <option value="refunded">Remboursé</option>
                  </select>

                  <select
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Tous les enfants</option>
                    {children.map(child => (
                      <option key={child} value={child}>{child}</option>
                    ))}
                  </select>

                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">Toutes les matières</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Liste des réservations */}
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{booking.teacher_name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{booking.course_title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{booking.subject} • {booking.level}</span>
                            {booking.teacher_rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500 fill-current" />
                                <span className="text-xs text-slate-600 dark:text-slate-400">{booking.teacher_rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{booking.price.toFixed(2)}€</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{booking.duration} min</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {new Date(booking.date).toLocaleDateString('fr-FR')} à {booking.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{booking.child_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{booking.teacher_experience} d'expérience</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.payment_status)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Réf: {booking.reference}
                      </div>
                    </div>

                    {booking.special_requirements && (
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          <strong>Exigences spéciales:</strong> {booking.special_requirements}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(booking.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Voir détails
                      </button>
                      
                      {booking.payment_status === 'pending' && (
                        <button
                          onClick={() => handlePayment(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <CreditCard className="h-4 w-4" />
                          Payer
                        </button>
                      )}
                      
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Aucune réservation trouvée</h3>
                  <p className="text-slate-600 dark:text-slate-400">Aucune réservation ne correspond à vos critères de recherche.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

// Composants pour la sidebar
function CustomSidebarLink({ link }: { link: any }) {
  return (
    <Link
      href={link.href}
      onClick={link.onClick}
      className={`flex items-center justify-start gap-2 group/sidebar py-2 px-3 rounded-lg transition-colors ${
        link.isActive 
          ? 'bg-slate-800 text-white border border-slate-700' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {link.icon}
      <span className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre !p-0 !m-0">
        {link.label}
      </span>
    </Link>
  )
}

const Logo = () => (
  <Link href="/dashboard/parent" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    <span className="font-medium whitespace-pre text-white font-heading">Lahacademia</span>
  </Link>
)

const LogoIcon = () => (
  <Link href="/dashboard/parent" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
    <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
  </Link>
)