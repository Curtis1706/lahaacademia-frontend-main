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
  Library,
  Upload,
  Image,
  FileText,
  BookOpen,
  Clock,
  Users,
  Star,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  FileImage,
  FileSpreadsheet
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

interface BookData {
  id: string
  title: string
  author: string
  subject: string
  class_level: string
  description: string
  isbn: string
  pages: number
  language: string
  publisher: string
  publicationYear: number
  price: number
  coverImage?: string
  file?: File
  fileType: 'pdf' | 'epub' | 'mobi'
  isPublished: boolean
  allowDownloads: boolean
  allowPreview: boolean
  tags: string[]
  status: string
}

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [bookData, setBookData] = useState<BookData>({
    id: "",
    title: "",
    author: "",
    subject: "",
    class_level: "",
    description: "",
    isbn: "",
    pages: 0,
    language: "français",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    price: 0,
    fileType: 'pdf',
    isPublished: false,
    allowDownloads: true,
    allowPreview: true,
    tags: [],
    status: 'draft'
  })

  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    name: string
    size: number
    type: string
  } | null>(null)
  const [uploadedCover, setUploadedCover] = useState<{
    url: string
    name: string
    size: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Charger les données du livre
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/admin/books/${bookId}`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        setBookData({
          id: data.id,
          title: data.title || '',
          author: data.author || '',
          subject: data.subject || '',
          class_level: data.class_level || '',
          description: data.description || '',
          isbn: data.isbn || '',
          pages: data.pages || 0,
          language: data.language || 'français',
          publisher: data.publisher || '',
          publicationYear: data.publication_year || new Date().getFullYear(),
          price: data.price || 0,
          fileType: data.file_format === 'pdf' ? 'pdf' : 
                   data.file_format === 'epub' ? 'epub' : 'mobi',
          isPublished: data.status === 'published',
          allowDownloads: data.allow_downloads !== false,
          allowPreview: data.allow_preview !== false,
          tags: data.tags || [],
          status: data.status || 'draft'
        })

        if (data.content_file_url) {
          setUploadedFile({
            url: data.content_file_url,
            name: data.title || 'Fichier existant',
            size: data.file_size_mb ? data.file_size_mb * 1024 * 1024 : 0,
            type: data.file_format || 'application/pdf'
          })
        }

        if (data.thumbnail_url) {
          setUploadedCover({
            url: data.thumbnail_url,
            name: 'Image de couverture existante',
            size: 0
          })
        }

      } catch (error) {
        console.error('Erreur lors du chargement du livre:', error)
        alert('Erreur lors du chargement du livre')
      } finally {
        setIsLoading(false)
      }
    }

    if (bookId) {
      loadBook()
    }
  }, [bookId])

  const addTag = () => {
    if (currentTag.trim() && !bookData.tags.includes(currentTag.trim())) {
      setBookData({
        ...bookData,
        tags: [...bookData.tags, currentTag.trim()]
      })
      setCurrentTag("")
    }
  }

  const removeTag = (index: number) => {
    setBookData({
      ...bookData,
      tags: bookData.tags.filter((_, i) => i !== index)
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

      setBookData({
        ...bookData,
        file: file,
        fileType: file.type.includes('pdf') ? 'pdf' : 
                 file.type.includes('epub') ? 'epub' : 'mobi'
      })

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload du fichier')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploadedCover({
        url: result.file_url,
        name: result.file_name,
        size: result.file_size
      })

    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (!bookData.title || !bookData.author || !bookData.subject || !bookData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const payload = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        subject: bookData.subject,
        class_level: bookData.class_level,
        isbn: bookData.isbn,
        pages: bookData.pages,
        language: bookData.language,
        publisher: bookData.publisher,
        publication_year: bookData.publicationYear,
        price: bookData.price,
        status: bookData.status,
        tags: bookData.tags,
        allow_downloads: bookData.allowDownloads,
        allow_preview: bookData.allowPreview,
        content_file: uploadedFile?.url,
        thumbnail: uploadedCover?.url,
      }

      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Livre modifié avec succès !")
      router.push('/dashboard/admin/content/books')
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Erreur lors de la modification")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.")) {
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      alert("Livre supprimé avec succès !")
      router.push('/dashboard/admin/content/books')
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      alert("Erreur lors de la suppression")
    } finally {
      setIsSaving(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'epub':
        return <BookOpen className="h-6 w-6 text-blue-500" />
      case 'mobi':
        return <File className="h-6 w-6 text-green-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
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
                    <Link href="/dashboard/admin/content/books">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Modifier le livre
                    </h1>
                    <p className="text-laha-text-secondary">
                      Modifiez les informations du livre
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
                        Titre du livre *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ex: Mathématiques Terminale S"
                        value={bookData.title}
                        onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="author" className="text-laha-text">
                          Auteur *
                        </Label>
                        <Input
                          id="author"
                          placeholder="Nom de l'auteur"
                          value={bookData.author}
                          onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>

                      <div>
                        <Label htmlFor="publisher" className="text-laha-text">
                          Éditeur
                        </Label>
                        <Input
                          id="publisher"
                          placeholder="Nom de l'éditeur"
                          value={bookData.publisher}
                          onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject" className="text-laha-text">
                          Matière *
                        </Label>
                        <Select value={bookData.subject} onValueChange={(value) => setBookData({ ...bookData, subject: value })}>
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
                        <Select value={bookData.class_level} onValueChange={(value) => setBookData({ ...bookData, class_level: value })}>
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
                        placeholder="Description du livre..."
                        value={bookData.description}
                        onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Détails techniques */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Détails techniques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="isbn" className="text-laha-text">
                          ISBN
                        </Label>
                        <Input
                          id="isbn"
                          placeholder="978-2-123456-78-9"
                          value={bookData.isbn}
                          onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pages" className="text-laha-text">
                          Nombre de pages
                        </Label>
                        <Input
                          id="pages"
                          type="number"
                          min="1"
                          value={bookData.pages}
                          onChange={(e) => setBookData({ ...bookData, pages: parseInt(e.target.value) || 0 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>

                      <div>
                        <Label htmlFor="publicationYear" className="text-laha-text">
                          Année de publication
                        </Label>
                        <Input
                          id="publicationYear"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={bookData.publicationYear}
                          onChange={(e) => setBookData({ ...bookData, publicationYear: parseInt(e.target.value) || new Date().getFullYear() })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language" className="text-laha-text">
                          Langue
                        </Label>
                        <Select value={bookData.language} onValueChange={(value) => setBookData({ ...bookData, language: value })}>
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
                          value={bookData.price}
                          onChange={(e) => setBookData({ ...bookData, price: parseFloat(e.target.value) || 0 })}
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
                    <CardTitle className="text-laha-text">Fichier du livre</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Télécharger le fichier du livre</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: PDF, EPUB, MOBI (max 50MB)
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.epub,.mobi"
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
                      <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                        {getFileIcon(bookData.fileType)}
                        <div className="flex-1">
                          <p className="text-laha-text font-medium">{uploadedFile.name}</p>
                          <p className="text-laha-text-secondary text-sm">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Badge variant="outline" className="border-laha-border text-laha-text">
                          {bookData.fileType.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-green-500/20 text-green-500">
                          ✓ Uploadé
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Image de couverture */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Image de couverture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
                      <Image className="h-12 w-12 mx-auto mb-4 text-laha-text-secondary" />
                      <div className="space-y-2">
                        <p className="text-laha-text font-medium">Télécharger l'image de couverture</p>
                        <p className="text-laha-text-secondary text-sm">
                          Formats supportés: JPG, PNG (max 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                          id="cover-upload"
                          disabled={isUploading}
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black" disabled={isUploading}>
                          <label htmlFor="cover-upload" className="cursor-pointer">
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

                    {uploadedCover && (
                      <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                        <Image className="h-6 w-6 text-laha-gold" />
                        <div className="flex-1">
                          <p className="text-laha-text font-medium">{uploadedCover.name}</p>
                          <p className="text-laha-text-secondary text-sm">
                            {(uploadedCover.size / 1024).toFixed(2)} KB
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
                      {bookData.tags.map((tag, index) => (
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
                        <p className="text-sm text-laha-text-secondary">Statut de publication du livre</p>
                      </div>
                      <Select value={bookData.status} onValueChange={(value) => setBookData({ ...bookData, status: value })}>
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
                        <Label className="text-laha-text">Autoriser les téléchargements</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront télécharger le livre</p>
                      </div>
                      <Switch
                        checked={bookData.allowDownloads}
                        onCheckedChange={(checked) => setBookData({ ...bookData, allowDownloads: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Autoriser l'aperçu</Label>
                        <p className="text-sm text-laha-text-secondary">Les utilisateurs pourront prévisualiser le livre</p>
                      </div>
                      <Switch
                        checked={bookData.allowPreview}
                        onCheckedChange={(checked) => setBookData({ ...bookData, allowPreview: checked })}
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
                onClick={() => router.push('/dashboard/admin/content/books')}
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

