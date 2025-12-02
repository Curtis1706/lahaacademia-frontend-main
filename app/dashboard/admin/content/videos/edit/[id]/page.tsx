"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Video,
  Upload,
  Play,
  Clock,
  Users,
  Star,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  Image,
  Link as LinkIcon,
  Volume2,
  VolumeX,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

interface VideoData {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  file?: File
  thumbnail?: File
  quality: '720p' | '1080p' | '4K'
  language: string
  subtitles: boolean
  allowDownloads: boolean
  allowComments: boolean
  isPublished: boolean
  tags: string[]
  teacher?: string
  price: number
  status: string
}

export default function EditVideoPage() {
  const params = useParams()
  const router = useRouter()
  const videoId = params.id as string

  const [videoData, setVideoData] = useState<VideoData>({
    id: "",
    title: "",
    description: "",
    subject: "",
    class_level: "",
    duration: 0,
    quality: '1080p',
    language: "français",
    subtitles: false,
    allowDownloads: false,
    allowComments: true,
    isPublished: false,
    tags: [],
    price: 0,
    status: 'draft'
  })

  const [uploadedVideo, setUploadedVideo] = useState<{
    url: string
    name: string
    size: number
    type: string
  } | null>(null)
  const [uploadedThumbnail, setUploadedThumbnail] = useState<{
    url: string
    name: string
    size: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Charger les données de la vidéo
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/videos/${videoId}`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        setVideoData({
          id: data.id,
          title: data.title || '',
          description: data.description || '',
          subject: data.subject || '',
          class_level: data.class_level || '',
          duration: data.duration_minutes || 0,
          quality: data.quality || '1080p',
          language: data.language || 'français',
          subtitles: data.subtitles || false,
          allowDownloads: data.allow_downloads || false,
          allowComments: data.allow_comments !== false,
          isPublished: data.status === 'published',
          tags: data.tags || [],
          price: data.price || 0,
          status: data.status || 'draft'
        })

        if (data.content_file_url) {
          setUploadedVideo({
            url: data.content_file_url,
            name: data.title || 'Vidéo existante',
            size: data.file_size_mb ? data.file_size_mb * 1024 * 1024 : 0,
            type: data.file_format || 'video/mp4'
          })
        }

        if (data.thumbnail_url) {
          setUploadedThumbnail({
            url: data.thumbnail_url,
            name: 'Miniature existante',
            size: 0
          })
        }

      } catch (error) {
        console.error('Erreur lors du chargement de la vidéo:', error)
        alert('Erreur lors du chargement de la vidéo')
      } finally {
        setIsLoading(false)
      }
    }

    if (videoId) {
      loadVideo()
    }
  }, [videoId])

  const addTag = () => {
    if (currentTag.trim() && !videoData.tags.includes(currentTag.trim())) {
      setVideoData({
        ...videoData,
        tags: [...videoData.tags, currentTag.trim()]
      })
      setCurrentTag("")
    }
  }

  const removeTag = (index: number) => {
    setVideoData({
      ...videoData,
      tags: videoData.tags.filter((_, i) => i !== index)
    })
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      setUploadedVideo({
        url: result.file_url,
        name: result.file_name,
        size: result.file_size,
        type: result.file_type
      })

      setVideoData({
        ...videoData,
        file: file
      })
      
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        setVideoData(prev => ({
          ...prev,
          duration: Math.round(video.duration)
        }))
      }
      video.src = URL.createObjectURL(file)

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de la vidéo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'thumbnail')

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      setUploadedThumbnail({
        url: result.file_url,
        name: result.file_name,
        size: result.file_size
      })

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de la miniature')
    } finally {
      setIsUploading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (!videoData.title || !videoData.subject || !videoData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const payload = {
        title: videoData.title,
        description: videoData.description,
        subject: videoData.subject,
        class_level: videoData.class_level,
        duration_minutes: videoData.duration,
        quality: videoData.quality,
        language: videoData.language,
        subtitles: videoData.subtitles,
        status: videoData.status,
        tags: videoData.tags,
        allow_downloads: videoData.allowDownloads,
        allow_comments: videoData.allowComments,
        price: videoData.price,
        content_file: uploadedVideo?.url,
        thumbnail: uploadedThumbnail?.url,
      }

      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Vidéo modifiée avec succès !")
      router.push('/dashboard/admin/content/videos')
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Erreur lors de la modification")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible.")) {
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Vidéo supprimée avec succès !")
      router.push('/dashboard/admin/content/videos')
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRoles={['admin', 'super_admin']}>
        <AdminSidebar>
          <main className="flex-1 w-full overflow-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
            </div>
          </main>
        </AdminSidebar>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                    <Link href="/dashboard/admin/content/videos">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Modifier la vidéo
                    </h1>
                    <p className="text-laha-text-secondary">
                      Modifiez les informations de la vidéo
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                  <Button 
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </div>

            {/* Form with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-laha-surface border-laha-border">
                <TabsTrigger value="general" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <File className="h-4 w-4 mr-2" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                {/* Informations générales */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-laha-text">
                        Titre de la vidéo *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ex: Introduction à la physique quantique"
                        value={videoData.title}
                        onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject" className="text-laha-text">
                          Matière *
                        </Label>
                        <Select value={videoData.subject} onValueChange={(value) => setVideoData({ ...videoData, subject: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une matière" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematiques">Mathématiques</SelectItem>
                            <SelectItem value="physique">Physique</SelectItem>
                            <SelectItem value="francais">Français</SelectItem>
                            <SelectItem value="svt">SVT</SelectItem>
                            <SelectItem value="histoire">Histoire</SelectItem>
                            <SelectItem value="anglais">Anglais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="class_level" className="text-laha-text">
                          Classe *
                        </Label>
                        <Select value={videoData.class_level} onValueChange={(value) => setVideoData({ ...videoData, class_level: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une classe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quatrieme">Quatrième</SelectItem>
                            <SelectItem value="troisieme">Troisième</SelectItem>
                            <SelectItem value="seconde">Seconde</SelectItem>
                            <SelectItem value="premiere">Première</SelectItem>
                            <SelectItem value="terminale">Terminale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-laha-text">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Description de la vidéo..."
                        value={videoData.description}
                        onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration technique */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Configuration technique</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="quality" className="text-laha-text">
                          Qualité
                        </Label>
                        <Select value={videoData.quality} onValueChange={(value: any) => setVideoData({ ...videoData, quality: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une qualité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="720p">720p HD</SelectItem>
                            <SelectItem value="1080p">1080p Full HD</SelectItem>
                            <SelectItem value="4K">4K Ultra HD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="language" className="text-laha-text">
                          Langue
                        </Label>
                        <Select value={videoData.language} onValueChange={(value) => setVideoData({ ...videoData, language: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="français">Français</SelectItem>
                            <SelectItem value="anglais">Anglais</SelectItem>
                            <SelectItem value="espagnol">Espagnol</SelectItem>
                            <SelectItem value="allemand">Allemand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="price" className="text-laha-text">
                          Prix (FCFA)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="100"
                          value={videoData.price}
                          onChange={(e) => setVideoData({ ...videoData, price: parseFloat(e.target.value) || 0 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>

                    {videoData.duration > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-laha-background rounded-lg border border-laha-border">
                        <Clock className="h-4 w-4 text-laha-gold" />
                        <span className="text-laha-text">Durée: {formatDuration(videoData.duration)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                {/* Upload de vidéo */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Fichier vidéo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Video className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Télécharger la vidéo</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: MP4, AVI, MOV (max 500MB)
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                          disabled={isUploading}
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black" disabled={isUploading}>
                          <label htmlFor="video-upload" className="cursor-pointer">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {isUploading ? 'Upload en cours...' : 'Choisir une vidéo'}
                          </label>
                        </Button>
                      </div>
                    </div>

                    {uploadedVideo && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                          <Play className="h-6 w-6 text-laha-gold" />
                          <div className="flex-1">
                            <p className="text-laha-text font-medium">{uploadedVideo.name}</p>
                            <p className="text-laha-text-secondary text-sm">
                              {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Badge variant="outline" className="border-laha-border text-laha-text">
                            {videoData.quality}
                          </Badge>
                          <Badge variant="outline" className="border-green-500/20 text-green-500">
                            ✓ Uploadé
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Miniature */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Miniature</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Image className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Télécharger une miniature</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: JPG, PNG (16:9 recommandé)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          id="thumbnail-upload"
                          disabled={isUploading}
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black" disabled={isUploading}>
                          <label htmlFor="thumbnail-upload" className="cursor-pointer">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Image className="h-4 w-4 mr-2" />
                            )}
                            {isUploading ? 'Upload en cours...' : 'Choisir une image'}
                          </label>
                        </Button>
                      </div>
                    </div>

                    {uploadedThumbnail && (
                      <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                        <Image className="h-6 w-6 text-laha-gold" />
                        <div className="flex-1">
                          <p className="text-laha-text font-medium">{uploadedThumbnail.name}</p>
                          <p className="text-laha-text-secondary text-sm">
                            {(uploadedThumbnail.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Badge variant="outline" className="border-green-500/20 text-green-500">
                          ✓ Uploadé
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un tag..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        className="bg-laha-background border-laha-border text-laha-text"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {videoData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-laha-border text-laha-text">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTag(index)}
                            className="ml-2 h-auto p-0 text-laha-text-secondary hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Paramètres de publication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Statut</Label>
                        <p className="text-sm text-laha-text-secondary">Statut de publication de la vidéo</p>
                      </div>
                      <Select value={videoData.status} onValueChange={(value) => setVideoData({ ...videoData, status: value })}>
                        <SelectTrigger className="bg-laha-background border-laha-border text-laha-text w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Brouillon</SelectItem>
                          <SelectItem value="published">Publié</SelectItem>
                          <SelectItem value="archived">Archivé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Sous-titres disponibles</Label>
                        <p className="text-sm text-laha-text-secondary">La vidéo contient des sous-titres</p>
                      </div>
                      <Switch
                        checked={videoData.subtitles}
                        onCheckedChange={(checked) => setVideoData({ ...videoData, subtitles: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Autoriser les téléchargements</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront télécharger la vidéo</p>
                      </div>
                      <Switch
                        checked={videoData.allowDownloads}
                        onCheckedChange={(checked) => setVideoData({ ...videoData, allowDownloads: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Autoriser les commentaires</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront commenter la vidéo</p>
                      </div>
                      <Switch
                        checked={videoData.allowComments}
                        onCheckedChange={(checked) => setVideoData({ ...videoData, allowComments: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-laha-border">
              <Button 
                variant="outline" 
                className="border-laha-border text-laha-text hover:bg-laha-surface"
                onClick={() => router.push('/dashboard/admin/content/videos')}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button 
                className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Sauvegarder les modifications
              </Button>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}

