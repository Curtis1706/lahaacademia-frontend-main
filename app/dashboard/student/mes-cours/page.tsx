"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Download,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Bookmark,
  Share2,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useStudentData } from "@/hooks/use-student-data"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import Image from "next/image"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  difficulty: string
  price: number
  rating: number
  students_count: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  progress?: number
  is_enrolled: boolean
  is_favorite: boolean
  created_at: string
  lessons_count: number
}

export default function StudentCoursesPage() {
  const { user } = useAuth()
  const { courses, loading, error, refreshData } = useStudentData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filtrer les cours selon les critères sélectionnés
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || course.subject === selectedSubject
    const matchesClass = !selectedClass || course.class_level === selectedClass
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty
    const matchesTab = activeTab === "all" || 
                      (activeTab === "enrolled" && course.is_enrolled) ||
                      (activeTab === "favorites" && course.is_favorite) ||
                      (activeTab === "completed" && course.progress === 100)
    
    return matchesSearch && matchesSubject && matchesClass && matchesDifficulty && matchesTab
  })

  // Calculer les statistiques
  const enrolledCourses = courses.filter(course => course.is_enrolled)
  const favoriteCourses = courses.filter(course => course.is_favorite)
  const availableCourses = courses.filter(course => !course.is_enrolled)

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      beginner: "bg-green-500/10 text-green-500 border-green-500/20",
      intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      advanced: "bg-red-500/10 text-red-500 border-red-500/20"
    }
    return variants[difficulty as keyof typeof variants] || variants.intermediate
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé"
    }
    return labels[difficulty as keyof typeof labels] || difficulty
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const handleEnroll = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        logger.info('Enrolled in course successfully', { courseId }, { context: 'mes-cours' })
        // Rafraîchir les données
        refreshData()
      } else {
        const error = await response.json()
        logger.error('Failed to enroll', new Error(error.error || 'Unknown error'), { context: 'mes-cours', data: { courseId } })
        alert(error.error || "Erreur lors de l'inscription")
      }
    } catch (error) {
      logger.error('Error enrolling in course', error as Error, { context: 'mes-cours', data: { courseId } })
      alert('Erreur de connexion')
    }
  }

  const handleToggleFavorite = async (courseId: string) => {
    try {
      // Vérifier si le cours est déjà favori
      const course = courses.find(c => c.id === courseId)
      const isFavorite = course?.is_favorite

      const response = await fetch(`/api/courses/${courseId}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok || response.status === 204) {
        logger.info('Toggled favorite successfully', { courseId, isFavorite: !isFavorite }, { context: 'mes-cours' })
        // Rafraîchir les données
        refreshData()
      } else {
        const error = await response.json()
        logger.error('Failed to toggle favorite', new Error(error.error || 'Unknown error'), { context: 'mes-cours', data: { courseId } })
        alert(error.error || 'Erreur lors de la mise à jour des favoris')
      }
    } catch (error) {
      logger.error('Error toggling favorite', error as Error, { context: 'mes-cours', data: { courseId } })
      alert('Erreur de connexion')
    }
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/student/mes-cours",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "/dashboard/student/mes-videos",
      icon: <Play className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "/dashboard/student/mes-ouvrages",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Entraînements",
      href: "/dashboard/student/mes-entrainements",
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/student/course-booking",
      icon: <Calendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Liens parentals",
      href: "/dashboard/student/link-parent",
      icon: <Users className="h-5 w-5 shrink-0 text-white" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <AuthGuard requiredRole="student">
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-laha-gold mb-2">
                    Mes Cours
                  </h1>
                  <p className="text-laha-text-secondary">
                    Découvrez et suivez vos cours préférés
                  </p>
                </div>
                <Button
                  onClick={refreshData}
                  disabled={loading}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>

              {/* État de chargement */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
                  <span className="ml-3 text-laha-text-secondary">Chargement des cours...</span>
                </div>
              )}

              {/* Gestion d'erreur */}
              {error && !loading && (
                <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardContent className="py-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                          Erreur de chargement
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                      </div>
                      <Button onClick={refreshData} variant="outline" size="sm">
                        Réessayer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contenu uniquement si pas de chargement */}
              {!loading && !error && (
                <>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Cours suivis</p>
                        <p className="text-laha-text text-xl font-bold">{enrolledCourses.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                        <Clock className="h-5 w-5 text-laha-gold-warm" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Heures d'étude</p>
                        <p className="text-laha-text text-xl font-bold">
                          {enrolledCourses.reduce((total, course) => total + course.duration, 0)}h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                        <Star className="h-5 w-5 text-laha-gold-soft" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Favoris</p>
                        <p className="text-laha-text text-xl font-bold">{favoriteCourses.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Progression</p>
                        <p className="text-laha-text text-xl font-bold">
                          {enrolledCourses.length > 0 
                            ? Math.round(enrolledCourses.reduce((total, course) => total + (course.progress || 0), 0) / enrolledCourses.length)
                            : 0}%
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
                    Filtres
                    <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                </CardHeader>
                {showFilters && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="">Tous les niveaux</option>
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                      </select>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Tous ({courses.length})
                  </TabsTrigger>
                  <TabsTrigger value="enrolled" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Mes Cours ({enrolledCourses.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Favoris ({favoriteCourses.length})
                  </TabsTrigger>
                  <TabsTrigger value="available" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Disponibles ({availableCourses.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <CourseGrid courses={filteredCourses} onEnroll={handleEnroll} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="enrolled" className="space-y-4">
                  <CourseGrid courses={enrolledCourses.filter(course => 
                    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || course.subject === selectedSubject) &&
                    (!selectedClass || course.class_level === selectedClass) &&
                    (!selectedDifficulty || course.difficulty === selectedDifficulty)
                  )} onEnroll={handleEnroll} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  <CourseGrid courses={favoriteCourses.filter(course => 
                    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || course.subject === selectedSubject) &&
                    (!selectedClass || course.class_level === selectedClass) &&
                    (!selectedDifficulty || course.difficulty === selectedDifficulty)
                  )} onEnroll={handleEnroll} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="available" className="space-y-4">
                  <CourseGrid courses={availableCourses.filter(course => 
                    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || course.subject === selectedSubject) &&
                    (!selectedClass || course.class_level === selectedClass) &&
                    (!selectedDifficulty || course.difficulty === selectedDifficulty)
                  )} onEnroll={handleEnroll} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>
              </Tabs>
              </>
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

const CourseGrid = ({ courses, onEnroll, onToggleFavorite }: { 
  courses: Course[], 
  onEnroll: (courseId: string) => void,
  onToggleFavorite: (courseId: string) => void 
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const getDifficultyBadge = (difficulty: string) => {
    const variants = {
      beginner: "bg-green-500/10 text-green-500 border-green-500/20",
      intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      advanced: "bg-red-500/10 text-red-500 border-red-500/20"
    }
    return variants[difficulty as keyof typeof variants] || variants.intermediate
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé"
    }
    return labels[difficulty as keyof typeof labels] || difficulty
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-laha-text-secondary opacity-50" />
        <h3 className="text-lg font-semibold text-laha-text mb-2">Aucun cours trouvé</h3>
        <p className="text-laha-text-secondary">Essayez de modifier vos filtres de recherche</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-all duration-200 hover:scale-105">
          <CardHeader className="pb-3">
            <div className="relative">
              <div className="w-full h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border mb-3">
                <BookOpen className="h-8 w-8 text-laha-text-secondary" />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(course.id)}
                  className={`h-8 w-8 p-0 ${course.is_favorite ? 'text-laha-gold' : 'text-laha-text-secondary hover:text-laha-gold'}`}
                >
                  <Bookmark className={`h-4 w-4 ${course.is_favorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-laha-text-secondary hover:text-laha-gold"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyBadge(course.difficulty)}>
                  {getDifficultyLabel(course.difficulty)}
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
            <div className="flex items-center justify-between text-sm text-laha-text-secondary">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(course.duration)}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {course.students_count}
              </div>
            </div>

            {course.is_enrolled && course.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-laha-text-secondary">Progression</span>
                  <span className="text-laha-gold font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-laha-text-secondary">Par {course.teacher.name}</p>
                <p className="text-laha-gold font-semibold">{formatPrice(course.price)}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-laha-border text-laha-text hover:bg-laha-surface"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Voir
                </Button>
                {course.is_enrolled ? (
                  <Button
                    size="sm"
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Continuer
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onEnroll(course.id)}
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                  >
                    S'inscrire
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
