"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Lock, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Crown,
  Calendar,
  BookOpen,
  Trophy,
  Users
} from 'lucide-react'

interface VideoAccessProps {
  videoId: string
  videoTitle: string
  videoDescription?: string
  thumbnail?: string
  duration?: number
  onAccessGranted?: (videoData: any) => void
  onAccessDenied?: (reason: string, message: string) => void
}

interface AccessResponse {
  has_access: boolean
  reason?: string
  message?: string
  video?: {
    id: string
    title: string
    description: string
    duration: number
    thumbnail?: string
    video_url?: string
  }
  access_info?: {
    access_level: string
    expires_at?: string
    progress: number
  }
  subscription_options?: Array<{
    id: string
    name: string
    level: string
    price?: number
    duration_days?: number
    description: string
  }>
  prerequisite_video?: {
    id: string
    title: string
  }
  required_level?: string
  user_level?: string
}

export function VideoAccessControl({ 
  videoId, 
  videoTitle, 
  videoDescription, 
  thumbnail, 
  duration,
  onAccessGranted,
  onAccessDenied 
}: VideoAccessProps) {
  const [accessData, setAccessData] = useState<AccessResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkVideoAccess()
  }, [videoId])

  const checkVideoAccess = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/video-access/${videoId}`, {
        method: 'GET',
        credentials: 'include',
      })
      
      const data = await response.json()
      setAccessData(data)
      
      if (data.has_access) {
        onAccessGranted?.(data.video)
      } else {
        onAccessDenied?.(data.reason, data.message)
      }
      
    } catch (err) {
      console.error('Erreur lors de la vérification d\'accès:', err)
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = (subscriptionId: string) => {
    // TODO: Implémenter la logique d'upgrade
    console.log('Upgrade vers:', subscriptionId)
  }

  const handleWatchPrerequisite = (videoId: string) => {
    // Rediriger vers la vidéo prérequise
    window.location.href = `/courses/${videoId}`
  }

  if (loading) {
    return (
      <Card className="bg-laha-card border-laha-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-primary"></div>
            <span className="ml-2 text-laha-text-secondary">Vérification de l'accès...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-laha-card border-laha-border">
        <CardContent className="p-6">
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!accessData) {
    return null
  }

  // Si l'accès est autorisé
  if (accessData.has_access) {
    return (
      <Card className="bg-laha-card border-laha-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-laha-heading flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Accès autorisé
            </CardTitle>
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              {accessData.access_info?.access_level || 'Accès'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {thumbnail && (
                <img 
                  src={thumbnail} 
                  alt={videoTitle}
                  className="w-24 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-laha-text">{videoTitle}</h3>
                {videoDescription && (
                  <p className="text-sm text-laha-text-secondary mt-1">{videoDescription}</p>
                )}
                {duration && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-laha-text-secondary">
                    <Clock className="h-4 w-4" />
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
            </div>
            
            {accessData.access_info?.progress && accessData.access_info.progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-laha-text-secondary">Progression</span>
                  <span className="text-laha-text">{accessData.access_info.progress.toFixed(1)}%</span>
                </div>
                <Progress value={accessData.access_info.progress} className="h-2" />
              </div>
            )}
            
            {accessData.access_info?.expires_at && (
              <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                <Calendar className="h-4 w-4" />
                <span>Expire le {new Date(accessData.access_info.expires_at).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
            
            <Button 
              className="w-full bg-laha-gold hover:bg-laha-gold-warm text-laha-black font-semibold"
              onClick={() => onAccessGranted?.(accessData.video)}
            >
              <Play className="h-4 w-4 mr-2" />
              Lire la vidéo
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Si l'accès est refusé
  return (
    <Card className="bg-laha-card border-laha-border">
      <CardHeader>
        <CardTitle className="text-laha-heading flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-500" />
          Accès restreint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {thumbnail && (
              <img 
                src={thumbnail} 
                alt={videoTitle}
                className="w-24 h-16 object-cover rounded-lg opacity-50"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-laha-text">{videoTitle}</h3>
              {videoDescription && (
                <p className="text-sm text-laha-text-secondary mt-1">{videoDescription}</p>
              )}
            </div>
          </div>
          
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">{accessData.message}</p>
                
                {/* Messages spécifiques selon la raison */}
                {accessData.reason === 'niveau_requis' && (
                  <div className="mt-2 text-sm text-red-300">
                    <p>Niveau requis: <strong>{accessData.required_level}</strong></p>
                    <p>Votre niveau: <strong>{accessData.user_level}</strong></p>
                  </div>
                )}
                
                {accessData.reason === 'prerequis_video' && accessData.prerequisite_video && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleWatchPrerequisite(accessData.prerequisite_video!.id)}
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Voir "{accessData.prerequisite_video.title}"
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Options d'abonnement */}
          {accessData.subscription_options && accessData.subscription_options.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-laha-text flex items-center gap-2">
                <Crown className="h-4 w-4 text-laha-gold" />
                Options d'abonnement
              </h4>
              <div className="grid gap-3">
                {accessData.subscription_options.map((option) => (
                  <div key={option.id} className="bg-laha-surface/30 border border-laha-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-laha-text">{option.name}</h5>
                        <p className="text-sm text-laha-text-secondary">{option.description}</p>
                        {option.duration_days && (
                          <p className="text-xs text-laha-text-secondary mt-1">
                            Durée: {option.duration_days} jours
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {option.price ? (
                          <div>
                            <p className="text-lg font-bold text-laha-gold">{option.price}€</p>
                            <Button 
                              size="sm"
                              onClick={() => handleUpgrade(option.id)}
                              className="mt-2 bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                            >
                              S'abonner
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleUpgrade(option.id)}
                            className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                          >
                            Activer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

