"use client"

import { useEffect, useMemo, useState } from 'react'
import { AuthGuard } from '@/components/auth-guard'
import { ParentSidebar } from '@/components/parent-sidebar'

type TeacherItem = {
  id: number
  user: { first_name: string; last_name: string; email: string }
  subjects?: string[]
  bio?: string
  hourly_rate?: number
}

type ChildItem = {
  id: string
  user: { first_name: string; last_name: string; email: string }
  school_level?: string
  school_name?: string
}

export default function ParentReservePage() {
  // Récupérer l'ID de l'enfant depuis l'URL si présent
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const childId = urlParams.get('child_id')
    if (childId) {
      setStudentId(childId)
    }
  }, [])

  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [teacherId, setTeacherId] = useState<string>('')
  const [children, setChildren] = useState<ChildItem[]>([])
  const [studentId, setStudentId] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les enseignants
        const teachersRes = await fetch('/api/teachers')
        if (teachersRes.ok) {
          const teachersData = await teachersRes.json()
          setTeachers(Array.isArray(teachersData) ? teachersData : [])
        }

        // Charger les enfants
        const childrenRes = await fetch('/api/parents/children')
        if (childrenRes.ok) {
          const childrenData = await childrenRes.json()
          setChildren(Array.isArray(childrenData) ? childrenData : [])
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (teacherId && date) {
      const fetchSlots = async () => {
        try {
          const res = await fetch(`/api/teachers/${teacherId}/availability?date=${date}`)
          const data = await res.json()
          setTimeSlots(Array.isArray(data) ? data : [])
        } catch {
          setTimeSlots([])
        }
      }
      fetchSlots()
    } else {
      setTimeSlots([])
    }
  }, [teacherId, date])

  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id.toString() === teacherId)
  }, [teachers, teacherId])

  const subjects = useMemo(() => {
    if (!selectedTeacher?.subjects) return []
    return selectedTeacher.subjects
  }, [selectedTeacher])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !teacherId || !studentId) return

    setSubmitting(true)
    setMessage('')

    try {
      const [start, end] = selectedSlot.split('-')
      const startIso = new Date(`${date}T${start}:00`).toISOString()
      const endIso = new Date(`${date}T${end}:00`).toISOString()
      const body: any = {
        teacher_id: teacherId,
        start_time: startIso,
        end_time: endIso,
        student_id: studentId,
      }
      
      const res = await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Réservation impossible')
      setMessage('Réservation confirmée')
    } catch (err: any) {
      setMessage(err?.message || 'Erreur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Réserver un cours</h1>
          <p className="text-laha-gold-light/70">Choisissez un professeur, une date et un créneau.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche: formulaire */}
          <form onSubmit={submit} className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 space-y-5">
            
            {/* Sélection de l'enfant */}
            <div>
              <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                Sélectionner un enfant
              </label>
              {children.length === 0 ? (
                <div className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 p-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-laha-gold/20 flex items-center justify-center">
                      <span className="text-laha-gold text-sm">👥</span>
                    </div>
                    <p className="text-laha-gold-light/60 text-sm">Aucun enfant associé</p>
                    <a
                      href="/dashboard/parent/invitations"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-laha-gold/20 text-laha-gold rounded-lg hover:bg-laha-gold/30 transition-colors text-sm"
                    >
                      <span className="text-sm">+</span>
                      Inviter un enfant
                    </a>
                  </div>
                </div>
              ) : (
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
                  required
                >
                  <option value="">-- Choisir un enfant --</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.user.first_name} {child.user.last_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Sélection du professeur */}
            <div>
              <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                Choisir un professeur
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
                required
              >
                <option value="">-- Sélectionner --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id.toString()}>
                    {teacher.user.first_name} {teacher.user.last_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection de la matière */}
            {subjects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                  Matière
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
                >
                  <option value="">-- Choisir une matière --</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sélection de la date */}
            <div>
              <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 px-4 py-3 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
                required
              />
            </div>

            {/* Sélection du créneau */}
            {timeSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-laha-gold-light/80 mb-2">
                  Créneaux disponibles
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot.slot)}
                      className={`p-3 rounded-lg border text-sm transition-all ${
                        selectedSlot === slot.slot
                          ? 'bg-laha-gold/20 border-laha-gold text-laha-gold'
                          : 'bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light hover:bg-laha-gold/10'
                      }`}
                    >
                      {slot.slot.replace('-', ' - ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={submitting || !selectedSlot || !teacherId || !studentId}
              className="w-full bg-laha-gold hover:bg-laha-gold-dark text-laha-black font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Réservation...' : 'Confirmer la réservation'}
            </button>

            {message && <div className="text-center p-4 text-laha-gold-light">{message}</div>}
          </form>

          {/* Colonne droite: détails du professeur */}
          <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            {selectedTeacher ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-laha-gold">
                  {selectedTeacher.user.first_name} {selectedTeacher.user.last_name}
                </h3>
                
                {selectedTeacher.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-laha-gold-light/80 mb-2">Biographie</h4>
                    <p className="text-laha-gold-light/70 text-sm">{selectedTeacher.bio}</p>
                  </div>
                )}
                
                {selectedTeacher.subjects && selectedTeacher.subjects.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-laha-gold-light/80 mb-2">Matières enseignées</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeacher.subjects.map((subj) => (
                        <span key={subj} className="px-2 py-1 bg-laha-gold/20 text-laha-gold text-xs rounded">
                          {subj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedTeacher.hourly_rate && (
                  <div>
                    <h4 className="text-sm font-medium text-laha-gold-light/80 mb-2">Tarif</h4>
                    <p className="text-laha-gold font-medium">{selectedTeacher.hourly_rate}€/heure</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-laha-gold-light/60">
                <p>Sélectionnez un professeur pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}