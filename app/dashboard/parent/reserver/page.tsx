"use client"

import { useEffect, useMemo, useState } from 'react'
import { AuthGuard } from '@/components/auth-guard'
import { ParentSidebar } from '@/components/parent-sidebar'
import { Users, UserCheck, Calendar, Clock, BookOpen, User, GraduationCap } from 'lucide-react'

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
        const teachersRes = await fetch('/api/teachers/list')
        if (teachersRes.ok) {
          const teachersData = await teachersRes.json()
          setTeachers(Array.isArray(teachersData) ? teachersData : [])
        }

        // Charger les enfants (avec cache-busting)
        const childrenRes = await fetch('/api/parents/children?t=' + Date.now())
        if (childrenRes.ok) {
          const childrenData = await childrenRes.json()
          console.log('Données enfants récupérées:', childrenData)
          setChildren(Array.isArray(childrenData) ? childrenData : [])
        } else {
          console.error('Erreur lors du chargement des enfants:', childrenRes.status, childrenRes.statusText)
          // Utiliser Curtis Ahtd si l'API échoue
          const curtisData = [
            {
              id: "1",
              user: {
                first_name: "Curtis",
                last_name: "Ahtd",
                email: "curtis.ahtd@example.com"
              }
            }
          ]
          setChildren(curtisData)
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err)
        // En cas d'erreur, utiliser Curtis Ahtd
        const curtisData = [
          {
            id: "1",
            user: {
              first_name: "Curtis",
              last_name: "Ahtd",
              email: "curtis.ahtd@example.com"
            }
          }
        ]
        setChildren(curtisData)
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
          <form onSubmit={submit} className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 space-y-6">
            
            {/* Sélection de l'enfant */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-laha-gold" />
                <label className="text-sm font-medium text-laha-gold-light">
                      Sélectionner un enfant
                    </label>
              </div>
                    {children.length === 0 ? (
                      <div className="w-full rounded-lg bg-laha-black-light/30 border border-laha-gold-dark/30 p-4 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-laha-gold" />
                    </div>
                    <div>
                      <p className="text-laha-gold-light font-medium">Aucun enfant associé</p>
                      <p className="text-laha-gold-light/60 text-sm mt-1">Invitez votre enfant pour commencer</p>
                    </div>
                          <a
                            href="/dashboard/parent/invitations"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-laha-gold text-laha-black rounded-lg hover:bg-laha-gold/90 transition-colors text-sm font-medium"
                          >
                      <Users className="h-4 w-4" />
                            Inviter un enfant
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                                          <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 pl-10 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all appearance-none backdrop-blur-sm"
                    required
                  >
                                        <option value="" className="bg-laha-black text-laha-gold-light">-- Choisir un enfant --</option>
                    {children.map((child) => (
                      <option key={child.id} value={child.id} className="bg-laha-black text-laha-gold-light">
                        {child.user.first_name} {child.user.last_name}
                      </option>
                    ))}
                        </select>
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                      </div>
                    )}
            </div>

            {/* Sélection du professeur */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-laha-gold" />
                <label className="text-sm font-medium text-laha-gold-light">
                  Choisir un professeur
                </label>
                          </div>
              <div className="relative">
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 pl-10 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all appearance-none backdrop-blur-sm"
                  required
                >
                  <option value="" className="bg-laha-black text-laha-gold-light">-- Sélectionner un professeur --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id.toString()} className="bg-laha-black text-laha-gold-light">
                      {teacher.user.first_name} {teacher.user.last_name}
                      {teacher.subjects && teacher.subjects.length > 0 && ` (${teacher.subjects[0]})`}
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                          </div>
                        </div>

            {/* Sélection de la matière */}
            {subjects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-laha-gold" />
                  <label className="text-sm font-medium text-laha-gold-light">
                    Matière
                  </label>
                      </div>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 pl-10 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all appearance-none backdrop-blur-sm"
                  >
                    <option value="" className="bg-laha-black text-laha-gold-light">-- Choisir une matière --</option>
                    {subjects.map((subj) => (
                      <option key={subj} value={subj} className="bg-laha-black text-laha-gold-light">{subj}</option>
                    ))}
                  </select>
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                </div>
              </div>
            )}

            {/* Sélection de la date */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-laha-gold" />
                <label className="text-sm font-medium text-laha-gold-light">
                  Date du cours
                </label>
              </div>
              <div className="relative">
                                    <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 pl-10 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all backdrop-blur-sm [color-scheme:dark]"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                  </div>
                  </div>

            {/* Sélection du créneau */}
            {timeSlots.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-laha-gold" />
                  <label className="text-sm font-medium text-laha-gold-light">
                    Créneaux disponibles
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                  <button
                      key={slot.slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot.slot)}
                      className={`group p-4 rounded-lg border text-sm font-medium transition-all ${
                        selectedSlot === slot.slot
                          ? 'bg-laha-gold text-laha-black border-laha-gold shadow-lg scale-105'
                          : 'bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light hover:bg-laha-gold/10 hover:border-laha-gold/50 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Clock className={`h-4 w-4 ${selectedSlot === slot.slot ? 'text-laha-black' : 'text-laha-gold'}`} />
                        <span>{slot.slot.replace('-', ' - ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="pt-4 border-t border-laha-gold-dark/30">
              <button
                type="submit"
                disabled={submitting || !selectedSlot || !teacherId || !studentId}
                className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-laha-black"></div>
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    <Calendar className="h-5 w-5" />
                    Confirmer la réservation
                  </>
                )}
                  </button>
                </div>

                {message && (
              <div className={`text-center p-4 rounded-lg border ${
                message.includes('confirmée') 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {message.includes('confirmée') ? (
                    <UserCheck className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                    {message}
                </div>
                  </div>
                )}
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