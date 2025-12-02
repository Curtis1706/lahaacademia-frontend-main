"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { 
  Plus,
  Brain,
  Library,
  BookOpen, 
  HelpCircle,
  Video,
  FileText,
  Settings,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContentStats } from "@/hooks/use-content-stats"

export default function AdminContentPage() {
  const router = useRouter()
  const { courses, qcms, books, videos, documents, loading, error } = useContentStats()

  const contentModules = [
    {
      title: "Cours",
      description: "Créer et gérer les cours structurés avec éditeur riche",
      href: "/dashboard/admin/content/courses",
      icon: BookOpen,
      color: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20",
      stats: loading ? "..." : `${courses} cours`,
      count: courses
    },
    {
      title: "QCM",
      description: "Créer des questionnaires à choix multiples interactifs",
      href: "/dashboard/admin/content/qcm",
      icon: HelpCircle,
      color: "bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
      stats: loading ? "..." : `${qcms} QCM`,
      count: qcms
    },
    {
      title: "Livres",
      description: "Gérer la bibliothèque numérique et les ressources",
      href: "/dashboard/admin/content/books",
      icon: Library,
      color: "bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20",
      stats: loading ? "..." : `${books} livres`,
      count: books
    },
    {
      title: "Vidéos",
      description: "Organiser les contenus vidéo éducatifs",
      href: "/dashboard/admin/content/videos",
      icon: Video,
      color: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
      stats: loading ? "..." : `${videos} vidéos`,
      count: videos
    },
    {
      title: "Documents",
      description: "Gérer les fiches, exercices et documents pratiques",
      href: "/dashboard/admin/content/documents",
      icon: FileText,
      color: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20",
      stats: loading ? "..." : `${documents} documents`,
      count: documents
    },
    {
      title: "Paramètres",
      description: "Configurer matières, classes et auteurs",
      href: "/dashboard/admin/content/settings",
      icon: Settings,
      color: "bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20",
      stats: "Configuration",
      count: null
    }
  ]

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin']}>
      <AdminSidebar>
        <main className="flex-1 w-full overflow-auto">
          <div className="w-full px-6 py-6">
              {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-laha-gold mb-2">
                    Contenus Pédagogiques
                  </h1>
                  <p className="text-laha-text-secondary">
                    Gérez tous vos contenus éducatifs depuis cette interface centralisée
                  </p>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentModules.map((module, index) => (
                <Card key={index} className={`${module.color} transition-all duration-200 hover:scale-105`}>
                      <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-lg bg-white/10">
                        <module.icon className="h-6 w-6 text-white" />
                          </div>
                      <div className="flex items-center gap-2">
                        {module.count !== null && (
                          <Badge 
                            variant={module.count > 0 ? "default" : "secondary"}
                            className={module.count > 0 ? "bg-laha-gold text-laha-black" : "bg-white/20 text-white"}
                          >
                            {module.count}
                          </Badge>
                        )}
                        <span className="text-sm text-white/70">{module.stats}</span>
                          </div>
                        </div>
                    <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                    <p className="text-white/80 text-sm mb-4">{module.description}</p>
                    <Button 
                      asChild
                      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    >
                      <Link href={module.href}>
                        Accéder
                      </Link>
                    </Button>
                      </CardContent>
                    </Card>
                ))}
              </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <Card className="bg-laha-surface/50 border-laha-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-laha-text">Actions Rapides</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-laha-border text-laha-text hover:bg-laha-surface"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualiser
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                      <Link href="/dashboard/admin/content/courses/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Cours
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                      <Link href="/dashboard/admin/content/qcm/create">
                        <Brain className="h-4 w-4 mr-2" />
                        Nouveau QCM
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                      <Link href="/dashboard/admin/content/books/create">
                        <Library className="h-4 w-4 mr-2" />
                        Ajouter un Livre
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Statistiques rapides */}
                  <div className="mt-6 pt-6 border-t border-laha-border">
                    <h4 className="text-laha-text font-medium mb-3">Statistiques globales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-laha-gold">{courses}</div>
                      <div className="text-sm text-laha-text-secondary">Cours</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-laha-gold">{qcms}</div>
                      <div className="text-sm text-laha-text-secondary">QCM</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-laha-gold">{books}</div>
                      <div className="text-sm text-laha-text-secondary">Livres</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-laha-gold">{videos}</div>
                      <div className="text-sm text-laha-text-secondary">Vidéos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-laha-gold">{documents}</div>
                      <div className="text-sm text-laha-text-secondary">Documents</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
                  </div>
            </div>
          </main>
      </AdminSidebar>
    </AuthGuard>
  )
}