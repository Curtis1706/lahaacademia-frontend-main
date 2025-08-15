"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  Globe,
  MapPin,
  GraduationCap,
  Users,
  BookMarked,
  Brain,
  Trophy,
  Target,
  Languages,
  Zap,
  BookOpen
} from "lucide-react"
import { BookCard } from "@/components/ui/book-card"
import { BooksGrid } from "@/components/ui/books-grid"
import { ResultsStats } from "@/components/ui/results-stats"
import { Pagination } from "@/components/ui/pagination"
import { SearchFilters } from "@/components/ui/search-filters"
import { PageHeader } from "@/components/ui/page-header"
import { PageFooter } from "@/components/ui/page-footer"
import { HeroSection } from "@/components/ui/hero-section"

export default function NosOuvragesPage() {
  const [selectedCountry, setSelectedCountry] = useState("tous")
  const [selectedLevel, setSelectedLevel] = useState("tous")
  const [selectedSeries, setSelectedSeries] = useState("tous")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const countries = [
    { code: "tous", name: "Tous les pays", icon: <Globe className="h-4 w-4" /> },
    { code: "benin", name: "Bénin", icon: <MapPin className="h-4 w-4" /> },
    { code: "togo", name: "Togo", icon: <MapPin className="h-4 w-4" /> },
    { code: "cote-ivoire", name: "Côte d'Ivoire", icon: <MapPin className="h-4 w-4" /> },
    { code: "senegal", name: "Sénégal", icon: <MapPin className="h-4 w-4" /> },
    { code: "mali", name: "Mali", icon: <MapPin className="h-4 w-4" /> },
    { code: "burkina-faso", name: "Burkina Faso", icon: <MapPin className="h-4 w-4" /> },
    { code: "niger", name: "Niger", icon: <MapPin className="h-4 w-4" /> },
    { code: "chad", name: "Tchad", icon: <MapPin className="h-4 w-4" /> },
    { code: "cameroun", name: "Cameroun", icon: <MapPin className="h-4 w-4" /> },
    { code: "gabon", name: "Gabon", icon: <MapPin className="h-4 w-4" /> },
    { code: "congo", name: "Congo", icon: <MapPin className="h-4 w-4" /> },
    { code: "rca", name: "République Centrafricaine", icon: <MapPin className="h-4 w-4" /> },
    { code: "guinee", name: "Guinée", icon: <MapPin className="h-4 w-4" /> },
    { code: "guinee-bissau", name: "Guinée-Bissau", icon: <MapPin className="h-4 w-4" /> }
  ]

  const levels = [
    { code: "tous", name: "Tous les niveaux", icon: <GraduationCap className="h-4 w-4" /> },
    { code: "primaire", name: "Primaire", icon: <BookOpen className="h-4 w-4" /> },
    { code: "secondaire", name: "Secondaire", icon: <GraduationCap className="h-4 w-4" /> },
    { code: "superieur", name: "Supérieur", icon: <Users className="h-4 w-4" /> }
  ]

  const series = [
    { code: "tous", name: "Toutes les séries", icon: <BookOpen className="h-4 w-4" /> },
    { code: "J'apprends en SVT", name: "J'apprends en SVT", icon: <BookMarked className="h-4 w-4" /> },
    { code: "Étude de la philosophie", name: "Étude de la philosophie", icon: <Brain className="h-4 w-4" /> },
    { code: "Réussir en", name: "Réussir en", icon: <Trophy className="h-4 w-4" /> },
    { code: "Préparation aux examens", name: "Préparation aux examens", icon: <Target className="h-4 w-4" /> },
    { code: "Communication écrite", name: "Communication écrite", icon: <Languages className="h-4 w-4" /> },
    { code: "Sports traditionnels", name: "Sports traditionnels", icon: <Zap className="h-4 w-4" /> }
  ]

  // Vrais livres disponibles dans la collection LAHA
  const books = [
    {
      id: 1,
      title: "J'apprends en SVT 3ème",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 3eme.png",
      description: "Manuel de SVT pour la 3ème année du collège, conforme au programme officiel béninois. Couvre la biologie, la géologie et l'écologie.",
      rating: 4.8,
      downloads: 1250,
      views: 8900,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 2,
      title: "J'apprends en SVT 2nde CD",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 2nd CD.png",
      description: "Manuel de SVT pour la 2nde année du lycée, série CD (Sciences). Programme approfondi en biologie et géologie.",
      rating: 4.7,
      downloads: 1100,
      views: 8200,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 3,
      title: "J'apprends en SVT 2nde AB",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 2nd AB.png",
      description: "Manuel de SVT pour la 2nde année du lycée, série AB (Lettres). Approche adaptée aux élèves de lettres.",
      rating: 4.6,
      downloads: 980,
      views: 7500,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 4,
      title: "J'apprends en SVT 1ère CD",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 1ere CD.png",
      description: "Manuel de SVT pour la 1ère année du lycée, série CD (Sciences). Préparation au baccalauréat scientifique.",
      rating: 4.9,
      downloads: 1350,
      views: 9200,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 5,
      title: "J'apprends en SVT 1ère AB",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 1ere AB.png",
      description: "Manuel de SVT pour la 1ère année du lycée, série AB (Lettres). Programme adapté aux élèves de lettres.",
      rating: 4.5,
      downloads: 850,
      views: 6800,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 6,
      title: "Étude de la philosophie Terminale",
      subject: "Philosophie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Etude de la philosophie Tle.png",
      description: "Manuel de philosophie pour la terminale. Introduction aux grands courants philosophiques et préparation au baccalauréat.",
      rating: 4.8,
      downloads: 1200,
      views: 8800,
      isNew: true,
      series: "Étude de la philosophie"
    },
    {
      id: 7,
      title: "Étude de la philosophie 2nde",
      subject: "Philosophie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Etude de la philosophie 2nde.png",
      description: "Initiation à la philosophie pour la 2nde année du lycée. Premiers concepts et auteurs philosophiques.",
      rating: 4.6,
      downloads: 950,
      views: 7200,
      isNew: false,
      series: "Étude de la philosophie"
    },
    {
      id: 8,
      title: "Étude de la philosophie 1ère",
      subject: "Philosophie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Etude de la philosophie 1ere.png",
      description: "Manuel de philosophie pour la 1ère année du lycée. Approfondissement des concepts philosophiques.",
      rating: 4.7,
      downloads: 1100,
      views: 8100,
      isNew: false,
      series: "Étude de la philosophie"
    },
    {
      id: 9,
      title: "La lutte à l'école - EPS",
      subject: "Éducation Physique et Sportive",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/La lutte à l'écolde EPS.png",
      description: "Manuel d'EPS spécialisé dans la lutte traditionnelle africaine. Techniques, règles et valeurs de ce sport.",
      rating: 4.4,
      downloads: 720,
      views: 5900,
      isNew: false,
      series: "Sports traditionnels"
    },
    {
      id: 10,
      title: "BEPC - Guide de préparation",
      subject: "Préparation aux examens",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/BEPC.png",
      description: "Guide complet de préparation au BEPC (Brevet d'Études du Premier Cycle). Exercices et conseils méthodologiques.",
      rating: 4.9,
      downloads: 1500,
      views: 9800,
      isNew: true,
      series: "Préparation aux examens"
    },
    {
      id: 11,
      title: "Réussir en Histoire-Géographie 3ème",
      subject: "Histoire-Géographie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Reussir en histoire geographie 3eme.png",
      description: "Manuel d'histoire-géographie pour la 3ème année. Méthodes et contenus pour réussir au collège.",
      rating: 4.7,
      downloads: 1150,
      views: 8500,
      isNew: false,
      series: "Réussir en"
    },
    {
      id: 12,
      title: "Réussir en SVT",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Reussir en SVT.png",
      description: "Guide méthodologique pour réussir en SVT. Techniques d'apprentissage et exercices pratiques.",
      rating: 4.6,
      downloads: 980,
      views: 7300,
      isNew: false,
      series: "Réussir en"
    },
    {
      id: 13,
      title: "Réussir en Mathématiques CP",
      subject: "Mathématiques",
      level: "primaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Reussir en mathematiques CP.png",
      description: "Manuel de mathématiques pour le CP (Cours Préparatoire). Initiation aux nombres et calculs de base.",
      rating: 4.8,
      downloads: 1300,
      views: 8900,
      isNew: true,
      series: "Réussir en"
    },
    {
      id: 14,
      title: "Communication écrite 4ème-3ème BEPC",
      subject: "Français",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Communication ecrite 4eme 3eme BEPC.png",
      description: "Manuel de français pour la communication écrite en 4ème et 3ème. Préparation au BEPC et amélioration de l'expression écrite.",
      rating: 4.7,
      downloads: 1200,
      views: 8600,
      isNew: false,
      series: "Communication écrite"
    }
  ]

  const filteredBooks = books.filter(book => {
    const matchesCountry = selectedCountry === "tous" || book.country === selectedCountry
    const matchesLevel = selectedLevel === "tous" || book.level === selectedLevel
    const matchesSeries = selectedSeries === "tous" || book.series === selectedSeries
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCountry && matchesLevel && matchesSeries && matchesSearch
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCountry, selectedLevel, selectedSeries, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark ">
      {/* Header */}
      <PageHeader currentPage="nos-ouvrages" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 justify-center">
                 {/* Hero Section */}
         <HeroSection
           title="                           Nos Ouvrages"
           description="Découvrez notre collection de manuels scolaires LAHA, spécialisée dans les SVT, la philosophie, les mathématiques et la préparation aux examens. Des ressources pédagogiques de qualité, conformes aux programmes officiels béninois."
         />

                 {/* Search and Filters */}
         <SearchFilters
           searchQuery={searchQuery}
           setSearchQuery={setSearchQuery}
           selectedCountry={selectedCountry}
           setSelectedCountry={setSelectedCountry}
           selectedLevel={selectedLevel}
           setSelectedLevel={setSelectedLevel}
           selectedSeries={selectedSeries}
           setSelectedSeries={setSelectedSeries}
           showFilters={showFilters}
           setShowFilters={setShowFilters}
           countries={countries}
           levels={levels}
           series={series}
         />

                          {/* Results Stats */}
         <ResultsStats
           count={filteredBooks.length}
           selectedCountry={selectedCountry}
           selectedLevel={selectedLevel}
           selectedSeries={selectedSeries}
           countries={countries}
           levels={levels}
           series={series}
         />

         {/* Books Grid */}
         <BooksGrid books={paginatedBooks} />

        

        {/* Pagination */}
        {filteredBooks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  )
}
