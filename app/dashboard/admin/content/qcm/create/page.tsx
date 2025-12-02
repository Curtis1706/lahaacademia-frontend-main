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
  Clock,
  Target,
  Settings,
  BookOpen,
  CheckCircle,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EducationalContent {
  id: string
  title: string
  content_type: string
  subject: string
  class_level: string
}

interface QCMData {
  title: string
  description: string
  content: string
  time_limit_minutes?: number
  max_attempts: number
  passing_score: number
  show_correct_answers: boolean
  randomize_questions: boolean
  is_active: boolean
}

interface Question {
  id?: string
  question_text: string
  question_type: 'single_choice' | 'multiple_choice' | 'true_false' | 'text'
  explanation: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
  answers: Answer[]
}

interface Answer {
  id?: string
  answer_text: string
  is_correct: boolean
  order: number
}

export default function CreateQCMPage() {
  const router = useRouter()
  const [educationalContents, setEducationalContents] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const [qcmData, setQcmData] = useState<QCMData>({
    title: "",
    description: "",
    content: "",
    time_limit_minutes: undefined,
    max_attempts: 3,
    passing_score: 70,
    show_correct_answers: true,
    randomize_questions: false,
    is_active: true,
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      question_text: "",
      question_type: "single_choice",
      explanation: "",
      points: 1,
      difficulty: "medium",
      order: 1,
      answers: [
        { answer_text: "", is_correct: false, order: 1 },
        { answer_text: "", is_correct: false, order: 2 },
      ]
    }
  ])

  // Charger les contenus éducatifs
  useEffect(() => {
    const loadEducationalContents = async () => {
      try {
        const response = await fetch('/api/admin/content', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()
        
        const contents = Array.isArray(data) ? data : (data.results || [])
        setEducationalContents(contents.map((c: any) => ({
          id: c.id,
          title: c.title,
          content_type: c.content_type,
          subject: c.subject,
          class_level: c.class_level,
        })))
      } catch (error) {
        console.error('Erreur lors du chargement des contenus:', error)
      }
    }
    loadEducationalContents()
  }, [])

  const addQuestion = () => {
    const newQuestion: Question = {
      question_text: "",
      question_type: "single_choice",
      explanation: "",
      points: 1,
      difficulty: "medium",
      order: questions.length + 1,
      answers: [
        { answer_text: "", is_correct: false, order: 1 },
        { answer_text: "", is_correct: false, order: 2 },
      ]
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index)
      // Réorganiser les ordres
      newQuestions.forEach((q, i) => {
        q.order = i + 1
      })
      setQuestions(newQuestions)
    }
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const addAnswer = (questionIndex: number) => {
    const newQuestions = [...questions]
    const question = newQuestions[questionIndex]
    const newAnswer: Answer = {
      answer_text: "",
      is_correct: false,
      order: question.answers.length + 1
    }
    question.answers.push(newAnswer)
    setQuestions(newQuestions)
  }

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...questions]
    const question = newQuestions[questionIndex]
    if (question.answers.length > 2) {
      question.answers.splice(answerIndex, 1)
      // Réorganiser les ordres
      question.answers.forEach((a, i) => {
        a.order = i + 1
      })
      setQuestions(newQuestions)
    }
  }

  const updateAnswer = (questionIndex: number, answerIndex: number, field: keyof Answer, value: any) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].answers[answerIndex] = {
      ...newQuestions[questionIndex].answers[answerIndex],
      [field]: value
    }
    setQuestions(newQuestions)
  }

  const handleSave = async () => {
    if (!qcmData.title.trim() || !qcmData.description.trim() || !qcmData.content) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (questions.some(q => !q.question_text.trim() || q.answers.some(a => !a.answer_text.trim()))) {
      alert("Veuillez remplir toutes les questions et réponses")
      return
    }

    try {
      setSaving(true)
      
      const payload = {
        ...qcmData,
        questions: questions.map(q => ({
          ...q,
          answers: q.answers.map(a => ({
            answer_text: a.answer_text,
            is_correct: a.is_correct,
            order: a.order
          }))
        }))
      }

      console.log('💾 Sauvegarde du QCM:', payload)

      const response = await fetch('/api/admin/qcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ QCM sauvegardé:', result)
      
      alert('QCM sauvegardé avec succès !')
      router.push('/dashboard/admin/content/qcm')
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error)
      alert(`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!qcmData.title.trim() || !qcmData.description.trim() || !qcmData.content) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setPublishing(true)
      
      const payload = {
        ...qcmData,
        is_active: true,
        questions: questions.map(q => ({
          ...q,
          answers: q.answers.map(a => ({
            answer_text: a.answer_text,
            is_correct: a.is_correct,
            order: a.order
          }))
        }))
      }

      console.log('🚀 Publication du QCM:', payload)

      const response = await fetch('/api/admin/qcm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ QCM publié:', result)
      
      alert('QCM publié avec succès !')
      router.push('/dashboard/admin/content/qcm')
    } catch (error) {
      console.error('❌ Erreur lors de la publication:', error)
      alert(`Erreur lors de la publication: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <AuthGuard>
      <AdminSidebar>
        <main className="flex-1 p-6 bg-laha-background">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/content/qcm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-laha-heading">Créer un QCM</h1>
                <p className="text-laha-text-secondary mt-1">Créez un nouveau questionnaire à choix multiples</p>
              </div>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === "general" ? "default" : "outline"}
                onClick={() => setActiveTab("general")}
                className={activeTab === "general" ? "bg-laha-primary text-laha-primary-foreground" : ""}
              >
                <Settings className="h-4 w-4 mr-2" />
                Général
              </Button>
              <Button
                variant={activeTab === "questions" ? "default" : "outline"}
                onClick={() => setActiveTab("questions")}
                className={activeTab === "questions" ? "bg-laha-primary text-laha-primary-foreground" : ""}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Questions ({questions.length})
              </Button>
            </div>

            {/* Onglet Général */}
            {activeTab === "general" && (
              <Card className="bg-laha-card border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-laha-text">Titre du QCM *</Label>
                    <Input
                      id="title"
                      value={qcmData.title}
                      onChange={(e) => setQcmData({ ...qcmData, title: e.target.value })}
                      placeholder="Ex: Quiz sur les équations du second degré"
                      className="bg-laha-background border-laha-border text-laha-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-laha-text">Description *</Label>
                    <Textarea
                      id="description"
                      value={qcmData.description}
                      onChange={(e) => setQcmData({ ...qcmData, description: e.target.value })}
                      placeholder="Décrivez le contenu et les objectifs de ce QCM..."
                      className="bg-laha-background border-laha-border text-laha-text"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="content" className="text-laha-text">Contenu associé *</Label>
                    <Select value={qcmData.content} onValueChange={(value) => setQcmData({ ...qcmData, content: value })}>
                      <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                        <SelectValue placeholder="Sélectionnez un contenu éducatif" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationalContents.map((content) => (
                          <SelectItem key={content.id} value={content.id}>
                            {content.title} ({content.content_type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time_limit" className="text-laha-text">Limite de temps (minutes)</Label>
                      <Input
                        id="time_limit"
                        type="number"
                        value={qcmData.time_limit_minutes || ""}
                        onChange={(e) => setQcmData({ ...qcmData, time_limit_minutes: e.target.value ? parseInt(e.target.value) : undefined })}
                        placeholder="Ex: 30"
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="max_attempts" className="text-laha-text">Nombre max de tentatives</Label>
                      <Input
                        id="max_attempts"
                        type="number"
                        value={qcmData.max_attempts}
                        onChange={(e) => setQcmData({ ...qcmData, max_attempts: parseInt(e.target.value) })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>

                    <div>
                      <Label htmlFor="passing_score" className="text-laha-text">Score de réussite (%)</Label>
                      <Input
                        id="passing_score"
                        type="number"
                        value={qcmData.passing_score}
                        onChange={(e) => setQcmData({ ...qcmData, passing_score: parseInt(e.target.value) })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show_correct_answers" className="text-laha-text">Afficher les bonnes réponses</Label>
                      <Switch
                        id="show_correct_answers"
                        checked={qcmData.show_correct_answers}
                        onCheckedChange={(checked) => setQcmData({ ...qcmData, show_correct_answers: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="randomize_questions" className="text-laha-text">Mélanger les questions</Label>
                      <Switch
                        id="randomize_questions"
                        checked={qcmData.randomize_questions}
                        onCheckedChange={(checked) => setQcmData({ ...qcmData, randomize_questions: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active" className="text-laha-text">QCM actif</Label>
                      <Switch
                        id="is_active"
                        checked={qcmData.is_active}
                        onCheckedChange={(checked) => setQcmData({ ...qcmData, is_active: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Onglet Questions */}
            {activeTab === "questions" && (
              <div className="space-y-4">
                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className="bg-laha-card border-laha-border">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-laha-heading">Question {questionIndex + 1}</CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestion(questionIndex)}
                            disabled={questions.length === 1}
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-laha-text">Texte de la question *</Label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => updateQuestion(questionIndex, 'question_text', e.target.value)}
                          placeholder="Posez votre question ici..."
                          className="bg-laha-background border-laha-border text-laha-text"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-laha-text">Type de question</Label>
                          <Select
                            value={question.question_type}
                            onValueChange={(value: any) => updateQuestion(questionIndex, 'question_type', value)}
                          >
                            <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single_choice">Choix unique</SelectItem>
                              <SelectItem value="multiple_choice">Choix multiple</SelectItem>
                              <SelectItem value="true_false">Vrai/Faux</SelectItem>
                              <SelectItem value="text">Réponse libre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-laha-text">Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
                            className="bg-laha-background border-laha-border text-laha-text"
                          />
                        </div>

                        <div>
                          <Label className="text-laha-text">Difficulté</Label>
                          <Select
                            value={question.difficulty}
                            onValueChange={(value: any) => updateQuestion(questionIndex, 'difficulty', value)}
                          >
                            <SelectTrigger className="bg-laha-background border-laha-border text-laha-text">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Facile</SelectItem>
                              <SelectItem value="medium">Moyen</SelectItem>
                              <SelectItem value="hard">Difficile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-laha-text">Explication</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                          placeholder="Expliquez pourquoi cette réponse est correcte..."
                          className="bg-laha-background border-laha-border text-laha-text"
                          rows={2}
                        />
                      </div>

                      {/* Réponses */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-laha-text">Réponses</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addAnswer(questionIndex)}
                            className="border-laha-border text-laha-text hover:bg-laha-surface"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter une réponse
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="flex items-center gap-2">
                              <div className="flex-1">
                                <Input
                                  value={answer.answer_text}
                                  onChange={(e) => updateAnswer(questionIndex, answerIndex, 'answer_text', e.target.value)}
                                  placeholder={`Réponse ${answerIndex + 1}`}
                                  className="bg-laha-background border-laha-border text-laha-text"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={answer.is_correct}
                                  onCheckedChange={(checked) => updateAnswer(questionIndex, answerIndex, 'is_correct', checked)}
                                />
                                <Label className="text-sm text-laha-text">Correcte</Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeAnswer(questionIndex, answerIndex)}
                                  disabled={question.answers.length === 2}
                                  className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  onClick={addQuestion}
                  variant="outline"
                  className="w-full border-laha-border text-laha-text hover:bg-laha-surface"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une question
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/dashboard/admin/content/qcm">
                  Annuler
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  variant="outline"
                  className="border-laha-border text-laha-text hover:bg-laha-surface"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="bg-laha-primary hover:bg-laha-primary/90 text-laha-primary-foreground"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {publishing ? 'Publication...' : 'Publier'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}