"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { 
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Shield,
  GraduationCap,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Upload
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminUsersPage() {
  const { users, total, isLoading, error, retry } = useAdminUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && user.is_active) ||
      (selectedStatus === "inactive" && !user.is_active)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Grouper les utilisateurs par rôle
  const usersByRole = {
    all: filteredUsers,
    student: filteredUsers.filter(u => u.role === 'student'),
    teacher: filteredUsers.filter(u => u.role === 'teacher'),
    parent: filteredUsers.filter(u => u.role === 'parent'),
    admin: filteredUsers.filter(u => u.role === 'admin')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />
      case 'teacher': return <User className="h-4 w-4" />
      case 'parent': return <Users className="h-4 w-4" />
      case 'admin': return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'teacher': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'parent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
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
                  <p className="text-laha-text">Chargement des utilisateurs...</p>
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
              <h1 className="text-3xl font-bold text-laha-gold mb-2">Gestion des Utilisateurs</h1>
              <p className="text-laha-text">Gérez tous les utilisateurs de la plateforme</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Utilisateurs</p>
                      <p className="text-2xl font-bold">{total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Étudiants</p>
                      <p className="text-2xl font-bold">{usersByRole.student.length}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Enseignants</p>
                      <p className="text-2xl font-bold">{usersByRole.teacher.length}</p>
                    </div>
                    <User className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Parents</p>
                      <p className="text-2xl font-bold">{usersByRole.parent.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtres et Recherche */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par nom, email ou username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        <SelectItem value="student">Étudiants</SelectItem>
                        <SelectItem value="teacher">Enseignants</SelectItem>
                        <SelectItem value="parent">Parents</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="inactive">Inactifs</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des Utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Utilisateurs ({filteredUsers.length})</span>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profile.avatar || undefined} />
                          <AvatarFallback>
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {user.first_name} {user.last_name}
                            </h3>
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleIcon(user.role)}
                              <span className="ml-1 capitalize">{user.role}</span>
                            </Badge>
                            {user.is_active ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Actif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactif
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                            {user.profile.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {user.profile.location}, {user.profile.country}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Inscrit le {formatDate(user.date_joined)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.role === 'teacher' && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{user.profile.average_rating.toFixed(1)}</span>
                            <span className="text-gray-500">({user.profile.students_count} élèves)</span>
                          </div>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Envoyer un email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {user.is_active ? (
                                <>
                                  <UserX className="h-4 w-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Aucun utilisateur trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminSidebar>
    </AuthGuard>
  )
}
