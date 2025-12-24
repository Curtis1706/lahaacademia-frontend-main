"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export interface CourseFiltersData {
  subject: string
  country: string
  level: string
  language: string
  min_price: string
  max_price: string
  min_rating: string
  availability: string
  sort_by: string
  search: string
}

interface CourseFiltersProps {
  onFilterChange: (filters: CourseFiltersData) => void
  initialFilters?: Partial<CourseFiltersData>
}

export default function CourseFilters({ 
  onFilterChange, 
  initialFilters = {} 
}: CourseFiltersProps) {
  const [filters, setFilters] = useState<CourseFiltersData>({
    subject: initialFilters.subject || '',
    country: initialFilters.country || '',
    level: initialFilters.level || '',
    language: initialFilters.language || '',
    min_price: initialFilters.min_price || '',
    max_price: initialFilters.max_price || '',
    min_rating: initialFilters.min_rating || '',
    availability: initialFilters.availability || '',
    sort_by: initialFilters.sort_by || 'created_at',
    search: initialFilters.search || '',
  })

  const [isOpen, setIsOpen] = useState(false)

  const subjects = [
    { value: '', label: 'Toutes les matières' },
    { value: 'mathematics', label: 'Mathématiques' },
    { value: 'physics', label: 'Physique' },
    { value: 'chemistry', label: 'Chimie' },
    { value: 'french', label: 'Français' },
    { value: 'english', label: 'Anglais' },
    { value: 'history', label: 'Histoire' },
    { value: 'geography', label: 'Géographie' },
    { value: 'philosophy', label: 'Philosophie' },
    { value: 'svt', label: 'SVT' },
    { value: 'economics', label: 'Économie' },
    { value: 'computer_science', label: 'Informatique' },
  ]

  const levels = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'primaire', label: 'Primaire' },
    { value: 'college', label: 'Collège' },
    { value: 'lycee', label: 'Lycée' },
    { value: 'superieur', label: 'Supérieur' },
    { value: 'adult', label: 'Formation Adulte' },
  ]

  const countries = [
    { value: '', label: 'Tous les pays' },
    { value: 'CM', label: 'Cameroun' },
    { value: 'CI', label: 'Côte d\'Ivoire' },
    { value: 'SN', label: 'Sénégal' },
    { value: 'GA', label: 'Gabon' },
    { value: 'CD', label: 'RDC' },
    { value: 'MA', label: 'Maroc' },
    { value: 'TN', label: 'Tunisie' },
    { value: 'FR', label: 'France' },
  ]

  const languages = [
    { value: '', label: 'Toutes les langues' },
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'Anglais' },
    { value: 'ar', label: 'Arabe' },
  ]

  const sortOptions = [
    { value: 'created_at', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'popular', label: 'Plus populaires' },
  ]

  const handleFilterChange = (key: keyof CourseFiltersData, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    onFilterChange(filters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const emptyFilters: CourseFiltersData = {
      subject: '',
      country: '',
      level: '',
      language: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      availability: '',
      sort_by: 'created_at',
      search: '',
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      value && key !== 'sort_by' && key !== 'search'
    ).length
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours, une matière, un enseignant..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters()
              }
            }}
          />
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres
              {activeFiltersCount > 0 && (
                <Badge 
                  variant="default" 
                  className="ml-2 px-1.5 py-0.5 h-5 min-w-[20px] flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres avancés
                  </span>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Réinitialiser
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Matière */}
                  <div>
                    <Label htmlFor="subject">Matière</Label>
                    <Select
                      value={filters.subject}
                      onValueChange={(value) => handleFilterChange('subject', value)}
                    >
                      <SelectTrigger id="subject">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subj => (
                          <SelectItem key={subj.value} value={subj.value}>
                            {subj.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Niveau */}
                  <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select
                      value={filters.level}
                      onValueChange={(value) => handleFilterChange('level', value)}
                    >
                      <SelectTrigger id="level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(lvl => (
                          <SelectItem key={lvl.value} value={lvl.value}>
                            {lvl.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pays de l'enseignant */}
                  <div>
                    <Label htmlFor="country">Pays de l'enseignant</Label>
                    <Select
                      value={filters.country}
                      onValueChange={(value) => handleFilterChange('country', value)}
                    >
                      <SelectTrigger id="country">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Langue */}
                  <div>
                    <Label htmlFor="language">Langue d'enseignement</Label>
                    <Select
                      value={filters.language}
                      onValueChange={(value) => handleFilterChange('language', value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prix minimum */}
                  <div>
                    <Label htmlFor="min_price">Prix min (FCFA)</Label>
                    <Input
                      id="min_price"
                      type="number"
                      placeholder="0"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    />
                  </div>

                  {/* Prix maximum */}
                  <div>
                    <Label htmlFor="max_price">Prix max (FCFA)</Label>
                    <Input
                      id="max_price"
                      type="number"
                      placeholder="50000"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    />
                  </div>

                  {/* Note minimum */}
                  <div>
                    <Label htmlFor="min_rating">Note minimum</Label>
                    <Select
                      value={filters.min_rating}
                      onValueChange={(value) => handleFilterChange('min_rating', value)}
                    >
                      <SelectTrigger id="min_rating">
                        <SelectValue placeholder="Toutes les notes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les notes</SelectItem>
                        <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                        <SelectItem value="4.0">4.0+ ⭐</SelectItem>
                        <SelectItem value="3.5">3.5+ ⭐</SelectItem>
                        <SelectItem value="3.0">3.0+ ⭐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disponibilité */}
                  <div>
                    <Label htmlFor="availability">Disponibilité</Label>
                    <Select
                      value={filters.availability}
                      onValueChange={(value) => handleFilterChange('availability', value)}
                    >
                      <SelectTrigger id="availability">
                        <SelectValue placeholder="Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes</SelectItem>
                        <SelectItem value="weekdays">En semaine</SelectItem>
                        <SelectItem value="weekend">Week-end</SelectItem>
                        <SelectItem value="morning">Matin</SelectItem>
                        <SelectItem value="afternoon">Après-midi</SelectItem>
                        <SelectItem value="evening">Soir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tri */}
                  <div>
                    <Label htmlFor="sort_by">Trier par</Label>
                    <Select
                      value={filters.sort_by}
                      onValueChange={(value) => handleFilterChange('sort_by', value)}
                    >
                      <SelectTrigger id="sort_by">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={applyFilters} className="flex-1">
                    <Search className="h-4 w-4 mr-2" />
                    Appliquer les filtres
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Affichage des filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtres actifs :</span>
          {filters.subject && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {subjects.find(s => s.value === filters.subject)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('subject', '')}
              />
            </Badge>
          )}
          {filters.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {levels.find(l => l.value === filters.level)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('level', '')}
              />
            </Badge>
          )}
          {filters.country && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {countries.find(c => c.value === filters.country)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('country', '')}
              />
            </Badge>
          )}
          {filters.language && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {languages.find(l => l.value === filters.language)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('language', '')}
              />
            </Badge>
          )}
          {(filters.min_price || filters.max_price) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Prix: {filters.min_price || '0'} - {filters.max_price || '∞'} FCFA
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  handleFilterChange('min_price', '')
                  handleFilterChange('max_price', '')
                }}
              />
            </Badge>
          )}
          {filters.min_rating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Note: {filters.min_rating}+ ⭐
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('min_rating', '')}
              />
            </Badge>
          )}
          {filters.availability && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Disponibilité: {filters.availability}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('availability', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

