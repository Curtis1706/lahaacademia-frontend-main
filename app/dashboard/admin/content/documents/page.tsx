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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
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
  const [previewContent, setPreviewContent] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null)

  // Fonction pour supprimer un document
  const handleDeleteDocument = async (documentId: string) => {
    try {
      setDeletingDocumentId(documentId)
      console.log('🗑️ Suppression du document:', documentId)
      
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
      
      // Supprimer le document de la liste locale
      setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== documentId))
      
      console.log('✅ Document supprimé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setDeletingDocumentId(null)
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
        if (selectedType) params.set('type', selectedType)
        if (searchTerm) params.set('search', searchTerm)

        params.set('content_type', 'document')
        const url = `/api/admin/content${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { method: 'GET', credentials: 'include' })
        const data = await res.json()

        const raw: any[] = Array.isArray(data) ? data : (data.results || data.documents || [])
        const normalized: Document[] = raw.map((d: any) => ({
          id: (d.id ?? d.pk ?? '').toString(),
          title: d.title || d.name || 'Sans titre',
          description: d.description || '',
          subject: d.subject || d.category || 'N/A',
          class_level: d.class_level || d.level || 'N/A',
          status: d.status || (d.is_active === false ? 'archived' : 'published'),
          type: d.type || d.file_type || 'file',
          size: Number(d.size_mb ?? d.size ?? 0),
          downloads: Number(d.downloads || 0),
          created_at: d.created_at || d.date_created || '',
          teacher: d.created_by ? { first_name: d.created_by.first_name || '', last_name: d.created_by.last_name || '' } : undefined,
        }))

        setDocuments(normalized)
      } catch (e) {
        console.error('Erreur chargement documents:', e)
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [selectedSubject, selectedClass, selectedStatus, selectedType, searchTerm])

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
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6">
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-laha-border text-laha-text hover:bg-laha-surface"
                            onClick={() => {
                              setPreviewContent({
                                ...document,
                                type: 'document',
                                fileUrl: document.file_url,
                                thumbnailUrl: document.thumbnail_url,
                                fileType: document.file_format,
                                fileSize: document.file_size_mb ? document.file_size_mb * 1024 * 1024 : 0,
                                pageCount: document.page_count,
                                language: document.language,
                                allowDownloads: document.allow_downloads,
                                allowPreview: document.allow_preview
                              })
                              setIsPreviewOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                          <Button asChild variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                            <Link href={`/dashboard/admin/content/documents/edit/${document.id}`}>
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
                                disabled={deletingDocumentId === document.id}
                              >
                            <Trash2 className="h-4 w-4 mr-1" />
                                {deletingDocumentId === document.id ? 'Suppression...' : 'Supprimer'}
                          </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le document "{document.title}" ? 
                                  Cette action est irréversible et supprimera définitivement le document et tous ses fichiers associés.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDocument(document.id)}
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
