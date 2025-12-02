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
  FileText,
  Upload,
  File,
  FileImage,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image,
  Link as LinkIcon,
  BookOpen,
  Clock,
  Users
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
import Link from "next/link"

interface DocumentData {
  title: string
  description: string
  subject: string
  class_level: string
  type: 'pdf' | 'image' | 'spreadsheet' | 'presentation' | 'text'
  file?: File
  thumbnail?: File
  author: string
  language: string
  pages: number
  size: number
  allowDownloads: boolean
  allowPreview: boolean
  isPublished: boolean
  tags: string[]
  price: number
  category: string
}

export default function CreateDocumentPage() {
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: "",
    description: "",
    subject: "",
    class_level: "",
    type: 'pdf',
    author: "",
    language: "français",
    pages: 0,
    size: 0,
    allowDownloads: true,
    allowPreview: true,
    isPublished: false,
    tags: [],
    price: 0,
    category: "exercise"
  })

  const [uploadedFile, setUploadedFile] = useState<{
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

  const addTag = () => {
    if (currentTag.trim() && !documentData.tags.includes(currentTag.trim())) {
      setDocumentData({
        ...documentData,
        tags: [...documentData.tags, currentTag.trim()]
      })
      setCurrentTag("")
    }
  }

  const removeTag = (index: number) => {
    setDocumentData({
      ...documentData,
      tags: documentData.tags.filter((_, i) => i !== index)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'content')

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
      setUploadedFile({
        url: result.file_url,
        name: result.file_name,
        size: result.file_size,
        type: result.file_type
      })

      const fileType = file.type.includes('pdf') ? 'pdf' :
                     file.type.includes('image') ? 'image' :
                     file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'spreadsheet' :
                     file.type.includes('presentation') || file.name.endsWith('.pptx') || file.name.endsWith('.ppt') ? 'presentation' :
                     'text'

      setDocumentData({
        ...documentData,
        file: file,
        type: fileType as any,
        size: file.size,
        pages: fileType === 'pdf' ? Math.floor(Math.random() * 50) + 1 : 1
      })

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload du fichier')
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
      alert('Erreur lors de l\'upload de l\'aperçu')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      case 'presentation':
        return <FileText className="h-6 w-6 text-purple-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validation
      if (!documentData.title || !documentData.subject || !documentData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const payload = {
        title: documentData.title,
        description: documentData.description,
        subject: documentData.subject,
        class_level: documentData.class_level,
        type: documentData.type,
        author: documentData.author,
        language: documentData.language,
        pages: documentData.pages,
        size_mb: documentData.size / (1024 * 1024),
        category: documentData.category,
        status: 'draft',
        tags: documentData.tags,
        allow_downloads: documentData.allowDownloads,
        allow_preview: documentData.allowPreview,
        content_file: uploadedFile?.url,
        thumbnail: uploadedThumbnail?.url,

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Document sauvegardé avec succès !")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    console.log("Prévisualisation du document:", documentData)
    // TODO: Ouvrir modal de prévisualisation
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      // Validation complète
      if (!documentData.title || !documentData.subject || !documentData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const payload = {
        title: documentData.title,
        description: documentData.description,
        subject: documentData.subject,
        class_level: documentData.class_level,
        type: documentData.type,
        author: documentData.author,
        language: documentData.language,
        pages: documentData.pages,
        size_mb: documentData.size / (1024 * 1024),
        category: documentData.category,
        status: 'published',
        tags: documentData.tags,
        allow_downloads: documentData.allowDownloads,
        allow_preview: documentData.allowPreview,
        content_file: uploadedFile?.url,
        thumbnail: uploadedThumbnail?.url,

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Document publié avec succès !")
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
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                    <Link href="/dashboard/admin/content/documents">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Créer un document
                    </h1>
                    <p className="text-laha-text-secondary">
                      Ajoutez un nouveau document pédagogique
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
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Publier le document
                  </Button>
                </div>
              </div>
            </div>

            {/* Form with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-laha-surface border-laha-border">
                <TabsTrigger value="general" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <FileText className="h-4 w-4 mr-2" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <Upload className="h-4 w-4 mr-2" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <CheckCircle className="h-4 w-4 mr-2" />
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
                        Titre du document *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ex: Exercices de mathématiques - Terminale"
                        value={documentData.title}
                        onChange={(e) => setDocumentData({ ...documentData, title: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject" className="text-laha-text">
                          Matière *
                        </Label>
                        <Select value={documentData.subject} onValueChange={(value) => setDocumentData({ ...documentData, subject: value })}>
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
                        <Select value={documentData.class_level} onValueChange={(value) => setDocumentData({ ...documentData, class_level: value })}>
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
                        placeholder="Description du document..."
                        value={documentData.description}
                        onChange={(e) => setDocumentData({ ...documentData, description: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Détails du document */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Détails du document</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="type" className="text-laha-text">
                          Type de document
                        </Label>
                        <Select value={documentData.type} onValueChange={(value: any) => setDocumentData({ ...documentData, type: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="spreadsheet">Tableur</SelectItem>
                            <SelectItem value="presentation">Présentation</SelectItem>
                            <SelectItem value="text">Texte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="category" className="text-laha-text">
                          Catégorie
                        </Label>
                        <Select value={documentData.category} onValueChange={(value) => setDocumentData({ ...documentData, category: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exercise">Exercice</SelectItem>
                            <SelectItem value="lesson">Leçon</SelectItem>
                            <SelectItem value="exam">Examen</SelectItem>
                            <SelectItem value="summary">Résumé</SelectItem>
                            <SelectItem value="worksheet">Fiche de travail</SelectItem>
                            <SelectItem value="reference">Document de référence</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="author" className="text-laha-text">
                          Auteur
                        </Label>
                        <Input
                          id="author"
                          placeholder="Nom de l'auteur"
                          value={documentData.author}
                          onChange={(e) => setDocumentData({ ...documentData, author: e.target.value })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language" className="text-laha-text">
                          Langue
                        </Label>
                        <Select value={documentData.language} onValueChange={(value) => setDocumentData({ ...documentData, language: value })}>
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
                          value={documentData.price}
                          onChange={(e) => setDocumentData({ ...documentData, price: parseFloat(e.target.value) || 0 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                {/* Upload de fichier */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Fichier du document</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Télécharger le fichier</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG (max 25MB)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          disabled={isUploading}
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black" disabled={isUploading}>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            {isUploading ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            {isUploading ? 'Upload en cours...' : 'Choisir un fichier'}
                          </label>
                        </Button>
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                          {getFileIcon(documentData.type)}
                          <div className="flex-1">
                            <p className="text-laha-text font-medium">{uploadedFile.name}</p>
                            <p className="text-laha-text-secondary text-sm">
                              {formatFileSize(uploadedFile.size)}
                              {documentData.pages > 0 && ` • ${documentData.pages} pages`}
                            </p>
                          </div>
                          <Badge variant="outline" className="border-laha-border text-laha-text">
                            {documentData.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="border-green-500/20 text-green-500">
                            ✓ Uploadé
                          </Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Aperçu */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Aperçu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Image className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Image d'aperçu</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: JPG, PNG (max 2MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          className="hidden"
                          id="preview-upload"
                          disabled={isUploading}
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black" disabled={isUploading}>
                          <label htmlFor="preview-upload" className="cursor-pointer">
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
                      {documentData.tags.map((tag, index) => (
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
                        <Label className="text-laha-text">Autoriser les téléchargements</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront télécharger le document</p>
                      </div>
                      <Switch
                        checked={documentData.allowDownloads}
                        onCheckedChange={(checked) => setDocumentData({ ...documentData, allowDownloads: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Autoriser l'aperçu</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront prévisualiser le document</p>
                      </div>
                      <Switch
                        checked={documentData.allowPreview}
                        onCheckedChange={(checked) => setDocumentData({ ...documentData, allowPreview: checked })}
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
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Publier le document
              </Button>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}
