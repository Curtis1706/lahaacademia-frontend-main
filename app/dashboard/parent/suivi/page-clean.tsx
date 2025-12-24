"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { useParentData } from "@/hooks/use-parent-data"
import { 
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  BookOpen,
  Award,
  Eye,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity,
  Loader2,
  RefreshCw,
  Minus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ParentProgressPage() {
  const { children, courseProgress, performanceMetrics, attendanceRecords, loading, error, refreshData } = useParentData()
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [activeTab, setActiveTab] = useState("overview")

  // Sélectionner automatiquement le premier enfant
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id)
    }
  }, [children, selectedChild])

  const selectedChildData = children.find(child => child.id === selectedChild)

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-laha-gold mb-2">Suivi des Progrès</h1>
                <p className="text-laha-text-secondary">
                  Suivez en détail les performances de vos enfants
                </p>
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
                <span className="ml-3 text-laha-text-secondary">Chargement des données...</span>
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
                {/* Sélection de l'enfant */}
                {children.length > 0 && (
                  <Card className="mb-6">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Sélectionner un enfant :</label>
                        <Select value={selectedChild} onValueChange={setSelectedChild}>
                          <SelectTrigger className="w-64">
                            <SelectValue placeholder="Choisir un enfant" />
                          </SelectTrigger>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                {child.name} - {child.class_level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pas d'enfants */}
                {children.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-laha-text-secondary mb-4">Aucun enfant enregistré</p>
                      <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        Ajouter un enfant
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Contenu principal */}
                {selectedChildData && (
                  <>
                    {/* Résumé de l'enfant */}
                    <Card className="mb-6 bg-gradient-to-br from-laha-gold/10 to-laha-gold/5">
                      <CardContent className="py-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-laha-gold/20 flex items-center justify-center">
                            <GraduationCap className="h-10 w-10 text-laha-gold" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-1">{selectedChildData.name}</h2>
                            <p className="text-laha-text-secondary">{selectedChildData.class_level}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <p className="text-2xl font-bold text-laha-gold">
                                {selectedChildData.performance_summary?.overall_grade?.toFixed(1) || '0.0'}
                              </p>
                              <p className="text-sm text-laha-text-secondary">Moyenne</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-laha-gold">
                                {selectedChildData.performance_summary?.attendance_rate?.toFixed(0) || '0'}%
                              </p>
                              <p className="text-sm text-laha-text-secondary">Assiduité</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-laha-gold">
                                {selectedChildData.performance_summary?.courses_enrolled || 0}
                              </p>
                              <p className="text-sm text-laha-text-secondary">Cours</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-6">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="courses">Cours ({courseProgress.length})</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="attendance">Assiduité</TabsTrigger>
                      </TabsList>

                      {/* Overview */}
                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Progression globale */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Progression globale
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between text-sm mb-2">
                                    <span>Cours complétés</span>
                                    <span className="font-medium">
                                      {selectedChildData.performance_summary?.courses_completed || 0} / 
                                      {selectedChildData.performance_summary?.courses_enrolled || 0}
                                    </span>
                                  </div>
                                  <Progress 
                                    value={
                                      selectedChildData.performance_summary?.courses_enrolled 
                                        ? (selectedChildData.performance_summary.courses_completed / selectedChildData.performance_summary.courses_enrolled) * 100 
                                        : 0
                                    } 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                  <div className="text-center p-4 bg-laha-surface/20 rounded-lg">
                                    <p className="text-2xl font-bold text-laha-gold">
                                      {selectedChildData.performance_summary?.overall_grade?.toFixed(1) || '0.0'}
                                    </p>
                                    <p className="text-sm text-laha-text-secondary">Moyenne générale</p>
                                  </div>
                                  <div className="text-center p-4 bg-laha-surface/20 rounded-lg">
                                    <p className="text-2xl font-bold text-laha-gold">
                                      {selectedChildData.performance_summary?.attendance_rate?.toFixed(0) || '0'}%
                                    </p>
                                    <p className="text-sm text-laha-text-secondary">Assiduité</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Dernière activité */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Activité récente
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-laha-text-secondary mb-4">
                                Dernière connexion :{" "}
                                {selectedChildData.performance_summary?.last_activity 
                                  ? new Date(selectedChildData.performance_summary.last_activity).toLocaleDateString('fr-FR')
                                  : 'Jamais'}
                              </p>
                              {courseProgress.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Cours actifs :</p>
                                  {courseProgress.slice(0, 3).map((course) => (
                                    <div key={course.id} className="flex items-center justify-between p-2 bg-laha-surface/20 rounded">
                                      <span className="text-sm">{course.title}</span>
                                      <Badge variant="outline">{course.progress}%</Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Courses */}
                      <TabsContent value="courses">
                        {courseProgress.length === 0 ? (
                          <Card>
                            <CardContent className="py-12 text-center">
                              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                              <p className="text-laha-text-secondary">Aucun cours en cours</p>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courseProgress.map((course) => (
                              <Card key={course.id}>
                                <CardHeader>
                                  <CardTitle className="text-lg">{course.title}</CardTitle>
                                  <Badge 
                                    variant="outline"
                                    className={
                                      course.status === 'active' ? 'bg-green-500/10 text-green-700' :
                                      course.status === 'completed' ? 'bg-blue-500/10 text-blue-700' :
                                      'bg-yellow-500/10 text-yellow-700'
                                    }
                                  >
                                    {course.status}
                                  </Badge>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between text-sm mb-2">
                                        <span>Progression</span>
                                        <span className="font-medium">{course.progress}%</span>
                                      </div>
                                      <Progress value={course.progress} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-3 bg-laha-surface/20 rounded">
                                        <p className="text-xl font-bold text-laha-gold">{course.grade}/20</p>
                                        <p className="text-xs text-laha-text-secondary">Note</p>
                                      </div>
                                      <div className="text-center p-3 bg-laha-surface/20 rounded">
                                        <p className="text-xl font-bold text-laha-gold">{course.attendance}%</p>
                                        <p className="text-xs text-laha-text-secondary">Présence</p>
                                      </div>
                                    </div>
                                    <div className="text-sm text-laha-text-secondary space-y-1">
                                      <p>Leçons: {course.lessons_completed}/{course.total_lessons}</p>
                                      <p>Devoirs en attente: {course.assignments_pending}</p>
                                      <p>Examens à venir: {course.upcoming_exams}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* Performance */}
                      <TabsContent value="performance">
                        {performanceMetrics.length === 0 ? (
                          <Card>
                            <CardContent className="py-12 text-center">
                              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                              <p className="text-laha-text-secondary">Aucune donnée de performance</p>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {performanceMetrics.map((metric, index) => (
                              <Card key={index}>
                                <CardContent className="py-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-semibold">{metric.subject}</h3>
                                    <Badge>
                                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-600" />}
                                      {metric.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1 text-red-600" />}
                                      {metric.trend === 'stable' && <Minus className="h-3 w-3 mr-1" />}
                                      {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
                                    </Badge>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-laha-text-secondary">Note actuelle</span>
                                      <span className="font-bold text-laha-gold">{metric.grade}/20</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-laha-text-secondary">Dernier examen</span>
                                      <span className="font-medium">{metric.last_exam_score}/20</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-laha-text-secondary">Moyenne classe</span>
                                      <span className="font-medium">{metric.average_score}/20</span>
                                    </div>
                                    {metric.rank_in_class && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-laha-text-secondary">Classement</span>
                                        <Badge variant="outline">{metric.rank_in_class}ème</Badge>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      {/* Attendance */}
                      <TabsContent value="attendance">
                        {attendanceRecords.length === 0 ? (
                          <Card>
                            <CardContent className="py-12 text-center">
                              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                              <p className="text-laha-text-secondary">Aucun enregistrement de présence</p>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card>
                            <CardHeader>
                              <CardTitle>Historique de présence</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {attendanceRecords.map((record, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 bg-laha-surface/20 rounded-lg">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-3 h-3 rounded-full ${
                                        record.status === 'present' ? 'bg-green-500' :
                                        record.status === 'absent' ? 'bg-red-500' :
                                        'bg-yellow-500'
                                      }`}></div>
                                      <div>
                                        <p className="font-medium">{record.course}</p>
                                        <p className="text-sm text-laha-text-secondary">
                                          {record.teacher} • {new Date(record.date).toLocaleDateString('fr-FR')}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={
                                        record.status === 'present' 
                                          ? 'bg-green-500/10 text-green-700 border-green-500/20'
                                          : record.status === 'absent'
                                          ? 'bg-red-500/10 text-red-700 border-red-500/20'
                                          : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                                      }
                                    >
                                      {record.status === 'present' ? 'Présent' :
                                       record.status === 'absent' ? 'Absent' : 'Retard'}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                    </Tabs>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}




