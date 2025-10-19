"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Award,
  Clock,
  Users,
  Star,
  Play,
  Download,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  BookOpen,
  TrendingUp,
  Eye,
  Bookmark,
  Share2,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  Trophy
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

interface Exercise {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  type: string
  difficulty: string
  duration: number
  questions_count: number
  max_score: number
  price: number
  rating: number
  attempts: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  progress?: number
  best_score?: number
  is_completed: boolean
  is_favorite: boolean
  created_at: string
  last_attempt?: string
  average_score: number
}

export default function StudentExercisesPage() {
  const { user } = useAuth()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockExercises: Exercise[] = [
      {
        id: "1",
        title: "QCM Mathématiques - Algèbre Terminale",
        description: "Questionnaire à choix multiples sur les concepts d'algèbre pour la terminale scientifique",
        subject: "Mathématiques",
        class_level: "Terminale",
        type: "QCM",
        difficulty: "intermediate",
        duration: 30,
        questions_count: 20,
        max_score: 100,
        price: 5000,
        rating: 4.7,
        attempts: 3,
        teacher: {
          name: "Dr. Aminata Diallo",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-exercise.jpg",
        progress: 100,
        best_score: 85,
        is_completed: true,
        is_favorite: true,
        created_at: "2025-01-15",
        last_attempt: "2025-01-20",
        average_score: 78
      },
      {
        id: "2",
        title: "Exercices Physique - Mécanique",
        description: "Série d'exercices pratiques sur la mécanique avec corrigés détaillés",
        subject: "Physique",
        class_level: "Première",
        type: "Exercices",
        difficulty: "advanced",
        duration: 45,
        questions_count: 15,
        max_score: 100,
        price: 7000,
        rating: 4.8,
        attempts: 1,
        teacher: {
          name: "Prof. Jean-Baptiste",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-exercise.jpg",
        progress: 60,
        best_score: 72,
        is_completed: false,
        is_favorite: false,
        created_at: "2025-01-20",
        last_attempt: "2025-01-22",
        average_score: 65
      },
      {
        id: "3",
        title: "Quiz Français - Grammaire",
        description: "Quiz interactif sur les règles de grammaire française avec feedback immédiat",
        subject: "Français",
        class_level: "Quatrième",
        type: "Quiz",
        difficulty: "beginner",
        duration: 20,
        questions_count: 25,
        max_score: 100,
        price: 3000,
        rating: 4.5,
        attempts: 0,
        teacher: {
          name: "Dr. Fatou Ndiaye",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-exercise.jpg",
        progress: 0,
        best_score: 0,
        is_completed: false,
        is_favorite: true,
        created_at: "2025-01-18",
        average_score: 70
      },
      {
        id: "4",
        title: "Contrôle SVT - Biologie",
        description: "Contrôle de connaissances sur la biologie cellulaire avec évaluation automatique",
        subject: "SVT",
        class_level: "Seconde",
        type: "Contrôle",
        difficulty: "intermediate",
        duration: 40,
        questions_count: 18,
        max_score: 100,
        price: 6000,
        rating: 4.6,
        attempts: 2,
        teacher: {
          name: "Dr. Sophie Leroy",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-exercise.jpg",
        progress: 100,
        best_score: 90,
        is_completed: true,
        is_favorite: false,
        created_at: "2025-01-22",
        last_attempt: "2025-01-25",
        average_score: 82
      }
    ]
    
    setTimeout(() => {
      setExercises(mockExercises)
      setLoading(false)
    }, 1000)
  }, [])

  const completedExercises = exercises.filter(exercise => exercise.is_completed)
  const favoriteExercises = exercises.filter(exercise => exercise.is_favorite)
  const pendingExercises = exercises.filter(exercise => !exercise.is_completed)

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || exercise.subject === selectedSubject
    const matchesClass = !selectedClass || exercise.class_level === selectedClass
    const matchesType = !selectedType || exercise.type === selectedType

    return matchesSearch && matchesSubject && matchesClass && matchesType
  })

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

  const getTypeIcon = (type: string) => {
    const icons = {
      QCM: <Target className="h-4 w-4" />,
      Quiz: <Zap className="h-4 w-4" />,
      Exercices: <BookOpen className="h-4 w-4" />,
      Contrôle: <Award className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || <Award className="h-4 w-4" />
  }

  const formatDuration = (minutes: number) => {
    return `${minutes}min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const handleToggleFavorite = (exerciseId: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, is_favorite: !exercise.is_favorite }
        : exercise
    ))
  }

  const handleStartExercise = (exerciseId: string) => {
    // Simulation du démarrage d'un exercice
    console.log(`Démarrage de l'exercice ${exerciseId}`)
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/student/mes-cours",
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "/dashboard/student/mes-videos",
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "/dashboard/student/mes-ouvrages",
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-laha-gold mb-2">
                  Mes Entraînements
                </h1>
                <p className="text-laha-text-secondary">
                  Testez vos connaissances avec nos exercices interactifs
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <Award className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Entraînements</p>
                        <p className="text-laha-text text-xl font-bold">{exercises.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-laha-gold-warm" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Terminés</p>
                        <p className="text-laha-text text-xl font-bold">{completedExercises.length}</p>
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
                        <p className="text-laha-text text-xl font-bold">{favoriteExercises.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <Trophy className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Score moyen</p>
                        <p className="text-laha-text text-xl font-bold">
                          {completedExercises.length > 0 
                            ? Math.round(completedExercises.reduce((total, ex) => total + (ex.best_score || 0), 0) / completedExercises.length)
                            : 0}/100
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
                          placeholder="Rechercher un entraînement..."
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
                        <option value="Quatrième">Quatrième</option>
                        <option value="Seconde">Seconde</option>
                        <option value="Première">Première</option>
                        <option value="Terminale">Terminale</option>
                      </select>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="">Tous les types</option>
                        <option value="QCM">QCM</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Exercices">Exercices</option>
                        <option value="Contrôle">Contrôle</option>
                      </select>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Tous ({exercises.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Terminés ({completedExercises.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Favoris ({favoriteExercises.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    En attente ({pendingExercises.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <ExerciseGrid exercises={filteredExercises} onStart={handleStartExercise} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  <ExerciseGrid exercises={completedExercises.filter(exercise => 
                    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || exercise.subject === selectedSubject) &&
                    (!selectedClass || exercise.class_level === selectedClass) &&
                    (!selectedType || exercise.type === selectedType)
                  )} onStart={handleStartExercise} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  <ExerciseGrid exercises={favoriteExercises.filter(exercise => 
                    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || exercise.subject === selectedSubject) &&
                    (!selectedClass || exercise.class_level === selectedClass) &&
                    (!selectedType || exercise.type === selectedType)
                  )} onStart={handleStartExercise} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  <ExerciseGrid exercises={pendingExercises.filter(exercise => 
                    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || exercise.subject === selectedSubject) &&
                    (!selectedClass || exercise.class_level === selectedClass) &&
                    (!selectedType || exercise.type === selectedType)
                  )} onStart={handleStartExercise} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>
              </Tabs>
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

const ExerciseGrid = ({ exercises, onStart, onToggleFavorite }: { 
  exercises: Exercise[], 
  onStart: (exerciseId: string) => void,
  onToggleFavorite: (exerciseId: string) => void 
}) => {
  const formatDuration = (minutes: number) => {
    return `${minutes}min`
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

  const getTypeIcon = (type: string) => {
    const icons = {
      QCM: <Target className="h-4 w-4" />,
      Quiz: <Zap className="h-4 w-4" />,
      Exercices: <BookOpen className="h-4 w-4" />,
      Contrôle: <Award className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || <Award className="h-4 w-4" />
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-16 w-16 mx-auto mb-4 text-laha-text-secondary opacity-50" />
        <h3 className="text-lg font-semibold text-laha-text mb-2">Aucun entraînement trouvé</h3>
        <p className="text-laha-text-secondary">Essayez de modifier vos filtres de recherche</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-all duration-200 hover:scale-105">
          <CardHeader className="pb-3">
            <div className="relative">
              <div className="w-full h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border mb-3">
                <Award className="h-8 w-8 text-laha-text-secondary" />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(exercise.id)}
                  className={`h-8 w-8 p-0 ${exercise.is_favorite ? 'text-laha-gold' : 'text-laha-text-secondary hover:text-laha-gold'}`}
                >
                  <Bookmark className={`h-4 w-4 ${exercise.is_favorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-laha-text-secondary hover:text-laha-gold"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                  {getTypeIcon(exercise.type)}
                  <span className="ml-1">{exercise.type}</span>
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={getDifficultyBadge(exercise.difficulty)}>
                  {getDifficultyLabel(exercise.difficulty)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-laha-text-secondary">
                  <Star className="h-3 w-3 text-laha-gold fill-current" />
                  {exercise.rating}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-laha-text line-clamp-2">{exercise.title}</h3>
              <p className="text-sm text-laha-text-secondary line-clamp-2">{exercise.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-laha-text-secondary">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(exercise.duration)}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {exercise.questions_count} questions
              </div>
            </div>

            {exercise.is_completed && exercise.best_score !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-laha-text-secondary">Meilleur score</span>
                  <span className="text-laha-gold font-medium">{exercise.best_score}/100</span>
                </div>
                <Progress value={exercise.best_score} className="h-2" />
                <div className="flex justify-between text-xs text-laha-text-secondary">
                  <span>{exercise.attempts} tentative{exercise.attempts > 1 ? 's' : ''}</span>
                  <span>Score moyen: {exercise.average_score}/100</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-laha-text-secondary">Par {exercise.teacher.name}</p>
                <p className="text-laha-gold font-semibold">{formatPrice(exercise.price)}</p>
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
                <Button
                  size="sm"
                  onClick={() => onStart(exercise.id)}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {exercise.is_completed ? 'Refaire' : 'Commencer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
