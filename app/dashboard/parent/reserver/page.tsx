"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { useTeachersAndCourses } from "@/hooks/use-teachers-and-courses"
import { 
  Calendar,
  Clock,
  MapPin,
  Star,
  GraduationCap,
  Award,
  Globe,
  Users,
  BookOpen,
  CheckCircle,
  Filter,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Teacher {
  id: string
  name: string
  avatar?: string
  location: string
  country: string
  languages: string[]
  rating: number
  students_count: number
  hourly_rate: number
  subjects: string[]
  class_levels: string[]
  bio: string
  experience: number
  education: string
  certifications: string[]
}

interface Child {
  id: string
  name: string
  class_level: string
}

interface Course {
  id: string
  title: string
  subject: string
  duration: number
  price: number
  available_slots: string[]
  teacher_id: string
  class_level: string
  country: string
  language: string
}

export default function ParentBookingPage() {
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [selectedTeacher, setSelectedTeacher] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [children, setChildren] = useState<Child[]>([])
  const [parent, setParent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Utiliser le hook pour récupérer les données des enseignants et cours
  const { teachers, courses, isLoading: dataLoading, error: dataError } = useTeachersAndCourses()
  
  // Filtres
  const [filters, setFilters] = useState({
    subject: "all",
    class: "all",
    country: "all",
    language: "all",
    priceRange: "all"
  })

  // Charger les données depuis le cookie
  useEffect(() => {
    const loadDataFromCookie = () => {
      try {
        console.log('🔄 Chargement des données pour la réservation...')
        
        // Vérifier si le cookie existe
        const cookies = document.cookie.split(';')
        const userSessionCookie = cookies.find(cookie => 
          cookie.trim().startsWith('user_session_client=')
        )

        if (!userSessionCookie) {
          console.error('❌ Pas de cookie user_session_client trouvé')
          setLoading(false)
          return
        }

        // Parser les données du cookie
        const sessionValue = userSessionCookie.split('=')[1]
        const userData = JSON.parse(decodeURIComponent(sessionValue))
        console.log('✅ Données utilisateur du cookie:', userData)

        // Utiliser les données mockées avec les vraies informations de Serge
        const mockChildren: Child[] = [
          {
            id: "1",
            name: "Spero",
            class_level: "Seconde"
          }
        ]

        setChildren(mockChildren)
        setParent({
          id: userData.id || "1",
          name: `${userData.first_name || 'Serge'} ${userData.last_name || 'ALOHOUTADE'}`,
          email: userData.email || "serge10@gmail.com"
        })
        
        // Sélectionner automatiquement le premier enfant
        if (mockChildren.length > 0) {
          setSelectedChild(mockChildren[0].id)
        }
        
        console.log('✅ Données chargées pour la réservation:', { children: mockChildren, parent: userData })
        setLoading(false)
        
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données:', err)
        setLoading(false)
      }
    }

    loadDataFromCookie()
  }, [])

  const selectedTeacherData = teachers.find(t => t.id === selectedTeacher)
  const selectedCourseData = courses.find(c => c.id === selectedCourse)

  // Logique de filtrage des cours
  const filteredCourses = courses.filter(course => {
    const matchesSubject = filters.subject === "all" || course.subject === filters.subject
    const matchesClass = filters.class === "all" || course.class_level === filters.class
    const matchesCountry = filters.country === "all" || course.country === filters.country
    const matchesLanguage = filters.language === "all" || course.language === filters.language
    
    return matchesSubject && matchesClass && matchesCountry && matchesLanguage
  })

  // Logique de filtrage des enseignants basée sur les cours filtrés
  const filteredTeachers = teachers.filter(teacher => 
    filteredCourses.some(course => course.teacher_id === teacher.id)
  )

  // Fonction pour mettre à jour les filtres
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    // Réinitialiser les sélections quand les filtres changent
    setSelectedTeacher("")
    setSelectedCourse("")
    setSelectedDate("")
    setSelectedTimeSlot("")
  }

  // Fonction pour obtenir les options uniques pour chaque filtre
  const getUniqueSubjects = () => {
    const subjects = courses.map(course => course.subject)
    return Array.from(new Set(subjects))
  }

  const getUniqueClasses = () => {
    const classes = courses.map(course => course.class_level)
    return Array.from(new Set(classes))
  }

  const getUniqueCountries = () => {
    const countries = courses.map(course => course.country)
    return Array.from(new Set(countries))
  }

  const getUniqueLanguages = () => {
    const languages = courses.map(course => course.language)
    return Array.from(new Set(languages))
  }

  if (loading || dataLoading) {
    return (
      <AuthGuard requiredRole="parent">
        <ParentSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-laha-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-laha-text">Chargement des données...</p>
                </div>
              </div>
            </div>
          </div>
        </ParentSidebar>
      </AuthGuard>
    )
  }

  if (dataError) {
    return (
      <AuthGuard requiredRole="parent">
        <ParentSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <p className="text-red-500 mb-2">Erreur lors du chargement des données</p>
                  <p className="text-laha-text/70 text-sm">{dataError}</p>
                </div>
              </div>
            </div>
          </div>
        </ParentSidebar>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="w-full px-6 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-laha-gold mb-2">Réserver un cours</h1>
            <p className="text-laha-text">Réservez des cours personnalisés pour vos enfants</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de réservation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-laha-text">Formulaire de réservation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sélectionner un enfant */}
                    <div>
                    <Label htmlFor="child">Sélectionner un enfant</Label>
                    <Select value={selectedChild} onValueChange={setSelectedChild}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un enfant" />
                      </SelectTrigger>
                      <SelectContent>
                    {children.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name} - {child.class_level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtres */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-laha-gold" />
                      <Label className="text-laha-text font-medium">Filtres avancés</Label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Matière</Label>
                        <Select value={filters.subject} onValueChange={(value) => updateFilter('subject', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Toutes les matières" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les matières</SelectItem>
                            {getUniqueSubjects().map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="class">Classe</Label>
                        <Select value={filters.class} onValueChange={(value) => updateFilter('class', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Toutes les classes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les classes</SelectItem>
                            {getUniqueClasses().map(classLevel => (
                              <SelectItem key={classLevel} value={classLevel}>{classLevel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Select value={filters.country} onValueChange={(value) => updateFilter('country', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tous les pays" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous les pays</SelectItem>
                            {getUniqueCountries().map(country => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="language">Langue</Label>
                        <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Toutes les langues" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes les langues</SelectItem>
                            {getUniqueLanguages().map(language => (
                              <SelectItem key={language} value={language}>{language}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Choisir un professeur */}
                  <div>
                    <Label htmlFor="teacher">Choisir un professeur</Label>
                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un professeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            <div className="flex items-center space-x-2">
                              <span>{teacher.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {teacher.subjects.join(", ")}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cours disponibles */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="course">Cours disponibles</Label>
                      <Badge variant="outline" className="text-xs">
                        {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un cours" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{course.title}</span>
                              <span className="text-sm text-laha-text/70 ml-2">
                                {course.price.toLocaleString()} FCFA
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date du cours */}
                  <div>
                    <Label htmlFor="date">Date du cours</Label>
                    <Input 
                      id="date"
                      type="date" 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  {/* Créneaux horaires */}
                  {selectedCourseData && (
                    <div>
                      <Label>Creneaux horaires disponibles</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {selectedCourseData.available_slots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTimeSlot === slot ? "default" : "outline"}
                            className={selectedTimeSlot === slot ? "bg-laha-gold text-laha-black" : "border-laha-border text-laha-text"}
                            onClick={() => setSelectedTimeSlot(slot)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            {slot}
                          </Button>
                  ))}
                </div>
              </div>
            )}

                  {/* Bouton de confirmation */}
                  <Button 
                    className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    disabled={!selectedChild || !selectedTeacher || !selectedCourse || !selectedDate || !selectedTimeSlot}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmer la réservation
                  </Button>
                </CardContent>
              </Card>
                </div>

            {/* Profil du professeur sélectionné */}
            <div>
              {selectedTeacherData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-laha-text">Profil du professeur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-laha-gold rounded-full flex items-center justify-center text-laha-black font-bold text-lg">
                        {selectedTeacherData.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-laha-text">{selectedTeacherData.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-laha-gold fill-current" />
                          <span className="text-laha-text">{selectedTeacherData.rating}/5</span>
                          <span className="text-laha-text/70">({selectedTeacherData.students_count} élèves)</span>
                        </div>
                </div>
                  </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-laha-text mb-2">Biographie</h4>
                      <p className="text-laha-text/70 text-sm">{selectedTeacherData.bio}</p>
                  </div>
                
                    <div className="grid grid-cols-2 gap-4">
                  <div>
                        <h4 className="font-semibold text-laha-text mb-2">Matières enseignées</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedTeacherData.subjects.map((subject, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-laha-gold text-laha-gold">
                              {subject}
                            </Badge>
                      ))}
                    </div>
                  </div>
                
                  <div>
                        <h4 className="font-semibold text-laha-text mb-2">Classes</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedTeacherData.class_levels.map((level, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-laha-gold text-laha-gold">
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-laha-gold" />
                        <span className="text-sm text-laha-text">{selectedTeacherData.location}, {selectedTeacherData.country}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-laha-gold" />
                        <span className="text-sm text-laha-text">{selectedTeacherData.languages.join(", ")}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-laha-gold" />
                        <span className="text-sm text-laha-text">{selectedTeacherData.education}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-laha-gold" />
                        <span className="text-sm text-laha-text">{selectedTeacherData.experience} ans d'expérience</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="text-center">
                      <div className="text-2xl font-bold text-laha-gold">
                        {selectedTeacherData.hourly_rate.toLocaleString()} FCFA/h
                      </div>
                      <p className="text-sm text-laha-text/70">Tarif horaire</p>
                </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-laha-text/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-laha-text mb-2">Sélectionnez un professeur</h3>
                    <p className="text-laha-text/70">Choisissez un professeur pour voir son profil détaillé</p>
                  </CardContent>
                </Card>
            )}
          </div>
          </div>
        </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}