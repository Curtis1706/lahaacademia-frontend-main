"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Loader2,
  Search,
  Calendar as CalendarIcon,
  Clock,
  Star,
  BookOpen,
  Video,
  CheckCircle,
  XCircle,
  Filter,
  User,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import logger from "@/lib/logger"

interface Teacher {
  id: string
  name: string
  avatar?: string
  subjects: string[]
  rating: number
  students_count: number
  hourly_rate: number
  bio: string
  available_slots: {
    id: string
    date: string
    start_time: string
    end_time: string
  }[]
}

interface Booking {
  id: string
  teacher: {
    id: string
    name: string
    avatar?: string
  }
  subject: string
  date: string
  start_time: string
  end_time: string
  status: "upcoming" | "completed" | "cancelled"
  meeting_url?: string
  notes?: string
}

export default function BookingsPage() {
  return (
    <AuthGuard requiredRole="student">
      <BookingsContent />
    </AuthGuard>
  )
}

function BookingsContent() {
  const [activeTab, setActiveTab] = useState<"book" | "my-bookings">("book")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [myBookings, setMyBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchSubject, setSearchSubject] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookingNotes, setBookingNotes] = useState("")
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    if (activeTab === "book") {
      fetchTeachers()
    } else {
      fetchMyBookings()
    }
  }, [activeTab])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchSubject) params.append("subject", searchSubject)

      const response = await fetch(`/api/bookings/teachers?${params.toString()}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers || [])
      }
    } catch (error) {
      logger.error("Error fetching teachers", error as Error, { context: "BookingsPage" })
    } finally {
      setLoading(false)
    }
  }

  const fetchMyBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bookings/my-bookings", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setMyBookings(data.results || [])
      }
    } catch (error) {
      logger.error("Error fetching bookings", error as Error, { context: "BookingsPage" })
    } finally {
      setLoading(false)
    }
  }

  const handleBookSlot = (teacher: Teacher, slot: any) => {
    setSelectedTeacher(teacher)
    setSelectedSlot(slot)
    setShowBookingDialog(true)
  }

  const confirmBooking = async () => {
    if (!selectedTeacher || !selectedSlot) return

    try {
      setBookingLoading(true)

      const response = await fetch("/api/bookings/teachers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: selectedTeacher.id,
          slot_id: selectedSlot.id,
          subject: searchSubject || selectedTeacher.subjects[0],
          notes: bookingNotes,
          booking_type: "individual",
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la réservation")
      }

      logger.info("Booking created successfully", { teacher_id: selectedTeacher.id }, { context: "BookingsPage" })

      setShowBookingDialog(false)
      setSelectedTeacher(null)
      setSelectedSlot(null)
      setBookingNotes("")
      
      // Recharger les professeurs pour mettre à jour les créneaux
      fetchTeachers()
    } catch (error) {
      logger.error("Error creating booking", error as Error, { context: "BookingsPage" })
      alert("Erreur lors de la réservation. Veuillez réessayer.")
    } finally {
      setBookingLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) return

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Annulation par l'élève" }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation")
      }

      logger.info("Booking cancelled", { bookingId }, { context: "BookingsPage" })
      fetchMyBookings()
    } catch (error) {
      logger.error("Error cancelling booking", error as Error, { context: "BookingsPage" })
      alert("Erreur lors de l'annulation. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laha-gold mb-2">Réservation de Cours</h1>
          <p className="text-laha-text-secondary">
            Réservez des cours individuels avec nos professeurs certifiés
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "book" ? "default" : "outline"}
            onClick={() => setActiveTab("book")}
            className={activeTab === "book" ? "bg-laha-gold text-laha-black" : ""}
          >
            <Search className="h-4 w-4 mr-2" />
            Réserver un cours
          </Button>
          <Button
            variant={activeTab === "my-bookings" ? "default" : "outline"}
            onClick={() => setActiveTab("my-bookings")}
            className={activeTab === "my-bookings" ? "bg-laha-gold text-laha-black" : ""}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Mes réservations
          </Button>
        </div>

        {/* Content */}
        {activeTab === "book" ? (
          <div className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Rechercher un professeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Matière (ex: Mathématiques, Français...)"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                  />
                  <Button onClick={fetchTeachers}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des professeurs */}
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
              </div>
            ) : teachers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-laha-text-secondary">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun professeur disponible pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.map((teacher) => (
                  <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-laha-gold/20 flex items-center justify-center">
                          {teacher.avatar ? (
                            <img
                              src={teacher.avatar}
                              alt={teacher.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-8 w-8 text-laha-gold" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{teacher.rating}</span>
                            </div>
                            <span className="text-sm text-laha-text-secondary">
                              • {teacher.students_count} élèves
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {teacher.subjects.slice(0, 3).map((subject, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-laha-gold">
                            {teacher.hourly_rate} XOF
                          </p>
                          <p className="text-xs text-laha-text-secondary">/heure</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-laha-text-secondary mb-4 line-clamp-2">
                        {teacher.bio}
                      </p>
                      
                      {/* Créneaux disponibles */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Créneaux disponibles :</p>
                        {teacher.available_slots && teacher.available_slots.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {teacher.available_slots.slice(0, 6).map((slot) => (
                              <Button
                                key={slot.id}
                                size="sm"
                                variant="outline"
                                onClick={() => handleBookSlot(teacher, slot)}
                                className="text-xs"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(slot.date).toLocaleDateString("fr-FR")} {slot.start_time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-laha-text-secondary">
                            Aucun créneau disponible actuellement
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Mes réservations */
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
              </div>
            ) : myBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-laha-text-secondary">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune réservation pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              myBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                          {booking.teacher.avatar ? (
                            <img
                              src={booking.teacher.avatar}
                              alt={booking.teacher.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-laha-gold" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-laha-text">
                              {booking.subject} avec {booking.teacher.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={
                                booking.status === "upcoming"
                                  ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                                  : booking.status === "completed"
                                  ? "bg-green-500/10 text-green-700 border-green-500/20"
                                  : "bg-red-500/10 text-red-700 border-red-500/20"
                              }
                            >
                              {booking.status === "upcoming"
                                ? "À venir"
                                : booking.status === "completed"
                                ? "Terminé"
                                : "Annulé"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {new Date(booking.date).toLocaleDateString("fr-FR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.start_time} - {booking.end_time}
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-laha-text-secondary mt-2">
                              Note: {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        {booking.status === "upcoming" && booking.meeting_url && (
                          <Button
                            size="sm"
                            className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                            onClick={() => window.open(booking.meeting_url, "_blank")}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Rejoindre
                          </Button>
                        )}
                        {booking.status === "upcoming" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Annuler
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Dialog de confirmation de réservation */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la réservation</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de réserver un cours avec{" "}
              <strong>{selectedTeacher?.name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-laha-surface/20 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-laha-text-secondary">Date et heure:</span>
                <span className="font-medium">
                  {selectedSlot?.date && new Date(selectedSlot.date).toLocaleDateString("fr-FR")}{" "}
                  {selectedSlot?.start_time}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-laha-text-secondary">Durée:</span>
                <span className="font-medium">1 heure</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-laha-text-secondary">Tarif:</span>
                <span className="font-medium text-laha-gold">
                  {selectedTeacher?.hourly_rate} XOF
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optionnel)</label>
              <Textarea
                placeholder="Précisez vos besoins, questions ou objectifs..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={confirmBooking}
              disabled={bookingLoading}
              className="flex-1 bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Réservation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmer
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


