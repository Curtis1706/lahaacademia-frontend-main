"use client"

import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  selectedLevel: string
  setSelectedLevel: (level: string) => void
  selectedSeries: string
  setSelectedSeries: (serie: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  countries: Array<{ code: string; name: string; icon: React.ReactNode }>
  levels: Array<{ code: string; name: string; icon: React.ReactNode }>
  series: Array<{ code: string; name: string; icon: React.ReactNode }>
}

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  selectedLevel,
  setSelectedLevel,
  selectedSeries,
  setSelectedSeries,
  showFilters,
  setShowFilters,
  countries,
  levels,
  series
}: SearchFiltersProps) {
  const resetFilters = () => {
    setSelectedCountry("tous")
    setSelectedLevel("tous")
    setSelectedSeries("tous")
    setSearchQuery("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-laha-surface/50 rounded-2xl p-6 mb-8 border border-laha-border"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-laha-text-secondary h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un livre, une matière ou un niveau..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-laha-surface border border-laha-border rounded-xl text-laha-text placeholder-laha-text-secondary focus:outline-none focus:border-laha-gold focus:ring-2 focus:ring-laha-gold/20 transition-all"
          />
        </div>

        {/* Country Filter */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="appearance-none bg-laha-surface border border-laha-border rounded-xl px-4 py-3 pr-10 text-laha-text focus:outline-none focus:border-laha-gold focus:ring-2 focus:ring-laha-gold/20 transition-all min-w-[200px]"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.icon} {country.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-laha-text-secondary h-5 w-5 pointer-events-none" />
        </div>

        {/* Level Filter */}
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="appearance-none bg-laha-surface border border-laha-border rounded-xl px-4 py-3 pr-10 text-laha-text focus:outline-none focus:border-laha-gold focus:ring-2 focus:ring-laha-gold/20 transition-all min-w-[200px]"
          >
            {levels.map((level) => (
              <option key={level.code} value={level.code}>
                {level.icon} {level.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-laha-text-secondary h-5 w-5 pointer-events-none" />
        </div>

        {/* Series Filter */}
        <div className="relative">
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="appearance-none bg-laha-surface border border-laha-border rounded-xl px-4 py-3 pr-10 text-laha-text focus:outline-none focus:border-laha-gold focus:ring-2 focus:ring-laha-gold/20 transition-all min-w-[200px]"
          >
            {series.map((serie) => (
              <option key={serie.code} value={serie.code}>
                {serie.icon} {serie.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-laha-text-secondary h-5 w-5 pointer-events-none" />
        </div>
      </div>

      {/* Advanced Filters Toggle and Reset */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-laha-gold hover:text-laha-gold-warm transition-colors"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Masquer les filtres" : "Filtres avancés"}
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-laha-text-secondary hover:text-laha-gold transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Réinitialiser
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-laha-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-laha-text-secondary mb-2">Matière</label>
              <select className="w-full bg-laha-surface border border-laha-border rounded-lg px-3 py-2 text-laha-text focus:outline-none focus:border-laha-gold">
                <option value="">Toutes les matières</option>
                <option value="mathematiques">Mathématiques</option>
                <option value="francais">Français</option>
                <option value="sciences">Sciences</option>
                <option value="histoire">Histoire-Géographie</option>
                <option value="anglais">Anglais</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-laha-text-secondary mb-2">Année</label>
              <select className="w-full bg-laha-surface border border-laha-border rounded-lg px-3 py-2 text-laha-text focus:outline-none focus:border-laha-gold">
                <option value="">Toutes les années</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-laha-text-secondary mb-2">Tri</label>
              <select className="w-full bg-laha-surface border border-laha-border rounded-lg px-3 py-2 text-laha-text focus:outline-none focus:border-laha-gold">
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="rating">Meilleures notes</option>
                <option value="downloads">Plus téléchargés</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
