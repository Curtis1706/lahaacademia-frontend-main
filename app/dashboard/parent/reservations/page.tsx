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
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Enfants",
      href: "/dashboard/parent/enfants",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Réservations",
      href: "/dashboard/parent/reservations",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" />,
      isActive: true,
    },
    {
      label: "Invitations",
      href: "/dashboard/parent/invitations",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Notifications",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Messages",
      href: "#",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
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
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>
      case 'confirmed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Confirmé</span>
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Terminé</span>
      case 'cancelled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Annulé</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Payé</span>
      case 'failed':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Échoué</span>
      case 'refunded':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Remboursé</span>
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'refunded':
        return <CreditCard className="h-4 w-4 text-gray-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
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
          
                     <div className="flex-1 overflow-auto bg-black text-white">
             {/* Header avec thème noir et or */}
             <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-6">
               <h1 className="text-3xl font-bold mb-2">Mes Réservations</h1>
               <p className="text-black/80">Gérez et suivez toutes vos réservations de cours pour vos enfants</p>
             </div>

      <div className="p-8">
        {/* Statistiques avec thème noir et or */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-500/70 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-500">{totalBookings}</div>
            </div>
            <h3 className="text-yellow-400 font-semibold mb-1">Total Réservations</h3>
            <p className="text-yellow-200/60 text-sm">Toutes les réservations</p>
          </div>

          <div className="bg-black border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-500/70 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-500">{pendingBookings}</div>
            </div>
            <h3 className="text-yellow-400 font-semibold mb-1">En Attente</h3>
            <p className="text-yellow-200/60 text-sm">Réservations en attente</p>
          </div>

          <div className="bg-black border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-500/70 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-500">{totalSpent.toFixed(2)}€</div>
            </div>
            <h3 className="text-yellow-400 font-semibold mb-1">Total Dépensé</h3>
            <p className="text-yellow-200/60 text-sm">Cours payés</p>
          </div>

          <div className="bg-black border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-500/70 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <CreditCard className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-500">{totalPendingAmount.toFixed(2)}€</div>
            </div>
            <h3 className="text-yellow-400 font-semibold mb-1">Paiements en Attente</h3>
            <p className="text-yellow-200/60 text-sm">{pendingPayments} réservations</p>
          </div>
        </div>

                 {/* Filtres avec thème noir et or */}
         <div className="bg-black border border-yellow-500/50 rounded-xl p-6 mb-8">
           <div className="mb-6">
             <h3 className="text-xl font-semibold text-yellow-400 mb-2">Filtres et Recherche</h3>
             <p className="text-yellow-200/60">Trouvez facilement vos réservations</p>
           </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                         <div className="relative">
               <Search className="absolute left-3 top-3 h-5 w-5 text-yellow-400" />
               <input
                 type="text"
                 placeholder="Rechercher..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 bg-black border border-yellow-500/50 rounded-lg text-white placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
               />
             </div>
             
             <select 
               value={selectedStatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               className="px-4 py-3 bg-black border border-yellow-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
               className="px-4 py-3 bg-black border border-yellow-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
               className="px-4 py-3 bg-black border border-yellow-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
             >
               <option value="all">Tous les enfants</option>
               {children.map((child) => (
                 <option key={child} value={child}>{child}</option>
               ))}
             </select>

             <select 
               value={selectedSubject}
               onChange={(e) => setSelectedSubject(e.target.value)}
               className="px-4 py-3 bg-black border border-yellow-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
             >
               <option value="all">Toutes les matières</option>
               {subjects.map((subject) => (
                 <option key={subject} value={subject}>{subject}</option>
               ))}
             </select>
          </div>
        </div>

        {/* Liste des réservations avec thème noir et or */}
                 <div className="space-y-6">
           {filteredBookings.length === 0 ? (
             <div className="bg-black border border-yellow-500/50 rounded-xl p-12 text-center">
               <Calendar className="h-16 w-16 text-yellow-500/50 mx-auto mb-4" />
               <h3 className="text-xl font-semibold text-white mb-2">
                 Aucune réservation trouvée
               </h3>
               <p className="text-yellow-200/60">
                 Aucune réservation ne correspond à vos critères de recherche
               </p>
             </div>
          ) : (
                         filteredBookings.map((booking) => (
               <div key={booking.id} className="bg-black border border-yellow-500/50 rounded-xl p-6 hover:border-yellow-500/70 transition-all">
                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                   {/* Informations principales */}
                   <div className="flex-1">
                     <div className="flex items-start gap-4">
                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                         <User className="h-6 w-6 text-black" />
                       </div>
                       
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-3">
                           <h3 className="font-semibold text-white text-lg">
                             {booking.course_title || `${booking.subject} - ${booking.teacher_name}`}
                           </h3>
                           <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                             {booking.subject}
                           </span>
                           <span className="px-3 py-1 bg-black text-yellow-200 rounded-full text-sm border border-yellow-500/50">
                             {booking.level}
                           </span>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-200/70">
                           <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-yellow-400" />
                             <span>Enfant : <span className="text-white">{booking.child_name}</span></span>
                           </div>
                           <div className="flex items-center gap-2">
                             <User className="h-4 w-4 text-yellow-400" />
                             <span>Professeur : <span className="text-white">{booking.teacher_name}</span></span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Calendar className="h-4 w-4 text-yellow-400" />
                             <span>
                               {new Date(booking.date).toLocaleDateString('fr-FR', {
                                 weekday: 'long',
                                 year: 'numeric',
                                 month: 'long',
                                 day: 'numeric'
                               })}
                             </span>
                           </div>
                           <div className="flex items-center gap-2">
                             <Clock className="h-4 w-4 text-yellow-400" />
                             <span>{booking.time} ({booking.duration} min)</span>
                           </div>
                         </div>

                         {booking.special_requirements && (
                           <div className="mt-4 p-4 bg-black/50 border border-yellow-500/30 rounded-lg">
                             <div className="text-sm font-medium text-yellow-400 mb-2">
                               Demandes spéciales :
                             </div>
                             <div className="text-sm text-yellow-200/70">
                               {booking.special_requirements}
                             </div>
                           </div>
                         )}

                         {booking.teacher_rating && (
                           <div className="mt-4 flex items-center gap-2">
                             <Star className="h-4 w-4 text-yellow-500 fill-current" />
                             <span className="text-yellow-400 font-medium">{booking.teacher_rating}</span>
                             <span className="text-yellow-200/60 text-sm">• {booking.teacher_experience} d'expérience</span>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                  {/* Prix et actions */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-yellow-500 mb-1">
                        {booking.price.toFixed(2)}€
                      </div>
                      <div className="text-sm text-gray-400">
                        Réf: {booking.reference}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusIcon(booking.payment_status)}
                        {getPaymentStatusBadge(booking.payment_status)}
                      </div>
                    </div>

                                         <div className="flex gap-2">
                       {booking.payment_status === 'pending' && (
                         <button 
                           onClick={() => handlePayment(booking.id)}
                           className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center gap-2"
                         >
                           <CreditCard className="h-4 w-4" />
                           Payer
                         </button>
                       )}
                       {booking.status === 'pending' && (
                         <button 
                           onClick={() => handleCancel(booking.id)}
                           className="px-4 py-2 bg-black text-yellow-200 font-medium rounded-lg hover:bg-yellow-500/10 transition-all duration-200 flex items-center gap-2 border border-yellow-500/50"
                         >
                           <XCircle className="h-4 w-4" />
                           Annuler
                         </button>
                       )}
                       <button 
                         onClick={() => handleViewDetails(booking.id)}
                         className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-yellow-500/10 transition-all duration-200 flex items-center gap-2 border border-yellow-500/50"
                       >
                         <Eye className="h-4 w-4" />
                         Détails
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
        </div>
      </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white font-heading"
      >
        Lahacademia
      </motion.span>
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