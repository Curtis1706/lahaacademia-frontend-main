"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Play, BookOpen, Clock, Star, Users } from "lucide-react"
import BlurText from "@/components/ui/blur-text"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Tous les cours" },
    { id: "math", name: "Mathématiques" },
    { id: "physics", name: "Physique" },
    { id: "french", name: "Français" },
    { id: "history", name: "Histoire" },
    { id: "chemistry", name: "Chimie" },
  ]

  const courses = [
    {
      id: 1,
      title: "Mathématiques - Terminale S",
      description: "Cours complet de mathématiques pour la classe de Terminale S",
      instructor: "Dr. Aminata Diallo",
      category: "math",
      level: "Terminale",
      duration: "45h",
      students: 156,
      rating: 4.9,
      progress: 75,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Math",
      price: "Gratuit",
      status: "enrolled",
    },
    {
      id: 2,
      title: "Physique - Première S",
      description: "Découvrez les lois fondamentales de la physique",
      instructor: "Prof. Jean-Baptiste Kouame",
      category: "physics",
      level: "Première",
      duration: "38h",
      students: 124,
      rating: 4.7,
      progress: 60,
      thumbnail: "/placeholder.svg?height=200&width=300&text=Physics",
      price: "5,000 FCFA",
      status: "enrolled",
    },
    {
      id: 3,
      title: "Français - Seconde",
      description: "Maîtrisez la langue française et la littérature",
      instructor: "Dr. Fatou Ndiaye",
      category: "french",
      level: "Seconde",
      duration: "32h",
      students: 89,
      rating: 4.8,
      progress: 0,
      thumbnail: "/placeholder.svg?height=200&width=300&text=French",
      price: "3,000 FCFA",
      status: "available",
    },
    {
      id: 4,
      title: "Histoire de l'Afrique",
      description: "Explorez l'histoire riche du continent africain",
      instructor: "Prof. Kwame Asante",
      category: "history",
      level: "Première",
      duration: "28h",
      students: 67,
      rating: 4.6,
      progress: 0,
      thumbnail: "/placeholder.svg?height=200&width=300&text=History",
      price: "4,000 FCFA",
      status: "available",
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
              <BlurText
                text="Mes Cours"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-heading text-2xl font-bold text-white"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-white/30 transition-colors">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

                <div className="relative z-10">
                  {/* Course Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === "enrolled"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {course.status === "enrolled" ? "Inscrit" : "Disponible"}
                      </span>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 text-sm font-medium">{course.level}</span>
                      <span className="text-orange-400 text-sm font-medium">{course.price}</span>
                    </div>

                    <h3 className="text-white font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        {course.rating}
                      </span>
                    </div>

                    <p className="text-white/80 text-sm mb-4">Par {course.instructor}</p>

                    {/* Progress Bar (if enrolled) */}
                    {course.status === "enrolled" && course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-white/70 text-sm">Progression</span>
                          <span className="text-blue-400 text-sm">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        course.status === "enrolled"
                          ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white hover:from-blue-600 hover:to-orange-600"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {course.status === "enrolled" ? "Continuer le cours" : "S'inscrire"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Aucun cours trouvé</h3>
            <p className="text-white/70">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
