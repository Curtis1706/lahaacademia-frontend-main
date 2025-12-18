"use client"

import { useState, useEffect } from "react"
import logger from "@/lib/logger"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  User,
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Eye,
  Calendar,
  Mail,
  Phone,
  Download,
  Image as ImageIcon,
  File,
  FileImage,
  GraduationCap,
  FileSpreadsheet
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

interface Teacher {
  id: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
    created_at: string
  }
  diploma_file?: string
  criminal_record_file?: string
  identity_document_file?: string
  proof_of_address_file?: string
  profile_photo?: string
  cv_file?: string
  bio: string
  subjects: string[]
  experience_years: number
  hourly_rate: number
  is_validated: boolean
  validation_date?: string
}

export default function TeacherValidationPage() {
  const [pendingTeachers, setPendingTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)

  // Fonction pour normaliser les données des enseignants
  const normalizeTeacherData = (teachers: any[]) => {
    return teachers.map(teacher => ({
      ...teacher,
      subjects: Array.isArray(teacher.subjects)
        ? teacher.subjects
        : typeof teacher.subjects === 'string'
          ? (() => {
              try {
                return JSON.parse(teacher.subjects);
              } catch {
                return [teacher.subjects];
              }
            })()
          : [],
    }));
  };

  const logContext = 'admin/teachers/validation'

  // Charger les enseignants en attente
  useEffect(() => {
    loadPendingTeachers()
    
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(() => {
      logger.debug('Rafraîchissement automatique des données', { context: logContext })
      loadPendingTeachers()
    }, 30000) // 30 secondes
    
    return () => clearInterval(interval)
  }, [])

  const loadPendingTeachers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Ajouter un timestamp pour forcer le rafraîchissement et éviter le cache
      const timestamp = Date.now()
      const response = await fetch(`/api/teachers/pending?_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des enseignants')
      }
      
      const data = await response.json()
      const normalizedTeachers = normalizeTeacherData(data.teachers || [])
      setPendingTeachers(normalizedTeachers)
    } catch (err) {
      logger.error('Erreur lors du chargement des enseignants en attente', err as Error, { context: logContext })
      setError('Impossible de charger les enseignants en attente. Réessayez ou vérifiez votre connexion.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateTeacher = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/teachers/${teacherId}/validate`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la validation')
      }
      
      // Recharger la liste
      await loadPendingTeachers()
      
      // Fermer le modal si ouvert
      setSelectedTeacher(null)
      
    } catch (err) {
      logger.error('Erreur lors de la validation', err as Error, { context: logContext, data: { teacherId } })
      setError('Validation impossible. Vérifiez vos droits ou réessayez.')
    }
  }

  const rejectTeacher = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/teachers/${teacherId}/reject`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: rejectReason || 'Non spécifié'
        })
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du rejet')
      }
      
      // Recharger la liste
      await loadPendingTeachers()
      
      // Fermer le modal et réinitialiser
      setSelectedTeacher(null)
      setRejectReason("")
      
    } catch (err) {
      logger.error('Erreur lors du rejet', err as Error, { context: logContext, data: { teacherId } })
      setError('Rejet impossible. Vérifiez vos droits ou réessayez.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileUrl = (filePath: string): string | undefined => {
    if (!filePath) return undefined
    
    // Si c'est déjà une URL complète (commence par http), l'utiliser directement
    if (filePath.startsWith('http')) return filePath
    
    // Construire l'URL complète avec l'URL de base du serveur Django
    const baseApi = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
    
    // Si le chemin commence par /media/, utiliser tel quel
    if (filePath.startsWith('/media/')) {
      return `${baseApi}${filePath}`
    }
    
    // Sinon, ajouter le préfixe /media/
    return `${baseApi}/media/${filePath}`
  }

  const downloadDocument = async (filePath: string, filename: string) => {
    try {
      const url = getFileUrl(filePath)
      if (!url) {
        logger.warn('URL de fichier invalide', { context: logContext, data: { filePath } })
        setError('Document introuvable')
        return
      }

      logger.debug('Téléchargement du document', { context: logContext, data: { url } })
      
      // Créer un lien de téléchargement
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      logger.error('Erreur lors du téléchargement', error as Error, { context: logContext, data: { filePath } })
      setError('Erreur lors du téléchargement du document')
    }
  }

  const viewDocument = (filePath: string) => {
    try {
      const url = getFileUrl(filePath)
      if (!url) {
        logger.warn('URL de fichier invalide', { context: logContext, data: { filePath } })
        setError('Document introuvable')
        return
      }

      logger.debug('Ouverture du document', { context: logContext, data: { url } })
      window.open(url, '_blank')
      
    } catch (error) {
      logger.error('Erreur lors de l\'ouverture du document', error as Error, { context: logContext, data: { filePath } })
      setError('Erreur lors de l\'ouverture du document')
    }
  }

  const getDocumentIcon = (documentType: string) => {
    switch (documentType) {
      case 'profile_photo':
        return <ImageIcon className="h-5 w-5" />
      case 'diploma_file':
        return <GraduationCap className="h-5 w-5" />
      case 'criminal_record_file':
        return <Shield className="h-5 w-5" />
      case 'identity_document_file':
        return <User className="h-5 w-5" />
      case 'proof_of_address_file':
        return <Home className="h-5 w-5" />
      case 'cv_file':
        return <FileSpreadsheet className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getDocumentName = (documentType: string) => {
    switch (documentType) {
      case 'profile_photo':
        return 'Photo de Profil'
      case 'diploma_file':
        return 'Diplôme Certifié'
      case 'criminal_record_file':
        return 'Extrait de Casier Judiciaire'
      case 'identity_document_file':
        return 'Pièce d\'Identité'
      case 'proof_of_address_file':
        return 'Justificatif de Domicile'
      case 'cv_file':
        return 'CV Professionnel'
      default:
        return documentType
    }
  }

  const handleViewDocuments = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setShowDocumentsModal(true)
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto bg-laha-surface">
            <div className="w-full px-6 py-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">
                      Validation des Enseignants
                    </h1>
                    <p className="text-laha-text-secondary">
                      Examinez et validez les demandes d'inscription des enseignants
                    </p>
                  </div>
                  <Button 
                    onClick={loadPendingTeachers}
                    disabled={isLoading}
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                  >
                    {isLoading ? 'Actualisation...' : 'Actualiser'}
                  </Button>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-laha-text-secondary">En attente</p>
                        <p className="text-3xl font-bold text-laha-gold">{pendingTeachers.length}</p>
                      </div>
                      <Clock className="h-8 w-8 text-laha-gold" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-laha-text-secondary">Validés cette semaine</p>
                        <p className="text-3xl font-bold text-green-500">0</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-laha-text-secondary">Rejetés cette semaine</p>
                        <p className="text-3xl font-bold text-red-500">0</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="text-sm font-medium">Erreur :</span>
                    <span className="text-sm">{error}</span>
                    <button 
                      onClick={() => setError(null)}
                      className="ml-auto text-sm underline hover:no-underline"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}

              {/* Liste des enseignants */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold"></div>
                </div>
              ) : pendingTeachers.length === 0 ? (
                <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                  <CardContent className="p-12 text-center">
                    <Shield className="h-16 w-16 text-laha-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-laha-gold mb-2">
                      Aucun enseignant en attente
                    </h3>
                    <p className="text-laha-text-secondary">
                      Tous les enseignants ont été traités ou aucun n'est en attente de validation.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {pendingTeachers.map((teacher, index) => (
                    <motion.div
                      key={teacher.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border hover:border-laha-gold/30 transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-16 w-16 rounded-full bg-laha-gold/20 flex items-center justify-center">
                                {teacher.profile_photo ? (
                                  <img
                                    src={getFileUrl(teacher.profile_photo)}
                                    alt="Photo de profil"
                                    className="h-16 w-16 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="h-8 w-8 text-laha-gold" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-laha-gold">
                                  {teacher.user.first_name} {teacher.user.last_name}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-laha-text-secondary">
                                  <Mail className="h-4 w-4" />
                                  <span>{teacher.user.email}</span>
                                </div>
                                {teacher.user.phone && (
                                  <div className="flex items-center gap-2 text-laha-text-secondary">
                                    <Phone className="h-4 w-4" />
                                    <span>{teacher.user.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 text-laha-text-secondary">
                                  <Calendar className="h-4 w-4" />
                                  <span>Inscrit le {formatDate(teacher.user.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-orange-500 text-orange-500">
                              En attente
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {/* Informations professionnelles */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h4 className="font-semibold text-laha-gold mb-2">Informations Professionnelles</h4>
                              <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Expérience:</span> {teacher.experience_years} ans</p>
                                <p><span className="font-medium">Tarif horaire:</span> {teacher.hourly_rate} FCFA</p>
                                <p><span className="font-medium">Matières:</span> {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : 'Non spécifié'}</p>
                              </div>
                              {teacher.bio && (
                                <div className="mt-3">
                                  <p className="font-medium text-laha-gold">Biographie:</p>
                                  <p className="text-sm text-laha-text-secondary mt-1">{teacher.bio}</p>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-laha-gold mb-2">Documents</h4>
                              <div className="space-y-2">
                                {teacher.diploma_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => teacher.diploma_file && viewDocument(teacher.diploma_file)}
                                      className="text-sm text-blue-500 hover:underline p-0 h-auto"
                                    >
                                      Diplôme
                                    </Button>
                                  </div>
                                )}
                                {teacher.criminal_record_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => teacher.criminal_record_file && viewDocument(teacher.criminal_record_file)}
                                      className="text-sm text-blue-500 hover:underline p-0 h-auto"
                                    >
                                      Casier judiciaire
                                    </Button>
                                  </div>
                                )}
                                {teacher.identity_document_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => teacher.identity_document_file && viewDocument(teacher.identity_document_file)}
                                      className="text-sm text-blue-500 hover:underline p-0 h-auto"
                                    >
                                      Pièce d'identité
                                    </Button>
                                  </div>
                                )}
                                {teacher.proof_of_address_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => teacher.proof_of_address_file && viewDocument(teacher.proof_of_address_file)}
                                      className="text-sm text-blue-500 hover:underline p-0 h-auto"
                                    >
                                      Justificatif de domicile
                                    </Button>
                                  </div>
                                )}
                                {teacher.cv_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => teacher.cv_file && viewDocument(teacher.cv_file)}
                                      className="text-sm text-blue-500 hover:underline p-0 h-auto"
                                    >
                                      CV
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 flex-wrap">
                            <Button 
                              onClick={() => validateTeacher(teacher.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Valider
                            </Button>
                            
                            <Button 
                              onClick={() => handleViewDocuments(teacher)}
                              variant="outline"
                              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Voir Documents
                            </Button>
                            
                            <Button 
                              onClick={() => setSelectedTeacher(teacher)}
                              variant="outline"
                              className="border-laha-gold text-laha-gold hover:bg-laha-gold hover:text-laha-black"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                            
                            <Button 
                              onClick={() => rejectTeacher(teacher.id)}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Modal de rejet */}
              {selectedTeacher && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-2xl mx-4 bg-laha-surface border border-laha-border">
                    <CardHeader>
                      <CardTitle className="text-laha-gold">
                        Rejeter {selectedTeacher.user.first_name} {selectedTeacher.user.last_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-laha-text mb-2">
                            Raison du rejet
                          </label>
                          <Textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Expliquez pourquoi cet enseignant est rejeté..."
                            className="min-h-[100px]"
                          />
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedTeacher(null)
                              setRejectReason("")
                            }}
                          >
                            Annuler
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => rejectTeacher(selectedTeacher.id)}
                          >
                            Confirmer le rejet
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Modal des Documents */}
              {showDocumentsModal && selectedTeacher && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Card className="w-full max-w-4xl mx-4 bg-laha-surface border border-laha-border max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-laha-gold">
                          Documents de {selectedTeacher.user.first_name} {selectedTeacher.user.last_name}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowDocumentsModal(false)
                            setSelectedTeacher(null)
                          }}
                        >
                          Fermer
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Photo de profil */}
                        {selectedTeacher.profile_photo && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('profile_photo')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('profile_photo')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <img 
                                src={getFileUrl(selectedTeacher.profile_photo)} 
                                alt="Photo de profil"
                                className="w-full h-48 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-user.jpg'
                                }}
                              />
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.profile_photo && viewDocument(selectedTeacher.profile_photo)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.profile_photo && downloadDocument(selectedTeacher.profile_photo, `photo_profil_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.jpg`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Diplôme */}
                        {selectedTeacher.diploma_file && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('diploma_file')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('diploma_file')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <div className="flex items-center justify-center h-32 bg-laha-surface/30 rounded-lg">
                                <GraduationCap className="h-12 w-12 text-laha-gold" />
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.diploma_file && viewDocument(selectedTeacher.diploma_file)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.diploma_file && downloadDocument(selectedTeacher.diploma_file, `diplome_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.pdf`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Casier judiciaire */}
                        {selectedTeacher.criminal_record_file && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('criminal_record_file')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('criminal_record_file')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <div className="flex items-center justify-center h-32 bg-laha-surface/30 rounded-lg">
                                <Shield className="h-12 w-12 text-laha-gold" />
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.criminal_record_file && viewDocument(selectedTeacher.criminal_record_file)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.criminal_record_file && downloadDocument(selectedTeacher.criminal_record_file, `casier_judiciaire_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.pdf`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Pièce d'identité */}
                        {selectedTeacher.identity_document_file && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('identity_document_file')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('identity_document_file')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <div className="flex items-center justify-center h-32 bg-laha-surface/30 rounded-lg">
                                <User className="h-12 w-12 text-laha-gold" />
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.identity_document_file && viewDocument(selectedTeacher.identity_document_file)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.identity_document_file && downloadDocument(selectedTeacher.identity_document_file, `piece_identite_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.pdf`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Justificatif de domicile */}
                        {selectedTeacher.proof_of_address_file && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('proof_of_address_file')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('proof_of_address_file')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <div className="flex items-center justify-center h-32 bg-laha-surface/30 rounded-lg">
                                <Home className="h-12 w-12 text-laha-gold" />
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.proof_of_address_file && viewDocument(selectedTeacher.proof_of_address_file)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.proof_of_address_file && downloadDocument(selectedTeacher.proof_of_address_file, `justificatif_domicile_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.pdf`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CV */}
                        {selectedTeacher.cv_file && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              {getDocumentIcon('cv_file')}
                              <h4 className="font-semibold text-laha-gold">
                                {getDocumentName('cv_file')}
                              </h4>
                            </div>
                            <div className="border border-laha-border rounded-lg p-4 bg-laha-surface/50">
                              <div className="flex items-center justify-center h-32 bg-laha-surface/30 rounded-lg">
                                <FileSpreadsheet className="h-12 w-12 text-laha-gold" />
                              </div>
                              <div className="mt-3 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.cv_file && viewDocument(selectedTeacher.cv_file)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => selectedTeacher.cv_file && downloadDocument(selectedTeacher.cv_file, `cv_${selectedTeacher.user.first_name}_${selectedTeacher.user.last_name}.pdf`)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Télécharger
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions globales */}
                      <div className="mt-8 pt-6 border-t border-laha-border flex justify-end gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowDocumentsModal(false)
                            setSelectedTeacher(null)
                          }}
                        >
                          Fermer
                        </Button>
                        <Button 
                          onClick={() => validateTeacher(selectedTeacher.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Valider cet enseignant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}
