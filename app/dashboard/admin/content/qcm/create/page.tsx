"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  HelpCircle,
  BookOpen,
  Clock,
  Target,
  Shuffle,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export default function CreateQCMPage() {
  const [qcmData, setQcmData] = useState({
    title: "",
    subject: "",
    class_level: "",
    description: "",
    successScore: 70,
    timeLimit: 0,
    maxAttempts: 3,
    showCorrectAnswers: true,
    shuffleQuestions: false
  })

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }
  ])

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }
    setQuestions([...questions, newQuestion])
  }

  const handleRemoveQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId))
    }
  }

  const handleQuestionChange = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ))
  }

  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    ))
  }

  const handleSave = () => {
    console.log("Sauvegarde du QCM:", { qcmData, questions })
    // Logique de sauvegarde
  }

  const handlePreview = () => {
    console.log("Prévisualisation du QCM:", { qcmData, questions })
    // Logique de prévisualisation
  }

  const handlePublish = () => {
    console.log("Publication du QCM:", { qcmData, questions })
    // Logique de publication
  }

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 overflow-auto p-6">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                    <Link href="/dashboard/admin/content/qcm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Link>
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-laha-gold mb-2">
                      Créer un QCM
                    </h1>
                    <p className="text-laha-text-secondary">
                      Créez un questionnaire à choix multiples interactif
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    className="border-laha-border text-laha-text hover:bg-laha-surface"
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button 
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    onClick={handlePublish}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Publier le QCM
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
                      Titre du QCM *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: QCM sur les équations du premier degré"
                      value={qcmData.title}
                      onChange={(e) => setQcmData({ ...qcmData, title: e.target.value })}
                      className="bg-laha-background border-laha-border text-laha-text"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject" className="text-laha-text">
                        Matière *
                      </Label>
                      <Select value={qcmData.subject} onValueChange={(value) => setQcmData({ ...qcmData, subject: value })}>
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
                      <Select value={qcmData.class_level} onValueChange={(value) => setQcmData({ ...qcmData, class_level: value })}>
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
                      placeholder="Description du QCM..."
                      value={qcmData.description}
                      onChange={(e) => setQcmData({ ...qcmData, description: e.target.value })}
                      className="bg-laha-background border-laha-border text-laha-text"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configuration du QCM */}
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-text">Configuration du QCM</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="successScore" className="text-laha-text">
                        Score de réussite (%)
                      </Label>
                      <Input
                        id="successScore"
                        type="number"
                        min="0"
                        max="100"
                        value={qcmData.successScore}
                        onChange={(e) => setQcmData({ ...qcmData, successScore: parseInt(e.target.value) || 0 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="timeLimit" className="text-laha-text">
                        Limite de temps (minutes)
                      </Label>
                      <Input
                        id="timeLimit"
                        type="number"
                        min="0"
                        value={qcmData.timeLimit}
                        onChange={(e) => setQcmData({ ...qcmData, timeLimit: parseInt(e.target.value) || 0 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxAttempts" className="text-laha-text">
                        Nombre max de tentatives
                      </Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        min="1"
                        value={qcmData.maxAttempts}
                        onChange={(e) => setQcmData({ ...qcmData, maxAttempts: parseInt(e.target.value) || 1 })}
                        className="bg-laha-background border-laha-border text-laha-text"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showCorrectAnswers"
                        checked={qcmData.showCorrectAnswers}
                        onCheckedChange={(checked) => setQcmData({ ...qcmData, showCorrectAnswers: !!checked })}
                      />
                      <Label htmlFor="showCorrectAnswers" className="text-laha-text">
                        Afficher les bonnes réponses
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shuffleQuestions"
                        checked={qcmData.shuffleQuestions}
                        onCheckedChange={(checked) => setQcmData({ ...qcmData, shuffleQuestions: !!checked })}
                      />
                      <Label htmlFor="shuffleQuestions" className="text-laha-text">
                        Mélanger les questions
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-laha-text">Questions</CardTitle>
                    <Button 
                      onClick={handleAddQuestion}
                      className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-laha-border rounded-lg p-4 bg-laha-background/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-laha-text">
                          Question {index + 1}
                        </h4>
                        {questions.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveQuestion(question.id)}
                            className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-laha-text">Question</Label>
                          <Textarea
                            placeholder="Entrez votre question..."
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                            className="bg-laha-background border-laha-border text-laha-text"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-laha-text">Options de réponse</Label>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => handleQuestionChange(question.id, 'correctAnswer', optionIndex)}
                                    className="text-laha-gold"
                                  />
                                  <Label className="text-laha-text">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </Label>
                                </div>
                                <Input
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  value={option}
                                  onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                  className="bg-laha-background border-laha-border text-laha-text"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-laha-text">Explication (optionnelle)</Label>
                          <Textarea
                            placeholder="Explication de la réponse correcte..."
                            value={question.explanation || ""}
                            onChange={(e) => handleQuestionChange(question.id, 'explanation', e.target.value)}
                            className="bg-laha-background border-laha-border text-laha-text"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="border-laha-border text-laha-text hover:bg-laha-surface"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme brouillon
                </Button>
                <Button 
                  className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                  onClick={handlePublish}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Publier le QCM
                </Button>
              </div>
            </div>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}