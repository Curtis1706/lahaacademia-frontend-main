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
  BookOpen,
  ChevronDown,
  Clock,
  Target,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link"

interface QCM {
  id: string
  title: string
  description: string
  content_title: string
  time_limit_minutes?: number
  max_attempts: number
  passing_score: number
  total_attempts: number
  average_score: number
  completion_rate: number
  is_active: boolean
  created_at: string
  questions_count: number
}

export default function QCMPage() {
  const [qcms, setQcms] = useState<QCM[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [deletingQCMId, setDeletingQCMId] = useState<string | null>(null)

  // Fonction pour supprimer un QCM
  const handleDeleteQCM = async (qcmId: string) => {
    try {
      setDeletingQCMId(qcmId)
      console.log('🗑️ Suppression du QCM:', qcmId)
      
      const response = await fetch(`/api/admin/qcm/${qcmId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Erreur lors de la suppression')
      }
      
      // Supprimer le QCM de la liste locale
      setQcms(prevQcms => prevQcms.filter(qcm => qcm.id !== qcmId))
      
      console.log('✅ QCM supprimé avec succès')
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      alert(`Erreur lors de la suppression: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setDeletingQCMId(null)
    }
  }

  // Charger les QCM depuis l'API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedStatus) params.set('is_active', selectedStatus)
        if (searchTerm) params.set('search', searchTerm)

        const url = `/api/admin/qcm${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url, { method: 'GET', credentials: 'include' })
        const data = await res.json()

        const raw: any[] = Array.isArray(data) ? data : (data.results || [])
        const normalized: QCM[] = raw.map((q: any) => ({
          id: (q.id ?? q.pk ?? '').toString(),
          title: q.title || 'Sans titre',
          description: q.description || '',
          content_title: q.content?.title || 'Contenu supprimé',
          time_limit_minutes: q.time_limit_minutes,
          max_attempts: q.max_attempts || 3,
          passing_score: q.passing_score || 70,
          total_attempts: q.total_attempts || 0,
          average_score: q.average_score || 0,
          completion_rate: q.completion_rate || 0,
          is_active: q.is_active !== false,
          created_at: q.created_at || '',
          questions_count: q.questions?.length || 0,
        }))
        setQcms(normalized)
      } catch (e) {
        console.error('Erreur chargement QCM:', e)
        setQcms([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedStatus, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <AuthGuard>
      <AdminSidebar>
        <main className="flex-1 p-6 bg-laha-background">
          <div className="max-w-7xl mx-auto">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-laha-heading">Gestion des QCM</h1>
                <p className="text-laha-text-secondary mt-2">Créez et gérez vos questionnaires à choix multiples</p>
              </div>
              <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                <Link href="/dashboard/admin/content/qcm/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un QCM
                </Link>
              </Button>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-laha-card p-4 rounded-lg border border-laha-border mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-laha-text-secondary h-4 w-4" />
                    <Input
                      placeholder="Rechercher un QCM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-laha-background border-laha-border text-laha-text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 bg-laha-background border border-laha-border rounded-md text-laha-text"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="true">Actifs</option>
                    <option value="false">Inactifs</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-laha-border text-laha-text hover:bg-laha-surface"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Liste des QCM */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-primary mx-auto"></div>
                  <p className="text-laha-text-secondary mt-2">Chargement des QCM...</p>
                </div>
              ) : qcms.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-laha-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-laha-text mb-2">Aucun QCM trouvé</h3>
                  <p className="text-laha-text-secondary mb-4">Commencez par créer votre premier questionnaire</p>
                  <Button asChild className="bg-laha-primary hover:bg-laha-primary/90 text-laha-primary-foreground">
                    <Link href="/dashboard/admin/content/qcm/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un QCM
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {qcms.map((qcm) => (
                    <Card key={qcm.id} className="bg-laha-card border-laha-border hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-laha-heading">{qcm.title}</h3>
                              <Badge variant={qcm.is_active ? "default" : "secondary"} className={qcm.is_active ? "bg-green-500" : ""}>
                                {qcm.is_active ? "Actif" : "Inactif"}
                              </Badge>
                            </div>
                            <p className="text-laha-text-secondary mb-3">{qcm.description}</p>
                            <p className="text-sm text-laha-text-secondary mb-4">
                              Contenu associé: <span className="font-medium text-laha-text">{qcm.content_title}</span>
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-laha-text-secondary mb-4">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {qcm.questions_count} questions
                              </div>
                              {qcm.time_limit_minutes && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {qcm.time_limit_minutes} min
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {qcm.passing_score}% pour réussir
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {qcm.total_attempts} tentatives
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-laha-text-secondary" />
                                <span className="text-laha-text-secondary">Score moyen:</span>
                                <span className={`px-2 py-1 rounded text-white text-xs font-medium ${getDifficultyColor(qcm.average_score)}`}>
                                  {qcm.average_score.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-laha-text-secondary" />
                                <span className="text-laha-text-secondary">Réussite:</span>
                                <span className="font-medium text-laha-text">{qcm.completion_rate.toFixed(1)}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-laha-text-secondary" />
                                <span className="text-laha-text-secondary">Créé le:</span>
                                <span className="font-medium text-laha-text">{formatDate(qcm.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                  disabled={deletingQCMId === qcm.id}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  {deletingQCMId === qcm.id ? 'Suppression...' : 'Supprimer'}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le QCM "{qcm.title}" ? 
                                    Cette action est irréversible et supprimera définitivement le QCM et toutes ses questions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteQCM(qcm.id)}
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
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}