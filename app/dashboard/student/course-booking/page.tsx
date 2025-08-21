"use client"

import { useState, useEffect } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconCalendar,
  IconTrophy,
  IconUsers,
  IconChartBar,
  IconVideo,
  IconBook2,
  IconBarbell,
  IconCalendarEvent,
  IconRobot,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { BookOpen, Clock, Star, TrendingUp, Award, Play, Calendar, MessageSquare, Search, Filter, MapPin, Clock as ClockIcon, Users, BookOpen as BookOpenIcon } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { BookingModal } from "./components/BookingModal"
import { getCoursesWithTeachers, getAvailableTeachers, Course, Teacher } from "@/lib/api-courses"

export default function CourseBookingPage() {
  const { user, logout } = useAuth()
  
  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "#",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "#",
      icon: <IconVideo className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "#",
      icon: <IconBook2 className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Entraînements",
      href: "#",
      icon: <IconBarbell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Réservation de cours",
      href: "/dashboard/student/course-booking",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" />,
      isActive: true,
    },
    {
      label: "Mon Enseignant IA",
      href: "#",
      icon: <IconRobot className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Favoris",
      href: "#",
      icon: <IconHeart className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Alertes",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Planning",
      href: "#",
      icon: <IconCalendar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Liens parentals",
      href: "/dashboard/student/link-parent",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Notes",
      href: "#",
      icon: <IconTrophy className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Communauté",
      href: "#",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
      onClick: logout,
    },
  ]

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  
  // États pour les vraies données
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les données depuis l'API
  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Charger les cours et professeurs en parallèle
      const [coursesResponse, teachersResponse] = await Promise.all([
        getCoursesWithTeachers({
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
          level: selectedLevel !== 'all' ? selectedLevel : undefined,
          country: selectedCountry !== 'all' ? selectedCountry : undefined,
          search: searchTerm || undefined
        }),
        getAvailableTeachers({
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
          country: selectedCountry !== 'all' ? selectedCountry : undefined,
          search: searchTerm || undefined
        })
      ])
      
      setCourses(coursesResponse.data)
      setTeachers(teachersResponse.data)
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err)
      setError('Erreur lors du chargement des données. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les données au montage du composant
  useEffect(() => {
    loadData()
  }, [])

  // Recharger les données quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadData()
    }, 500) // Délai de 500ms pour éviter trop d'appels API

    return () => clearTimeout(timeoutId)
  }, [selectedSubject, selectedLevel, selectedCountry, searchTerm])

  // Les données sont déjà filtrées côté serveur, on utilise directement les états
  const filteredCourses = courses
  const filteredTeachers = teachers

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
          <CourseBookingContent 
            user={user}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedLevel={selectedLevel}
            setSelectedLevel={setSelectedLevel}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            filteredCourses={filteredCourses}
            filteredTeachers={filteredTeachers}
            onBookCourse={(course) => {
              setSelectedCourse(course)
              setSelectedTeacher(null)
              setIsBookingModalOpen(true)
            }}
            onBookTeacher={(teacher) => {
              setSelectedTeacher(teacher)
              setSelectedCourse(null)
              setIsBookingModalOpen(true)
            }}
            isLoading={isLoading}
            error={error}
            onRetry={loadData}
          />
        </div>
      </SidebarProvider>
      
      {/* Modal de réservation */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        course={selectedCourse}
        teacher={selectedTeacher}
      />
    </AuthGuard>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white font-heading"
      >
        Lahacademia
      </motion.span>
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

const CourseBookingContent = ({ 
  user, 
  searchTerm, 
  setSearchTerm, 
  selectedSubject, 
  setSelectedSubject, 
  selectedLevel, 
  setSelectedLevel, 
  selectedCountry, 
  setSelectedCountry,
  filteredCourses,
  filteredTeachers,
  onBookCourse,
  onBookTeacher,
  isLoading,
  error,
  onRetry
}: {
  user: any
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedSubject: string
  setSelectedSubject: (value: string) => void
  selectedLevel: string
  setSelectedLevel: (value: string) => void
  selectedCountry: string
  setSelectedCountry: (value: string) => void
  filteredCourses: Course[]
  filteredTeachers: Teacher[]
  onBookCourse: (course: Course) => void
  onBookTeacher: (teacher: Teacher) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}) => {
  const [activeTab, setActiveTab] = useState("courses")

  const subjects = ["Mathématiques", "Physique", "Chimie", "Français", "Histoire", "Géographie", "Anglais", "Espagnol", "Philosophie", "SVT"]
  const levels = ["Primaire", "Collège", "Lycée", "Université"]
  const countries = ["France", "Belgique", "Suisse", "Canada", "Maroc", "Sénégal", "Côte d'Ivoire"]

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Réservation de cours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Découvrez et réservez des cours avec nos professeurs qualifiés
          </p>
        </div>

        {/* Filtres de recherche */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un cours ou professeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Button className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>

                 {/* Gestion des erreurs */}
         {error && (
           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
             <div className="flex items-center gap-2 text-red-800">
               <span className="text-sm font-medium">Erreur :</span>
               <span className="text-sm">{error}</span>
               <button 
                 onClick={onRetry}
                 className="ml-auto text-sm underline hover:no-underline text-red-600 font-medium"
               >
                 Réessayer
               </button>
             </div>
           </div>
         )}

         {/* Onglets */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <TabsList className="grid w-full grid-cols-2 mb-6">
                         <TabsTrigger value="courses">Cours disponibles ({filteredCourses?.length || 0})</TabsTrigger>
            <TabsTrigger value="teachers">Professeurs ({filteredTeachers?.length || 0})</TabsTrigger>
           </TabsList>

                     <TabsContent value="courses" className="space-y-6">
             {isLoading ? (
               <div className="text-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                   Chargement des cours...
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Veuillez patienter pendant que nous récupérons les cours disponibles
                 </p>
               </div>
             ) : !filteredCourses || filteredCourses.length === 0 ? (
               <div className="text-center py-12">
                 <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                   Aucun cours trouvé
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Essayez de modifier vos critères de recherche
                 </p>
               </div>
             ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredCourses.map((course) => (
                   <CourseCard key={course.id} course={course} onBook={() => onBookCourse(course)} />
                 ))}
               </div>
             )}
           </TabsContent>

                     <TabsContent value="teachers" className="space-y-6">
             {isLoading ? (
               <div className="text-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                   Chargement des professeurs...
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Veuillez patienter pendant que nous récupérons les professeurs disponibles
                 </p>
               </div>
             ) : !filteredTeachers || filteredTeachers.length === 0 ? (
               <div className="text-center py-12">
                 <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                   Aucun professeur trouvé
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   Essayez de modifier vos critères de recherche
                 </p>
               </div>
             ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredTeachers.map((teacher) => (
                   <TeacherCard key={teacher.id} teacher={teacher} onBook={() => onBookTeacher(teacher)} />
                 ))}
               </div>
             )}
           </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const CourseCard = ({ course, onBook }: { course: Course; onBook: () => void }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'À définir'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Récupérer le premier professeur disponible ou le professeur principal
  const mainTeacher = course.teachers?.[0] || null

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                         <div className="flex items-center gap-2 mb-2">
               <Badge variant="secondary">{course.subject}</Badge>
               <Badge variant="outline">{course.level}</Badge>
               <Badge variant="outline">{course.difficulty_level}</Badge>
             </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{course.price}€</div>
            <div className="text-sm text-gray-500">par heure</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="space-y-3">
                     {mainTeacher ? (
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Avatar className="h-8 w-8">
                   <AvatarImage src={mainTeacher.avatar || "/placeholder-user.jpg"} />
                   <AvatarFallback>{mainTeacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                 </Avatar>
                 <div>
                   <div className="font-medium text-sm">{mainTeacher.name}</div>
                   <div className="flex items-center gap-1">
                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                     <span className="text-sm text-gray-600">{mainTeacher.rating}</span>
                   </div>
                 </div>
               </div>
             </div>
           ) : (
             <div className="text-sm text-gray-500">Aucun professeur assigné</div>
           )}
          
                     <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="flex items-center gap-2">
               <Clock className="h-4 w-4 text-gray-400" />
               <span>{course.duration} min</span>
             </div>
             <div className="flex items-center gap-2">
               <Users className="h-4 w-4 text-gray-400" />
               <span>{course.available_spots}/{course.max_capacity} places</span>
             </div>
           </div>
          
                     <div className="flex items-center gap-2 text-sm text-gray-600">
             <Calendar className="h-4 w-4" />
             <span>Prochaine session : {formatDate(course.next_session)}</span>
           </div>
          
          <Separator />
          
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Voir détails
            </Button>
            <Button className="flex-1" onClick={onBook}>
              <Calendar className="h-4 w-4 mr-2" />
              Réserver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const TeacherCard = ({ teacher, onBook }: { teacher: Teacher; onBook: () => void }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={teacher.avatar || undefined} />
            <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{teacher.name}</CardTitle>
            <div className="flex items-center gap-2 mb-2">
              {teacher.subjects.map((subject: string) => (
                <Badge key={subject} variant="secondary">{subject}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{teacher.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{teacher.experience}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{teacher.country}</span>
              </div>
            </div>
          </div>
                     <div className="text-right">
             <div className="text-2xl font-bold text-green-600">{teacher.hourly_rate}€</div>
             <div className="text-sm text-gray-500">par heure</div>
           </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {teacher.bio}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{teacher.total_students} élèves</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-4 w-4 text-gray-400" />
            <span>{teacher.total_sessions} sessions</span>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Voir profil
          </Button>
          <Button className="flex-1" onClick={onBook}>
            <Calendar className="h-4 w-4 mr-2" />
            Réserver
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
