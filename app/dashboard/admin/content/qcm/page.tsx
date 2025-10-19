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
  HelpCircle,
  ChevronDown,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface QCM {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  status: string
  questions_count: number
  duration: number
  created_at: string
  teacher?: {
    first_name: string
    last_name: string
  }
}

export default function QCMPage() {
  const [qcms, setQcms] = useState<QCM[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockQCMs: QCM[] = [
      {
        id: "1",
        title: "Quiz sur les équations du second degré",
        description: "Évaluation des connaissances sur la résolution des équations quadratiques",
        subject: "Mathématiques",
        class_level: "Première",
        status: "published",
        questions_count: 15,
        duration: 30,
        created_at: "2025-08-10",
        teacher: {
          first_name: "Jean",
          last_name: "Dupont"
        }
      },
      {
        id: "2",
        title: "Test de compréhension en physique",
        description: "Questions sur les lois de Newton et la mécanique",
        subject: "Physique",
        class_level: "Terminale",
        status: "draft",
        questions_count: 20,
        duration: 45,
        created_at: "2025-08-12",
        teacher: {
          first_name: "Marie",
          last_name: "Martin"
        }
      },
      {
        id: "3",
        title: "Évaluation de grammaire française",
        description: "Test sur les règles de grammaire et la conjugaison",
        subject: "Français",
        class_level: "Quatrième",
        status: "published",
        questions_count: 25,
        duration: 35,
        created_at: "2025-08-15",
        teacher: {
          first_name: "Pierre",
          last_name: "Durand"
        }
      },
      {
        id: "4",
        title: "Quiz biologie cellulaire",
        description: "Questions sur la structure et le fonctionnement des cellules",
        subject: "SVT",
        class_level: "Seconde",
        status: "published",
        questions_count: 18,
        duration: 25,
        created_at: "2025-08-18",
        teacher: {
          first_name: "Sophie",
          last_name: "Leroy"
        }
      }
    ]
    
    setTimeout(() => {
      setQcms(mockQCMs)
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

  const filteredQCMs = qcms.filter(qcm => {
    const matchesSearch = qcm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         qcm.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || qcm.subject === selectedSubject
    const matchesClass = !selectedClass || qcm.class_level === selectedClass
    const matchesStatus = !selectedStatus || qcm.status === selectedStatus

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
                    Gestion des QCM
                  </h1>
                  <p className="text-laha-text-secondary">
                    Créez et gérez les questionnaires à choix multiples
                  </p>
                </div>
                <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                  <Link href="/dashboard/admin/content/qcm/create">
                    <Plus className="h-4 w-4 mr-2" />
                  Créer un QCM
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
                          placeholder="Rechercher un QCM..."
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

            {/* QCM List */}
              {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQCMs.map((qcm) => (
                  <Card key={qcm.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-colors">
                      <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{qcm.title}</h3>
                              <Badge className={getStatusBadge(qcm.status)}>
                              {qcm.status === 'published' ? 'Publié' : 
                               qcm.status === 'draft' ? 'Brouillon' : 'Archivé'}
                              </Badge>
                          </div>
                          <p className="text-laha-text-secondary mb-3">{qcm.description}</p>
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                            <div className="flex items-center gap-1">
                              <HelpCircle className="h-4 w-4" />
                              {qcm.questions_count} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {qcm.duration} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {qcm.class_level}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {qcm.created_at}
                            </div>
                            {qcm.teacher && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {qcm.teacher.first_name} {qcm.teacher.last_name}
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