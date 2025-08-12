"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  MapPin,
  ArrowLeft,
  Download,
  Share2 
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface BookingDetails {
  id: string
  student_name: string
  teacher_name: string
  course_name: string
  date: string
  start_time: string
  end_time: string
  status: string
  booking_reference: string
}

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking_id')

  useEffect(() => {
    const loadBookingDetails = async () => {
      if (!bookingId) {
        setLoading(false)
        return
      }

      try {
        // Charger les détails de la réservation depuis sessionStorage (données passées lors de la redirection)
        const bookingDataStr = sessionStorage.getItem(`booking_${bookingId}`)
        if (bookingDataStr) {
          const bookingData = JSON.parse(bookingDataStr)
          
          // Convertir les données de l'API vers le format attendu
          setBooking({
            id: bookingData.booking_id,
            student_name: bookingData.student?.name || 'N/A',
            teacher_name: bookingData.teacher?.name || 'N/A',
            course_name: bookingData.course?.name || 'Session individuelle',
            date: bookingData.session?.start_time ? bookingData.session.start_time.split('T')[0] : '',
            start_time: bookingData.session?.start_time ? new Date(bookingData.session.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            end_time: bookingData.session?.end_time ? new Date(bookingData.session.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
            status: bookingData.status || 'confirmed',
            booking_reference: bookingData.booking_reference || `REF-${bookingId}`
          })
          
          // Nettoyer les données temporaires
          sessionStorage.removeItem(`booking_${bookingId}`)
        } else {
          // Fallback : données par défaut si les détails ne sont pas disponibles
          setBooking({
            id: bookingId,
            student_name: 'Élève',
            teacher_name: 'Professeur',
            course_name: 'Cours réservé',
            date: new Date().toISOString().split('T')[0],
            start_time: '00:00',
            end_time: '01:00',
            status: 'confirmed',
            booking_reference: `REF-${bookingId}`
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error)
        setBooking(null)
      } finally {
        setLoading(false)
      }
    }

    loadBookingDetails()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-laha-gold mx-auto mb-4"></div>
          <p className="text-laha-gold-light">Finalisation de votre réservation...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Erreur lors du chargement de la confirmation</p>
          <Link href="/dashboard/parent/reserver" className="text-laha-gold hover:underline mt-2 inline-block">
            Retour à la réservation
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark p-4">
      <div className="max-w-2xl mx-auto pt-8">
        
        {/* Header de confirmation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl font-bold text-laha-gold mb-2"
          >
            Réservation Confirmée !
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-laha-gold-light"
          >
            Votre cours a été réservé avec succès
          </motion.p>
        </motion.div>

        {/* Détails de la réservation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 mb-6"
        >
          <h2 className="text-xl font-semibold text-laha-gold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Détails de votre réservation
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-laha-black/30">
              <User className="h-5 w-5 text-laha-gold" />
              <div>
                <p className="text-sm text-laha-gold-light/70">Élève</p>
                <p className="text-laha-gold-light font-medium">{booking.student_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-laha-black/30">
              <User className="h-5 w-5 text-laha-gold" />
              <div>
                <p className="text-sm text-laha-gold-light/70">Professeur</p>
                <p className="text-laha-gold-light font-medium">{booking.teacher_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-laha-black/30">
              <BookOpen className="h-5 w-5 text-laha-gold" />
              <div>
                <p className="text-sm text-laha-gold-light/70">Cours</p>
                <p className="text-laha-gold-light font-medium">{booking.course_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-laha-black/30">
              <Calendar className="h-5 w-5 text-laha-gold" />
              <div>
                <p className="text-sm text-laha-gold-light/70">Date</p>
                <p className="text-laha-gold-light font-medium">{formatDate(booking.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-laha-black/30">
              <Clock className="h-5 w-5 text-laha-gold" />
              <div>
                <p className="text-sm text-laha-gold-light/70">Horaire</p>
                <p className="text-laha-gold-light font-medium">
                  {booking.start_time} - {booking.end_time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-green-400/70">Référence</p>
                <p className="text-green-400 font-mono font-medium">{booking.booking_reference}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-laha-gold/20 text-laha-gold rounded-lg hover:bg-laha-gold/30 transition-colors">
              <Download className="h-4 w-4" />
              Télécharger le récapitulatif
            </button>
            
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-laha-gold/20 text-laha-gold rounded-lg hover:bg-laha-gold/30 transition-colors">
              <Share2 className="h-4 w-4" />
              Partager les détails
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/dashboard/parent/reserver"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-laha-black-light/30 text-laha-gold-light rounded-lg hover:bg-laha-black-light/50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Nouvelle réservation
            </Link>
            
            <Link 
              href="/dashboard/parent/suivi"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-laha-gold text-laha-black rounded-lg hover:bg-laha-gold/90 transition-colors font-medium"
            >
              <Calendar className="h-4 w-4" />
              Voir mes réservations
            </Link>
          </div>
        </motion.div>

        {/* Informations importantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
        >
          <h3 className="text-blue-400 font-medium mb-2">Informations importantes :</h3>
          <ul className="text-blue-400/80 text-sm space-y-1">
            <li>• Une notification a été envoyée au professeur</li>
            <li>• Vous recevrez un rappel 24h avant le cours</li>
            <li>• Vous pouvez annuler jusqu'à 4h avant le début</li>
            <li>• Le lien de visioconférence sera envoyé 1h avant</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
