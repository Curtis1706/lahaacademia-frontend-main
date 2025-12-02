"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { useParentChildren } from "@/hooks/use-parent-children"
import { 
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  BookOpen,
  Award,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Globe,
  UserPlus,
  Settings,
  Shield,
  AlertCircle,
  CheckCircle,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface CourseEnrollment {
  id: string
  course_title: string
  subject: string
  teacher: string
  start_date: string
  end_date: string
  status: string
  progress: number
  grade: number
}

export default function ParentChildrenPage() {
  const { children, parent, loading, error, refetch } = useParentChildren()
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [courseEnrollments, setCourseEnrollments] = useState<CourseEnrollment[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const router = useRouter()

  // Sélectionner automatiquement le premier enfant quand les données sont chargées
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id)
    }
  }, [children, selectedChild])

  // Données de test pour les cours (en attendant l'API des cours)
  useEffect(() => {
    const mockEnrollments: CourseEnrollment[] = [
      {
        id: "1",
        course_title: "Mathématiques",
        subject: "Mathématiques",
        teacher: "Prof. Ndiaye",
        start_date: "2023-09-15",
        end_date: "2024-06-15",
        status: "active",
        progress: 65,
        grade: 16
      },
      {
        id: "2",
        course_title: "Physique-Chimie",
        subject: "Physique",
        teacher: "Prof. Diouf",
        start_date: "2023-09-15",
        end_date: "2024-06-15",
        status: "active",
        progress: 45,
        grade: 14
      }
    ]
    setCourseEnrollments(mockEnrollments)
  }, [])

  const selectedChildData = children.find(child => child.id === selectedChild)

  if (loading) {
    return (
      <AuthGuard requiredRole="parent">
        <ParentSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold mx-auto mb-4"></div>
                  <p className="text-laha-text">Chargement des données...</p>
                </div>
              </div>
            </div>
          </div>
        </ParentSidebar>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="parent">
        <ParentSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500 mb-4">Erreur lors du chargement des données</p>
                  <p className="text-laha-text/70 mb-6">{error}</p>
                  
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={refetch}
                      className="bg-laha-gold hover:bg-laha-gold-dark text-laha-black"
                    >
                      Réessayer
                    </Button>
                    
                    {error.includes('Session expirée') && (
                      <Button 
                        onClick={() => router.push('/login?message=Session expirée - veuillez vous reconnecter')}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Se reconnecter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ParentSidebar>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="w-full px-6 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-laha-gold mb-2">Mes Enfants</h1>
            <p className="text-laha-text">Gérez les profils et les inscriptions de vos enfants</p>
            {parent && (
              <p className="text-sm text-laha-text/70 mt-2">
                Parent: {parent.name} • {parent.total_children} enfant{parent.total_children > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Bouton d'ajout */}
          <div className="flex justify-end mb-6">
            <Button 
              onClick={() => setShowAddChildModal(true)}
              className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un enfant
            </Button>
            </div>

          {children.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-16 w-16 text-laha-gold/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-laha-text mb-2">Aucun enfant enregistré</h3>
                <p className="text-laha-text/70 mb-6">
                  Vous n'avez pas encore d'enfants liés à votre compte. 
                  Ajoutez un enfant pour commencer à suivre ses progrès.
                </p>
                <Button 
                  onClick={() => setShowAddChildModal(true)}
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier enfant
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Sélection d'enfant */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-laha-text">Sélectionner un enfant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => setSelectedChild(child.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedChild === child.id
                            ? "border-laha-gold bg-laha-gold/10"
                            : "border-laha-border hover:border-laha-gold/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-laha-gold rounded-full flex items-center justify-center text-laha-black font-bold">
                            {child.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-laha-text">{child.name}</h3>
                            <p className="text-sm text-laha-text/70">{child.class_level}</p>
                            {child.age && (
                              <p className="text-xs text-laha-text/50">{child.age} ans</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques de l'enfant sélectionné */}
              {selectedChildData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-laha-gold/20 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text/70">Note moyenne</p>
                          <p className="text-lg font-semibold text-laha-text">{selectedChildData.average_score.toFixed(1)}/20</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-laha-gold/20 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text/70">Assiduité</p>
                          <p className="text-lg font-semibold text-laha-text">
                            {selectedChildData.last_activity ? '92%' : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-laha-gold/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text/70">Cours suivis</p>
                          <p className="text-lg font-semibold text-laha-text">{courseEnrollments.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-laha-gold/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                          <p className="text-sm text-laha-text/70">Cours terminés</p>
                          <p className="text-lg font-semibold text-laha-text">{selectedChildData.courses_completed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    </div>
              )}

              {/* Onglets de navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="courses">Cours</TabsTrigger>
                  <TabsTrigger value="settings">Paramètres</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informations générales */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-laha-text">Informations générales</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedChildData && (
                          <>
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-laha-gold rounded-full flex items-center justify-center text-laha-black font-bold text-lg">
                                {selectedChildData.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="font-semibold text-laha-text">{selectedChildData.name}</h3>
                                <p className="text-sm text-laha-text/70">
                                  {selectedChildData.class_level} • {selectedChildData.age ? `${selectedChildData.age} ans` : 'Âge non spécifié'}
                                </p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <GraduationCap className="h-4 w-4 text-laha-gold" />
                                <span className="text-sm text-laha-text/70">École:</span>
                                <span className="text-sm text-laha-text">{selectedChildData.school_name || 'Non spécifié'}</span>
                  </div>

                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-laha-gold" />
                                <span className="text-sm text-laha-text/70">Localisation:</span>
                                <span className="text-sm text-laha-text">
                                  {selectedChildData.city && selectedChildData.country 
                                    ? `${selectedChildData.city}, ${selectedChildData.country}`
                                    : 'Non spécifié'
                                  }
                      </span>
                    </div>
                              
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-laha-gold" />
                                <span className="text-sm text-laha-text/70">Email:</span>
                                <span className="text-sm text-laha-text">{selectedChildData.email || 'Non spécifié'}</span>
                              </div>
                              
                              {selectedChildData.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-laha-gold" />
                                  <span className="text-sm text-laha-text/70">Téléphone:</span>
                                  <span className="text-sm text-laha-text">{selectedChildData.phone}</span>
                    </div>
                              )}
                    </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Matières suivies */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-laha-text">Matières suivies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {selectedChildData?.subjects && selectedChildData.subjects.length > 0 ? (
                            selectedChildData.subjects.map((subject, index) => (
                              <Badge key={index} className="bg-laha-gold/20 text-laha-gold border-laha-gold/30">
                                {subject}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-laha-text/70">Aucune matière spécifiée</p>
                          )}
                    </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-laha-text">Profil détaillé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedChildData ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-laha-text mb-3">Informations personnelles</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-laha-text/70">Nom complet</Label>
                                  <p className="text-laha-text">{selectedChildData.name}</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Date de naissance</Label>
                                  <p className="text-laha-text">{selectedChildData.birth_date || 'Non spécifié'}</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Niveau scolaire</Label>
                                  <p className="text-laha-text">{selectedChildData.school_level || 'Non spécifié'}</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Classe actuelle</Label>
                                  <p className="text-laha-text">{selectedChildData.class_level}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-laha-text mb-3">Statistiques d'apprentissage</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-laha-text/70">Temps d'étude total</Label>
                                  <p className="text-laha-text">{selectedChildData.study_time_total} heures</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Série de jours</Label>
                                  <p className="text-laha-text">{selectedChildData.streak_days} jours</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Examens passés</Label>
                                  <p className="text-laha-text">{selectedChildData.total_exams_taken}</p>
                                </div>
                                <div>
                                  <Label className="text-laha-text/70">Note moyenne aux examens</Label>
                                  <p className="text-laha-text">{selectedChildData.average_exam_score.toFixed(1)}/20</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {selectedChildData.goals && (
                            <div>
                              <h4 className="font-semibold text-laha-text mb-3">Objectifs d'apprentissage</h4>
                              <p className="text-laha-text">{selectedChildData.goals}</p>
                            </div>
                          )}
                          
                          {selectedChildData.learning_style && (
                            <div>
                              <h4 className="font-semibold text-laha-text mb-3">Style d'apprentissage</h4>
                              <Badge className="bg-laha-gold/20 text-laha-gold border-laha-gold/30">
                                {selectedChildData.learning_style}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-laha-text/70">Sélectionnez un enfant pour voir son profil</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="courses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-laha-text">Cours suivis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courseEnrollments.map((enrollment) => (
                          <div key={enrollment.id} className="p-4 border border-laha-border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-laha-text">{enrollment.course_title}</h4>
                                <p className="text-sm text-laha-text/70">
                                  {enrollment.subject} • {enrollment.teacher}
                                </p>
                              </div>
                              <Badge className={
                                enrollment.status === 'active' 
                                  ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                              }>
                                {enrollment.status === 'active' ? 'Actif' : enrollment.status}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-laha-text/70">Progrès</span>
                                <span className="text-laha-text">{enrollment.progress}%</span>
                              </div>
                              <div className="w-full bg-laha-border rounded-full h-2">
                                <div 
                                  className="bg-laha-gold h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                    </div>
                            
                            <div className="flex justify-between items-center mt-3 text-sm">
                              <span className="text-laha-text/70">
                                {enrollment.start_date} - {enrollment.end_date}
                              </span>
                              {enrollment.grade > 0 && (
                                <span className="text-laha-gold font-semibold">
                                  Note: {enrollment.grade}/20
                                </span>
                              )}
                  </div>
                </div>
              ))}
            </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-laha-text">Paramètres de sécurité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedChildData ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-laha-text">Compte bloqué</Label>
                              <p className="text-sm text-laha-text/70">
                                {selectedChildData.is_blocked ? 'Le compte est actuellement bloqué' : 'Le compte est actif'}
                              </p>
                            </div>
                            <Switch 
                              checked={selectedChildData.is_blocked}
                              disabled
                              className="data-[state=checked]:bg-red-500"
                            />
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h4 className="font-semibold text-laha-text">Actions disponibles</h4>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier le profil
                              </Button>
                              <Button variant="outline" className="flex-1 border-laha-border text-laha-text hover:bg-laha-surface">
                                <Download className="h-4 w-4 mr-2" />
                                Exporter les données
                              </Button>
                              <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-laha-text/70">Sélectionnez un enfant pour gérer ses paramètres</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}