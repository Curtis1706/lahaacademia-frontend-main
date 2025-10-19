"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
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
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import Image from "next/image"
import Link from "next/link"

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
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedPriceRange, setSelectedPriceRange] = useState("")
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Données de test
  useEffect(() => {
    const mockChildren: Child[] = [
      {
        id: "1",
        name: "Fatou Diallo",
        age: 16,
        class_level: "Terminale",
        subjects: ["Mathématiques", "Physique", "SVT"],
        avatar: "/placeholder-child.jpg"
      },
      {
        id: "2",
        name: "Amadou Traoré",
        age: 14,
        class_level: "Seconde",
        subjects: ["Français", "Histoire", "Géographie"],
        avatar: "/placeholder-child.jpg"
      }
    ]

    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Mathématiques Terminale S - Algèbre",
        description: "Cours complet d'algèbre pour la terminale scientifique avec exercices pratiques et préparation au bac",
        subject: "Mathématiques",
        class_level: "Terminale",
        duration: 120,
        price: 15000,
        teacher: {
          id: "1",
          name: "Dr. Aminata Diallo",
          avatar: "/placeholder-teacher.jpg",
          location: "Dakar, Sénégal",
          country: "Sénégal",
          languages: ["Français", "Anglais", "Wolof"],
          rating: 4.8,
          students_count: 245,
          hourly_rate: 8000,
          subjects: ["Mathématiques", "Physique"],
          class_levels: ["Terminale", "Première"],
          availability: [
            { day: "Lundi", start_time: "14:00", end_time: "18:00" },
            { day: "Mercredi", start_time: "14:00", end_time: "18:00" },
            { day: "Vendredi", start_time: "14:00", end_time: "18:00" }
          ],
          profile: {
            bio: "Professeur de mathématiques avec 15 ans d'expérience, spécialisée dans la préparation au baccalauréat",
            experience: 15,
            education: "Doctorat en Mathématiques - Université Cheikh Anta Diop",
            certifications: ["Certification pédagogique", "Formation en ligne"]
          }
        },
        schedule: [
          { day: "Lundi", start_time: "15:00", end_time: "17:00", available_slots: 3 },
          { day: "Mercredi", start_time: "15:00", end_time: "17:00", available_slots: 2 },
          { day: "Vendredi", start_time: "15:00", end_time: "17:00", available_slots: 4 }
        ],
        max_students: 8,
        current_students: 5,
        rating: 4.8,
        reviews_count: 89
      },
      {
        id: "2",
        title: "Physique Quantique - Introduction",
        description: "Introduction aux concepts fondamentaux de la physique quantique avec applications pratiques",
        subject: "Physique",
        class_level: "Terminale",
        duration: 90,
        price: 20000,
        teacher: {
          id: "2",
          name: "Prof. Jean-Baptiste",
          avatar: "/placeholder-teacher.jpg",
          location: "Paris, France",
          country: "France",
          languages: ["Français", "Anglais"],
          rating: 4.9,
          students_count: 156,
          hourly_rate: 12000,
          subjects: ["Physique", "Mathématiques"],
          class_levels: ["Terminale"],
          availability: [
            { day: "Mardi", start_time: "16:00", end_time: "20:00" },
            { day: "Jeudi", start_time: "16:00", end_time: "20:00" },
            { day: "Samedi", start_time: "10:00", end_time: "14:00" }
          ],
          profile: {
            bio: "Physicien théoricien avec une expertise en mécanique quantique et relativité",
            experience: 12,
            education: "PhD en Physique Théorique - Sorbonne Université",
            certifications: ["Certification internationale", "Formation avancée"]
          }
        },
        schedule: [
          { day: "Mardi", start_time: "17:00", end_time: "18:30", available_slots: 5 },
          { day: "Jeudi", start_time: "17:00", end_time: "18:30", available_slots: 3 },
          { day: "Samedi", start_time: "11:00", end_time: "12:30", available_slots: 6 }
        ],
        max_students: 10,
        current_students: 7,
        rating: 4.9,
        reviews_count: 67
      },
      {
        id: "3",
        title: "Français - Techniques de Dissertation",
        description: "Guide méthodologique pour réussir la dissertation en français avec exemples et corrigés",
        subject: "Français",
        class_level: "Première",
        duration: 60,
        price: 12000,
        teacher: {
          id: "3",
          name: "Dr. Fatou Ndiaye",
          avatar: "/placeholder-teacher.jpg",
          location: "Bamako, Mali",
          country: "Mali",
          languages: ["Français", "Bambara"],
          rating: 4.6,
          students_count: 189,
          hourly_rate: 6000,
          subjects: ["Français", "Littérature"],
          class_levels: ["Première", "Terminale"],
          availability: [
            { day: "Lundi", start_time: "15:00", end_time: "19:00" },
            { day: "Mercredi", start_time: "15:00", end_time: "19:00" },
            { day: "Vendredi", start_time: "15:00", end_time: "19:00" }
          ],
          profile: {
            bio: "Professeure de français et littérature avec une passion pour l'enseignement",
            experience: 10,
            education: "Master en Littérature Française - Université de Bamako",
            certifications: ["Certification pédagogique", "Formation continue"]
          }
        },
        schedule: [
          { day: "Lundi", start_time: "16:00", end_time: "17:00", available_slots: 4 },
          { day: "Mercredi", start_time: "16:00", end_time: "17:00", available_slots: 2 },
          { day: "Vendredi", start_time: "16:00", end_time: "17:00", available_slots: 3 }
        ],
        max_students: 6,
        current_students: 4,
        rating: 4.6,
        reviews_count: 45
      }
    ]
    
    setTimeout(() => {
      setChildren(mockChildren)
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || course.subject === selectedSubject
    const matchesClass = !selectedClass || course.class_level === selectedClass
    const matchesCountry = !selectedCountry || course.teacher.country === selectedCountry
    const matchesLanguage = !selectedLanguage || course.teacher.languages.includes(selectedLanguage)
    const matchesPrice = !selectedPriceRange || (
      selectedPriceRange === "low" && course.price <= 10000 ||
      selectedPriceRange === "medium" && course.price > 10000 && course.price <= 20000 ||
      selectedPriceRange === "high" && course.price > 20000
    )

    return matchesSearch && matchesSubject && matchesClass && matchesCountry && matchesLanguage && matchesPrice
  })

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

  const [open, setOpen] = useState(false)

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
                        src="/placeholder.svg?height=50&width=50&text=KA"
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
          
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto">
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
                        <option value="">Toutes les matières</option>
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
                        <option value="">Toutes les classes</option>
                        <option value="Seconde">Seconde</option>
                        <option value="Première">Première</option>
                        <option value="Terminale">Terminale</option>
                      </select>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="">Tous les pays</option>
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
                        <option value="">Toutes les langues</option>
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
                        <option value="">Tous les prix</option>
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
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <span className="font-medium whitespace-pre text-white font-heading">
        Lahacademia
      </span>
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