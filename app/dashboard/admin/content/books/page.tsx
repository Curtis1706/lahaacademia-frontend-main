"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
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

  // Données de test
  useEffect(() => {
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "Mathématiques Terminale S",
        author: "Jean Dupont",
        description: "Manuel complet de mathématiques pour la terminale scientifique",
        subject: "Mathématiques",
        class_level: "Terminale",
        status: "published",
        pages: 450,
        rating: 4.5,
        downloads: 1250,
        created_at: "2025-08-10",
        cover_image: "/placeholder-book.jpg"
      },
      {
        id: "2",
        title: "Physique-Chimie Première",
        author: "Marie Martin",
        description: "Cours et exercices de physique-chimie pour la première",
        subject: "Physique",
        class_level: "Première",
        status: "published",
        pages: 380,
        rating: 4.2,
        downloads: 980,
        created_at: "2025-08-12",
        cover_image: "/placeholder-book.jpg"
      },
      {
        id: "3",
        title: "Français Quatrième",
        author: "Pierre Durand",
        description: "Grammaire et littérature française pour la quatrième",
        subject: "Français",
        class_level: "Quatrième",
        status: "draft",
        pages: 320,
        rating: 4.0,
        downloads: 750,
        created_at: "2025-08-15",
        cover_image: "/placeholder-book.jpg"
      },
      {
        id: "4",
        title: "SVT Seconde",
        author: "Sophie Leroy",
        description: "Sciences de la vie et de la terre pour la seconde",
        subject: "SVT",
        class_level: "Seconde",
        status: "published",
        pages: 400,
        rating: 4.3,
        downloads: 1100,
        created_at: "2025-08-18",
        cover_image: "/placeholder-book.jpg"
      }
    ]
    
    setTimeout(() => {
      setBooks(mockBooks)
      setLoading(false)
    }, 1000)
  }, [])

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
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto">
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
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Copy className="h-4 w-4 mr-1" />
                            Dupliquer
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
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
    </AuthGuard>
  )
}
