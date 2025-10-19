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
  Video,
  ChevronDown,
  Play,
  Clock,
  Download,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface VideoContent {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  status: string
  duration: number
  views: number
  rating: number
  created_at: string
  thumbnail?: string
  teacher?: {
    first_name: string
    last_name: string
  }
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockVideos: VideoContent[] = [
      {
        id: "1",
        title: "Introduction à la physique quantique",
        description: "Cours d'introduction aux concepts fondamentaux de la physique quantique",
        subject: "Physique",
        class_level: "Terminale",
        status: "published",
        duration: 45,
        views: 2500,
        rating: 4.7,
        created_at: "2025-08-10",
        thumbnail: "/placeholder-video.jpg",
        teacher: {
          first_name: "Jean",
          last_name: "Dupont"
        }
      },
      {
        id: "2",
        title: "Résolution d'équations du second degré",
        description: "Méthodes et techniques pour résoudre les équations quadratiques",
        subject: "Mathématiques",
        class_level: "Première",
        status: "published",
        duration: 35,
        views: 1800,
        rating: 4.5,
        created_at: "2025-08-12",
        thumbnail: "/placeholder-video.jpg",
        teacher: {
          first_name: "Marie",
          last_name: "Martin"
        }
      },
      {
        id: "3",
        title: "Grammaire française - Les temps",
        description: "Révision des temps de conjugaison en français",
        subject: "Français",
        class_level: "Quatrième",
        status: "draft",
        duration: 25,
        views: 0,
        rating: 0,
        created_at: "2025-08-15",
        thumbnail: "/placeholder-video.jpg",
        teacher: {
          first_name: "Pierre",
          last_name: "Durand"
        }
      },
      {
        id: "4",
        title: "Biologie cellulaire - Structure",
        description: "Étude de la structure et du fonctionnement des cellules",
        subject: "SVT",
        class_level: "Seconde",
        status: "published",
        duration: 40,
        views: 3200,
        rating: 4.8,
        created_at: "2025-08-18",
        thumbnail: "/placeholder-video.jpg",
        teacher: {
          first_name: "Sophie",
          last_name: "Leroy"
        }
      }
    ]
    
    setTimeout(() => {
      setVideos(mockVideos)
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || video.subject === selectedSubject
    const matchesClass = !selectedClass || video.class_level === selectedClass
    const matchesStatus = !selectedStatus || video.status === selectedStatus

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
                    Gestion des Vidéos
                  </h1>
                  <p className="text-laha-text-secondary">
                    Organisez les contenus vidéo éducatifs
                  </p>
                </div>
                <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                  <Link href="/dashboard/admin/content/videos/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une vidéo
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
                        placeholder="Rechercher une vidéo..."
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

            {/* Videos List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-48 h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border">
                          <Video className="h-8 w-8 text-laha-text-secondary" />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {formatDuration(video.duration)}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white/80" />
                          </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{video.title}</h3>
                            <Badge className={getStatusBadge(video.status)}>
                              {video.status === 'published' ? 'Publié' : 
                               video.status === 'draft' ? 'Brouillon' : 'Archivé'}
                            </Badge>
                          </div>
                          
                          <p className="text-laha-text-secondary mb-3">{video.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary mb-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {video.views} vues
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(video.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {video.rating > 0 ? `${video.rating}/5` : 'Non évalué'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {video.created_at}
                            </div>
                            {video.teacher && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {video.teacher.first_name} {video.teacher.last_name}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {video.subject}
                            </Badge>
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {video.class_level}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Play className="h-4 w-4 mr-1" />
                            Lire
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
