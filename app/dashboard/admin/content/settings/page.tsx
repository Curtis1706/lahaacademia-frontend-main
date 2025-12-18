"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  BookOpen,
  GraduationCap,
  User,
  School,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import logger from "@/lib/logger"

interface Subject {
  id: string
  name: string
  code: string
  description: string
  color: string
}

interface ClassLevel {
  id: string
  name: string
  level: number
  description: string
}

interface Author {
  id: string
  name: string
  email: string
  specialization: string
  status: string
}

export default function ContentSettingsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger les vraies données depuis les APIs
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [subjectsRes, classLevelsRes, authorsRes] = await Promise.allSettled([
        fetch('/api/admin/config/subjects', { credentials: 'include' }),
        fetch('/api/admin/config/class-levels', { credentials: 'include' }),
        fetch('/api/admin/config/authors', { credentials: 'include' })
      ])

      // Subjects
      if (subjectsRes.status === 'fulfilled' && subjectsRes.value.ok) {
        const data = await subjectsRes.value.json()
        setSubjects(data.results || data || [])
      } else {
        logger.error('Failed to fetch subjects', new Error('API error'), { context: 'ContentSettingsPage' })
      }

      // Class Levels
      if (classLevelsRes.status === 'fulfilled' && classLevelsRes.value.ok) {
        const data = await classLevelsRes.value.json()
        setClassLevels(data.results || data || [])
      } else {
        logger.error('Failed to fetch class levels', new Error('API error'), { context: 'ContentSettingsPage' })
      }

      // Authors
      if (authorsRes.status === 'fulfilled' && authorsRes.value.ok) {
        const data = await authorsRes.value.json()
        setAuthors(data.results || data || [])
      } else {
        logger.error('Failed to fetch authors', new Error('API error'), { context: 'ContentSettingsPage' })
      }

      setLoading(false)
    } catch (error) {
      logger.error('Error fetching config data', error as Error, { context: 'ContentSettingsPage' })
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6 max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-laha-gold mb-2">
                  Paramètres de Contenu
                </h1>
                <p className="text-laha-text-secondary">
                  Configurez matières, classes et auteurs
                </p>
              </div>
              <Button onClick={fetchAllData} disabled={loading} variant="outline" className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
                <span className="ml-3 text-laha-text-secondary">Chargement de la configuration...</span>
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
                    <Button onClick={fetchAllData} variant="outline" size="sm">Réessayer</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && (
              <>

            <Tabs defaultValue="subjects" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-laha-surface border-laha-border">
                <TabsTrigger value="subjects" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Matières
                </TabsTrigger>
                <TabsTrigger value="classes" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Classes
                </TabsTrigger>
                <TabsTrigger value="authors" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
                  <User className="h-4 w-4 mr-2" />
                  Auteurs
                </TabsTrigger>
              </TabsList>

              {/* Matières */}
              <TabsContent value="subjects">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-laha-text">Matières</CardTitle>
                      <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une matière
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between p-4 bg-laha-background rounded-lg border border-laha-border">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: subject.color }}
                            />
                            <div>
                              <h3 className="font-semibold text-laha-text">{subject.name}</h3>
                              <p className="text-sm text-laha-text-secondary">{subject.description}</p>
                              <Badge variant="outline" className="border-laha-border text-laha-text mt-1">
                                {subject.code}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Classes */}
              <TabsContent value="classes">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-laha-text">Classes</CardTitle>
                      <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une classe
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classLevels.map((classLevel) => (
                        <div key={classLevel.id} className="flex items-center justify-between p-4 bg-laha-background rounded-lg border border-laha-border">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-laha-gold/20 rounded-lg flex items-center justify-center">
                              <School className="h-5 w-5 text-laha-gold" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-laha-text">{classLevel.name}</h3>
                              <p className="text-sm text-laha-text-secondary">{classLevel.description}</p>
                              <Badge variant="outline" className="border-laha-border text-laha-text mt-1">
                                Niveau {classLevel.level}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Auteurs */}
              <TabsContent value="authors">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-laha-text">Auteurs</CardTitle>
                      <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un auteur
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {authors.map((author) => (
                        <div key={author.id} className="flex items-center justify-between p-4 bg-laha-background rounded-lg border border-laha-border">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-laha-gold/20 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-laha-gold" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-laha-text">{author.name}</h3>
                              <p className="text-sm text-laha-text-secondary">{author.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="border-laha-border text-laha-text">
                                  {author.specialization}
                                </Badge>
                                <Badge className={getStatusBadge(author.status)}>
                                  {author.status === 'active' ? 'Actif' : 'Inactif'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="border-laha-border text-laha-text hover:bg-laha-surface">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500/20 text-red-500 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

              {/* Statistiques globales */}
              <div className="mt-8">
                <Card className="bg-laha-surface/50 border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-text">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-laha-gold mb-2">{subjects.length}</div>
                        <div className="text-laha-text-secondary">Matières configurées</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-laha-gold mb-2">{classLevels.length}</div>
                        <div className="text-laha-text-secondary">Classes disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-laha-gold mb-2">{authors.filter(a => a.status === 'active').length}</div>
                        <div className="text-laha-text-secondary">Auteurs actifs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
            )}
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}
