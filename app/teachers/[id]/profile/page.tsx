"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, Star, MessageCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import TeacherProfileCard, { TeacherProfile } from '@/components/teachers/TeacherProfileCard'
import logger from '@/lib/logger'

interface Review {
  id: string
  student_name: string
  rating: number
  comment: string
  created_at: string
  booking_id?: string
}

export default function TeacherPublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const teacherId = params.id as string

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)

  useEffect(() => {
    if (teacherId) {
      fetchTeacherProfile()
      fetchTeacherReviews()
    }
  }, [teacherId])

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teachers/${teacherId}/public-profile`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Enseignant non trouvé')
      }

      setTeacher(data)
    } catch (error) {
      logger.error('Error fetching teacher profile', error as Error, { 
        context: 'TeacherPublicProfilePage' 
      })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de charger le profil',
      })
      // Rediriger vers la liste des enseignants après 2 secondes
      setTimeout(() => router.push('/teachers'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const fetchTeacherReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await fetch(`/api/teachers/${teacherId}/reviews?limit=5`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.results || data)
      }
    } catch (error) {
      logger.error('Error fetching reviews', error as Error, { 
        context: 'TeacherPublicProfilePage' 
      })
      // Non-bloquant, on ne montre pas d'erreur
    } finally {
      setReviewsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Enseignant non trouvé</p>
            <Button onClick={() => router.push('/teachers')}>
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-laha-background py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Bouton retour */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        {/* Profil de l'enseignant */}
        <TeacherProfileCard teacher={teacher} showActions={true} />

        {/* Avis des élèves */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Avis des élèves ({teacher.total_reviews})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-laha-blue" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>Aucun avis pour le moment</p>
                <p className="text-sm mt-1">Soyez le premier à laisser un avis !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{review.student_name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}

                {teacher.total_reviews > 5 && (
                  <Button variant="outline" className="w-full mt-4">
                    Voir tous les avis ({teacher.total_reviews})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA fixe en bas sur mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t md:hidden z-50">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => router.push(`/teachers/${teacherId}/book`)}
          >
            Réserver un cours
          </Button>
        </div>
      </div>
    </div>
  )
}

