"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import {
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  FileText,
  Video as VideoIcon,
  BookOpen,
  Library,
  HelpCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import logger from "@/lib/logger"

interface EducationalContent {
  id: number
  title: string
  description: string
  content_type: "course" | "video" | "document" | "book" | "qcm"
  subject: string
  class_level: string
  status: "review" | "published" | "draft"
  teacher: {
    id: number
    first_name: string
    last_name: string
  }
  created_at: string
  updated_at: string
}

const contentTypeIcons = {
  course: BookOpen,
  video: VideoIcon,
  document: FileText,
  book: Library,
  qcm: HelpCircle,
}

const contentTypeLabels = {
  course: "Cours",
  video: "Vidéo",
  document: "Document",
  book: "Livre",
  qcm: "QCM",
}

const statusLabels = {
  review: "En attente",
  published: "Approuvé",
  draft: "Rejeté",
}

const statusColors = {
  review: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  published: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  draft: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
}

export default function ModerationPage() {
  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <AdminSidebar>
        <ModerationContent />
      </AdminSidebar>
    </AuthGuard>
  )
}

function ModerationContent() {
  const [contents, setContents] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("review")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchContents = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filterType !== "all") params.append("content_type", filterType)
      if (filterStatus !== "all") params.append("status", filterStatus)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/educational-content?${params.toString()}`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des contenus")
      }

      const data = await response.json()
      setContents(data.results || data || [])
    } catch (err) {
      logger.error("Failed to fetch educational contents", err as Error, { context: "ModerationPage" })
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
  }, [filterType, filterStatus])

  const handleSearch = () => {
    fetchContents()
  }

  const handleAction = async (content: EducationalContent, type: "approve" | "reject") => {
    setSelectedContent(content)
    setActionType(type)
    if (type === "approve") {
      await executeAction(content.id, "approve")
    }
  }

  const executeAction = async (contentId: number, action: "approve" | "reject", reason?: string) => {
    try {
      setActionLoading(true)
      const endpoint = `/api/admin/educational-content/${contentId}/${action}`
      
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: action === "reject" && reason ? JSON.stringify({ reason }) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Erreur lors de l'${action === "approve" ? "approbation" : "rejet"}`)
      }

      logger.info(`Content ${action}ed successfully`, { contentId }, { context: "ModerationPage" })
      
      // Recharger la liste
      await fetchContents()
      
      // Fermer le dialog
      setSelectedContent(null)
      setActionType(null)
      setRejectReason("")
    } catch (err) {
      logger.error(`Failed to ${action} content`, err as Error, { context: "ModerationPage" })
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setActionLoading(false)
    }
  }

  const pendingCount = contents.filter((c) => c.status === "pending").length

  return (
    <main className="flex-1 w-full overflow-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-laha-gold mb-2">Modération de Contenu</h1>
              <p className="text-laha-text-secondary">
                Validez ou rejetez les contenus soumis par les enseignants
              </p>
            </div>
            <Button onClick={fetchContents} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approuvés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {contents.filter((c) => c.status === "approved").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejetés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {contents.filter((c) => c.status === "rejected").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{contents.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de contenu</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="course">Cours</SelectItem>
                    <SelectItem value="video">Vidéos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="book">Livres</SelectItem>
                    <SelectItem value="qcm">QCM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Recherche</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher par titre, matière..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-laha-gold" />
          </div>
        ) : contents.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-laha-text-secondary">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun contenu trouvé avec ces critères</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contents.map((content) => {
              const Icon = contentTypeIcons[content.content_type]
              return (
                <Card key={content.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-laha-gold/10 rounded-lg">
                          <Icon className="h-6 w-6 text-laha-gold" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-laha-text">{content.title}</h3>
                            <Badge variant="outline" className={statusColors[content.status]}>
                              {statusLabels[content.status]}
                            </Badge>
                            <Badge variant="outline">
                              {contentTypeLabels[content.content_type]}
                            </Badge>
                          </div>
                          <p className="text-sm text-laha-text-secondary mb-3 line-clamp-2">
                            {content.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {content.teacher.first_name} {content.teacher.last_name}
                            </div>
                            <div>Matière: {content.subject}</div>
                            <div>Niveau: {content.class_level}</div>
                            <div>
                              Créé le: {new Date(content.created_at).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {content.status === "pending" && (
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50 border-green-300"
                            onClick={() => handleAction(content, "approve")}
                            disabled={actionLoading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50 border-red-300"
                            onClick={() => handleAction(content, "reject")}
                            disabled={actionLoading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog
        open={actionType === "reject" && selectedContent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedContent(null)
            setActionType(null)
            setRejectReason("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le contenu</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de rejeter "{selectedContent?.title}". Veuillez indiquer la
              raison du rejet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Raison du rejet (optionnel)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedContent(null)
                setActionType(null)
                setRejectReason("")
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedContent && executeAction(selectedContent.id, "reject", rejectReason)
              }
              disabled={actionLoading}
            >
              {actionLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}




