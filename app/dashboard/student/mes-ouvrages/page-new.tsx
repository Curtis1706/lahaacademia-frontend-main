"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { useStudentData } from "@/hooks/use-student-data"
import { 
  Book,
  Download,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  Bookmark,
  FileText,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function StudentBooksPage() {
  const { books, loading, error, refreshData } = useStudentData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les livres
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || book.subject === selectedSubject
    const matchesTab = activeTab === "all" || 
                      (activeTab === "read" && book.is_read) ||
                      (activeTab === "favorites" && book.is_favorite)
    
    return matchesSearch && matchesSubject && matchesTab
  })

  // Stats
  const readBooks = books.filter(b => b.is_read)
  const favoriteBooks = books.filter(b => b.is_favorite)
  const totalPages = books.reduce((sum, b) => sum + b.pages, 0)

  return (
    <AuthGuard requiredRole="student">
      <StudentSidebar>
        <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-laha-gold mb-2">Mes Ouvrages</h1>
                <p className="text-laha-text-secondary">Consultez vos manuels et livres scolaires</p>
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
                <span className="ml-3 text-laha-text-secondary">Chargement des ouvrages...</span>
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
                          <Book className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Total ouvrages</p>
                          <p className="text-xl font-bold">{books.length}</p>
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
                          <p className="text-sm text-laha-text-secondary">Lus</p>
                          <p className="text-xl font-bold">{readBooks.length}</p>
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
                          <p className="text-xl font-bold">{favoriteBooks.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Total pages</p>
                          <p className="text-xl font-bold">{totalPages}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="py-4">
                    <Input
                      placeholder="Rechercher par titre ou auteur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="all">Tous ({books.length})</TabsTrigger>
                    <TabsTrigger value="read">Lus ({readBooks.length})</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris ({favoriteBooks.length})</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-laha-text-secondary">Aucun ouvrage trouvé</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredBooks.map((book) => (
                      <Card key={book.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-t-lg flex items-center justify-center">
                          <Book className="h-16 w-16 text-laha-gold" />
                          {book.is_favorite && (
                            <Bookmark className="absolute top-2 right-2 h-5 w-5 text-laha-gold fill-current" />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
                          <p className="text-sm text-laha-text-secondary mb-3">{book.author}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">{book.subject}</Badge>
                            <Badge variant="outline" className="text-xs">{book.class_level}</Badge>
                          </div>
                          <div className="text-xs text-laha-text-secondary mb-3">
                            {book.pages} pages • {book.file_format.toUpperCase()}
                          </div>
                          {book.progress && book.progress > 0 && (
                            <div className="mb-3">
                              <Progress value={book.progress} className="h-1" />
                              <p className="text-xs text-laha-text-secondary mt-1">{book.progress}%</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-laha-gold hover:bg-laha-gold/90 text-laha-black text-sm">
                              <Eye className="h-3 w-3 mr-1" />
                              Lire
                            </Button>
                            {book.allow_download && (
                              <Button variant="outline" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
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




