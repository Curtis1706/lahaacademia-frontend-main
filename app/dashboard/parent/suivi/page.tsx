"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Award,
  Users,
  Eye,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  avatar?: string
  overall_progress: number
  courses_enrolled: number
  courses_completed: number
  average_grade: number
  attendance_rate: number
  last_activity: string
}

interface CourseProgress {
  id: string
  title: string
  subject: string
  teacher: {
    name: string
    avatar?: string
  }
  progress: number
  grade: number
  attendance: number
  last_session: string
  next_session: string
  status: "active" | "completed" | "paused"
  lessons_completed: number
  total_lessons: number
  assignments_pending: number
  upcoming_exams: number
}

interface PerformanceMetric {
  subject: string
  grade: number
  trend: "up" | "down" | "stable"
  improvement: number
  last_exam_score: number
  average_score: number
  rank_in_class?: number
}

interface AttendanceRecord {
  date: string
  course: string
  teacher: string
  status: "present" | "absent" | "late"
  duration: number
  notes?: string
}

export default function ParentProgressPage() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Données de test
  useEffect(() => {
    const mockChildren: Child[] = [
      {
        id: "1",
        name: "Fatou Diallo",
        age: 16,
        class_level: "Terminale",
        avatar: "/placeholder-child.jpg",
        overall_progress: 78,
        courses_enrolled: 4,
        courses_completed: 1,
        average_grade: 15.2,
        attendance_rate: 92,
        last_activity: "2025-01-25"
      },
      {
        id: "2",
        name: "Amadou Traoré",
        age: 14,
        class_level: "Seconde",
        avatar: "/placeholder-child.jpg",
        overall_progress: 65,
        courses_enrolled: 3,
        courses_completed: 0,
        average_grade: 13.8,
        attendance_rate: 88,
        last_activity: "2025-01-24"
      }
    ]

    const mockCourseProgress: CourseProgress[] = [
      {
        id: "1",
        title: "Mathématiques Terminale S - Algèbre",
        subject: "Mathématiques",
        teacher: {
          name: "Dr. Aminata Diallo",
          avatar: "/placeholder-teacher.jpg"
        },
        progress: 75,
        grade: 16,
        attendance: 95,
        last_session: "2025-01-24",
        next_session: "2025-01-27",
        status: "active",
        lessons_completed: 9,
        total_lessons: 12,
        assignments_pending: 2,
        upcoming_exams: 1
      },
      {
        id: "2",
        title: "Physique Quantique - Introduction",
        subject: "Physique",
        teacher: {
          name: "Prof. Jean-Baptiste",
          avatar: "/placeholder-teacher.jpg"
        },
        progress: 60,
        grade: 14,
        attendance: 90,
        last_session: "2025-01-23",
        next_session: "2025-01-26",
        status: "active",
        lessons_completed: 6,
        total_lessons: 10,
        assignments_pending: 1,
        upcoming_exams: 0
      },
      {
        id: "3",
        title: "Français - Techniques de Dissertation",
        subject: "Français",
        teacher: {
          name: "Dr. Fatou Ndiaye",
          avatar: "/placeholder-teacher.jpg"
        },
        progress: 100,
        grade: 17,
        attendance: 100,
        last_session: "2025-01-20",
        next_session: "Terminé",
        status: "completed",
        lessons_completed: 8,
        total_lessons: 8,
        assignments_pending: 0,
        upcoming_exams: 0
      }
    ]

    const mockPerformanceMetrics: PerformanceMetric[] = [
      {
        subject: "Mathématiques",
        grade: 16,
        trend: "up",
        improvement: 2.5,
        last_exam_score: 18,
        average_score: 15.2,
        rank_in_class: 3
      },
      {
        subject: "Physique",
        grade: 14,
        trend: "stable",
        improvement: 0.5,
        last_exam_score: 14,
        average_score: 13.8,
        rank_in_class: 5
      },
      {
        subject: "Français",
        grade: 17,
        trend: "up",
        improvement: 3.2,
        last_exam_score: 17,
        average_score: 16.1,
        rank_in_class: 2
      }
    ]

    const mockAttendanceRecords: AttendanceRecord[] = [
      {
        date: "2025-01-24",
        course: "Mathématiques Terminale S",
        teacher: "Dr. Aminata Diallo",
        status: "present",
        duration: 120,
        notes: "Excellent travail sur les équations"
      },
      {
        date: "2025-01-23",
        course: "Physique Quantique",
        teacher: "Prof. Jean-Baptiste",
        status: "present",
        duration: 90
      },
      {
        date: "2025-01-22",
        course: "Mathématiques Terminale S",
        teacher: "Dr. Aminata Diallo",
        status: "late",
        duration: 100,
        notes: "Arrivé 10 minutes en retard"
      },
      {
        date: "2025-01-21",
        course: "Français",
        teacher: "Dr. Fatou Ndiaye",
        status: "present",
        duration: 60
      },
      {
        date: "2025-01-20",
        course: "Physique Quantique",
        teacher: "Prof. Jean-Baptiste",
        status: "absent",
        duration: 0,
        notes: "Absence justifiée - maladie"
      }
    ]
    
    setTimeout(() => {
      setChildren(mockChildren)
      setCourseProgress(mockCourseProgress)
      setPerformanceMetrics(mockPerformanceMetrics)
      setAttendanceRecords(mockAttendanceRecords)
      setSelectedChild(mockChildren[0]?.id || "")
      setLoading(false)
    }, 1000)
  }, [])

  const selectedChildData = children.find(child => child.id === selectedChild)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-yellow-500" />
    }
  }

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

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/parent",
      icon: <GraduationCap className="h-5 w-5 shrink-0 text-white" />,
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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-laha-gold mb-2">
                  Suivi des Progrès
                </h1>
                <p className="text-laha-text-secondary">
                  Suivez les performances et l'assiduité de vos enfants
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

              {selectedChildData && (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold/20 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-laha-gold" />
                          </div>
                          <div>
                            <p className="text-laha-text-secondary text-sm">Progression globale</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.overall_progress}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                            <Award className="h-5 w-5 text-laha-gold-warm" />
                          </div>
            <div>
                            <p className="text-laha-text-secondary text-sm">Note moyenne</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.average_grade}/20</p>
            </div>
          </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold-soft/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-laha-gold-soft" />
                          </div>
              <div>
                            <p className="text-laha-text-secondary text-sm">Assiduité</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.attendance_rate}%</p>
              </div>
            </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-laha-gold/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-laha-gold" />
                          </div>
              <div>
                            <p className="text-laha-text-secondary text-sm">Cours suivis</p>
                            <p className="text-laha-text text-xl font-bold">{selectedChildData.courses_enrolled}</p>
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
                      <TabsTrigger value="courses" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Cours
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Performances
                      </TabsTrigger>
                      <TabsTrigger value="attendance" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                        Assiduité
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      {/* Performance par matière */}
                      <Card className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <CardTitle className="text-laha-text">Performances par matière</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {performanceMetrics.map((metric) => (
                              <div key={metric.subject} className="flex items-center justify-between p-4 bg-laha-background/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-laha-gold/20 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-laha-gold" />
                                  </div>
              <div>
                                    <p className="font-medium text-laha-text">{metric.subject}</p>
                                    <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                                      <span>Note: {metric.grade}/20</span>
                                      <span>•</span>
                                      <span>Rang: {metric.rank_in_class}ème</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getTrendIcon(metric.trend)}
                                  <span className={`text-sm font-medium ${
                                    metric.improvement > 0 ? 'text-green-500' : 
                                    metric.improvement < 0 ? 'text-red-500' : 'text-yellow-500'
                                  }`}>
                                    {metric.improvement > 0 ? '+' : ''}{metric.improvement.toFixed(1)}
                                  </span>
              </div>
            </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progression des cours */}
                      <Card className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <CardTitle className="text-laha-text">Progression des cours</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {courseProgress.map((course) => (
                              <div key={course.id} className="p-4 bg-laha-background/30 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={course.teacher.avatar || "/placeholder.svg?height=40&width=40"}
                                      alt={course.teacher.name}
                                      className="h-8 w-8 rounded-full"
                                    />
              <div>
                                      <p className="font-medium text-laha-text">{course.title}</p>
                                      <p className="text-sm text-laha-text-secondary">Par {course.teacher.name}</p>
                                    </div>
                                  </div>
                                  <Badge className={getStatusBadge(course.status)}>
                                    {getStatusLabel(course.status)}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-laha-text-secondary">Progression</span>
                                    <span className="text-laha-gold font-medium">{course.progress}%</span>
                                  </div>
                                  <Progress value={course.progress} className="h-2" />
                                  <div className="flex justify-between text-xs text-laha-text-secondary">
                                    <span>{course.lessons_completed}/{course.total_lessons} leçons</span>
                                    <span>Note: {course.grade}/20</span>
                                  </div>
              </div>
            </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="courses" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courseProgress.map((course) => (
                          <Card key={course.id} className="bg-laha-surface/50 border-laha-border">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-laha-text text-lg">{course.title}</CardTitle>
                                <Badge className={getStatusBadge(course.status)}>
                                  {getStatusLabel(course.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={course.teacher.avatar || "/placeholder.svg?height=40&width=40"}
                                  alt={course.teacher.name}
                                  className="h-10 w-10 rounded-full"
                                />
                                <div>
                                  <p className="font-medium text-laha-text">{course.teacher.name}</p>
                                  <p className="text-sm text-laha-text-secondary">{course.subject}</p>
                                </div>
        </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Progression</span>
                                  <span className="text-laha-gold font-medium">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-laha-text-secondary">Note actuelle</p>
                                  <p className="text-laha-gold font-semibold">{course.grade}/20</p>
                                </div>
                                <div>
                                  <p className="text-laha-text-secondary">Assiduité</p>
                                  <p className="text-laha-gold font-semibold">{course.attendance}%</p>
                                </div>
                </div>
                
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-laha-text-secondary">
                                  <span>Dernière session</span>
                                  <span>{course.last_session}</span>
                                </div>
                                <div className="flex justify-between text-sm text-laha-text-secondary">
                                  <span>Prochaine session</span>
                                  <span>{course.next_session}</span>
                                </div>
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

                    <TabsContent value="performance" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {performanceMetrics.map((metric) => (
                          <Card key={metric.subject} className="bg-laha-surface/50 border-laha-border">
                            <CardHeader>
                              <CardTitle className="text-laha-text">{metric.subject}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                  <div className="text-center">
                                <div className="text-3xl font-bold text-laha-gold mb-2">{metric.grade}/20</div>
                                <div className="flex items-center justify-center gap-2">
                                  {getTrendIcon(metric.trend)}
                                  <span className={`text-sm ${
                                    metric.improvement > 0 ? 'text-green-500' : 
                                    metric.improvement < 0 ? 'text-red-500' : 'text-yellow-500'
                                  }`}>
                                    {metric.improvement > 0 ? '+' : ''}{metric.improvement.toFixed(1)} points
                                  </span>
                  </div>
                </div>
                
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Dernier examen</span>
                                  <span className="text-laha-text">{metric.last_exam_score}/20</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Moyenne</span>
                                  <span className="text-laha-text">{metric.average_score}/20</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-laha-text-secondary">Rang</span>
                                  <span className="text-laha-text">{metric.rank_in_class}ème</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                      ))}
                    </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-4">
                      <Card className="bg-laha-surface/50 border-laha-border">
                        <CardHeader>
                          <CardTitle className="text-laha-text">Historique d'assiduité</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {attendanceRecords.map((record, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-laha-background/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {getAttendanceStatusIcon(record.status)}
                                  <div>
                                    <p className="font-medium text-laha-text">{record.course}</p>
                                    <p className="text-sm text-laha-text-secondary">
                                      {record.date} • {record.teacher} • {record.duration}min
                                    </p>
                                    {record.notes && (
                                      <p className="text-xs text-laha-text-secondary mt-1">{record.notes}</p>
                                    )}
                                  </div>
                                </div>
                                <Badge variant="outline" className={
                                  record.status === "present" ? "border-green-500 text-green-500" :
                                  record.status === "absent" ? "border-red-500 text-red-500" :
                                  "border-yellow-500 text-yellow-500"
                                }>
                                  {record.status === "present" ? "Présent" :
                                   record.status === "absent" ? "Absent" : "En retard"}
                                </Badge>
              </div>
            ))}
          </div>
                        </CardContent>
                      </Card>
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