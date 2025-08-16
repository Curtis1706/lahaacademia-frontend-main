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
import { PageFooter } from "@/components/ui/page-footer"
import { HeroSection } from "@/components/ui/hero-section"
import { GlassIcon } from "@/components/ui/glass-icon"
import Navigation from "@/components/Navigation"

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
      rating: 4.9,
      downloads: 980,
      views: 7200,
      isNew: true,
      series: "J'apprends en SVT"
    },
    {
      id: 3,
      title: "Étude de la philosophie - Terminale",
      subject: "Philosophie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Etude de la philosophie Tle.png",
      description: "Manuel de philosophie pour la Terminale, couvrant tous les champs philosophiques au programme : l'homme, la société, la connaissance, la morale.",
      rating: 4.7,
      downloads: 1100,
      views: 6500,
      isNew: false,
      series: "Étude de la philosophie"
    },
    {
      id: 4,
      title: "Réussir en Mathématiques CP",
      subject: "Mathématiques",
      level: "primaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Reussir en mathematiques CP.png",
      description: "Manuel de mathématiques pour le CP (Cours Préparatoire), avec exercices progressifs et méthodes de résolution.",
      rating: 4.6,
      downloads: 1350,
      views: 8100,
      isNew: false,
      series: "Réussir en"
    },
    {
      id: 5,
      title: "Préparation BEPC",
      subject: "Général",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/BEPC.png",
      description: "Guide de préparation au BEPC (Brevet d'Études du Premier Cycle), avec sujets corrigés et conseils méthodologiques.",
      rating: 4.8,
      downloads: 2100,
      views: 12500,
      isNew: true,
      series: "Préparation aux examens"
    },
    {
      id: 6,
      title: "Communication écrite - 4ème, 3ème, BEPC",
      subject: "Français",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Communication ecrite 4eme 3eme BEPC.png",
      description: "Manuel de français axé sur la communication écrite, l'expression et la rédaction pour la 4ème, 3ème et BEPC.",
      rating: 4.5,
      downloads: 890,
      views: 5400,
      isNew: false,
      series: "Communication écrite"
    },
    {
      id: 7,
      title: "La lutte à l'école - EPS",
      subject: "Éducation Physique et Sportive",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/La lutte à l'écolde EPS.png",
      description: "Manuel d'EPS sur la lutte traditionnelle africaine, adaptée au contexte scolaire et aux programmes officiels.",
      rating: 4.4,
      downloads: 650,
      views: 3800,
      isNew: false,
      series: "Sports traditionnels"
    },
    {
      id: 8,
      title: "Réussir en SVT",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Reussir en SVT.png",
      description: "Manuel de SVT pour la réussite scolaire, avec exercices progressifs et méthodes de résolution adaptées aux examens.",
      rating: 4.7,
      downloads: 1150,
      views: 7200,
      isNew: false,
      series: "Réussir en"
    },
    {
      id: 9,
      title: "J'apprends en SVT 2nde AB",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 2nd AB.png",
      description: "Manuel de SVT pour la 2nde année du lycée, série AB (Lettres). Programme adapté aux filières littéraires.",
      rating: 4.6,
      downloads: 920,
      views: 6800,
      isNew: false,
      series: "J'apprends en SVT"
    },
    {
      id: 10,
      title: "J'apprends en SVT 1ère CD",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 1ere CD.png",
      description: "Manuel de SVT pour la 1ère année du lycée, série CD (Sciences). Programme approfondi en biologie et géologie.",
      rating: 4.7,
      downloads: 1050,
      views: 7500,
      isNew: false,
      series: "J'apprends en SVT"
    },
    {
      id: 11,
      title: "J'apprends en SVT 1ère AB",
      subject: "SVT (Sciences de la Vie et de la Terre)",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/J'apprends en SVT 1ere AB.png",
      description: "Manuel de SVT pour la 1ère année du lycée, série AB (Lettres). Programme adapté aux filières littéraires.",
      rating: 4.5,
      downloads: 980,
      views: 7200,
      isNew: false,
      series: "J'apprends en SVT"
    },
    {
      id: 12,
      title: "Étude de la philosophie - 2nde",
      subject: "Philosophie",
      level: "secondaire",
      country: "benin",
      countryName: "Bénin",
      year: "2024",
      cover: "/Livres-LAHA/Etude de la philosophie 2nde.png",
      description: "Manuel de philosophie pour la 2nde, introduction aux concepts philosophiques fondamentaux.",
      rating: 4.4,
      downloads: 850,
      views: 6200,
      isNew: false,
      series: "Étude de la philosophie"
    }
  ]

  // Filtrage des livres
  const filteredBooks = books.filter(book => {
    const matchesCountry = selectedCountry === "tous" || book.country === selectedCountry
    const matchesLevel = selectedLevel === "tous" || book.level === selectedLevel
    const matchesSeries = selectedSeries === "tous" || book.series === selectedSeries
    const matchesSearch = searchQuery === "" || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCountry && matchesLevel && matchesSeries && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCountry, selectedLevel, selectedSeries, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface to-laha-gold-light-new">
      <Navigation currentPage="/nos-ouvrages" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection
          title="               Nos Ouvrages"
          description="Découvrez notre collection de manuels scolaires LAHA, spécialisée dans les SVT, la philosophie, les mathématiques et la préparation aux examens. Des ressources pédagogiques de qualité, conformes aux programmes officiels béninois."
        />
        
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

        <ResultsStats
          count={filteredBooks.length}
          selectedCountry={selectedCountry}
          selectedLevel={selectedLevel}
          selectedSeries={selectedSeries}
          countries={countries}
          levels={levels}
          series={series}
        />

        <BooksGrid books={paginatedBooks} />

        {filteredBooks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.png"
                alt="LAHA Editions"
                width={32}
                height={32}
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="font-heading text-lg sm:text-xl font-bold text-laha-text">Lahacademia</span>
            </div>

            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <GlassIcon
                icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Cours"
                variant="blue"
                size="sm"
              />
              <GlassIcon
                icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Communauté"
                variant="orange"
                size="sm"
              />
              <GlassIcon
                icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Ressources"
                variant="pink"
                size="sm"
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-laha-text font-semibold text-base mb-4">Plateforme</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Cours
                  </Link>
                </li>
                <li>
                  <Link href="/teachers" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Enseignants
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/mobile" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    App Mobile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-laha-text font-semibold text-base mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Statut
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-laha-text font-semibold text-base mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Presse
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Partenaires
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-laha-text font-semibold text-base mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                    Licences
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-laha-text-secondary text-sm leading-relaxed">
              © 2024 LAHA Editions. Tous droits réservés. Révolutionner l'éducation en Afrique francophone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
