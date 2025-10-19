"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  BookOpen,
  Clock,
  Users,
  Star,
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
  FileText,
  Book,
  Library
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

interface BookContent {
  id: string
  title: string
  author: string
  description: string
  subject: string
  class_level: string
  pages: number
  year: number
  language: string
  price: number
  rating: number
  downloads: number
  teacher: {
    name: string
    avatar?: string
  }
  cover_image?: string
  file_url?: string
  file_format: string
  file_size: number
  progress?: number
  is_read: boolean
  is_favorite: boolean
  created_at: string
  isbn?: string
  allow_download: boolean
  allow_preview: boolean
}

export default function StudentBooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<BookContent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockBooks: BookContent[] = [
      {
        id: "1",
        title: "Mathématiques Terminale S - Algèbre et Analyse",
        author: "Dr. Aminata Diallo",
        description: "Manuel complet d'algèbre et d'analyse pour la terminale scientifique avec exercices corrigés et méthodes",
        subject: "Mathématiques",
        class_level: "Terminale",
        pages: 350,
        year: 2024,
        language: "français",
        price: 25000,
        rating: 4.8,
        downloads: 1200,
        teacher: {
          name: "Dr. Aminata Diallo",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-book.jpg",
        file_url: "/sample-book.pdf",
        file_format: "PDF",
        file_size: 15.2,
        progress: 65,
        is_read: false,
        is_favorite: true,
        created_at: "2025-01-15",
        isbn: "978-2-123456-78-9",
        allow_download: true,
        allow_preview: true
      },
      {
        id: "2",
        title: "Physique Quantique - Introduction Théorique",
        author: "Prof. Jean-Baptiste",
        description: "Introduction aux concepts fondamentaux de la physique quantique avec applications pratiques",
        subject: "Physique",
        class_level: "Terminale",
        pages: 280,
        year: 2024,
        language: "français",
        price: 30000,
        rating: 4.9,
        downloads: 850,
        teacher: {
          name: "Prof. Jean-Baptiste",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-book.jpg",
        file_url: "/sample-book.epub",
        file_format: "EPUB",
        file_size: 8.7,
        progress: 100,
        is_read: true,
        is_favorite: false,
        created_at: "2025-01-20",
        isbn: "978-2-123456-79-6",
        allow_download: true,
        allow_preview: true
      },
      {
        id: "3",
        title: "Français - Techniques de Dissertation",
        author: "Dr. Fatou Ndiaye",
        description: "Guide méthodologique pour réussir la dissertation en français avec exemples et corrigés",
        subject: "Français",
        class_level: "Première",
        pages: 200,
        year: 2024,
        language: "français",
        price: 18000,
        rating: 4.6,
        downloads: 1500,
        teacher: {
          name: "Dr. Fatou Ndiaye",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-book.jpg",
        file_url: "/sample-book.pdf",
        file_format: "PDF",
        file_size: 12.1,
        progress: 0,
        is_read: false,
        is_favorite: true,
        created_at: "2025-01-18",
        isbn: "978-2-123456-80-2",
        allow_download: true,
        allow_preview: false
      },
      {
        id: "4",
        title: "SVT - Biologie Cellulaire Avancée",
        author: "Dr. Sophie Leroy",
        description: "Étude approfondie de la structure et du fonctionnement des cellules avec illustrations détaillées",
        subject: "SVT",
        class_level: "Seconde",
        pages: 320,
        year: 2024,
        language: "français",
        price: 22000,
        rating: 4.7,
        downloads: 980,
        teacher: {
          name: "Dr. Sophie Leroy",
          avatar: "/placeholder-teacher.jpg"
        },
        cover_image: "/placeholder-book.jpg",
        file_url: "/sample-book.mobi",
        file_format: "MOBI",
        file_size: 18.5,
        progress: 30,
        is_read: false,
        is_favorite: false,
        created_at: "2025-01-22",
        isbn: "978-2-123456-81-9",
        allow_download: true,
        allow_preview: true
      }
    ]
    
    setTimeout(() => {
      setBooks(mockBooks)
      setLoading(false)
    }, 1000)
  }, [])

  const readBooks = books.filter(book => book.is_read)
  const favoriteBooks = books.filter(book => book.is_favorite)
  const unreadBooks = books.filter(book => !book.is_read)

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || book.subject === selectedSubject
    const matchesClass = !selectedClass || book.class_level === selectedClass
    const matchesFormat = !selectedFormat || book.file_format === selectedFormat

    return matchesSearch && matchesSubject && matchesClass && matchesFormat
  })

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB} MB`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const handleToggleFavorite = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, is_favorite: !book.is_favorite }
        : book
    ))
  }

  const handleRead = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, is_read: true, progress: 100 }
        : book
    ))
  }

  const links = [
    {
      label: "Tableau de bord",
      href: "/dashboard/student",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Cours",
      href: "/dashboard/student/mes-cours",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Vidéos",
      href: "/dashboard/student/mes-videos",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Ouvrages",
      href: "/dashboard/student/mes-ouvrages",
      icon: <BookOpen className="h-5 w-5 shrink-0 text-white" />,
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
                  Mes Ouvrages
                </h1>
                <p className="text-laha-text-secondary">
                  Explorez votre bibliothèque numérique personnelle
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Ouvrages disponibles</p>
                        <p className="text-laha-text text-xl font-bold">{books.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 via-laha-surface/20 to-laha-gold/15 backdrop-blur-md border-laha-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-laha-gold-warm/20 rounded-lg">
                        <FileText className="h-5 w-5 text-laha-gold-warm" />
                      </div>
                      <div>
                        <p className="text-laha-text-secondary text-sm">Pages totales</p>
                        <p className="text-laha-text text-xl font-bold">
                          {books.reduce((total, book) => total + book.pages, 0)}
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
                        <p className="text-laha-text text-xl font-bold">{favoriteBooks.length}</p>
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
                        <p className="text-laha-text-secondary text-sm">Lus</p>
                        <p className="text-laha-text text-xl font-bold">{readBooks.length}</p>
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
                          placeholder="Rechercher un ouvrage..."
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
                        <option value="Seconde">Seconde</option>
                        <option value="Première">Première</option>
                        <option value="Terminale">Terminale</option>
                      </select>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                      >
                        <option value="">Tous les formats</option>
                        <option value="PDF">PDF</option>
                        <option value="EPUB">EPUB</option>
                        <option value="MOBI">MOBI</option>
                      </select>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                  <TabsTrigger value="all" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Tous ({books.length})
                  </TabsTrigger>
                  <TabsTrigger value="read" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Lus ({readBooks.length})
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    Favoris ({favoriteBooks.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                    À lire ({unreadBooks.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  <BookGrid books={filteredBooks} onRead={handleRead} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="read" className="space-y-4">
                  <BookGrid books={readBooks.filter(book => 
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || book.subject === selectedSubject) &&
                    (!selectedClass || book.class_level === selectedClass) &&
                    (!selectedFormat || book.file_format === selectedFormat)
                  )} onRead={handleRead} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  <BookGrid books={favoriteBooks.filter(book => 
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || book.subject === selectedSubject) &&
                    (!selectedClass || book.class_level === selectedClass) &&
                    (!selectedFormat || book.file_format === selectedFormat)
                  )} onRead={handleRead} onToggleFavorite={handleToggleFavorite} />
                </TabsContent>

                <TabsContent value="unread" className="space-y-4">
                  <BookGrid books={unreadBooks.filter(book => 
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (!selectedSubject || book.subject === selectedSubject) &&
                    (!selectedClass || book.class_level === selectedClass) &&
                    (!selectedFormat || book.file_format === selectedFormat)
                  )} onRead={handleRead} onToggleFavorite={handleToggleFavorite} />
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

const BookGrid = ({ books, onRead, onToggleFavorite }: { 
  books: BookContent[], 
  onRead: (bookId: string) => void,
  onToggleFavorite: (bookId: string) => void 
}) => {
  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB} MB`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-laha-text-secondary opacity-50" />
        <h3 className="text-lg font-semibold text-laha-text mb-2">Aucun ouvrage trouvé</h3>
        <p className="text-laha-text-secondary">Essayez de modifier vos filtres de recherche</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-all duration-200 hover:scale-105">
          <CardHeader className="pb-3">
            <div className="relative">
              <div className="w-full h-40 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border mb-3">
                <BookOpen className="h-8 w-8 text-laha-text-secondary" />
              </div>
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(book.id)}
                  className={`h-8 w-8 p-0 ${book.is_favorite ? 'text-laha-gold' : 'text-laha-text-secondary hover:text-laha-gold'}`}
                >
                  <Bookmark className={`h-4 w-4 ${book.is_favorite ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-laha-text-secondary hover:text-laha-gold"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                  {book.file_format}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-laha-border text-laha-text">
                  {book.subject}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-laha-text-secondary">
                  <Star className="h-3 w-3 text-laha-gold fill-current" />
                  {book.rating}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-laha-text line-clamp-2">{book.title}</h3>
              <p className="text-sm text-laha-text-secondary">Par {book.author}</p>
              <p className="text-sm text-laha-text-secondary line-clamp-2">{book.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-laha-text-secondary">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {book.pages} pages
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {book.downloads}
              </div>
            </div>

            {book.progress !== undefined && book.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-laha-text-secondary">Progression</span>
                  <span className="text-laha-gold font-medium">{book.progress}%</span>
                </div>
                <Progress value={book.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="text-laha-text-secondary">{book.year} • {formatFileSize(book.file_size)}</p>
                <p className="text-laha-gold font-semibold">{formatPrice(book.price)}</p>
              </div>
              <div className="flex gap-2">
                {book.allow_preview && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-laha-border text-laha-text hover:bg-laha-surface"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Aperçu
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => onRead(book.id)}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  {book.is_read ? 'Relire' : 'Lire'}
                </Button>
              </div>
            </div>

            {book.allow_download && (
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
