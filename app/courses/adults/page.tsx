"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, GraduationCap, BookOpen, Users, Clock, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import logger from '@/lib/logger'

interface AdultCourse {
  id: string
  title: string
  description: string
  subject: string
  level: string
  price: number
  duration: number
  teacher_name: string
  teacher_rating: number
  thumbnail?: string
  is_certified: boolean
}

export default function AdultCoursesPage() {
  const [courses, setCourses] = useState<AdultCourse[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdultCourses()
  }, [])

  const fetchAdultCourses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/courses/adults')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setCourses(data.courses || data.results || data)
    } catch (error) {
      logger.error('Error fetching adult courses', error as Error, { context: 'AdultCoursesPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les cours pour adultes',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-laha-background py-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-laha-blue/10 p-4 rounded-full">
              <GraduationCap className="h-12 w-12 text-laha-blue" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">
            Formations pour Adultes
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Développez vos compétences professionnelles avec nos formations certifiées
            adaptées aux besoins des adultes
          </p>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Clock className="h-6 w-6" />,
              title: 'Horaires flexibles',
              description: 'Cours adaptés à votre emploi du temps'
            },
            {
              icon: <GraduationCap className="h-6 w-6" />,
              title: 'Certification',
              description: 'Obtenez une certification reconnue'
            },
            {
              icon: <Users className="h-6 w-6" />,
              title: 'Enseignants experts',
              description: 'Formateurs professionnels expérimentés'
            }
          ].map((advantage, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 text-laha-blue">
                  {advantage.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{advantage.title}</h3>
                <p className="text-sm text-gray-400">{advantage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Liste des cours */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
          </div>
        ) : courses.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun cours pour adultes disponible pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-gray-900 border-gray-800 hover:border-laha-blue transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="bg-laha-blue/20 text-laha-blue">
                      Formation Adulte
                    </Badge>
                    {course.is_certified && (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Certifié
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-white line-clamp-2">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      {course.subject}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      {course.duration}h
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < Math.floor(course.teacher_rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {course.teacher_rating.toFixed(1)} - {course.teacher_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <span className="text-2xl font-bold text-white">{course.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 ml-1">FCFA</span>
                    </div>
                    <Button asChild>
                      <Link href={`/courses/${course.id}`}>
                        Voir le cours
                      </Link>
                    </Button>
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

