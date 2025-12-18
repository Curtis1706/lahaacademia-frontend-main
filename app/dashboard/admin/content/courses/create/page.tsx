"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  BookOpen,
  Clock,
  Target,
  Users,
  Calendar,
  FileText,
  Upload,
  Image,
  Video,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  content: string
  duration: number
  type: 'video' | 'text' | 'quiz' | 'exercise'
  resources: string[]
}

interface CourseData {
  title: string
  subject: string
  class_level: string
  description: string
  duration: number
  maxStudents: number
  price: number
  difficulty: string
  objectives: string[]
  prerequisites: string[]
  lessons: Lesson[]
  coverImage?: string
  isPublished: boolean
  allowComments: boolean
  enableDownloads: boolean
}

export default function CreateCoursePage() {
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    subject: "",
    class_level: "",
    description: "",
    duration: 60,
    maxStudents: 30,
    price: 0,
    difficulty: "intermediate",
    objectives: [],
    prerequisites: [],
    lessons: [],
    isPublished: false,
    allowComments: true,
    enableDownloads: false
  })

  const [currentObjective, setCurrentObjective] = useState("")
  const [currentPrerequisite, setCurrentPrerequisite] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const addObjective = () => {
    if (currentObjective.trim()) {
      setCourseData({
        ...courseData,
        objectives: [...courseData.objectives, currentObjective.trim()]
      })
      setCurrentObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setCourseData({
      ...courseData,
      objectives: courseData.objectives.filter((_, i) => i !== index)
    })
  }

  const addPrerequisite = () => {
    if (currentPrerequisite.trim()) {
      setCourseData({
        ...courseData,
        prerequisites: [...courseData.prerequisites, currentPrerequisite.trim()]
      })
      setCurrentPrerequisite("")
    }
  }

  const removePrerequisite = (index: number) => {
    setCourseData({
      ...courseData,
      prerequisites: courseData.prerequisites.filter((_, i) => i !== index)
    })
  }

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      content: "",
      duration: 15,
      type: 'text',
      resources: []
    }
    setCourseData({
      ...courseData,
      lessons: [...courseData.lessons, newLesson]
    })
  }

  const removeLesson = (lessonId: string) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.filter(lesson => lesson.id !== lessonId)
    })
  }

  const updateLesson = (lessonId: string, field: keyof Lesson, value: any) => {
    setCourseData({
      ...courseData,
      lessons: courseData.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      )
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validation
      if (!courseData.title || !courseData.subject || !courseData.class_level) {
        alert("Veuillez remplir tous les champs obligatoires")
        return
      }

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...courseData,
          status: 'draft' // Sauvegarder en brouillon
        })
      })

      if (response.ok) {
        alert("Cours sauvegardé avec succès !")
        // Optionnel : Rediriger vers la liste des cours
        // router.push('/dashboard/admin/content/courses')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de la sauvegarde")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // NOTE: La prévisualisation peut être implémentée via un modal ou une page dédiée
    // Pour l'instant, afficher les données dans la console
    alert('Prévisualisation : ' + courseData.title + '\n' + 
          'Matière: ' + courseData.subject + '\n' + 
          'Niveau: ' + courseData.class_level + '\n' + 
          'Leçons: ' + courseData.lessons.length)
  }

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      // Validation complète
      if (!courseData.title || !courseData.subject || !courseData.class_level || courseData.lessons.length === 0) {
        alert("Veuillez remplir tous les champs obligatoires et ajouter au moins une leçon")
        return
      }

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...courseData,
          status: 'published' // Publier directement
        })
      })

      if (response.ok) {
        alert("Cours publié avec succès !")
        // Optionnel : Rediriger vers la liste des cours
        // router.push('/dashboard/admin/content/courses')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la publication')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de la publication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6 max-w-4xl">
              {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                    <Link href="/dashboard/admin/content/courses">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Créer un cours
                    </h1>
                    <p className="text-laha-text-secondary">
                      Créez un cours structuré avec éditeur riche
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    className="border-laha-border text-laha-text hover:bg-laha-surface"
                    onClick={handlePreview}
                    disabled={isLoading}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button 
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    onClick={handlePublish}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <BookOpen className="h-4 w-4 mr-2" />
                    )}
                    Publier le cours
                  </Button>
                </div>
                </div>
              </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Informations générales */}
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-text">Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div>
                    <Label htmlFor="title" className="text-laha-text">
                          Titre du cours *
                        </Label>
                        <Input
                          id="title"
                      placeholder="Ex: Introduction à la physique quantique"
                      value={courseData.title}
                      onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                      className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                      
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                      <Label htmlFor="subject" className="text-laha-text">
                          Matière *
                        </Label>
                      <Select value={courseData.subject} onValueChange={(value) => setCourseData({ ...courseData, subject: value })}>
                        <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une matière" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="mathematiques">Mathématiques</SelectItem>
                          <SelectItem value="physique">Physique</SelectItem>
                          <SelectItem value="francais">Français</SelectItem>
                          <SelectItem value="svt">SVT</SelectItem>
                          <SelectItem value="histoire">Histoire</SelectItem>
                          <SelectItem value="anglais">Anglais</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>

                    <div>
                      <Label htmlFor="class_level" className="text-laha-text">
                        Classe *
                      </Label>
                      <Select value={courseData.class_level} onValueChange={(value) => setCourseData({ ...courseData, class_level: value })}>
                        <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quatrieme">Quatrième</SelectItem>
                          <SelectItem value="troisieme">Troisième</SelectItem>
                          <SelectItem value="seconde">Seconde</SelectItem>
                          <SelectItem value="premiere">Première</SelectItem>
                          <SelectItem value="terminale">Terminale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>

                  <div>
                    <Label htmlFor="description" className="text-laha-text">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Description du cours..."
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      className="bg-laha-background border-laha-border text-laha-text"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configuration du cours */}
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-text">Configuration du cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="duration" className="text-laha-text">
                        Durée (minutes)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="15"
                        value={courseData.duration}
                        onChange={(e) => setCourseData({ ...courseData, duration: parseInt(e.target.value) || 60 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxStudents" className="text-laha-text">
                        Nombre max d'élèves
                      </Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        min="1"
                        value={courseData.maxStudents}
                        onChange={(e) => setCourseData({ ...courseData, maxStudents: parseInt(e.target.value) || 30 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-laha-text">
                        Prix (€)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty" className="text-laha-text">
                      Niveau de difficulté
                    </Label>
                    <Select value={courseData.difficulty} onValueChange={(value) => setCourseData({ ...courseData, difficulty: value })}>
                      <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                        <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                </CardContent>
              </Card>

            {/* Form with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-laha-surface border-laha-border">
                <TabsTrigger value="general" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <FileText className="h-4 w-4 mr-2" />
                  Général
                </TabsTrigger>
                <TabsTrigger value="content" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="lessons" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <List className="h-4 w-4 mr-2" />
                  Leçons
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <Target className="h-4 w-4 mr-2" />
                  Paramètres
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                {/* Informations générales */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Informations générales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-laha-text">
                        Titre du cours *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ex: Introduction à la physique quantique"
                        value={courseData.title}
                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject" className="text-laha-text">
                          Matière *
                        </Label>
                        <Select value={courseData.subject} onValueChange={(value) => setCourseData({ ...courseData, subject: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une matière" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematiques">Mathématiques</SelectItem>
                            <SelectItem value="physique">Physique</SelectItem>
                            <SelectItem value="francais">Français</SelectItem>
                            <SelectItem value="svt">SVT</SelectItem>
                            <SelectItem value="histoire">Histoire</SelectItem>
                            <SelectItem value="anglais">Anglais</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="class_level" className="text-laha-text">
                          Classe *
                        </Label>
                        <Select value={courseData.class_level} onValueChange={(value) => setCourseData({ ...courseData, class_level: value })}>
                          <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                            <SelectValue placeholder="Sélectionner une classe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quatrieme">Quatrième</SelectItem>
                            <SelectItem value="troisieme">Troisième</SelectItem>
                            <SelectItem value="seconde">Seconde</SelectItem>
                            <SelectItem value="premiere">Première</SelectItem>
                            <SelectItem value="terminale">Terminale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-laha-text">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Description du cours..."
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                        className="bg-laha-background border-laha-border text-laha-text"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Configuration du cours */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Configuration du cours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="duration" className="text-laha-text">
                          Durée (minutes)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          min="15"
                          value={courseData.duration}
                          onChange={(e) => setCourseData({ ...courseData, duration: parseInt(e.target.value) || 60 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxStudents" className="text-laha-text">
                          Nombre max d'élèves
                        </Label>
                        <Input
                          id="maxStudents"
                          type="number"
                          min="1"
                          value={courseData.maxStudents}
                          onChange={(e) => setCourseData({ ...courseData, maxStudents: parseInt(e.target.value) || 30 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>

                    <div>
                        <Label htmlFor="price" className="text-laha-text">
                          Prix (FCFA)
                      </Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="100"
                          value={courseData.price}
                          onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
                          className="bg-laha-background border-laha-border text-laha-text"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="difficulty" className="text-laha-text">
                        Niveau de difficulté
                      </Label>
                      <Select value={courseData.difficulty} onValueChange={(value) => setCourseData({ ...courseData, difficulty: value })}>
                        <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Débutant</SelectItem>
                          <SelectItem value="intermediate">Intermédiaire</SelectItem>
                          <SelectItem value="advanced">Avancé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                {/* Objectifs d'apprentissage */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Objectifs d'apprentissage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un objectif..."
                        value={currentObjective}
                        onChange={(e) => setCurrentObjective(e.target.value)}
                        className="bg-laha-background border-laha-border text-laha-text"
                        onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                      />
                      <Button onClick={addObjective} className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {courseData.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-laha-background rounded border border-laha-border">
                          <span className="text-laha-text">{objective}</span>
                      <Button 
                        variant="outline" 
                            size="sm"
                            onClick={() => removeObjective(index)}
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prérequis */}
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Prérequis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter un prérequis..."
                        value={currentPrerequisite}
                        onChange={(e) => setCurrentPrerequisite(e.target.value)}
                        className="bg-laha-background border-laha-border text-laha-text"
                        onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
                      />
                      <Button onClick={addPrerequisite} className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {courseData.prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-laha-background rounded border border-laha-border">
                          <span className="text-laha-text">{prerequisite}</span>
                        <Button 
                          variant="outline"
                            size="sm"
                            onClick={() => removePrerequisite(index)}
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lessons Tab */}
              <TabsContent value="lessons" className="space-y-6">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-laha-text">Leçons du cours</CardTitle>
                      <Button onClick={addLesson} className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une leçon
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courseData.lessons.length === 0 ? (
                      <div className="text-center py-8 text-laha-text-secondary">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune leçon ajoutée</p>
                        <p className="text-sm">Cliquez sur "Ajouter une leçon" pour commencer</p>
                      </div>
                    ) : (
                      courseData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="border border-laha-border rounded-lg p-4 bg-laha-background/50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-laha-text">
                              Leçon {index + 1}
                            </h4>
                        <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => removeLesson(lesson.id)}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                        </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="text-laha-text">Titre de la leçon</Label>
                              <Input
                                placeholder="Titre de la leçon..."
                                value={lesson.title}
                                onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                                className="bg-laha-background border-laha-border text-laha-text"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-laha-text">Durée (minutes)</Label>
                                <Input
                                  type="number"
                                  min="5"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(lesson.id, 'duration', parseInt(e.target.value) || 15)}
                                  className="bg-laha-background border-laha-border text-laha-text"
                                />
                              </div>
                              <div>
                                <Label className="text-laha-text">Type</Label>
                                <Select value={lesson.type} onValueChange={(value: any) => updateLesson(lesson.id, 'type', value)}>
                                  <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Texte</SelectItem>
                                    <SelectItem value="video">Vidéo</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="exercise">Exercice</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-laha-text">Contenu</Label>
                              <Textarea
                                placeholder="Contenu de la leçon..."
                                value={lesson.content}
                                onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                                className="bg-laha-background border-laha-border text-laha-text"
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Paramètres avancés</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Autoriser les commentaires</Label>
                        <p className="text-sm text-laha-text-secondary">Les étudiants pourront commenter le cours</p>
                      </div>
                      <Switch
                        checked={courseData.allowComments}
                        onCheckedChange={(checked) => setCourseData({ ...courseData, allowComments: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-laha-text">Activer les téléchargements</Label>
                        <p className="text-sm text-laha-text-secondary">Les étudiants pourront télécharger les ressources</p>
                      </div>
                      <Switch
                        checked={courseData.enableDownloads}
                        onCheckedChange={(checked) => setCourseData({ ...courseData, enableDownloads: checked })}
                      />
                    </div>
                </CardContent>
              </Card>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-laha-border">
              <Button 
                variant="outline" 
                className="border-laha-border text-laha-text hover:bg-laha-surface"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Sauvegarder comme brouillon
              </Button>
              <Button 
                className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                onClick={handlePublish}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BookOpen className="h-4 w-4 mr-2" />
                )}
                Publier le cours
              </Button>
            </div>
          </div>
            </div>
          </main>
      </AdminSidebar>
    </AuthGuard>
  )
}