"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  BookOpen, 
  GraduationCap,
  RefreshCcw,
  Star,
  Clock,
  Award
} from "lucide-react"
import logger from "@/lib/logger"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

const COLORS = ['#D4AF37', '#FFD700', '#B8860B', '#DAA520', '#F0E68C']

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null)
  const [teachersData, setTeachersData] = useState<any[]>([])
  const [coursesData, setCoursesData] = useState<any[]>([])
  const [studentsData, setStudentsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      
      const [overviewRes, teachersRes, coursesRes, studentsRes] = await Promise.allSettled([
        fetch('/api/admin/analytics/overview', { credentials: 'include' }),
        fetch(`/api/admin/analytics/teachers?period=${period}`, { credentials: 'include' }),
        fetch(`/api/admin/analytics/courses?period=${period}`, { credentials: 'include' }),
        fetch(`/api/admin/analytics/students?period=${period}`, { credentials: 'include' })
      ])

      if (overviewRes.status === 'fulfilled' && overviewRes.value.ok) {
        const data = await overviewRes.value.json()
        setOverview(data)
      }

      if (teachersRes.status === 'fulfilled' && teachersRes.value.ok) {
        const data = await teachersRes.value.json()
        setTeachersData(data.teachers || data || [])
      }

      if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
        const data = await coursesRes.value.json()
        setCoursesData(data.courses || data || [])
      }

      if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
        const data = await studentsRes.value.json()
        setStudentsData(data)
      }

    } catch (error) {
      logger.error('Error loading analytics', error as Error, { context: 'admin/analytics' })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string) => {
    try {
      logger.info('Exporting report', { type, period }, { context: 'admin/analytics' })
      
      const response = await fetch(
        `/api/admin/analytics/export?type=${type}&period=${period}`,
        { credentials: 'include' }
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapport-${type}-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Erreur lors de l\'export')
      }
    } catch (error) {
      logger.error('Error exporting', error as Error, { context: 'admin/analytics' })
      alert('Erreur lors de l\'export')
    }
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto bg-laha-surface">
          <div className="w-full px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-laha-gold font-heading mb-2">
                    Statistiques & Rapports
                  </h1>
                  <p className="text-laha-text-secondary">
                    Analyses détaillées des performances de la plateforme
                  </p>
                </div>
                <div className="flex gap-3">
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px] bg-laha-surface border-laha-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="year">Cette année</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={loadAnalytics}
                    disabled={loading}
                    variant="outline"
                    className="border-laha-gold text-laha-gold"
                  >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-laha-surface/30 to-laha-gold/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold text-laha-gold">
                        {loading ? '...' : overview?.total_active_users || 0}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        +{overview?.users_growth || 0}% vs période précédente
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-laha-gold" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-blue-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Cours Actifs</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {loading ? '...' : overview?.total_courses || 0}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        +{overview?.courses_growth || 0}% vs période précédente
                      </p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-green-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Taux de Complétion</p>
                      <p className="text-2xl font-bold text-green-500">
                        {loading ? '...' : `${overview?.completion_rate || 0}%`}
                      </p>
                      <p className="text-xs text-green-500 mt-1">
                        +{overview?.completion_growth || 0}% vs période précédente
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-laha-surface/30 to-purple-500/15 border border-laha-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-laha-text-secondary mb-1">Note Moyenne</p>
                      <p className="text-2xl font-bold text-purple-500">
                        {loading ? '...' : `${overview?.average_rating || 0}/5`}
                      </p>
                      <p className="text-xs text-laha-text-secondary mt-1">
                        Basé sur {overview?.total_reviews || 0} avis
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-laha-surface/80">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="teachers">Enseignants</TabsTrigger>
                <TabsTrigger value="courses">Cours</TabsTrigger>
                <TabsTrigger value="students">Étudiants</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-laha-surface/80 border border-laha-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-laha-gold">Croissance Utilisateurs</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => handleExport('overview')}
                        className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                          Chargement...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={overview?.user_growth_data || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="period" stroke="#D4AF37" />
                            <YAxis stroke="#D4AF37" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="users" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.3} name="Utilisateurs" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-laha-surface/80 border border-laha-border">
                    <CardHeader>
                      <CardTitle className="text-laha-gold">Répartition des Rôles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                          Chargement...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={overview?.role_distribution || []}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={(entry) => `${entry.role}: ${entry.count}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {(overview?.role_distribution || []).map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Teachers Tab */}
              <TabsContent value="teachers" className="mt-6">
                <Card className="bg-laha-surface/80 border border-laha-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-laha-gold">Performances des Enseignants</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => handleExport('teachers')}
                      className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-[400px] flex items-center justify-center text-laha-text-secondary">
                        Chargement...
                      </div>
                    ) : teachersData.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center text-laha-text-secondary">
                        Aucune donnée disponible
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={teachersData.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#D4AF37" />
                          <YAxis stroke="#D4AF37" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                          />
                          <Legend />
                          <Bar dataKey="students_count" fill="#D4AF37" name="Étudiants" />
                          <Bar dataKey="courses_count" fill="#FFD700" name="Cours" />
                          <Bar dataKey="rating" fill="#B8860B" name="Note /5" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="mt-6">
                <Card className="bg-laha-surface/80 border border-laha-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-laha-gold">Top Cours par Inscriptions</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => handleExport('courses')}
                      className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-[400px] flex items-center justify-center text-laha-text-secondary">
                        Chargement...
                      </div>
                    ) : coursesData.length === 0 ? (
                      <div className="h-[400px] flex items-center justify-center text-laha-text-secondary">
                        Aucune donnée disponible
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={coursesData.slice(0, 10)} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis type="number" stroke="#D4AF37" />
                          <YAxis type="category" dataKey="title" stroke="#D4AF37" width={150} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                          />
                          <Legend />
                          <Bar dataKey="enrollments" fill="#D4AF37" name="Inscriptions" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-laha-surface/80 border border-laha-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-laha-gold">Engagement Étudiants</CardTitle>
                      <Button
                        size="sm"
                        onClick={() => handleExport('students')}
                        className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="h-[300px] flex items-center justify-center text-laha-text-secondary">
                          Chargement...
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={studentsData?.engagement_data || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="period" stroke="#D4AF37" />
                            <YAxis stroke="#D4AF37" />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #D4AF37' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="active_students" stroke="#D4AF37" name="Actifs" />
                            <Line type="monotone" dataKey="completed_courses" stroke="#FFD700" name="Cours terminés" />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-laha-surface/80 border border-laha-border">
                    <CardHeader>
                      <CardTitle className="text-laha-gold">Statistiques Étudiants</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-laha-black-light/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-laha-gold" />
                            <span className="text-laha-text">Temps moyen d'étude</span>
                          </div>
                          <span className="text-laha-gold font-bold">
                            {studentsData?.average_study_time || 0}h
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-laha-black-light/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <span className="text-laha-text">Taux de progression</span>
                          </div>
                          <span className="text-green-500 font-bold">
                            {studentsData?.progression_rate || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-laha-black-light/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Award className="h-5 w-5 text-purple-500" />
                            <span className="text-laha-text">Certificats délivrés</span>
                          </div>
                          <span className="text-purple-500 font-bold">
                            {studentsData?.certificates_issued || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </AdminSidebar>
    </AuthGuard>
  )
}



