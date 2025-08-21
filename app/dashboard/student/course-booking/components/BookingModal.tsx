"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User, BookOpen, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Course, Teacher, reserveSession, BookingData } from "@/lib/api-courses"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  course?: Course | null
  teacher?: Teacher | null
}

export function BookingModal({ isOpen, onClose, course, teacher }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("60")
  const [specialRequirements, setSpecialRequirements] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const availableDates = [
    { date: "2024-01-15", day: "Lundi", available: true },
    { date: "2024-01-16", day: "Mardi", available: true },
    { date: "2024-01-17", day: "Mercredi", available: true },
    { date: "2024-01-18", day: "Jeudi", available: true },
    { date: "2024-01-19", day: "Vendredi", available: true },
    { date: "2024-01-20", day: "Samedi", available: true },
    { date: "2024-01-21", day: "Dimanche", available: false },
  ]

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  const durations = [
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 heure" },
    { value: "90", label: "1h30" },
    { value: "120", label: "2 heures" },
  ]

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration)
    setStep(4)
  }

  const calculatePrice = () => {
    const basePrice = course?.price || teacher?.hourly_rate || 25
    const durationHours = parseInt(selectedDuration) / 60
    return (basePrice * durationHours).toFixed(2)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Validation des données requises
      if (!selectedDate || !selectedTime || !selectedDuration) {
        toast.error("Données manquantes", {
          description: "Veuillez remplir tous les champs requis.",
        })
        setIsLoading(false)
        return
      }

      // Déterminer les IDs du professeur et du cours
      const teacherId = teacher?.id || course?.teachers?.[0]?.id
      const courseId = course?.id
      
      if (!teacherId) {
        toast.error("Erreur de configuration", {
          description: "Aucun professeur sélectionné.",
        })
        setIsLoading(false)
        return
      }

      // Construire les dates/heures
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00.000Z`)
      const durationMinutes = parseInt(selectedDuration)
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000)

      // Préparer les données de réservation
      const bookingData: BookingData = {
        teacher_id: teacherId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        special_requirements: specialRequirements || undefined
      }

      if (courseId) {
        bookingData.course_id = courseId
      }

      // Effectuer la réservation
      const response = await reserveSession(bookingData)
      
      toast.success("Réservation effectuée avec succès !", {
        description: `Référence: ${response.booking_reference}. Vous recevrez une confirmation par email.`,
      })
      
      onClose()
      setStep(1)
      setSelectedDate("")
      setSelectedTime("")
      setSelectedDuration("60")
      setSpecialRequirements("")
    } catch (error: any) {
      console.error("Erreur lors de la réservation:", error)
      const errorMessage = error?.message || "Une erreur est survenue lors de la réservation"
      toast.error("Erreur lors de la réservation", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDate("")
    setSelectedTime("")
    setSelectedDuration("60")
    setSpecialRequirements("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Réservation de cours
          </DialogTitle>
          <DialogDescription>
            {course ? `Réserver le cours "${course.title}"` : `Réserver une session avec ${teacher?.name}`}
          </DialogDescription>
        </DialogHeader>

        {/* Étapes de progression */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                stepNumber <= step 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"
              )}>
                {stepNumber < step ? <CheckCircle className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < 5 && (
                <div className={cn(
                  "w-16 h-0.5 mx-2",
                  stepNumber < step ? "bg-blue-600" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1: Sélection de la date */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Choisissez une date</Label>
              <p className="text-sm text-gray-600 mt-1">
                Sélectionnez le jour qui vous convient pour votre session
              </p>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {availableDates.map((dateInfo) => (
                <button
                  key={dateInfo.date}
                  onClick={() => dateInfo.available && handleDateSelect(dateInfo.date)}
                  disabled={!dateInfo.available}
                  className={cn(
                    "p-3 rounded-lg border text-center transition-colors",
                    dateInfo.available
                      ? "border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  )}
                >
                  <div className="text-xs font-medium text-gray-600">{dateInfo.day}</div>
                  <div className="text-lg font-semibold">
                    {new Date(dateInfo.date).getDate()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2: Sélection de l'heure */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Choisissez une heure</Label>
              <p className="text-sm text-gray-600 mt-1">
                Sélectionnez l'heure de début de votre session
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <Clock className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                  <div className="font-medium">{time}</div>
                </button>
              ))}
            </div>
            
            <Button variant="outline" onClick={() => setStep(1)} className="w-full">
              Retour à la sélection de date
            </Button>
          </div>
        )}

        {/* Étape 3: Sélection de la durée */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Choisissez la durée</Label>
              <p className="text-sm text-gray-600 mt-1">
                Sélectionnez la durée de votre session
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => handleDurationSelect(duration.value)}
                  className="p-4 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="font-medium">{duration.label}</div>
                  <div className="text-sm text-gray-600">
                    {((course?.price || teacher?.hourlyRate || 25) * parseInt(duration.value) / 60).toFixed(2)}€
                  </div>
                </button>
              ))}
            </div>
            
            <Button variant="outline" onClick={() => setStep(2)} className="w-full">
              Retour à la sélection d'heure
            </Button>
          </div>
        )}

        {/* Étape 4: Détails et confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Détails de la réservation</Label>
              <p className="text-sm text-gray-600 mt-1">
                Vérifiez les informations et ajoutez des commentaires si nécessaire
              </p>
            </div>
            
            {/* Résumé de la réservation */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Date :</span>
                <span>{new Date(selectedDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Heure :</span>
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Durée :</span>
                <span>{durations.find(d => d.value === selectedDuration)?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Prix :</span>
                <span className="text-lg font-bold text-green-600">{calculatePrice()}€</span>
              </div>
            </div>
            
            {/* Informations sur le cours/professeur */}
            {course && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-gray-600">avec {course.teachers?.[0]?.name || 'Professeur à définir'}</div>
                  </div>
                </div>
              </div>
            )}
            
            {teacher && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-gray-600">{teacher.subjects.join(', ')}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Commentaires spéciaux */}
            <div>
              <Label htmlFor="requirements">Commentaires ou demandes spéciales (optionnel)</Label>
              <Textarea
                id="requirements"
                placeholder="Ex: J'aimerais me concentrer sur les dérivées, ou J'ai des difficultés avec..."
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                Retour à la durée
              </Button>
              <Button onClick={() => setStep(5)} className="flex-1">
                Confirmer la réservation
              </Button>
            </div>
          </div>
        )}

        {/* Étape 5: Confirmation finale */}
        {step === 5 && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Confirmer votre réservation ?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Vérifiez une dernière fois les détails avant de confirmer
              </p>
            </div>
            
            {/* Résumé final */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium">Session :</span>
                <span>{selectedDate} à {selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Durée :</span>
                <span>{durations.find(d => d.value === selectedDuration)?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Prix total :</span>
                <span className="text-lg font-bold text-green-600">{calculatePrice()}€</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Important :</div>
                  <div>Votre réservation sera confirmée après validation du paiement.</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? "Réservation en cours..." : "Confirmer et payer"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

