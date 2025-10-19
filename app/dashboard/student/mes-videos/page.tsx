"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Video,
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
  Volume2,
  VolumeX,
  Settings
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

interface VideoContent {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  quality: string
  language: string
  price: number
  rating: number
  views: number
  teacher: {
    name: string
    avatar?: string
  }
  thumbnail?: string
  video_url?: string
  progress?: number
  is_watched: boolean
  is_favorite: boolean
  created_at: string
  subtitles: boolean
  allow_download: boolean
}

export default function StudentVideosPage() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<VideoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedQuality, setSelectedQuality] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockVideos: VideoContent[] = [
      {
        id: "1",
        title: "Introduction à la physique quantique",
        description: "Cours d'introduction aux concepts fondamentaux de la physique quantique avec exemples pratiques",
        subject: "Physique",
        class_level: "Terminale",
        duration: 45,
        quality: "1080p",
        language: "français",
        price: 8000,
        rating: 4.7,
        views: 2500,
        teacher: {
          name: "Dr. Aminata Diallo",
          avatar: "/placeholder-teacher.jpg"
        },
        thumbnail: "/placeholder-video.jpg",
        video_url: "/sample-video.mp4",
        progress: 75,
        is_watched: false,
        is_favorite: true,
        created_at: "2025-01-15",
        subtitles: true,
        allow_download: true
      },
      {
        id: "2",
        title: "Résolution d'équations du second degré",
        description: "Méthodes et techniques pour résoudre les équations quadratiques avec exercices corrigés",
        subject: "Mathématiques",
        class_level: "Première",
        duration: 35,
        quality: "720p",
        language: "français",
        price: 6000,
        rating: 4.5,
        views: 1800,
        teacher: {
          name: "Prof. Jean-Baptiste",
          avatar: "/placeholder-teacher.jpg"
        },
        thumbnail: "/placeholder-video.jpg",
        video_url: "/sample-video.mp4",
        progress: 100,
        is_watched: true,
        is_favorite: false,
        created_at: "2025-01-20",
        subtitles: false,
        allow_download: true
      },
      {
        id: "3",
        title: "Grammaire française - Les temps",
        description: "Révision complète des temps de conjugaison en français avec exercices pratiques",
        subject: "Français",
        class_level: "Quatrième",
        duration: 25,
        quality: "1080p",
        language: "français",
        price: 5000,
        rating: 4.6,
        views: 1200,
        teacher: {
          name: "Dr. Fatou Ndiaye",
          avatar: "/placeholder-teacher.jpg"
        },
        thumbnail: "/placeholder-video.jpg",
        video_url: "/sample-video.mp4",
        progress: 0,
        is_watched: false,
        is_favorite: true,
        created_at: "2025-01-18",
        subtitles: true,
        allow_download: false
      },
      {
        id: "4",
        title: "Biologie cellulaire - Structure",
        description: "Étude approfondie de la structure et du fonctionnement des cellules avec animations 3D",
        subject: "SVT",
        class_level: "Seconde",
        duration: 40,
        quality: "4K",
        language: "français",
        price: 10000,
        rating: 4.8,
        views: 3200,
        teacher: {
          name: "Dr. Sophie Leroy",
          avatar: "/placeholder-teacher.jpg"
        },
        thumbnail: "/placeholder-video.jpg",
        video_url: "/sample-video.mp4",
        progress: 45,
        is_watched: false,
        is_favorite: false,
        created_at: "2025-01-22",
        subtitles: true,
        allow_download: true
      }
    ]
    
    setTimeout(() => {
      setVideos(mockVideos)
      setLoading(false)
    }, 1000)
  }, [])

  const watchedVideos = videos.filter(video => video.is_watched)
  const favoriteVideos = videos.filter(video => video.is_favorite)
  const unwatchedVideos = videos.filter(video => !video.is_watched)

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || video.subject === selectedSubject
    const matchesClass = !selectedClass || video.class_level === selectedClass
    const matchesQuality = !selectedQuality || video.quality === selectedQuality

    return matchesSearch && matchesSubject && matchesClass && matchesQuality
  })

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const handleToggleFavorite = (videoId: string) => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, is_favorite: !video.is_favorite }
        : video
    ))
  }

  const handleWatch = (videoId: string) => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, is_watched: true, progress: 100 }
        : video
    ))
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <Video className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/student/mes-cours",
      icon: <Video className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "/dashboard/student/mes-videos",
      icon: <Video className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "/dashboard/student/mes-ouvrages",
      icon: <Video className="h-5 w-5 shrink-0 text-white" />,
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
                  Mes Vidéos
                </h1>
                <p className="text-laha-text-secondary">
                  Regardez vos vidéos éducatives préférées
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <Video className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Vidéos disponibles</p>
                        <p className="text-laha-text text-xl font-bold">{videos.length}</p>
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
                        <p className="text-laha-text-secondary text-sm">Temps total</p>
                        <p className="text-laha-text text-xl font-bold">
                          {formatDuration(videos.reduce((total, video) => total + video.duration, 0))}
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
                        <p className="text-laha-text text-xl font-bold">{favoriteVideos.length}</p>
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
                        <p className="text-laha-text-secondary text-sm">Regardées</p>
                        <p className="text-laha-text text-xl font-bold">{watchedVideos.length}</p>
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
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="">Toutes les qualités</option>
                        <option value="720p">720p HD</option>
                        <option value="1080p">1080p Full HD</option>
                        <option value="4K">4K Ultra HD</option>
                      </select>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Toutes ({videos.length})
                  </TabsTrigger>
                  <TabsTrigger value="watched" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Regardées ({watchedVideos.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Favoris ({favoriteVideos.length})
                  </TabsTrigger>
                  <TabsTrigger value="unwatched" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    À regarder ({unwatchedVideos.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <VideoGrid videos={filteredVideos} onWatch={handleWatch} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="watched" className="space-y-4">
                  <VideoGrid videos={watchedVideos.filter(video => 
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || video.subject === selectedSubject) &&
                    (!selectedClass || video.class_level === selectedClass) &&
                    (!selectedQuality || video.quality === selectedQuality)
                  )} onWatch={handleWatch} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  <VideoGrid videos={favoriteVideos.filter(video => 
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || video.subject === selectedSubject) &&
                    (!selectedClass || video.class_level === selectedClass) &&
                    (!selectedQuality || video.quality === selectedQuality)
                  )} onWatch={handleWatch} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="unwatched" className="space-y-4">
                  <VideoGrid videos={unwatchedVideos.filter(video => 
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || video.subject === selectedSubject) &&
                    (!selectedClass || video.class_level === selectedClass) &&
                    (!selectedQuality || video.quality === selectedQuality)
                  )} onWatch={handleWatch} onToggleFavorite={handleToggleFavorite} />
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

const VideoGrid = ({ videos, onWatch, onToggleFavorite }: { 
  videos: VideoContent[], 
  onWatch: (videoId: string) => void,
  onToggleFavorite: (videoId: string) => void 
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="h-16 w-16 mx-auto mb-4 text-laha-text-secondary opacity-50" />
        <h3 className="text-lg font-semibold text-laha-text mb-2">Aucune vidéo trouvée</h3>
        <p className="text-laha-text-secondary">Essayez de modifier vos filtres de recherche</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-all duration-200 hover:scale-105">
          <CardHeader className="pb-3">
            <div className="relative">
              <div className="w-full h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border mb-3 relative overflow-hidden">
                <Video className="h-8 w-8 text-laha-text-secondary" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                    {video.quality}
                  </Badge>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(video.id)}
                  className={`h-8 w-8 p-0 ${video.is_favorite ? 'text-laha-gold' : 'text-laha-text-secondary hover:text-laha-gold'}`}
                >
                  <Bookmark className={`h-4 w-4 ${video.is_favorite ? 'fill-current' : ''}`} />
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-laha-border text-laha-text">
                    {video.subject}
                  </Badge>
                  {video.subtitles && (
                    <Badge variant="outline" className="border-laha-border text-laha-text">
                      <Volume2 className="h-3 w-3 mr-1" />
                      ST
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-laha-text-secondary">
                  <Star className="h-3 w-3 text-laha-gold fill-current" />
                  {video.rating}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-laha-text line-clamp-2">{video.title}</h3>
              <p className="text-sm text-laha-text-secondary line-clamp-2">{video.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-laha-text-secondary">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {video.views} vues
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {video.class_level}
              </div>
            </div>

            {video.progress !== undefined && video.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-laha-text-secondary">Progression</span>
                  <span className="text-laha-gold font-medium">{video.progress}%</span>
                </div>
                <Progress value={video.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-laha-text-secondary">Par {video.teacher.name}</p>
                <p className="text-laha-gold font-semibold">{formatPrice(video.price)}</p>
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
                  onClick={() => onWatch(video.id)}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {video.is_watched ? 'Revoir' : 'Regarder'}
                </Button>
              </div>
            </div>

            {video.allow_download && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-laha-border text-laha-text hover:bg-laha-surface"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
