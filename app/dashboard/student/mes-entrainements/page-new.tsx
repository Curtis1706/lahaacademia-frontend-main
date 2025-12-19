"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { useStudentData } from "@/hooks/use-student-data"
import { 
  Dumbbell,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Star,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function StudentExercisesPage() {
  const { exercises, loading, error, refreshData } = useStudentData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les exercices
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || exercise.subject === selectedSubject
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty
    const matchesTab = activeTab === "all" || 
                      (activeTab === "completed" && exercise.is_completed) ||
                      (activeTab === "favorites" && exercise.is_favorite) ||
                      (activeTab === "inprogress" && !exercise.is_completed && exercise.progress && exercise.progress > 0)
    
    return matchesSearch && matchesSubject && matchesDifficulty && matchesTab
  })

  // Stats
  const completedExercises = exercises.filter(e => e.is_completed)
  const favoriteExercises = exercises.filter(e => e.is_favorite)
  const avgScore = exercises.filter(e => e.best_score).length > 0
    ? Math.round(exercises.filter(e => e.best_score).reduce((sum, e) => sum + (e.best_score || 0), 0) / exercises.filter(e => e.best_score).length)
    : 0

  return (
    <AuthGuard requiredRole="student">
      <StudentSidebar>
        <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-laha-gold mb-2">Mes Entraînements</h1>
                <p className="text-laha-text-secondary">Exercices, QCM et tests pour progresser</p>
              </div>
              <Button onClick={refreshData} disabled={loading} variant="outline" className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
                <span className="ml-3 text-laha-text-secondary">Chargement des entraînements...</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200">
                <CardContent className="py-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-red-900 mb-1">Erreur de chargement</h3>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                    <Button onClick={refreshData} variant="outline" size="sm">Réessayer</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content */}
            {!loading && !error && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-laha-gold/20 rounded-lg">
                          <Dumbbell className="h-5 w-5 text-laha-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Total exercices</p>
                          <p className="text-xl font-bold">{exercises.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Complétés</p>
                          <p className="text-xl font-bold">{completedExercises.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                          <Trophy className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Score moyen</p>
                          <p className="text-xl font-bold">{avgScore}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Star className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-laha-text-secondary">Favoris</p>
                          <p className="text-xl font-bold">{favoriteExercises.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="py-4">
                    <Input
                      placeholder="Rechercher un exercice..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList>
                    <TabsTrigger value="all">Tous ({exercises.length})</TabsTrigger>
                    <TabsTrigger value="inprogress">En cours</TabsTrigger>
                    <TabsTrigger value="completed">Complétés ({completedExercises.length})</TabsTrigger>
                    <TabsTrigger value="favorites">Favoris ({favoriteExercises.length})</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Exercises Grid */}
                {filteredExercises.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-laha-text-secondary">Aucun exercice trouvé</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExercises.map((exercise) => (
                      <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-laha-gold/20 rounded-lg">
                              <Target className="h-6 w-6 text-laha-gold" />
                            </div>
                            <div className="flex gap-2">
                              {exercise.is_completed && (
                                <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complété
                                </Badge>
                              )}
                              {exercise.is_favorite && (
                                <Star className="h-4 w-4 text-laha-gold fill-current" />
                              )}
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{exercise.title}</h3>
                          <p className="text-sm text-laha-text-secondary line-clamp-2 mb-4">
                            {exercise.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{exercise.subject}</Badge>
                            <Badge variant="outline">{exercise.class_level}</Badge>
                            <Badge variant="outline" className={
                              exercise.difficulty === 'beginner' ? 'bg-green-500/10 text-green-700' :
                              exercise.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-700' :
                              'bg-red-500/10 text-red-700'
                            }>
                              {exercise.difficulty}
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-laha-text-secondary">Questions</span>
                              <span className="font-medium">{exercise.questions_count}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-laha-text-secondary">Durée</span>
                              <span className="font-medium">{exercise.duration}min</span>
                            </div>
                            {exercise.best_score !== undefined && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-laha-text-secondary">Meilleur score</span>
                                <span className="font-bold text-laha-gold">{exercise.best_score}%</span>
                              </div>
                            )}
                          </div>

                          {exercise.progress && exercise.progress > 0 && !exercise.is_completed && (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-laha-text-secondary">Progression</span>
                                <span className="font-medium">{exercise.progress}%</span>
                              </div>
                              <Progress value={exercise.progress} className="h-2" />
                            </div>
                          )}

                          <Button className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                            {exercise.is_completed ? 'Refaire' : exercise.progress && exercise.progress > 0 ? 'Continuer' : 'Commencer'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </StudentSidebar>
    </AuthGuard>
  )
}




