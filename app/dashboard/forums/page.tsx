"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Plus,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import logger from "@/lib/logger"

interface Forum {
  id: string
  name: string
  description: string
  category: string
  level?: string
  country?: string
  subject?: string
  posts_count: number
  members_count: number
  last_activity: string
  is_moderated: boolean
}

const CATEGORIES = [
  { value: "general", label: "Général" },
  { value: "homework_help", label: "Aide aux devoirs" },
  { value: "exam_prep", label: "Préparation examens" },
  { value: "study_groups", label: "Groupes d'étude" },
  { value: "career_guidance", label: "Orientation" },
]

export default function ForumsPage() {
  return (
    <AuthGuard>
      <ForumsContent />
    </AuthGuard>
  )
}

function ForumsContent() {
  const [forums, setForums] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  useEffect(() => {
    fetchForums()
  }, [selectedCategory, selectedLevel])

  const fetchForums = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedLevel && selectedLevel !== "all") {
        params.append("level", selectedLevel)
      }

      const response = await fetch(`/api/forums?${params.toString()}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setForums(data.results || [])
      }
    } catch (error) {
      logger.error("Error fetching forums", error as Error, { context: "ForumsPage" })
    } finally {
      setLoading(false)
    }
  }

  const filteredForums = forums.filter((forum) =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laha-gold mb-2">Forums de discussion</h1>
          <p className="text-laha-text-secondary">
            Échangez avec des élèves de votre niveau et de votre pays
          </p>
        </div>

        {/* Alerte de modération */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Forums sécurisés et modérés
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Tous les messages sont filtrés automatiquement. Les contenus inappropriés
                  (numéros de téléphone, emails, liens externes) sont bloqués pour votre sécurité.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                  <Input
                    placeholder="Rechercher un forum..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="primary">Primaire</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-laha-gold/10 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-laha-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">
                    {forums.reduce((sum, f) => sum + f.posts_count, 0)}
                  </p>
                  <p className="text-sm text-laha-text-secondary">Posts totaux</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">
                    {forums.reduce((sum, f) => sum + f.members_count, 0)}
                  </p>
                  <p className="text-sm text-laha-text-secondary">Membres actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">{forums.length}</p>
                  <p className="text-sm text-laha-text-secondary">Forums disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des forums */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
          </div>
        ) : filteredForums.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-laha-text-secondary">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun forum trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredForums.map((forum) => (
              <Card key={forum.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/dashboard/forums/${forum.id}`}
                          className="text-xl font-semibold text-laha-text hover:text-laha-gold transition-colors"
                        >
                          {forum.name}
                        </Link>
                        {forum.is_moderated && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                            <Shield className="h-3 w-3 mr-1" />
                            Modéré
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-laha-text-secondary mb-3">
                        {forum.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-laha-text-secondary">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{forum.posts_count} posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{forum.members_count} membres</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Dernière activité:{" "}
                            {new Date(forum.last_activity).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {forum.category && (
                          <Badge variant="outline">
                            {CATEGORIES.find((c) => c.value === forum.category)?.label}
                          </Badge>
                        )}
                        {forum.level && (
                          <Badge variant="outline">
                            {forum.level === "primary" ? "Primaire" : "Secondaire"}
                          </Badge>
                        )}
                        {forum.subject && (
                          <Badge variant="outline">{forum.subject}</Badge>
                        )}
                        {forum.country && (
                          <Badge variant="outline">{forum.country}</Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/forums/${forum.id}`}>
                      <Button className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black">
                        Accéder
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


