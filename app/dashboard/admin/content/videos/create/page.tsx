"use client"

import { useState } from "react"
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
}

export default function CreateVideoPage() {
  const [videoData, setVideoData] = useState<VideoData>({
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
    price: 0
  })

  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [uploadProgress, setUploadProgress] = useState(0)

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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoData({
        ...videoData,
        file: file
      })
      
      // Simuler la lecture des métadonnées vidéo
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        setVideoData(prev => ({
          ...prev,
          duration: Math.round(video.duration)
        }))
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoData({
        ...videoData,
        thumbnail: file
      })
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
    setIsLoading(true)
    try {
      // Validation
      if (!videoData.title || !videoData.subject || !videoData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      console.log("Sauvegarde de la vidéo:", videoData)
      // TODO: Appel API pour sauvegarder
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      alert("Vidéo sauvegardée avec succès !")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    console.log("Prévisualisation de la vidéo:", videoData)
    // TODO: Ouvrir modal de prévisualisation
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      // Validation complète
      if (!videoData.title || !videoData.subject || !videoData.class_level || !videoData.file) {
        alert("Veuillez remplir tous les champs obligatoires et télécharger une vidéo")
        return
      }

      console.log("Publication de la vidéo:", videoData)
      // TODO: Appel API pour publier
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      alert("Vidéo publiée avec succès !")
    } catch (error) {
      console.error("Erreur lors de la publication:", error)
      alert("Erreur lors de la publication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-4xl">
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
                      Créer une vidéo
                    </h1>
                    <p className="text-laha-text-secondary">
                      Ajoutez une nouvelle vidéo éducative
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="border-laha-border text-laha-text hover:bg-laha-surface"
                    onClick={handlePreview}
                    disabled={isLoading}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button 
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    onClick={handlePublish}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Video className="h-4 w-4 mr-2" />
                    )}
                    Publier la vidéo
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
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choisir une vidéo
                          </label>
                        </Button>
                      </div>
                    </div>

                    {videoData.file && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                          <Play className="h-6 w-6 text-laha-gold" />
                          <div className="flex-1">
                            <p className="text-laha-text font-medium">{videoData.file.name}</p>
                            <p className="text-laha-text-secondary text-sm">
                              {(videoData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Badge variant="outline" className="border-laha-border text-laha-text">
                            {videoData.quality}
                          </Badge>
                        </div>

                        {/* Barre de progression simulée */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-laha-text-secondary">
                            <span>Upload en cours...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-laha-background rounded-full h-2">
                            <div 
                              className="bg-laha-gold h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
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
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                          <label htmlFor="thumbnail-upload" className="cursor-pointer">
                            <Image className="h-4 w-4 mr-2" />
                            Choisir une image
                          </label>
                        </Button>
                      </div>
                    </div>

                    {videoData.thumbnail && (
                      <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                        <Image className="h-6 w-6 text-laha-gold" />
                        <div className="flex-1">
                          <p className="text-laha-text font-medium">{videoData.thumbnail.name}</p>
                          <p className="text-laha-text-secondary text-sm">
                            {(videoData.thumbnail.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
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
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Sauvegarder comme brouillon
              </Button>
              <Button 
                className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Video className="h-4 w-4 mr-2" />
                )}
                Publier la vidéo
              </Button>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}
