"use client"

import { useState, useMemo } from 'react'
import { AuthGuard } from '@/components/auth-guard'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Users as UsersIcon,
  Search,
  Filter,
  Download,
  Mail,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Star,
  GraduationCap,
  Clock,
  Eye
} from 'lucide-react'
import { useTeachers } from '@/hooks/use-teachers'

export default function AdminTeachersPage() {
  const { teachers, total, isLoading, error, retry } = useTeachers()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCountry, setFilterCountry] = useState('all')
  const [filterSubject, setFilterSubject] = useState('all')

  const filteredTeachers = useMemo(() => {
    let filtered = teachers

    if (filterStatus !== 'all') {
      const isVerified = filterStatus === 'verified'
      filtered = filtered.filter(teacher => teacher.is_verified === isVerified)
    }

    if (filterCountry !== 'all') {
      filtered = filtered.filter(teacher => teacher.country === filterCountry)
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(teacher => teacher.subjects.includes(filterSubject))
    }

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    return filtered
  }, [teachers, filterStatus, filterCountry, filterSubject, searchTerm])

  const teachersByStatus = useMemo(() => {
    return teachers.reduce((acc, teacher) => {
      if (teacher.is_verified) {
        acc.verified.push(teacher)
      } else {
        acc.pending.push(teacher)
      }
      return acc
    }, { verified: [], pending: [] } as { verified: typeof teachers, pending: typeof teachers })
  }, [teachers])

  const getUniqueCountries = () => {
    const countries = [...new Set(teachers.map(teacher => teacher.country))]
    return countries.sort()
  }

  const getUniqueSubjects = () => {
    const subjects = [...new Set(teachers.flatMap(teacher => teacher.subjects))]
    return subjects.sort()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-laha-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-laha-text">Chargement des enseignants...</p>
                </div>
              </div>
            </div>
          </div>
        </AdminSidebar>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="admin">
        <AdminSidebar>
          <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full px-6 py-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <p className="text-red-500 mb-2">Erreur lors du chargement des enseignants</p>
                  <p className="text-laha-text/70 text-sm mb-4">{error}</p>
                  <Button onClick={retry} variant="outline">
                    Réessayer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AdminSidebar>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="admin">
      <AdminSidebar>
        <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="w-full px-6 py-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-laha-gold mb-2">Gestion des Enseignants</h1>
              <p className="text-laha-text">Gérez tous les enseignants inscrits sur la plateforme LAHA Academia.</p>
            </div>

            {/* Teacher Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-laha-text">Total Enseignants</CardTitle>
                  <UsersIcon className="h-4 w-4 text-laha-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laha-text">{total}</div>
                </CardContent>
              </Card>
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-laha-text">Vérifiés</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laha-text">{teachersByStatus.verified.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-laha-text">En Attente</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laha-text">{teachersByStatus.pending.length}</div>
                </CardContent>
              </Card>
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-laha-text">Note Moyenne</CardTitle>
                  <Star className="h-4 w-4 text-laha-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-laha-text">
                    {teachers.length > 0 ? (teachers.reduce((sum, t) => sum + t.rating, 0) / teachers.length).toFixed(1) : '0.0'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="mb-8 bg-laha-surface/50 border-laha-border">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <Input
                    placeholder="Rechercher un enseignant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-laha-background border-laha-border text-laha-text"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px] bg-laha-background border-laha-border text-laha-text">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="verified">Vérifiés</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-[180px] bg-laha-background border-laha-border text-laha-text">
                      <SelectValue placeholder="Filtrer par pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les pays</SelectItem>
                      {getUniqueCountries().map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-[180px] bg-laha-background border-laha-border text-laha-text">
                      <SelectValue placeholder="Filtrer par matière" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les matières</SelectItem>
                      {getUniqueSubjects().map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="bg-laha-background border-laha-border text-laha-text hover:bg-laha-surface">
                    <Download className="h-4 w-4 mr-2" /> Exporter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teacher List */}
            <Card className="bg-laha-surface/50 border-laha-border">
              <CardHeader>
                <CardTitle className="text-laha-text">Enseignants ({filteredTeachers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTeachers.length === 0 ? (
                  <div className="text-center py-8 text-laha-text-secondary">
                    <UsersIcon className="h-12 w-12 mx-auto mb-4 text-laha-gold" />
                    <p>Aucun enseignant trouvé avec les filtres actuels.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTeachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center justify-between p-4 border border-laha-border rounded-lg bg-laha-background">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={teacher.avatar || undefined} />
                            <AvatarFallback className="bg-laha-gold text-white font-bold">
                              {teacher.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-laha-text">{teacher.name}</h3>
                              {teacher.is_verified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-laha-text-secondary mb-2">{teacher.bio}</p>
                            <div className="flex items-center gap-4 text-sm text-laha-text-secondary">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {teacher.location}, {teacher.country}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                {teacher.rating}/5 ({teacher.students_count} étudiants)
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {teacher.experience} ans d'expérience
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {teacher.subjects.slice(0, 3).map(subject => (
                                <Badge key={subject} variant="secondary" className="text-xs">
                                  {subject}
                                </Badge>
                              ))}
                              {teacher.subjects.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{teacher.subjects.length - 3} autres
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-laha-text">
                              {teacher.hourly_rate.toLocaleString()} FCFA/h
                            </div>
                            <div className="text-xs text-laha-text-secondary">
                              {teacher.languages.join(', ')}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('View', teacher.id)}>
                                <Eye className="mr-2 h-4 w-4" /> Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Edit', teacher.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Email', teacher.id)}>
                                <Mail className="mr-2 h-4 w-4" /> Envoyer un email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log('Validate', teacher.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Valider
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => console.log('Delete', teacher.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminSidebar>
    </AuthGuard>
  )
}


