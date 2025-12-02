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
  Library,
  ChevronDown,
  BookOpen,
  Star,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  description: string
  subject: string
  class_level: string
  status: string
  pages: number
  rating: number
  downloads: number
  created_at: string
  cover_image?: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [previewContent, setPreviewContent] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null)

  // Fonction pour supprimer un livre
  const handleDeleteBook = async (bookId: string) => {
    try {
      setDeletingBookId(bookId)
      console.log('🗑️ Suppression du livre:', bookId)
      
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
      
      // Supprimer le livre de la liste locale
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId))
      
      console.log('✅ Livre supprimé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setDeletingBookId(null)
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

        params.set('content_type', 'book')
        const url = `/api/admin/content${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { method: 'GET', credentials: 'include' })
        const data = await res.json()

        const raw: any[] = Array.isArray(data) ? data : (data.results || data.books || [])
        const normalized: Book[] = raw.map((b: any) => ({
          id: (b.id ?? b.pk ?? '').toString(),
          title: b.title || b.name || 'Sans titre',
          author: b.author || b.created_by?.full_name || `${b.created_by?.first_name || ''} ${b.created_by?.last_name || ''}`.trim(),
          description: b.description || '',
          subject: b.subject || b.category || 'N/A',
          class_level: b.class_level || b.level || 'N/A',
          status: b.status || (b.is_active === false ? 'archived' : 'published'),
          pages: Number(b.pages || 0),
          rating: Number(b.rating || 0),
          downloads: Number(b.downloads || 0),
          created_at: b.created_at || b.date_created || '',
          cover_image: b.cover_image || null,
        }))

        setBooks(normalized)
      } catch (e) {
        console.error('Erreur chargement livres:', e)
        setBooks([])
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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || book.subject === selectedSubject
    const matchesClass = !selectedClass || book.class_level === selectedClass
    const matchesStatus = !selectedStatus || book.status === selectedStatus

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
                    Gestion des Livres
                  </h1>
                  <p className="text-laha-text-secondary">
                    Gérez la bibliothèque numérique et les ressources
                  </p>
                </div>
                <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                  <Link href="/dashboard/admin/content/books/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un livre
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
                        placeholder="Rechercher un livre..."
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

            {/* Books List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map((book) => (
                  <Card key={book.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Cover Image */}
                        <div className="w-24 h-32 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border">
                          <Library className="h-8 w-8 text-laha-text-secondary" />
                        </div>
                        
                        {/* Book Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{book.title}</h3>
                            <Badge className={getStatusBadge(book.status)}>
                              {book.status === 'published' ? 'Publié' : 
                               book.status === 'draft' ? 'Brouillon' : 'Archivé'}
                            </Badge>
                          </div>
                          
                          <p className="text-laha-text-secondary mb-3">{book.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {book.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {book.pages} pages
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {book.rating}/5
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {book.downloads} téléchargements
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {book.created_at}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {book.subject}
                            </Badge>
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {book.class_level}
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
                              setPreviewContent({
                                ...book,
                                type: 'book',
                                fileUrl: book.file_url,
                                thumbnailUrl: book.cover_image,
                                fileType: book.file_format,
                                fileSize: book.file_size_mb ? book.file_size_mb * 1024 * 1024 : 0,
                                pageCount: book.pages,
                                author: book.author,
                                allowDownloads: book.allow_downloads,
                                allowPreview: book.allow_preview
                              })
                              setIsPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button asChild variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Link href={`/dashboard/admin/content/books/edit/${book.id}`}>
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
                                disabled={deletingBookId === book.id}
                              >
                            <Trash2 className="h-4 w-4 mr-1" />
                                {deletingBookId === book.id ? 'Suppression...' : 'Supprimer'}
                          </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le livre "{book.title}" ? 
                                  Cette action est irréversible et supprimera définitivement le livre et tous ses fichiers associés.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBook(book.id)}
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
