"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { useTeachersAndCourses } from "@/hooks/use-teachers-and-courses"
import { 
  Calendar,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  BookOpen,
  GraduationCap,
  DollarSign,
  Eye,
  Bookmark,
  Share2,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  User,
  Phone,
  Mail,
  Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

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
  availability: {
    day: string
    start_time: string
    end_time: string
  }[]
  profile: {
    bio: string
    experience: number
    education: string
    certifications: string[]
  }
}

interface Course {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  price: number
  teacher: Teacher
  schedule: {
    day: string
    start_time: string
    end_time: string
    available_slots: number
  }[]
  max_students: number
  current_students: number
  rating: number
  reviews_count: number
}

interface Child {
  id: string
  name: string
  age: number
  class_level: string
  subjects: string[]
  avatar?: string
}

export default function ParentBookingPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Utiliser le hook pour récupérer les données des enseignants et cours
  const { teachers, courses: apiCourses, isLoading: dataLoading, error: dataError } = useTeachersAndCourses()

  // Charger les données depuis le cookie
  useEffect(() => {
    const loadDataFromCookie = () => {
      try {
        console.log('🔄 Chargement des données pour les réservations...')
        
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
            age: 15,
            class_level: "Seconde",
            subjects: ["Mathématiques", "Français", "Histoire"],
            avatar: undefined
          }
        ]

        setChildren(mockChildren)
        
        // Sélectionner automatiquement le premier enfant
        if (mockChildren.length > 0) {
          setSelectedChild(mockChildren[0].id)
        }
        
        console.log('✅ Données chargées pour les réservations:', { children: mockChildren })
        setLoading(false)
        
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données:', err)
        setLoading(false)
      }
    }

    loadDataFromCookie()
  }, [])

  // Mettre à jour les cours quand les données API sont chargées
  useEffect(() => {
    if (apiCourses.length > 0) {
      // Transformer les cours API pour correspondre à l'interface locale
      const transformedCourses = apiCourses.map(course => ({
        ...course,
        schedule: course.available_slots?.map(slot => ({
          day: "Lundi", // Valeur par défaut
          start_time: slot,
          end_time: slot,
          available_slots: 5
        })) || [],
        max_students: 8,
        current_students: 3,
        rating: course.teacher?.rating || 4.0,
        reviews_count: 10,
        teacher: {
          ...course.teacher,
          location: course.teacher?.country || "Non spécifié",
          students_count: 50,
          hourly_rate: course.price || 5000,
          subjects: [course.subject],
          class_levels: [course.class_level],
          bio: "Enseignant expérimenté",
          experience: 5,
          education: "Formation pédagogique",
          certifications: ["Certification pédagogique"],
          availability: [],
          profile: {
            bio: "Enseignant expérimenté",
            experience: 5,
            education: "Formation pédagogique",
            certifications: ["Certification pédagogique"]
          }
        }
      }))
      setCourses(transformedCourses)
      setLoading(false)
    }
  }, [apiCourses])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSubject = selectedSubject === "all" || course.subject === selectedSubject
    const matchesClass = selectedClass === "all" || course.class_level === selectedClass
    const matchesCountry = selectedCountry === "all" || course.teacher.country === selectedCountry
    const matchesLanguage = selectedLanguage === "all" || course.teacher.languages.includes(selectedLanguage)
    const matchesPriceRange = selectedPriceRange === "all" || 
      (selectedPriceRange === "low" && course.price <= 5000) ||
      (selectedPriceRange === "medium" && course.price > 5000 && course.price <= 10000) ||
      (selectedPriceRange === "high" && course.price > 10000)
    
    return matchesSearch && matchesSubject && matchesClass && matchesCountry && matchesLanguage && matchesPriceRange
  })

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
    const countries = courses.map(course => course.teacher.country)
    return Array.from(new Set(countries))
  }

  const getUniqueLanguages = () => {
    const languages = courses.flatMap(course => course.teacher.languages)
    return Array.from(new Set(languages))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const handleBookCourse = (course: Course) => {
    setSelectedCourse(course)
    setShowBookingModal(true)
  }
  
  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <Calendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/parent/reservations",
      icon: <Calendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Suivi des progrès",
      href: "/dashboard/parent/suivi",
      icon: <GraduationCap className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes enfants",
      href: "/dashboard/parent/enfants",
      icon: <Users className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paiements",
      href: "/dashboard/parent/paiements",
      icon: <DollarSign className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Messages",
      href: "/dashboard/parent/messages",
      icon: <Mail className="h-5 w-5 shrink-0 text-white" />,
    },
  ]


  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="w-full px-6 py-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-laha-gold mb-2">
                  Réservation de Cours
                </h1>
                <p className="text-laha-text-secondary">
                  Trouvez le cours parfait pour vos enfants
                </p>
                </div>
                
              {/* Sélection d'enfant */}
              <Card className="mb-6 bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-text">Sélectionner un enfant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    {children.map((child) => (
                      <Button
                        key={child.id}
                        variant={selectedChild === child.id ? "default" : "outline"}
                        onClick={() => setSelectedChild(child.id)}
                        className={`flex items-center gap-3 ${
                          selectedChild === child.id 
                            ? "bg-laha-gold text-laha-black" 
                            : "border-laha-border text-laha-text hover:bg-laha-surface"
                        }`}
                      >
                        <img
                          src={child.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={child.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="text-left">
                          <p className="font-medium">{child.name}</p>
                          <p className="text-sm opacity-75">{child.class_level}</p>
                        </div>
                      </Button>
                    ))}
              </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Cours disponibles</p>
                        <p className="text-laha-text text-xl font-bold">{courses.length}</p>
            </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                        <Users className="h-5 w-5 text-laha-gold-warm" />
                  </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Enseignants</p>
                        <p className="text-laha-text text-xl font-bold">
                          {new Set(courses.map(c => c.teacher.id)).size}
                        </p>
                </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                        <Globe className="h-5 w-5 text-laha-gold-soft" />
                  </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Pays</p>
                        <p className="text-laha-text text-xl font-bold">
                          {new Set(courses.map(c => c.teacher.country)).size}
                        </p>
                </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <Star className="h-5 w-5 text-laha-gold" />
                  </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Note moyenne</p>
                        <p className="text-laha-text text-xl font-bold">
                          {(courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)}
                        </p>
                </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="mb-6 bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-laha-text hover:text-laha-gold"
                  >
                    <Filter className="h-4 w-4" />
                    Filtres avancés
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </CardHeader>
                {showFilters && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                        <Input
                          placeholder="Rechercher un cours..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="all">Toutes les matières</option>
                        <option value="Mathématiques">Mathématiques</option>
                        <option value="Physique">Physique</option>
                        <option value="Français">Français</option>
                        <option value="SVT">SVT</option>
                      </select>
                  <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="all">Toutes les classes</option>
                        <option value="Seconde">Seconde</option>
                        <option value="Première">Première</option>
                        <option value="Terminale">Terminale</option>
                  </select>
                  <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="all">Tous les pays</option>
                        <option value="Sénégal">Sénégal</option>
                        <option value="France">France</option>
                        <option value="Mali">Mali</option>
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  </select>
                  <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="all">Toutes les langues</option>
                        <option value="Français">Français</option>
                        <option value="Anglais">Anglais</option>
                        <option value="Wolof">Wolof</option>
                        <option value="Bambara">Bambara</option>
                  </select>
                  <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="all">Tous les prix</option>
                        <option value="low">≤ 10,000 FCFA</option>
                        <option value="medium">10,000 - 20,000 FCFA</option>
                        <option value="high">&gt; 20,000 FCFA</option>
                  </select>
                </div>
                  </CardContent>
                )}
              </Card>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-all duration-200 hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="relative">
                        <div className="w-full h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border mb-3">
                          <BookOpen className="h-8 w-8 text-laha-text-secondary" />
              </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                            {course.teacher.country}
                          </Badge>
                        </div>
                              </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="border-laha-border text-laha-text">
                            {course.subject}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-laha-text-secondary">
                            <Star className="h-3 w-3 text-laha-gold fill-current" />
                            {course.rating}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-laha-text line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-laha-text-secondary line-clamp-2">{course.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Teacher Info */}
                      <div className="flex items-center gap-3 p-3 bg-laha-background/50 rounded-lg">
                        <img
                          src={course.teacher.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={course.teacher.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-laha-text">{course.teacher.name}</p>
                          <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                            <MapPin className="h-3 w-3" />
                            {course.teacher.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                            <Globe className="h-3 w-3" />
                            {course.teacher.languages.join(", ")}
                      </div>
                    </div>
                      </div>

                      {/* Course Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-laha-text-secondary">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(course.duration)}
                      </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.current_students}/{course.max_students}
                      </div>
                    </div>
                        <div className="flex items-center justify-between text-sm text-laha-text-secondary">
                          <span>{course.class_level}</span>
                          <span className="text-laha-gold font-semibold">{formatPrice(course.price)}</span>
                      </div>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-laha-text">Horaires disponibles:</p>
                        <div className="space-y-1">
                          {course.schedule.slice(0, 2).map((slot, index) => (
                            <div key={index} className="flex items-center justify-between text-xs bg-laha-background/30 p-2 rounded">
                              <span className="text-laha-text">{slot.day}</span>
                              <span className="text-laha-text-secondary">{slot.start_time} - {slot.end_time}</span>
                              <Badge variant="outline" className="text-xs">
                                {slot.available_slots} places
                              </Badge>
                    </div>
                          ))}
                          {course.schedule.length > 2 && (
                            <p className="text-xs text-laha-text-secondary">
                              +{course.schedule.length - 2} autres créneaux
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir détails
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBookCourse(course)}
                          disabled={!selectedChild}
                          className="flex-1 bg-laha-gold hover:bg-laha-gold/90 text-laha-black disabled:opacity-50"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Réserver
                        </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-laha-text-secondary opacity-50" />
                  <h3 className="text-lg font-semibold text-laha-text mb-2">Aucun cours trouvé</h3>
                  <p className="text-laha-text-secondary">Essayez de modifier vos filtres de recherche</p>
                </div>
              )}
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}
