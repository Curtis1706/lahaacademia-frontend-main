"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  BookOpen,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Award,
  BarChart3,
  Activity,
  Users,
  GraduationCap,
  Edit,
  Save,
  X
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

interface StudentProfile {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
    created_at: string
  }
  profile: {
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
  }
}

interface CourseProgress {
  id: string
  title: string
  subject: string
  progress: number
  completed: boolean
  last_accessed: string
  score?: number
}

export default function StudentProfilePage() {
  const [profileData, setProfileData] = useState<StudentProfile | null>(null)
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

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
        setProfileData(data)

        // Charger la progression des cours
        const progressResponse = await fetch('/api/user/course-progress', {
          method: 'GET',
          credentials: 'include',
        })
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          setCourseProgress(progressData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    if (!profileData) return

    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
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

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'mathematics': 'bg-blue-500',
      'physics': 'bg-purple-500',
      'chemistry': 'bg-green-500',
      'biology': 'bg-red-500',
      'french': 'bg-yellow-500',
      'english': 'bg-indigo-500',
    }
    return colors[subject] || 'bg-gray-500'
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

  if (!profileData) {
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
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">
                      {profileData.user.first_name?.[0]}{profileData.user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-heading">
                      {profileData.user.first_name} {profileData.user.last_name}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-blue-500 text-white">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Élève
                      </Badge>
                      {profileData.profile.is_adult && (
                        <Badge className="bg-purple-500 text-white">
                          Adulte
                        </Badge>
                      )}
                    </div>
                    <p className="text-laha-text-secondary mt-1">
                      Membre depuis {formatDate(profileData.user.created_at)}
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
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="progress">Progression</TabsTrigger>
              <TabsTrigger value="achievements">Réalisations</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Onglet Tableau de bord */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Statistiques principales */}
                <Card className="bg-laha-card border-laha-border">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-laha-heading">{profileData.profile.courses_completed || 0}</div>
                    <div className="text-sm text-laha-text-secondary">Cours terminés</div>
                  </CardContent>
                </Card>

                <Card className="bg-laha-card border-laha-border">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-laha-heading">{(profileData.profile.average_score || 0).toFixed(1)}%</div>
                    <div className="text-sm text-laha-text-secondary">Score moyen</div>
                  </CardContent>
                </Card>

                <Card className="bg-laha-card border-laha-border">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-laha-heading">{profileData.profile.study_time_total || 0}h</div>
                    <div className="text-sm text-laha-text-secondary">Temps d'étude</div>
                  </CardContent>
                </Card>

                <Card className="bg-laha-card border-laha-border">
                  <CardContent className="p-6 text-center">
                    <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-laha-heading">{profileData.profile.streak_days || 0}</div>
                    <div className="text-sm text-laha-text-secondary">Jours de série</div>
                  </CardContent>
                </Card>
              </div>

              {/* Progression récente */}
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Progression récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseProgress.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 bg-laha-background rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getSubjectColor(course.subject)} text-white`}>
                            {course.subject}
                          </Badge>
                          <div>
                            <h4 className="font-medium text-laha-text">{course.title}</h4>
                            <p className="text-sm text-laha-text-secondary">
                              Dernière activité: {formatDate(course.last_accessed)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-laha-text">{course.progress}%</div>
                            <Progress value={course.progress} className="w-20 h-2" />
                          </div>
                          {course.completed && (
                            <Badge className="bg-green-500 text-white">
                              <Trophy className="h-3 w-3 mr-1" />
                              Terminé
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Progression */}
            <TabsContent value="progress" className="space-y-6">
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Mes cours en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseProgress.filter(course => !course.completed).map((course) => (
                      <div key={course.id} className="p-4 bg-laha-background rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-laha-text">{course.title}</h4>
                          <Badge className={`${getSubjectColor(course.subject)} text-white`}>
                            {course.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-laha-text">{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Onglet Réalisations */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Statistiques d'examens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-laha-text-secondary">Examens passés</span>
                      <span className="font-medium text-laha-text">{profileData.profile.total_exams_taken || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-laha-text-secondary">Score moyen</span>
                      <span className="font-medium text-laha-text">{(profileData.profile.average_exam_score || 0).toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Préférences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-laha-text-secondary">Matières préférées</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(profileData.profile.preferred_subjects || []).map((subject, index) => (
                          <Badge key={index} variant="outline" className="border-laha-border text-laha-text">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-laha-text-secondary">Style d'apprentissage</span>
                      <div className="text-laha-text">{profileData.profile.learning_style || 'Non défini'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-laha-text-secondary">Prénom</label>
                      <Input
                        value={profileData.user.first_name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          user: { ...profileData.user, first_name: e.target.value }
                        })}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Nom</label>
                      <Input
                        value={profileData.user.last_name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          user: { ...profileData.user, last_name: e.target.value }
                        })}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Email</label>
                      <Input
                        value={profileData.user.email}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          user: { ...profileData.user, email: e.target.value }
                        })}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Téléphone</label>
                      <Input
                        value={profileData.user.phone || ""}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          user: { ...profileData.user, phone: e.target.value }
                        })}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    <div>
                      <label className="text-laha-text-secondary">Niveau scolaire</label>
                      <Select
                        value={profileData.profile.school_level || ""}
                        onValueChange={(value) => setProfileData({
                          ...profileData,
                          profile: { ...profileData.profile, school_level: value }
                        })}
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
                        value={profileData.profile.current_grade || ""}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          profile: { ...profileData.profile, current_grade: e.target.value }
                        })}
                        disabled={!editing}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-laha-text-secondary">Objectifs d'apprentissage</label>
                    <Textarea
                      value={profileData.profile.goals || ""}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        profile: { ...profileData.profile, goals: e.target.value }
                      })}
                      disabled={!editing}
                      className="bg-laha-background border-laha-border text-laha-text"
                      rows={3}
                    />
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

