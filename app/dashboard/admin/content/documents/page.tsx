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
  FileText,
  ChevronDown,
  Download,
  File,
  FileImage,
  FileSpreadsheet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Document {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  status: string
  type: string
  size: number
  downloads: number
  created_at: string
  teacher?: {
    first_name: string
    last_name: string
  }
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Données de test
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: "1",
        title: "Exercices de mathématiques - Terminale",
        description: "Série d'exercices corrigés pour la terminale scientifique",
        subject: "Mathématiques",
        class_level: "Terminale",
        status: "published",
        type: "pdf",
        size: 2.5,
        downloads: 850,
        created_at: "2025-08-10",
        teacher: {
          first_name: "Jean",
          last_name: "Dupont"
        }
      },
      {
        id: "2",
        title: "Fiche de révision - Physique",
        description: "Résumé des formules importantes en physique",
        subject: "Physique",
        class_level: "Première",
        status: "published",
        type: "pdf",
        size: 1.2,
        downloads: 1200,
        created_at: "2025-08-12",
        teacher: {
          first_name: "Marie",
          last_name: "Martin"
        }
      },
      {
        id: "3",
        title: "Tableau de conjugaison",
        description: "Tableau récapitulatif des temps de conjugaison",
        subject: "Français",
        class_level: "Quatrième",
        status: "draft",
        type: "image",
        size: 0.8,
        downloads: 0,
        created_at: "2025-08-15",
        teacher: {
          first_name: "Pierre",
          last_name: "Durand"
        }
      },
      {
        id: "4",
        title: "Schéma de la cellule",
        description: "Schéma annoté de la structure cellulaire",
        subject: "SVT",
        class_level: "Seconde",
        status: "published",
        type: "image",
        size: 1.5,
        downloads: 650,
        created_at: "2025-08-18",
        teacher: {
          first_name: "Sophie",
          last_name: "Leroy"
        }
      },
      {
        id: "5",
        title: "Tableau périodique interactif",
        description: "Tableau périodique avec informations détaillées",
        subject: "Chimie",
        class_level: "Seconde",
        status: "published",
        type: "spreadsheet",
        size: 3.2,
        downloads: 950,
        created_at: "2025-08-20",
        teacher: {
          first_name: "Marc",
          last_name: "Bernard"
        }
      }
    ]
    
    setTimeout(() => {
      setDocuments(mockDocuments)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`
    }
    return `${sizeInMB.toFixed(1)} MB`
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || doc.subject === selectedSubject
    const matchesClass = !selectedClass || doc.class_level === selectedClass
    const matchesStatus = !selectedStatus || doc.status === selectedStatus
    const matchesType = !selectedType || doc.type === selectedType

    return matchesSearch && matchesSubject && matchesClass && matchesStatus && matchesType
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
                    Gestion des Documents
                  </h1>
                  <p className="text-laha-text-secondary">
                    Gérez les fiches, exercices et documents pratiques
                  </p>
                </div>
                <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                  <Link href="/dashboard/admin/content/documents/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un document
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
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                      <Input
                        placeholder="Rechercher un document..."
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
                      <option value="Chimie">Chimie</option>
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
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                    >
                      <option value="">Tous les types</option>
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                      <option value="spreadsheet">Tableur</option>
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

            {/* Documents List */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-gold"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-laha-surface/50 border-laha-border hover:bg-laha-surface/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* File Icon */}
                        <div className="w-16 h-16 bg-laha-background rounded-lg flex items-center justify-center border border-laha-border">
                          {getTypeIcon(doc.type)}
                        </div>
                        
                        {/* Document Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{doc.title}</h3>
                            <Badge className={getStatusBadge(doc.status)}>
                              {doc.status === 'published' ? 'Publié' : 
                               doc.status === 'draft' ? 'Brouillon' : 'Archivé'}
                            </Badge>
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {doc.type.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-laha-text-secondary mb-3">{doc.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary mb-3">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {doc.downloads} téléchargements
                            </div>
                            <div className="flex items-center gap-1">
                              <File className="h-4 w-4" />
                              {formatFileSize(doc.size)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {doc.created_at}
                            </div>
                            {doc.teacher && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {doc.teacher.first_name} {doc.teacher.last_name}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {doc.subject}
                            </Badge>
                            <Badge variant="outline" className="border-laha-border text-laha-text">
                              {doc.class_level}
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
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
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
