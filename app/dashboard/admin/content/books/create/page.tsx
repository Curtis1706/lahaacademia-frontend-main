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
}

export default function CreateBookPage() {
  const [bookData, setBookData] = useState<BookData>({
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
    tags: []
  })

  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBookData({
        ...bookData,
        file: file,
        fileType: file.type.includes('pdf') ? 'pdf' : 
                 file.type.includes('epub') ? 'epub' : 'mobi'
      })
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validation
      if (!bookData.title || !bookData.author || !bookData.subject || !bookData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      console.log("Sauvegarde du livre:", bookData)
      // TODO: Appel API pour sauvegarder
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      alert("Livre sauvegardé avec succès !")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    console.log("Prévisualisation du livre:", bookData)
    // TODO: Ouvrir modal de prévisualisation
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      // Validation complète
      if (!bookData.title || !bookData.author || !bookData.subject || !bookData.class_level || !bookData.file) {
        alert("Veuillez remplir tous les champs obligatoires et télécharger un fichier")
        return
      }

      console.log("Publication du livre:", bookData)
      // TODO: Appel API pour publier
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulation
      alert("Livre publié avec succès !")
    } catch (error) {
      console.error("Erreur lors de la publication:", error)
      alert("Erreur lors de la publication")
    } finally {
      setIsLoading(false)
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
                    <Link href="/dashboard/admin/content/books">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Créer un livre
                    </h1>
                    <p className="text-laha-text-secondary">
                      Ajoutez un nouveau livre à la bibliothèque numérique
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
                      <Library className="h-4 w-4 mr-2" />
                    )}
                    Publier le livre
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
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choisir un fichier
                          </label>
                        </Button>
                      </div>
                    </div>

                    {bookData.file && (
                      <div className="flex items-center gap-4 p-4 bg-laha-background rounded-lg border border-laha-border">
                        {getFileIcon(bookData.fileType)}
                        <div className="flex-1">
                          <p className="text-laha-text font-medium">{bookData.file.name}</p>
                          <p className="text-laha-text-secondary text-sm">
                            {(bookData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Badge variant="outline" className="border-laha-border text-laha-text">
                          {bookData.fileType.toUpperCase()}
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
                          className="hidden"
                          id="cover-upload"
                        />
                        <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                          <label htmlFor="cover-upload" className="cursor-pointer">
                            <Image className="h-4 w-4 mr-2" />
                            Choisir une image
                          </label>
                        </Button>
                      </div>
                    </div>
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
                  <Library className="h-4 w-4 mr-2" />
                )}
                Publier le livre
              </Button>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}
