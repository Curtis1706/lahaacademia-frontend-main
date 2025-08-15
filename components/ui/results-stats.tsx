"use client"

import { motion } from "framer-motion"
import { BookOpen, Filter, Search } from "lucide-react"

interface ResultsStatsProps {
  count: number
  selectedCountry: string
  selectedLevel: string
  selectedSeries: string
  countries: Array<{ code: string; name: string }>
  levels: Array<{ code: string; name: string }>
  series: Array<{ code: string; name: string }>
}

export function ResultsStats({
  count,
  selectedCountry,
  selectedLevel,
  selectedSeries,
  countries,
  levels,
  series
}: ResultsStatsProps) {
  const hasActiveFilters = selectedCountry !== "tous" || selectedLevel !== "tous" || selectedSeries !== "tous"
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-laha-black/30 rounded-xl border border-laha-gold-dark/20">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-laha-gold" />
          <span className="text-gray-300 font-medium">
            {count} ouvrage{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
          </span>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Filtres actifs :</span>
            
            {selectedCountry !== "tous" && (
              <span className="px-2 py-1 bg-laha-gold/20 text-laha-gold rounded-md text-xs">
                {countries.find(c => c.code === selectedCountry)?.name}
              </span>
            )}
            
            {selectedLevel !== "tous" && (
              <span className="px-2 py-1 bg-laha-gold/20 text-laha-gold rounded-md text-xs">
                {levels.find(l => l.code === selectedLevel)?.name}
              </span>
            )}
            
            {selectedSeries !== "tous" && (
              <span className="px-2 py-1 bg-laha-gold/20 text-laha-gold rounded-md text-xs">
                {series.find(s => s.code === selectedSeries)?.name}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
