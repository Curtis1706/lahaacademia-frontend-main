"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Users,
  BookOpen,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  status: string
  created_at: string
  teacher?: {
    first_name: string
    last_name: string
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Vitesse des corps en mouvement",
        description: "Les élèves apprendront les règles liées aux corps en mouvement",
        subject: "Physique",
        class_level: "Terminale",
        status: "published",
        created_at: "2025-08-11",
        teacher: {
          first_name: "Jean",
          last_name: "Dupont"
        }
      },
      {
        id: "2",
        title: "Vecteurs et Forces",
        description: "Les élèves apprendront des notions importantes pour la physique",
        subject: "Physique",
        class_level: "Première",
        status: "draft",
        created_at: "2025-08-11",
        teacher: {
          first_name: "Marie",
          last_name: "Martin"
        }
      },
      {
        id: "3",
        title: "Le complément d'objet",
        description: "Les élèves apprendront la notion de complément d'objet direct ou indirect",
        subject: "Français",
        class_level: "Quatrième",
        status: "published",
        created_at: "2025-08-16",
        teacher: {
          first_name: "Pierre",
          last_name: "Durand"
        }
      },
      {
        id: "4",
        title: "Les cellules",
        description: "Introduction à la biologie cellulaire",
        subject: "SVT",
        class_level: "Seconde",
        status: "published",
        created_at: "2025-08-21",
        teacher: {
          first_name: "Sophie",
          last_name: "Leroy"
        }
      }
    ]
    
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "bg-green-500/10 text-green-500 border-green-500/20",
      draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      archived: "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }

    return variants[status as keyof typeof variants] || variants.draft
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || course.subject === selectedSubject
    const matchesClass = !selectedClass || course.class_level === selectedClass
    const matchesStatus = !selectedStatus || course.status === selectedStatus

    return matchesSearch && matchesSubject && matchesClass && matchesStatus
  })

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
              {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-laha-gold mb-2">
                    Gestion des Cours
                  </h1>
                  <p className="text-laha-text-secondary">
                    Créez et gérez les cours structurés avec éditeur riche
                  </p>
                </div>
                <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                  <Link href="/dashboard/admin/content/courses/create">
                    <Plus className="h-4 w-4 mr-2" />
                  Créer un cours
                  </Link>
                </Button>
              </div>
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
                      <option value="Quatrième">Quatrième</option>
                      <option value="Seconde">Seconde</option>
                      <option value="Première">Première</option>
                      <option value="Terminale">Terminale</option>
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="published">Publié</option>
                      <option value="draft">Brouillon</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                </CardContent>
              )}
              </Card>

            {/* Courses List */}
              {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-colors">
                      <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{course.title}</h3>
                              <Badge className={getStatusBadge(course.status)}>
                              {course.status === 'published' ? 'Publié' : 
                               course.status === 'draft' ? 'Brouillon' : 'Archivé'}
                              </Badge>
                          </div>
                          <p className="text-laha-text-secondary mb-3">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course.subject}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.class_level}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {course.created_at}
                            </div>
                            {course.teacher && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {course.teacher.first_name} {course.teacher.last_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Copy className="h-4 w-4 mr-1" />
                              Dupliquer
                            </Button>
                          <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </main>
      </AdminSidebar>
    </AuthGuard>
  )
}