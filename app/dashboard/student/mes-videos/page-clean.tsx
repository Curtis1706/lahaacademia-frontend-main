"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { useStudentData } from "@/hooks/use-student-data"
import { 
  Video,
  Clock,
  Star,
  Play,
  Download,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Bookmark
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function StudentVideosPage() {
  const { videos, loading, error, refreshData } = useStudentData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les vidéos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || video.subject === selectedSubject
    const matchesClass = !selectedClass || video.class_level === selectedClass
    const matchesTab = activeTab === "all" || 
                      (activeTab === "watched" && video.is_watched) ||
                      (activeTab === "favorites" && video.is_favorite)
    
    return matchesSearch && matchesSubject && matchesClass && matchesTab
  })

  // Stats
  const watchedVideos = videos.filter(v => v.is_watched)
  const favoriteVideos = videos.filter(v => v.is_favorite)
  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0)

  return (
    <AuthGuard requiredRole="student">
      <StudentSidebar>
        <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-laha-gold mb-2">Mes Vidéos</h1>
                <p className="text-laha-text-secondary">Découvrez et suivez vos vidéos éducatives</p>
              </div>
              <Button onClick={refreshData} disabled={loading} variant="outline" className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
                <span className="ml-3 text-laha-text-secondary">Chargement des vidéos...</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200">
                <CardContent className="py-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-1">Erreur de chargement</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <Button onClick={refreshData} variant="outline" size="sm">Réessayer</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold/20 rounded-lg">
                          <Video className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Total vidéos</p>
                          <p className="text-xl font-bold">{videos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Eye className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Visionnées</p>
                          <p className="text-xl font-bold">{watchedVideos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Favoris</p>
                          <p className="text-xl font-bold">{favoriteVideos.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Durée totale</p>
                          <p className="text-xl font-bold">{totalDuration}min</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtres
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="all">Toutes ({videos.length})</TabsTrigger>
                    <TabsTrigger value="watched">Visionnées ({watchedVideos.length})</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris ({favoriteVideos.length})</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Videos Grid */}
                {filteredVideos.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-laha-text-secondary">Aucune vidéo trouvée</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                      <Card key={video.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-t-lg flex items-center justify-center">
                            <Play className="h-12 w-12 text-laha-gold" />
                          </div>
                          {video.progress && video.progress > 0 && (
                            <div className="absolute bottom-0 left-0 right-0">
                              <Progress value={video.progress} className="h-1" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold line-clamp-2 flex-1">{video.title}</h3>
                            {video.is_favorite && <Bookmark className="h-4 w-4 text-laha-gold fill-current" />}
                          </div>
                          <p className="text-sm text-laha-text-secondary line-clamp-2 mb-3">
                            {video.description}
                          </p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{video.subject}</Badge>
                            <Badge variant="outline">{video.class_level}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-laha-text-secondary">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {video.duration}min
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {video.views} vues
                            </div>
                          </div>
                          <Button className="w-full mt-4 bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                            <Play className="h-4 w-4 mr-2" />
                            {video.is_watched ? 'Revoir' : 'Regarder'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </StudentSidebar>
    </AuthGuard>
  )
}


