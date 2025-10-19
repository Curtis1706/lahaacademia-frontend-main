"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Globe,
  UserPlus,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle
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

interface Child {
  id: string
  name: string
  age: number
  class_level: string
  subjects: string[]
  avatar?: string
  email?: string
  phone?: string
  birth_date: string
  school: string
  emergency_contact: {
    name: string
    phone: string
    relationship: string
  }
  medical_info?: {
    allergies: string[]
    medications: string[]
    conditions: string[]
  }
  learning_preferences: {
    learning_style: string
    preferred_schedule: string[]
    difficulty_level: string
  }
  performance_summary: {
    overall_grade: number
    attendance_rate: number
    courses_enrolled: number
    courses_completed: number
    last_activity: string
  }
  created_at: string
  updated_at: string
}

interface CourseEnrollment {
  id: string
  course_title: string
  subject: string
  teacher: string
  start_date: string
  end_date: string
  status: "active" | "completed" | "paused"
  progress: number
  grade: number
}

export default function ParentChildrenPage() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddChildModal, setShowAddChildModal] = useState(false)

  // Données de test
  useEffect(() => {
    const mockChildren: Child[] = [
      {
        id: "1",
        name: "Fatou Diallo",
        age: 16,
        class_level: "Terminale",
        subjects: ["Mathématiques", "Physique", "SVT", "Français"],
        avatar: "/placeholder-child.jpg",
        email: "fatou.diallo@email.com",
        phone: "+221 77 123 45 67",
        birth_date: "2008-03-15",
        school: "Lycée Blaise Diagne",
        emergency_contact: {
          name: "Mariama Diallo",
          phone: "+221 77 987 65 43",
          relationship: "Mère"
        },
        medical_info: {
          allergies: ["Arachides"],
          medications: [],
          conditions: []
        },
        learning_preferences: {
          learning_style: "Visuel",
          preferred_schedule: ["Après-midi", "Weekend"],
          difficulty_level: "Avancé"
        },
        performance_summary: {
          overall_grade: 15.2,
          attendance_rate: 92,
          courses_enrolled: 4,
          courses_completed: 1,
          last_activity: "2025-01-25"
        },
        created_at: "2024-09-01",
        updated_at: "2025-01-25"
      },
      {
        id: "2",
        name: "Amadou Traoré",
        age: 14,
        class_level: "Seconde",
        subjects: ["Français", "Histoire", "Géographie", "Anglais"],
        avatar: "/placeholder-child.jpg",
        email: "amadou.traore@email.com",
        phone: "+221 78 456 78 90",
        birth_date: "2010-07-22",
        school: "Collège de la République",
        emergency_contact: {
          name: "Aminata Traoré",
          phone: "+221 78 123 45 67",
          relationship: "Sœur"
        },
        medical_info: {
          allergies: [],
          medications: [],
          conditions: []
        },
        learning_preferences: {
          learning_style: "Auditif",
          preferred_schedule: ["Matin", "Après-midi"],
          difficulty_level: "Intermédiaire"
        },
        performance_summary: {
          overall_grade: 13.8,
          attendance_rate: 88,
          courses_enrolled: 3,
          courses_completed: 0,
          last_activity: "2025-01-24"
        },
        created_at: "2024-09-01",
        updated_at: "2025-01-24"
      }
    ]

    const mockCourseEnrollments: CourseEnrollment[] = [
      {
        id: "1",
        course_title: "Mathématiques Terminale S - Algèbre",
        subject: "Mathématiques",
        teacher: "Dr. Aminata Diallo",
        start_date: "2024-09-15",
        end_date: "2025-06-15",
        status: "active",
        progress: 75,
        grade: 16
      },
      {
        id: "2",
        course_title: "Physique Quantique - Introduction",
        subject: "Physique",
        teacher: "Prof. Jean-Baptiste",
        start_date: "2024-10-01",
        end_date: "2025-05-30",
        status: "active",
        progress: 60,
        grade: 14
      },
      {
        id: "3",
        course_title: "Français - Techniques de Dissertation",
        subject: "Français",
        teacher: "Dr. Fatou Ndiaye",
        start_date: "2024-09-01",
        end_date: "2024-12-15",
        status: "completed",
        progress: 100,
        grade: 17
      }
    ]
    
    setTimeout(() => {
      setChildren(mockChildren)
      setCourseEnrollments(mockCourseEnrollments)
      setSelectedChild(mockChildren[0]?.id || "")
      setLoading(false)
    }, 1000)
  }, [])

  const selectedChildData = children.find(child => child.id === selectedChild)

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
    return variants[status as keyof typeof variants] || variants.active
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      active: "En cours",
      completed: "Terminé",
      paused: "En pause"
    }
    return labels[status as keyof typeof labels] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <Users className="h-5 w-5 shrink-0 text-white" />,
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
      icon: <Award className="h-5 w-5 shrink-0 text-white" />,
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
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-laha-gold mb-2">
                    Mes Enfants
                  </h1>
                  <p className="text-laha-text-secondary">
                    Gérez les profils et les inscriptions de vos enfants
                  </p>
                </div>
                <Button
                  onClick={() => setShowAddChildModal(true)}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un enfant
                </Button>
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

              {selectedChildData && (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold/20 rounded-lg">
                            <Award className="h-5 w-5 text-laha-gold" />
                          </div>
                          <div>
                            <p className="text-laha-text-secondary text-sm">Note moyenne</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.performance_summary.overall_grade}/20</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-laha-gold-warm" />
                          </div>
                          <div>
                            <p className="text-laha-text-secondary text-sm">Assiduité</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.performance_summary.attendance_rate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-laha-gold-soft" />
                          </div>
                          <div>
                            <p className="text-laha-text-secondary text-sm">Cours suivis</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.performance_summary.courses_enrolled}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold/20 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-laha-gold" />
                          </div>
                          <div>
                            <p className="text-laha-text-secondary text-sm">Cours terminés</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.performance_summary.courses_completed}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Vue d'ensemble
                      </TabsTrigger>
                      <TabsTrigger value="profile" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Profil
                      </TabsTrigger>
                      <TabsTrigger value="courses" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Cours
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Paramètres
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      {/* Informations générales */}
                      <Card className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <CardTitle className="text-laha-text">Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={selectedChildData.avatar || "/placeholder.svg?height=60&width=60"}
                                  alt={selectedChildData.name}
                                  className="h-15 w-15 rounded-full"
                                />
                                <div>
                                  <h3 className="text-xl font-semibold text-laha-text">{selectedChildData.name}</h3>
                                  <p className="text-laha-text-secondary">{selectedChildData.class_level} • {calculateAge(selectedChildData.birth_date)} ans</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                                  <GraduationCap className="h-4 w-4" />
                                  {selectedChildData.school}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                                  <Calendar className="h-4 w-4" />
                                  Né(e) le {formatDate(selectedChildData.birth_date)}
                                </div>
                                {selectedChildData.email && (
                                  <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                                    <Mail className="h-4 w-4" />
                                    {selectedChildData.email}
                                  </div>
                                )}
                                {selectedChildData.phone && (
                                  <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                                    <Phone className="h-4 w-4" />
                                    {selectedChildData.phone}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-laha-text mb-2">Matières suivies</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedChildData.subjects.map((subject) => (
                                    <Badge key={subject} variant="outline" className="border-laha-border text-laha-text">
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-laha-text mb-2">Préférences d'apprentissage</h4>
                                <div className="space-y-1 text-sm text-laha-text-secondary">
                                  <p>Style: {selectedChildData.learning_preferences.learning_style}</p>
                                  <p>Niveau: {selectedChildData.learning_preferences.difficulty_level}</p>
                                  <p>Horaires: {selectedChildData.learning_preferences.preferred_schedule.join(", ")}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cours en cours */}
                      <Card className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <CardTitle className="text-laha-text">Cours en cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {courseEnrollments.filter(course => course.status === "active").map((course) => (
                              <div key={course.id} className="flex items-center justify-between p-4 bg-laha-background/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-laha-gold/20 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-laha-gold" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-laha-text">{course.course_title}</p>
                                    <p className="text-sm text-laha-text-secondary">{course.subject} • {course.teacher}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm text-laha-text-secondary">Progression</p>
                                    <p className="text-laha-gold font-medium">{course.progress}%</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-laha-text-secondary">Note</p>
                                    <p className="text-laha-gold font-medium">{course.grade}/20</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="profile" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Informations personnelles */}
                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Informations personnelles</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Nom complet</label>
                              <Input value={selectedChildData.name} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Date de naissance</label>
                              <Input value={formatDate(selectedChildData.birth_date)} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">École</label>
                              <Input value={selectedChildData.school} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Classe</label>
                              <Input value={selectedChildData.class_level} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier les informations
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Contact d'urgence */}
                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Contact d'urgence</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Nom</label>
                              <Input value={selectedChildData.emergency_contact.name} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Téléphone</label>
                              <Input value={selectedChildData.emergency_contact.phone} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Relation</label>
                              <Input value={selectedChildData.emergency_contact.relationship} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier le contact
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Informations médicales */}
                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Informations médicales</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Allergies</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedChildData.medical_info?.allergies.map((allergy) => (
                                  <Badge key={allergy} variant="outline" className="border-red-500 text-red-500">
                                    {allergy}
                                  </Badge>
                                ))}
                                {selectedChildData.medical_info?.allergies.length === 0 && (
                                  <span className="text-sm text-laha-text-secondary">Aucune allergie connue</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Médicaments</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedChildData.medical_info?.medications.map((medication) => (
                                  <Badge key={medication} variant="outline" className="border-blue-500 text-blue-500">
                                    {medication}
                                  </Badge>
                                ))}
                                {selectedChildData.medical_info?.medications.length === 0 && (
                                  <span className="text-sm text-laha-text-secondary">Aucun médicament</span>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier les informations médicales
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Préférences d'apprentissage */}
                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Préférences d'apprentissage</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Style d'apprentissage</label>
                              <Input value={selectedChildData.learning_preferences.learning_style} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Niveau de difficulté</label>
                              <Input value={selectedChildData.learning_preferences.difficulty_level} className="bg-laha-background border-laha-border text-laha-text" readOnly />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-laha-text">Horaires préférés</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedChildData.learning_preferences.preferred_schedule.map((schedule) => (
                                  <Badge key={schedule} variant="outline" className="border-laha-border text-laha-text">
                                    {schedule}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier les préférences
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courseEnrollments.map((course) => (
                          <Card key={course.id} className="bg-laha-surface/50 border-laha-border">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-laha-text text-lg">{course.course_title}</CardTitle>
                                <Badge className={getStatusBadge(course.status)}>
                                  {getStatusLabel(course.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Matière</span>
                                  <span className="text-laha-text">{course.subject}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Enseignant</span>
                                  <span className="text-laha-text">{course.teacher}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Période</span>
                                  <span className="text-laha-text">{formatDate(course.start_date)} - {formatDate(course.end_date)}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Progression</span>
                                  <span className="text-laha-gold font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>

                              <div className="flex justify-between text-sm">
                                <span className="text-laha-text-secondary">Note actuelle</span>
                                <span className="text-laha-gold font-semibold">{course.grade}/20</span>
                              </div>

                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                                  <Mail className="h-4 w-4 mr-1" />
                                  Contacter
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Paramètres de sécurité</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-laha-text">Notifications par email</p>
                                <p className="text-sm text-laha-text-secondary">Recevoir les rapports de progrès</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-laha-text">Partage de données</p>
                                <p className="text-sm text-laha-text-secondary">Autoriser le partage avec les enseignants</p>
                              </div>
                              <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                                <Shield className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-laha-surface/50 border-laha-border">
                          <CardHeader>
                            <CardTitle className="text-laha-text">Actions</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Eye className="h-4 w-4 mr-2" />
                              Voir le rapport complet
                            </Button>
                            <Button variant="outline" className="w-full border-laha-border text-laha-text hover:bg-laha-surface">
                              <Download className="h-4 w-4 mr-2" />
                              Exporter les données
                            </Button>
                            <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer le profil
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
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