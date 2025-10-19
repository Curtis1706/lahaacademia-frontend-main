"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  Sidebar, 
  SidebarBody, 
  SidebarProvider,
  SidebarLink
} from "@/components/ui/sidebar"
import { 
  Home, 
  UsersIcon, 
  Shield, 
  BookOpen, 
  Bell, 
  BarChart3, 
  Settings,
  User
} from "lucide-react"
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Eye,
  Calendar,
  Mail,
  Phone
} from "lucide-react"
import { motion } from "framer-motion"

// Logo component
function Logo({ open }: { open: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-laha-gold">
        <span className="text-laha-black font-bold text-sm">LA</span>
      </div>
      {open && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-white">Lahacademia</span>
          <span className="text-xs text-laha-gold">Admin</span>
        </div>
      )}
    </div>
  )
}

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
  const [open, setOpen] = useState(true)
  const [pendingTeachers, setPendingTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const links = [
    { label: "Aperçu", href: "/dashboard/admin", icon: <Home className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Utilisateurs", href: "/dashboard/admin#users", icon: <UsersIcon className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Validation Enseignants", href: "/dashboard/admin/teachers/validation", icon: <Shield className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Signalements", href: "/dashboard/admin/moderation/reports", icon: <Bell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rôles & Permissions", href: "/dashboard/admin#roles", icon: <Shield className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Cours & Sessions", href: "/dashboard/admin#courses", icon: <BookOpen className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Notifications", href: "/dashboard/admin#notifications", icon: <Bell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rapports & Statistiques", href: "/dashboard/admin#reports", icon: <BarChart3 className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Paramètres", href: "/dashboard/admin#settings", icon: <Settings className="h-5 w-5 shrink-0 text-white" /> },
  ]

  // Charger les professeurs en attente
  useEffect(() => {
    loadPendingTeachers()
  }, [])

  const loadPendingTeachers = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/teachers/pending', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des professeurs')
      }
      
      const data = await response.json()
      setPendingTeachers(data.teachers || [])
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setIsLoading(false)
    }
  }

  const validateTeacher = async (teacherId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/teachers/${teacherId}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
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
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation')
    }
  }

  const rejectTeacher = async (teacherId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/teachers/${teacherId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
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
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur lors du rejet')
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
    return filePath.startsWith('http') ? filePath : `/media/${filePath}`
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
                <Logo open={open} />
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {/* Bouton de thème */}
                <div className="flex justify-center">
                  <AnimatedThemeToggler />
                </div>
                
                {/* Profil administrateur */}
                <SidebarLink
                  link={{
                    label: "Administrateur",
                    href: "#",
                    icon: (
                      <div className="h-8 w-8 rounded-full bg-laha-gold/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-laha-gold" />
                      </div>
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          
          {/* Contenu principal */}
          <main className="flex-1 overflow-auto bg-laha-surface">
            <div className="container mx-auto p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">
                  Validation des Enseignants
                </h1>
                <p className="text-laha-text-secondary">
                  Examinez et validez les demandes d'inscription des professeurs
                </p>
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

              {/* Liste des professeurs */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold"></div>
                </div>
              ) : pendingTeachers.length === 0 ? (
                <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                  <CardContent className="p-12 text-center">
                    <Shield className="h-16 w-16 text-laha-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-laha-gold mb-2">
                      Aucun professeur en attente
                    </h3>
                    <p className="text-laha-text-secondary">
                      Tous les professeurs ont été traités ou aucun n'est en attente de validation.
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
                                <p><span className="font-medium">Matières:</span> {teacher.subjects.join(', ')}</p>
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
                                    <a 
                                      href={getFileUrl(teacher.diploma_file)} 
                                      target="_blank" 
                                      className="text-sm text-blue-500 hover:underline"
                                    >
                                      Diplôme
                                    </a>
                                  </div>
                                )}
                                {teacher.criminal_record_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <a 
                                      href={getFileUrl(teacher.criminal_record_file)} 
                                      target="_blank" 
                                      className="text-sm text-blue-500 hover:underline"
                                    >
                                      Casier judiciaire
                                    </a>
                                  </div>
                                )}
                                {teacher.identity_document_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <a 
                                      href={getFileUrl(teacher.identity_document_file)} 
                                      target="_blank" 
                                      className="text-sm text-blue-500 hover:underline"
                                    >
                                      Pièce d'identité
                                    </a>
                                  </div>
                                )}
                                {teacher.proof_of_address_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <a 
                                      href={getFileUrl(teacher.proof_of_address_file)} 
                                      target="_blank" 
                                      className="text-sm text-blue-500 hover:underline"
                                    >
                                      Justificatif de domicile
                                    </a>
                                  </div>
                                )}
                                {teacher.cv_file && (
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-laha-gold" />
                                    <a 
                                      href={getFileUrl(teacher.cv_file)} 
                                      target="_blank" 
                                      className="text-sm text-blue-500 hover:underline"
                                    >
                                      CV
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button 
                              onClick={() => validateTeacher(teacher.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Valider
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
                            placeholder="Expliquez pourquoi ce professeur est rejeté..."
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
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
