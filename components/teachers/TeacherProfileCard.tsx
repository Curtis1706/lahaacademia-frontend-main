"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Star, 
  Clock, 
  Award, 
  BookOpen, 
  Languages, 
  CheckCircle,
  MessageCircle,
  Calendar,
  Download
} from 'lucide-react'
import Link from 'next/link'
import ReportIncidentForm from '@/components/reports/ReportIncidentForm'

export interface TeacherProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  photo_url?: string
  bio?: string
  
  // Localisation
  country: string
  city?: string
  timezone?: string
  
  // Notation et stats
  average_rating: number
  total_reviews: number
  total_hours: number
  completed_bookings_count: number
  completion_rate: number
  
  // Compétences
  subjects: Array<{
    id: string
    name: string
    level: string
    price_per_hour: number
  }>
  languages: string[]
  certifications?: string[]
  
  // Documents
  cv_url?: string
  diploma_urls?: string[]
  
  // Statut
  is_verified: boolean
  status: string
  years_of_experience: number
  
  // Disponibilité
  available_days?: string[]
  available_hours?: string
}

interface TeacherProfileCardProps {
  teacher: TeacherProfile
  showActions?: boolean
  compact?: boolean
}

export default function TeacherProfileCard({ 
  teacher, 
  showActions = true,
  compact = false 
}: TeacherProfileCardProps) {
  const [showFullBio, setShowFullBio] = useState(false)

  const getInitials = () => {
    return `${teacher.first_name[0]}${teacher.last_name[0]}`.toUpperCase()
  }

  const getRatingStars = () => {
    const rating = teacher.average_rating || 0
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : index === fullStars && hasHalfStar
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold">{rating.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground ml-1">
          ({teacher.total_reviews} avis)
        </span>
      </div>
    )
  }

  if (compact) {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={teacher.photo_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                {teacher.is_verified && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                {teacher.city}, {teacher.country}
              </div>
              
              {getRatingStars()}
              
              <div className="flex flex-wrap gap-2 mt-3">
                {teacher.subjects.slice(0, 3).map((subject) => (
                  <Badge key={subject.id} variant="secondary">
                    {subject.name}
                  </Badge>
                ))}
                {teacher.subjects.length > 3 && (
                  <Badge variant="outline">+{teacher.subjects.length - 3}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-laha-blue to-laha-purple p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage src={teacher.photo_url} alt={`${teacher.first_name} ${teacher.last_name}`} />
            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold">
                {teacher.first_name} {teacher.last_name}
              </h2>
              {teacher.is_verified && (
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Vérifié</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {teacher.city}, {teacher.country}
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                {teacher.years_of_experience} ans d'expérience
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-laha-blue">{teacher.total_hours}</div>
            <div className="text-xs text-muted-foreground">Heures enseignées</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-laha-purple">{teacher.completed_bookings_count}</div>
            <div className="text-xs text-muted-foreground">Cours complétés</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">{teacher.completion_rate}%</div>
            <div className="text-xs text-muted-foreground">Taux de complétion</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{teacher.average_rating.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Note moyenne</div>
          </div>
        </div>

        {/* Notation */}
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Évaluation
          </h3>
          {getRatingStars()}
        </div>

        {/* Bio */}
        {teacher.bio && (
          <div>
            <h3 className="font-semibold mb-2">À propos</h3>
            <p className={`text-muted-foreground ${!showFullBio && 'line-clamp-3'}`}>
              {teacher.bio}
            </p>
            {teacher.bio.length > 200 && (
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => setShowFullBio(!showFullBio)}
              >
                {showFullBio ? 'Voir moins' : 'Voir plus'}
              </Button>
            )}
          </div>
        )}

        {/* Matières enseignées */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-laha-blue" />
            Matières enseignées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {teacher.subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-xs text-muted-foreground">{subject.level}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-laha-blue">{subject.price_per_hour} FCFA</div>
                  <div className="text-xs text-muted-foreground">/heure</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Langues */}
        {teacher.languages && teacher.languages.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Languages className="h-5 w-5 text-laha-purple" />
              Langues parlées
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.languages.map((lang, index) => (
                <Badge key={index} variant="outline">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {teacher.certifications && teacher.certifications.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Certifications
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {teacher.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Documents */}
        {(teacher.cv_url || (teacher.diploma_urls && teacher.diploma_urls.length > 0)) && (
          <div>
            <h3 className="font-semibold mb-3">Documents</h3>
            <div className="space-y-2">
              {teacher.cv_url && (
                <Button variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href={teacher.cv_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le CV
                  </a>
                </Button>
              )}
              {teacher.diploma_urls?.map((url, index) => (
                <Button key={index} variant="outline" size="sm" asChild className="w-full justify-start">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Diplôme {index + 1}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Disponibilité */}
        {teacher.available_days && teacher.available_days.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Disponibilité
            </h3>
            <div className="flex flex-wrap gap-2">
              {teacher.available_days.map((day, index) => (
                <Badge key={index} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
            {teacher.available_hours && (
              <p className="text-sm text-muted-foreground mt-2">
                Plages horaires : {teacher.available_hours}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button asChild className="flex-1">
              <Link href={`/teachers/${teacher.id}/book`}>
                <Calendar className="h-4 w-4 mr-2" />
                Réserver un cours
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/messages?teacher=${teacher.id}`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contacter
              </Link>
            </Button>
            <ReportIncidentForm
              teacherId={teacher.id}
              teacherName={`${teacher.first_name} ${teacher.last_name}`}
              trigger={
                <Button variant="ghost" size="sm">
                  Signaler
                </Button>
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

