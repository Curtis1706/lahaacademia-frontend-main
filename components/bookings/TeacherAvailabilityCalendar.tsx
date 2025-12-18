"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, X, Save, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import logger from "@/lib/logger"

interface TimeSlot {
  id?: string
  day_of_week: number // 0 = Dimanche, 1 = Lundi, etc.
  start_time: string // Format: "HH:MM"
  end_time: string // Format: "HH:MM"
  is_available: boolean
}

const DAYS_OF_WEEK = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
]

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00"
]

export function TeacherAvailabilityCalendar() {
  const [availability, setAvailability] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/teachers/availability", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setAvailability(data.availability_slots || [])
      }
    } catch (error) {
      logger.error("Error fetching availability", error as Error, { context: "TeacherAvailabilityCalendar" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSlot = (dayOfWeek: number, startTime: string) => {
    const endTime = calculateEndTime(startTime, 60) // 1 heure par défaut
    
    const newSlot: TimeSlot = {
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
      is_available: true,
    }

    setAvailability([...availability, newSlot])
  }

  const handleRemoveSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index))
  }

  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + durationMinutes
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch("/api/teachers/availability", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availability_slots: availability,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde")
      }

      setMessage({ type: "success", text: "Disponibilités enregistrées avec succès !" })
      logger.info("Availability saved successfully", {}, { context: "TeacherAvailabilityCalendar" })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue"
      setMessage({ type: "error", text: errorMsg })
      logger.error("Error saving availability", error as Error, { context: "TeacherAvailabilityCalendar" })
    } finally {
      setSaving(false)
    }
  }

  const isSlotTaken = (dayOfWeek: number, startTime: string): boolean => {
    return availability.some(
      (slot) => slot.day_of_week === dayOfWeek && slot.start_time === startTime
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Mes Disponibilités
        </CardTitle>
        <CardDescription>
          Définissez vos créneaux horaires disponibles pour les cours en ligne
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Grille des disponibilités */}
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((dayName, dayIndex) => (
            <div key={dayIndex} className="border border-laha-border rounded-lg p-4">
              <h3 className="font-semibold text-laha-text mb-3">{dayName}</h3>
              
              {/* Créneaux existants pour ce jour */}
              <div className="flex flex-wrap gap-2 mb-3">
                {availability
                  .filter((slot) => slot.day_of_week === dayIndex)
                  .map((slot, slotIndex) => (
                    <Badge
                      key={slotIndex}
                      variant="outline"
                      className="bg-laha-gold/10 text-laha-gold border-laha-gold/20 px-3 py-1"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {slot.start_time} - {slot.end_time}
                      <button
                        onClick={() => handleRemoveSlot(availability.indexOf(slot))}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                
                {availability.filter((slot) => slot.day_of_week === dayIndex).length === 0 && (
                  <span className="text-sm text-laha-text-secondary">Aucun créneau défini</span>
                )}
              </div>

              {/* Boutons pour ajouter des créneaux */}
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddSlot(dayIndex, time)}
                    disabled={isSlotTaken(dayIndex, time)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="bg-laha-surface/20 rounded-lg p-4 border border-laha-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-laha-text-secondary">Créneaux définis</p>
              <p className="text-2xl font-bold text-laha-gold">{availability.length}</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving || availability.length === 0}
              className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-laha-text-secondary space-y-2">
          <p>💡 <strong>Astuce :</strong> Cliquez sur un horaire pour ajouter un créneau disponible.</p>
          <p>⏰ Chaque créneau dure <strong>1 heure</strong> par défaut.</p>
          <p>🔄 Vous pouvez modifier vos disponibilités à tout moment.</p>
        </div>
      </CardContent>
    </Card>
  )
}


