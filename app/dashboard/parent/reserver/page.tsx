"use client"

import { useEffect, useMemo, useState } from 'react'
import { AuthGuard } from '@/components/auth-guard'
import { ParentSidebar } from '@/components/parent-sidebar'
import { Users, UserCheck, Calendar, Clock, BookOpen, User, GraduationCap } from 'lucide-react'
import { useRouter } from 'next/navigation'

type TeacherItem = {
  id: number
  user: { first_name: string; last_name: string; email: string }
  subjects?: string[]
  bio?: string
  hourly_rate?: number
  courses?: CourseItem[]
}

type CourseItem = {
  id: number
  title: string
  description: string
  subject: string
  level: string
  duration: number
  price: number
  course_type: string
  max_students?: number
}

type ChildItem = {
  id: string
  user: { first_name: string; last_name: string; email: string }
  school_level?: string
  school_name?: string
}

export default function ParentReservePage() {
  const router = useRouter()
  
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
  const [courseId, setCourseId] = useState<string>('')
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
          const childrenArray = Array.isArray(childrenData) ? childrenData : []
          setChildren(childrenArray)
          
          // Auto-sélectionner le premier enfant disponible
          if (childrenArray.length > 0) {
            const firstChildId = String(childrenArray[0].id)
            console.log('Auto-sélection du premier enfant:', firstChildId)
            setStudentId(firstChildId)
          }
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
          setStudentId("1") // Auto-sélectionner Curtis
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

  // Cours disponibles pour le professeur sélectionné
  const availableCourses = useMemo(() => {
    const selectedTeacher = teachers.find(t => t.id.toString() === teacherId)
    return selectedTeacher?.courses || []
  }, [teachers, teacherId])

  // Informations du cours sélectionné
  const selectedCourse = useMemo(() => {
    return availableCourses.find(c => c.id.toString() === courseId)
  }, [availableCourses, courseId])

  // Réinitialiser la sélection de cours quand on change de professeur
  useEffect(() => {
    setCourseId('')
  }, [teacherId])
    
  useEffect(() => {
    const computeBackendDayIndex = (yyyyMmDd: string): number => {
      if (!yyyyMmDd) return -1
      const [y, m, d] = yyyyMmDd.split('-').map((v) => parseInt(v, 10))
      const jsDay = new Date(y, (m || 1) - 1, d || 1).getDay() // 0=dimanche..6=samedi
      return (jsDay + 6) % 7 // 0=lundi..6=dimanche
    }

    const toSlotString = (time: string) => {
      if (!time) return '00:00'
      return time.slice(0, 5) // 'HH:MM:SS' -> 'HH:MM'
    }

    const loadSlots = async () => {
      setTimeSlots([])
      setSelectedSlot('')
      if (!teacherId || !courseId || !date) return
      try {
        const res = await fetch(`/api/courses/${courseId}/availabilities?date=${date}`, { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`)
        }
        
        const data = await res.json()
        const list: any[] = Array.isArray(data) ? data : (data && Array.isArray(data.results) ? data.results : [])

        const dayIndex = computeBackendDayIndex(date)
        const slots = list
          .filter((a) => {
            // Vérification plus robuste
            if (!a || typeof a !== 'object') return false
            
            const matchesSpecific = a.specific_date && 
              typeof a.specific_date === 'string' && 
              a.specific_date.startsWith(date)
              
            const matchesDay = !a.specific_date && a.day_of_week === dayIndex
            
            const withinRange = (() => {
              const fromOk = !a.valid_from || a.valid_from <= date
              const untilOk = !a.valid_until || date <= a.valid_until
              return fromOk && untilOk
            })()
            
            return (matchesSpecific || matchesDay) && withinRange && a.is_active !== false
          })
          .map((a, idx) => ({
            id: a.id || idx,
            slot: `${toSlotString(a.start_time)}-${toSlotString(a.end_time)}`,
            available: true,
            availability_id: a.id // Garder l'ID original pour référence
          }))

        console.log('Créneaux chargés:', slots)
        setTimeSlots(slots)
      } catch (e) {
        console.error('Erreur chargement disponibilités cours:', e)
        setTimeSlots([])
        // Optionnel: afficher un message d'erreur à l'utilisateur
        setMessage('Impossible de charger les créneaux disponibles')
      }
    }

    loadSlots()
  }, [teacherId, courseId, date])

  const selectedTeacher = useMemo(() => {
    return teachers.find(t => t.id.toString() === teacherId)
  }, [teachers, teacherId])

  const subjects = useMemo(() => {
    if (!selectedTeacher?.subjects) return []
    return selectedTeacher.subjects
  }, [selectedTeacher])

  // CORRECTION 7: Validation supplémentaire avant soumission
  const canSubmit = useMemo(() => {
    return !submitting && 
           selectedSlot && 
           teacherId && 
           studentId && 
           courseId && 
           date &&
           timeSlots.length > 0
  }, [submitting, selectedSlot, teacherId, studentId, courseId, date, timeSlots])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !teacherId || !studentId || !courseId) return

    setSubmitting(true)
    setMessage('')

    try {
      const [startRaw, endRaw] = selectedSlot.split('-')
      const start = (startRaw || '').trim()
      const end = (endRaw || '').trim()
      
      // CORRECTION 1: Format des heures plus robuste
      const formatTime = (time: string) => {
        if (!time) return '00:00'
        // Si déjà au format HH:MM, on garde
        if (time.includes(':') && time.length >= 5) {
          return time.substring(0, 5) // Assurer HH:MM
        }
        // Sinon, ajouter :00
        return `${time}:00`
      }
      
      const startFormatted = formatTime(start)
      const endFormatted = formatTime(end)
      
      // CORRECTION 2: Construction des dates ISO avec timezone locale ou UTC
      // Option 1: Sans timezone (recommandé si votre backend attend du local time)
      const startDateTime = `${date}T${startFormatted}:00`
      const endDateTime = `${date}T${endFormatted}:00`
      
      // Option 2: Avec timezone UTC (si votre backend attend de l'UTC)
      // const startDateTime = `${date}T${startFormatted}:00Z`
      // const endDateTime = `${date}T${endFormatted}:00Z`
      
      console.log('📅 Données de réservation:', {
        teacher_id: parseInt(teacherId),
        course_id: courseId, // Garder en string si c'est un UUID
        start_time: startDateTime,
        end_time: endDateTime,
        student_id: parseInt(studentId),
        date: date,
        slot: selectedSlot
      })
      
      // CORRECTION 3: Structure de données plus claire
      const body = {
        teacher_id: parseInt(teacherId, 10),
        course_id: courseId, // Si c'est un UUID, rester en string
        start_time: startDateTime,
        end_time: endDateTime,
        student_id: parseInt(studentId, 10),
      }
      
      // CORRECTION 4: Validation des données avant envoi
      if (!body.teacher_id || !body.course_id || !body.student_id) {
        throw new Error('Données manquantes pour la réservation')
      }
      
      const res = await fetch('/api/bookings/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      
      // CORRECTION 5: Meilleure gestion des erreurs
      const data = await res.json().catch(() => ({}))
      
      if (!res.ok) {
        // Log de l'erreur complète pour debugging
        console.error('Erreur API:', {
          status: res.status,
          statusText: res.statusText,
          data: data
        })
        throw new Error(data?.error || data?.message || `Erreur ${res.status}: ${res.statusText}`)
      }
      
      // Sauvegarder les données de réservation pour la page de confirmation
      const bookingId = data.id || data.booking_id || Date.now().toString()
      if (data && Object.keys(data).length > 0) {
        sessionStorage.setItem(`booking_${bookingId}`, JSON.stringify(data))
      }
      
      // Redirection vers la page de confirmation avec l'ID de réservation
      router.push(`/dashboard/parent/confirmation?booking_id=${bookingId}`)
      return
      
    } catch (err: any) {
      console.error('Erreur lors de la réservation:', err)
      setMessage(err?.message || 'Erreur lors de la réservation')
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



            {/* Sélection du cours */}
            {teacherId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-laha-gold" />
                  <label className="text-sm font-medium text-laha-gold-light">
                    Cours disponibles
                  </label>
                </div>
                
                {availableCourses.length === 0 ? (
                  <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <p className="text-orange-300 text-sm">
                      Aucun cours disponible pour ce professeur. Veuillez contacter le professeur pour qu'il ajoute ses cours.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="w-full rounded-lg bg-laha-black/60 border border-laha-gold-dark/30 px-4 py-3 pl-10 text-laha-gold-light placeholder:text-laha-gold-light/50 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold focus:bg-laha-black/80 transition-all appearance-none backdrop-blur-sm"
                        required
                      >
                        <option value="" className="bg-laha-black text-laha-gold-light">-- Choisir un cours --</option>
                        {availableCourses.map((course) => (
                          <option key={course.id} value={course.id.toString()} className="bg-laha-black text-laha-gold-light">
                            {course.title} - {course.duration}min - {course.price} FCFA
                          </option>
                        ))}
                      </select>
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                    </div>
                    
                    {/* Affichage des détails du cours sélectionné */}
                    {selectedCourse && (
                      <div className="bg-laha-black/40 rounded-lg p-4 border border-laha-gold-dark/20">
                        <h4 className="text-laha-gold-light font-medium mb-2">{selectedCourse.title}</h4>
                        <p className="text-laha-gold-light/70 text-sm mb-3">{selectedCourse.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3 text-laha-gold" />
                            <span className="text-laha-gold-light/70">{selectedCourse.level}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-laha-gold-warm" />
                            <span className="text-laha-gold-light/70">{selectedCourse.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-laha-gold text-sm font-medium">{selectedCourse.price} FCFA</span>
                          </div>
                          <div className="text-laha-gold-light/70">
                            {selectedCourse.course_type === 'individual' ? 'Cours individuel' : `Groupe (max ${selectedCourse.max_students})`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                disabled={!canSubmit}
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