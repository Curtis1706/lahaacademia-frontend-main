"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { PreviewModal } from "@/components/admin/PreviewModal"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
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
  // ✅ CHAMPS VIDÉO AJOUTÉS
  file_url?: string
  video_url?: string
  thumbnail_url?: string
  duration_minutes?: number
  file_size_mb?: number
  quality?: string
  language?: string
  allow_downloads?: boolean
  allow_preview?: boolean
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [previewContent, setPreviewContent] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null)

  // Fonction pour supprimer une vidéo
  const handleDeleteVideo = async (videoId: string) => {
    try {
      setDeletingVideoId(videoId)
      console.log('🗑️ Suppression de la vidéo:', videoId)
      
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
      
      // Supprimer la vidéo de la liste locale
      setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId))
      
      console.log('✅ Vidéo supprimée avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setDeletingVideoId(null)
    }
  }
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedSubject) params.set('subject', selectedSubject)
        if (selectedClass) params.set('class_level', selectedClass)
        if (selectedStatus) params.set('status', selectedStatus)
        if (searchTerm) params.set('search', searchTerm)

        params.set('content_type', 'video')
        const url = `/api/admin/content${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { method: 'GET', credentials: 'include' })
        const data = await res.json()

        const raw: any[] = Array.isArray(data) ? data : (data.results || data.videos || [])
        console.log('📊 Données brutes de l\'API:', raw[0]) // Debug
        
        const normalized: VideoContent[] = raw.map((v: any) => ({
          id: (v.id ?? v.pk ?? '').toString(),
          title: v.title || v.name || 'Sans titre',
          description: v.description || '',
          subject: v.subject || v.category || 'N/A',
          class_level: v.class_level || v.level || 'N/A',
          status: v.status || (v.is_active === false ? 'archived' : 'published'),
          duration: Number(v.duration_minutes || v.duration || 0),
          views: Number(v.view_count || v.views || 0),
          rating: Number(v.rating_average || v.rating || 0),
          created_at: v.created_at || v.date_created || '',
          thumbnail: v.thumbnail_url || v.thumbnail || null,
          teacher: v.created_by ? { first_name: v.created_by.first_name || '', last_name: v.created_by.last_name || '' } : undefined,
          // ✅ AJOUT DES CHAMPS VIDÉO MANQUANTS
          file_url: v.video_url || v.content_file_url || null,
          video_url: v.video_url || v.content_file_url || null,
          thumbnail_url: v.thumbnail_url || v.thumbnail || null,
          duration_minutes: Number(v.duration_minutes || v.duration || 0),
          file_size_mb: Number(v.file_size_mb || 0),
          quality: v.quality || null,
          language: v.language || null,
          allow_downloads: v.allow_downloads || false,
          allow_preview: v.allow_preview || true,
        }))

        setVideos(normalized)
      } catch (e) {
        console.error('Erreur chargement vidéos:', e)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [selectedSubject, selectedClass, selectedStatus, searchTerm])

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
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6">
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
                              {video.duration_minutes ? `${video.duration_minutes}min` : 'Durée inconnue'}
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-laha-border text-laha-text hover:bg-laha-surface"
                            onClick={() => {
                              // Utiliser l'URL originale directement
                              const videoUrl = video.file_url || video.video_url
                              
                              console.log('🎥 Ouverture de la vidéo:', video.title)
                              console.log('🔗 URL vidéo:', videoUrl)
                              console.log('📁 Données vidéo complètes:', video)
                              
                              setPreviewContent({
                                ...video,
                                type: 'video',
                                fileUrl: videoUrl, // Le composant RobustVideoPlayer gérera les fallbacks
                                thumbnailUrl: video.thumbnail_url?.replace('http://localhost:8000/media/', '/api/media/'),
                                duration: video.duration_minutes ? video.duration_minutes * 60 : 0,
                                fileSize: video.file_size_mb ? video.file_size_mb * 1024 * 1024 : 0,
                                quality: video.quality,
                                language: video.language,
                                allowDownloads: video.allow_downloads,
                                allowPreview: video.allow_preview
                              })
                              setIsPreviewOpen(true)
                            }}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Lire
                          </Button>
                          <Button asChild variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Link href={`/dashboard/admin/content/videos/edit/${video.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Copy className="h-4 w-4 mr-1" />
                            Dupliquer
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                disabled={deletingVideoId === video.id}
                              >
                            <Trash2 className="h-4 w-4 mr-1" />
                                {deletingVideoId === video.id ? 'Suppression...' : 'Supprimer'}
                          </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer la vidéo "{video.title}" ? 
                                  Cette action est irréversible et supprimera définitivement la vidéo et tous ses fichiers associés.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVideo(video.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer définitivement
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
      
      {/* Modal de prévisualisation */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        content={previewContent}
      />
    </AuthGuard>
  )
}
