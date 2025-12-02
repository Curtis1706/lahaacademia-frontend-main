"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Filter,
  Search,
  ChevronDown,
  Lock,
  Unlock,
  Trophy,
  Target,
  BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { VideoAccessControl } from "@/components/video/VideoAccessControl"
import Link from "next/link"

interface VideoContent {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  views: number
  rating: number
  thumbnail: string
  is_free: boolean
  price?: number
  progress?: number
  qcm_available: boolean
  qcm_completed: boolean
  created_at: string
}

interface UserProgress {
  video_id: string
  progress_percentage: number
  completed: boolean
  qcm_score?: number
  qcm_completed: boolean
}

export default function CoursesPage() {
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Charger les vidéos publiques
        const videosResponse = await fetch('/api/public/videos', {
          credentials: 'include',
        })
        
        if (!videosResponse.ok) {
          throw new Error('Erreur lors du chargement des vidéos')
        }
        
        const videosData = await videosResponse.json()
        
        // Normaliser les données des vidéos
        const normalizedVideos = videosData.map((video: any) => ({
          id: video.id,
          title: video.title,
          description: video.description,
          subject: video.subject,
          class_level: video.class_level,
          duration: video.duration || 0,
          views: video.views || 0,
          rating: video.rating || 0,
          thumbnail: video.thumbnail,
          is_free: video.is_free || false,
          price: video.price,
          qcm_available: video.qcm_available || false,
          qcm_completed: false,
          created_at: video.created_at,
        }))

        // Charger la progression utilisateur
        const progressResponse = await fetch('/api/user/progress', {
          credentials: 'include',
        })
        
        let progressData: UserProgress[] = []
        if (progressResponse.ok) {
          progressData = await progressResponse.json()
        }

        // Merger avec les données de progression
        const progressMap = new Map(progressData.map((p: any) => [p.video_id, p]))
        const videosWithProgress = normalizedVideos.map(video => {
          const progress = progressMap.get(video.id)
          return {
            ...video,
            progress: progress?.progress_percentage || 0,
            qcm_completed: progress?.qcm_completed || false,
          }
        })

        setVideos(videosWithProgress)
        setUserProgress(progressData)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    // Fonction pour gérer l'accès accordé à une vidéo
    const handleVideoAccessGranted = (videoData: any) => {
      if (videoData) {
        // Rediriger vers la page de lecture de la vidéo
        window.location.href = `/courses/${videoData.id}`
      }
    }

    // Fonction pour gérer l'accès refusé à une vidéo
    const handleVideoAccessDenied = (reason: string, message: string) => {
      console.log('Accès refusé:', reason, message)
      // Ici on pourrait afficher une notification ou un modal
    }

    loadData()
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Filtrage et tri des vidéos
  const filteredVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubject = selectedSubject === "all" || video.subject === selectedSubject
      const matchesLevel = selectedLevel === "all" || video.class_level === selectedLevel
      
      return matchesSearch && matchesSubject && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "duration":
          return b.duration - a.duration
        case "rating":
          return b.rating - a.rating
        case "views":
          return b.views - a.views
        default:
          return 0
      }
    })

  const subjects = Array.from(new Set(videos.map(v => v.subject)))
  const levels = Array.from(new Set(videos.map(v => v.class_level)))

  const stats = {
    totalVideos: videos.length,
    completedVideos: videos.filter(v => v.progress === 100).length,
    inProgressVideos: videos.filter(v => v.progress > 0 && v.progress < 100).length,
    averageProgress: videos.length > 0 ? videos.reduce((sum, v) => sum + (v.progress || 0), 0) / videos.length : 0
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-laha-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-primary mx-auto mb-4"></div>
            <p className="text-laha-text-secondary">Chargement des cours...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-laha-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-laha-primary to-laha-gold text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Mes Cours</h1>
              <p className="text-xl opacity-90">
                Continuez votre apprentissage avec nos vidéos éducatives
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-laha-card border-laha-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-laha-primary mr-4" />
                  <div>
                    <p className="text-sm text-laha-text-secondary">Total des cours</p>
                    <p className="text-2xl font-bold text-laha-heading">{stats.totalVideos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-laha-card border-laha-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-green-500 mr-4" />
                  <div>
                    <p className="text-sm text-laha-text-secondary">Terminés</p>
                    <p className="text-2xl font-bold text-laha-heading">{stats.completedVideos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-laha-card border-laha-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Play className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <p className="text-sm text-laha-text-secondary">En cours</p>
                    <p className="text-2xl font-bold text-laha-heading">{stats.inProgressVideos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-laha-card border-laha-border">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-laha-gold mr-4" />
                  <div>
                    <p className="text-sm text-laha-text-secondary">Progression moyenne</p>
                    <p className="text-2xl font-bold text-laha-heading">{stats.averageProgress.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et recherche */}
          <Card className="bg-laha-card border-laha-border mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                    <Input
                      placeholder="Rechercher un cours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-laha-background border-laha-border"
                    />
                  </div>
                </div>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full lg:w-48 bg-laha-background border-laha-border">
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les matières</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full lg:w-48 bg-laha-background border-laha-border">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 bg-laha-background border-laha-border">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="oldest">Plus ancien</SelectItem>
                    <SelectItem value="duration">Durée</SelectItem>
                    <SelectItem value="rating">Note</SelectItem>
                    <SelectItem value="views">Vues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des vidéos */}
          <div>
            {filteredVideos.length === 0 ? (
              <Card className="bg-laha-card border-laha-border">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-laha-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-laha-text mb-2">Aucun cours trouvé</h3>
                  <p className="text-laha-text-secondary">Essayez de modifier vos critères de recherche</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredVideos.map((video) => (
                  <VideoAccessControl
                    key={video.id}
                    videoId={video.id}
                    videoTitle={video.title}
                    videoDescription={video.description}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                    onAccessGranted={handleVideoAccessGranted}
                    onAccessDenied={handleVideoAccessDenied}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}