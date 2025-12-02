"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  BookOpen,
  Trophy,
  Clock,
  Target,
  Star,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  BarChart3,
  Users,
  Award,
  TrendingUp,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface UserData {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_verified: boolean
  created_at: string
  phone?: string
}

interface ProfileData {
  // Student fields
  date_of_birth?: string
  country?: string
  city?: string
  school_level?: string
  current_grade?: string
  school_name?: string
  study_time_total?: number
  courses_completed?: number
  average_score?: number
  last_activity?: string
  preferred_subjects?: string[]
  learning_style?: string
  goals?: string
  total_exams_taken?: number
  average_exam_score?: number
  streak_days?: number
  is_adult?: boolean
  occupation?: string
  education_level?: string
  professional_experience?: string
  learning_objectives?: string
  budget_range?: string
  certification_needed?: boolean

  // Teacher fields
  is_validated?: boolean
  validation_date?: string
  subjects?: string[]
  experience_years?: number
  hourly_rate?: number
  bio?: string
  availability_schedule?: any
  max_students_per_session?: number
  total_sessions?: number
  total_students?: number
  average_rating?: number
  total_earnings?: number
  total_hours_taught?: number
  specializations?: string[]
  certifications?: string[]
  location?: string
  languages_spoken?: string[]
  teaching_style?: string
  availability_for_adults?: boolean
  total_cancellations?: number
  cancellation_rate?: number
  reliability_score?: number
  is_payment_verified?: boolean

  // Parent fields
  notification_preferences?: any
  occupation?: string
  education_level?: string
  preferred_contact_method?: string
  monitoring_enabled?: boolean
  weekly_reports?: boolean
  exam_notifications?: boolean
  total_children?: number
  total_payments?: number
  last_login?: string
  alert_preferences?: any
  communication_history?: any[]
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Charger les données du profil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du profil')
        }
        
        const data = await response.json()
        setUserData(data.user)
        setProfileData(data.profile)
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!userData || !profileData) return

    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user: userData,
          profile: profileData
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      setEditing(false)
      alert('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde du profil')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'student': 'Élève',
      'teacher': 'Enseignant',
      'parent': 'Parent',
      'admin': 'Administrateur',
      'author': 'Auteur'
    }
    return roleMap[role] || role
  }

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      'student': 'bg-blue-500',
      'teacher': 'bg-green-500',
      'parent': 'bg-purple-500',
      'admin': 'bg-red-500',
      'author': 'bg-orange-500'
    }
    return colorMap[role] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-primary mx-auto"></div>
          <p className="text-laha-text-secondary mt-2">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-laha-heading mb-4">Profil non trouvé</h1>
          <p className="text-laha-text-secondary">Impossible de charger votre profil</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-laha-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* En-tête du profil */}
          <Card className="bg-laha-card border-laha-border mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData?.profile_photo || ""} />
                    <AvatarFallback className="text-2xl">
                      {userData.first_name?.[0]}{userData.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-heading">
                      {userData.first_name} {userData.last_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={`${getRoleColor(userData.role)} text-white`}>
                        {getRoleDisplay(userData.role)}
                      </Badge>
                      {userData.is_verified && (
                        <Badge className="bg-green-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                    <p className="text-laha-text-secondary mt-1">
                      Membre depuis {formatDate(userData.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenu du profil */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="personal">Personnel</TabsTrigger>
              <TabsTrigger value="academic">Académique</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Onglet Aperçu */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Informations de base */}
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informations de base
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-laha-text-secondary" />
                      <span className="text-laha-text">{userData.email}</span>
                    </div>
                    {userData.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-laha-text-secondary" />
                        <span className="text-laha-text">{userData.phone}</span>
                      </div>
                    )}
                    {profileData?.country && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-laha-text-secondary" />
                        <span className="text-laha-text">{profileData.country}</span>
                      </div>
                    )}
                    {profileData?.date_of_birth && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-laha-text-secondary" />
                        <span className="text-laha-text">{formatDate(profileData.date_of_birth)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistiques spécifiques au rôle */}
                {userData.role === 'student' && (
                  <>
                    <Card className="bg-laha-card border-laha-border">
                      <CardHeader>
                        <CardTitle className="text-laha-heading flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Progression
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Cours terminés</span>
                          <span className="font-medium text-laha-text">{profileData?.courses_completed || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Score moyen</span>
                          <span className="font-medium text-laha-text">{(profileData?.average_score || 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Temps d'étude</span>
                          <span className="font-medium text-laha-text">{profileData?.study_time_total || 0}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Série actuelle</span>
                          <span className="font-medium text-laha-text">{profileData?.streak_days || 0} jours</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-laha-card border-laha-border">
                      <CardHeader>
                        <CardTitle className="text-laha-heading flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Examens
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Examens passés</span>
                          <span className="font-medium text-laha-text">{profileData?.total_exams_taken || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Score moyen</span>
                          <span className="font-medium text-laha-text">{(profileData?.average_exam_score || 0).toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {userData.role === 'teacher' && (
                  <>
                    <Card className="bg-laha-card border-laha-border">
                      <CardHeader>
                        <CardTitle className="text-laha-heading flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Enseignement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Sessions totales</span>
                          <span className="font-medium text-laha-text">{profileData?.total_sessions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Élèves formés</span>
                          <span className="font-medium text-laha-text">{profileData?.total_students || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Heures enseignées</span>
                          <span className="font-medium text-laha-text">{profileData?.total_hours_taught || 0}h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Note moyenne</span>
                          <span className="font-medium text-laha-text">{(profileData?.average_rating || 0).toFixed(1)}/5</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-laha-card border-laha-border">
                      <CardHeader>
                        <CardTitle className="text-laha-heading flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Revenus
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Total gagné</span>
                          <span className="font-medium text-laha-text">{(profileData?.total_earnings || 0).toLocaleString()} XOF</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Taux horaire</span>
                          <span className="font-medium text-laha-text">{(profileData?.hourly_rate || 0).toLocaleString()} XOF/h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Années d'expérience</span>
                          <span className="font-medium text-laha-text">{profileData?.experience_years || 0}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {userData.role === 'parent' && (
                  <>
                    <Card className="bg-laha-card border-laha-border">
                      <CardHeader>
                        <CardTitle className="text-laha-heading flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Enfants
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Nombre d'enfants</span>
                          <span className="font-medium text-laha-text">{profileData?.total_children || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Total payé</span>
                          <span className="font-medium text-laha-text">{(profileData?.total_payments || 0).toLocaleString()} XOF</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-laha-text-secondary">Surveillance</span>
                          <Badge className={profileData?.monitoring_enabled ? "bg-green-500" : "bg-red-500"}>
                            {profileData?.monitoring_enabled ? "Activée" : "Désactivée"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Onglet Personnel */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-laha-text-secondary">Prénom</label>
                      <Input
                        value={userData.first_name}
                        onChange={(e) => setUserData({...userData, first_name: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Nom</label>
                      <Input
                        value={userData.last_name}
                        onChange={(e) => setUserData({...userData, last_name: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Email</label>
                      <Input
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Téléphone</label>
                      <Input
                        value={userData.phone || ""}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Académique */}
            <TabsContent value="academic" className="space-y-6">
              {userData.role === 'student' && (
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading">Informations académiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-laha-text-secondary">Niveau scolaire</label>
                        <Select
                          value={profileData?.school_level || ""}
                          onValueChange={(value) => setProfileData({...profileData, school_level: value})}
                          disabled={!editing}
                        >
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionnez un niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primary">Primaire</SelectItem>
                            <SelectItem value="secondary">Secondaire</SelectItem>
                            <SelectItem value="adult">Adulte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-laha-text-secondary">Classe actuelle</label>
                        <Input
                          value={profileData?.current_grade || ""}
                          onChange={(e) => setProfileData({...profileData, current_grade: e.target.value})}
                          disabled={!editing}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                      <div>
                        <label className="text-laha-text-secondary">École</label>
                        <Input
                          value={profileData?.school_name || ""}
                          onChange={(e) => setProfileData({...profileData, school_name: e.target.value})}
                          disabled={!editing}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                      <div>
                        <label className="text-laha-text-secondary">Style d'apprentissage</label>
                        <Input
                          value={profileData?.learning_style || ""}
                          onChange={(e) => setProfileData({...profileData, learning_style: e.target.value})}
                          disabled={!editing}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Objectifs d'apprentissage</label>
                      <Textarea
                        value={profileData?.goals || ""}
                        onChange={(e) => setProfileData({...profileData, goals: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {userData.role === 'teacher' && (
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading">Informations professionnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-laha-text-secondary">Biographie</label>
                      <Textarea
                        value={profileData?.bio || ""}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-laha-text-secondary">Années d'expérience</label>
                        <Input
                          type="number"
                          value={profileData?.experience_years || 0}
                          onChange={(e) => setProfileData({...profileData, experience_years: parseInt(e.target.value)})}
                          disabled={!editing}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                      <div>
                        <label className="text-laha-text-secondary">Taux horaire (XOF)</label>
                        <Input
                          type="number"
                          value={profileData?.hourly_rate || 0}
                          onChange={(e) => setProfileData({...profileData, hourly_rate: parseFloat(e.target.value)})}
                          disabled={!editing}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Paramètres du compte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-laha-text">Notifications par email</h4>
                      <p className="text-sm text-laha-text-secondary">Recevoir des notifications importantes</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-laha-text">Changer le mot de passe</h4>
                      <p className="text-sm text-laha-text-secondary">Mettre à jour votre mot de passe</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}