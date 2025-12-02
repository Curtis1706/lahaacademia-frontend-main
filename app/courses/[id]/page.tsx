"use client"

import { useState, useEffect, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { 
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Settings,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface VideoData {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  video_url: string
  thumbnail_url: string
  is_free: boolean
  price?: number
  qcm_available: boolean
  qcm_id?: string
}

interface QCMData {
  id: string
  title: string
  description: string
  questions: Question[]
  time_limit_minutes?: number
  max_attempts: number
  passing_score: number
}

interface Question {
  id: string
  question_text: string
  question_type: string
  explanation: string
  points: number
  answers: Answer[]
}

interface Answer {
  id: string
  answer_text: string
  is_correct: boolean
}

interface UserProgress {
  video_id: string
  progress_percentage: number
  completed: boolean
  qcm_score?: number
  qcm_completed: boolean
}

export default function VideoPlayerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [qcmData, setQcmData] = useState<QCMData | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [showQCM, setShowQCM] = useState(false)
  const [qcmAnswers, setQcmAnswers] = useState<Record<string, string[]>>({})
  const [qcmSubmitted, setQcmSubmitted] = useState(false)
  const [qcmScore, setQcmScore] = useState<number | null>(null)
  const [qcmPassed, setQcmPassed] = useState(false)

  // Charger les données de la vidéo
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        setLoading(true)
        
        // Charger les données de la vidéo
        const videoResponse = await fetch(`/api/public/videos/${params.id}`, {
          method: 'GET',
          credentials: 'include',
        })
        const videoData = await videoResponse.json()
        
        // Charger la progression de l'utilisateur
        const progressResponse = await fetch(`/api/user/progress/${params.id}`, {
          method: 'GET',
          credentials: 'include',
        })
        const progressData = await progressResponse.json()

        setVideoData(videoData)
        setUserProgress(progressData)

        // Si un QCM est disponible, le charger
        if (videoData.qcm_available && videoData.qcm_id) {
          const qcmResponse = await fetch(`/api/public/qcm/${videoData.qcm_id}`, {
            method: 'GET',
            credentials: 'include',
          })
          const qcmData = await qcmResponse.json()
          setQcmData(qcmData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVideoData()
  }, [params.id])

  // Suivi de la progression
  useEffect(() => {
    const updateProgress = async () => {
      if (videoData && currentTime > 0 && duration > 0) {
        const progressPercentage = Math.round((currentTime / duration) * 100)
        
        // Mettre à jour la progression toutes les 10 secondes
        if (progressPercentage % 10 === 0 && progressPercentage !== userProgress?.progress_percentage) {
          try {
            await fetch('/api/user/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                video_id: videoData.id,
                progress_percentage: progressPercentage,
                completed: progressPercentage >= 95,
              }),
            })
            
            setUserProgress(prev => prev ? { ...prev, progress_percentage: progressPercentage, completed: progressPercentage >= 95 } : null)
          } catch (error) {
            console.error('Erreur lors de la mise à jour de la progression:', error)
          }
        }

        // Afficher le QCM à la fin de la vidéo
        if (progressPercentage >= 95 && qcmData && !showQCM && !qcmSubmitted) {
          setShowQCM(true)
        }
      }
    }

    updateProgress()
  }, [currentTime, duration, videoData, qcmData, showQCM, qcmSubmitted, userProgress])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.volume = value[0]
      setVolume(value[0])
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const handleQCMAnswer = (questionId: string, answerId: string) => {
    setQcmAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId]?.includes(answerId) 
        ? prev[questionId].filter(id => id !== answerId)
        : [...(prev[questionId] || []), answerId]
    }))
  }

  const handleQCMSubmit = async () => {
    if (!qcmData) return

    try {
      const response = await fetch('/api/user/qcm/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          qcm_id: qcmData.id,
          answers: qcmAnswers,
        }),
      })

      const result = await response.json()
      setQcmScore(result.score)
      setQcmPassed(result.score >= qcmData.passing_score)
      setQcmSubmitted(true)

      // Mettre à jour la progression
      if (result.score >= qcmData.passing_score) {
        setUserProgress(prev => prev ? { ...prev, qcm_completed: true, qcm_score: result.score } : null)
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du QCM:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-laha-primary mx-auto"></div>
          <p className="text-laha-text-secondary mt-2">Chargement de la vidéo...</p>
        </div>
      </div>
    )
  }

  if (!videoData) {
    return (
      <div className="min-h-screen bg-laha-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-laha-heading mb-4">Vidéo non trouvée</h1>
          <Button asChild>
            <Link href="/courses">Retour aux cours</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-laha-background">
        {/* En-tête */}
        <div className="bg-laha-card border-b border-laha-border p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/courses">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-laha-heading">{videoData.title}</h1>
                <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
                  <Badge variant="outline">{videoData.subject}</Badge>
                  <Badge variant="outline">{videoData.class_level}</Badge>
                  {videoData.is_free ? (
                    <Badge className="bg-green-500 text-white">Gratuit</Badge>
                  ) : (
                    <Badge className="bg-laha-gold text-laha-black">{videoData.price} XOF</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userProgress && (
                <div className="text-sm text-laha-text-secondary">
                  Progression: {userProgress.progress_percentage}%
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lecteur vidéo */}
            <div className="lg:col-span-2">
              <Card className="bg-laha-card border-laha-border">
                <CardContent className="p-0">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-64 lg:h-96"
                      poster={videoData.thumbnail_url}
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    >
                      <source src={videoData.video_url} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                    
                    {/* Contrôles vidéo */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="space-y-2">
                        {/* Barre de progression */}
                        <Slider
                          value={[currentTime]}
                          onValueChange={handleSeek}
                          max={duration}
                          step={1}
                          className="w-full"
                        />
                        
                        {/* Contrôles */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handlePlayPause}
                              className="text-white hover:bg-white/20"
                            >
                              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <span className="text-white text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleMuteToggle}
                              className="text-white hover:bg-white/20"
                            >
                              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                              value={[volume]}
                              onValueChange={handleVolumeChange}
                              max={1}
                              step={0.1}
                              className="w-20"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="bg-laha-card border-laha-border mt-4">
                <CardHeader>
                  <CardTitle className="text-laha-heading">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-laha-text-secondary">{videoData.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-4">
              {/* Progression */}
              {userProgress && (
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Votre progression
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-laha-text-secondary">Visionnage</span>
                          <span className="text-sm font-medium text-laha-text">{userProgress.progress_percentage}%</span>
                        </div>
                        <Progress value={userProgress.progress_percentage} className="h-2" />
                      </div>
                      
                      {qcmData && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-laha-text-secondary">QCM</span>
                            <span className="text-sm font-medium text-laha-text">
                              {userProgress.qcm_completed ? `${userProgress.qcm_score}%` : 'Non terminé'}
                            </span>
                          </div>
                          <Progress 
                            value={userProgress.qcm_completed ? 100 : 0} 
                            className="h-2" 
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* QCM disponible */}
              {qcmData && (
                <Card className="bg-laha-card border-laha-border">
                  <CardHeader>
                    <CardTitle className="text-laha-heading flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      QCM disponible
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-laha-text-secondary">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {qcmData.questions.length} questions
                      </div>
                      {qcmData.time_limit_minutes && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {qcmData.time_limit_minutes} minutes
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        {qcmData.passing_score}% pour réussir
                      </div>
                    </div>
                    
                    {userProgress?.qcm_completed ? (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">QCM terminé</span>
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          Score: {userProgress.qcm_score}%
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-sm text-blue-600">
                          Terminez la vidéo pour accéder au QCM
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Modal QCM */}
        <AlertDialog open={showQCM} onOpenChange={setShowQCM}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {qcmData?.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {qcmData?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {qcmData && (
              <div className="space-y-6">
                {qcmData.questions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <h4 className="font-medium text-laha-heading">
                      Question {index + 1}: {question.question_text}
                    </h4>
                    
                    <div className="space-y-2">
                      {question.answers.map((answer) => (
                        <label key={answer.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type={question.question_type === 'multiple_choice' ? 'checkbox' : 'radio'}
                            name={`question_${question.id}`}
                            value={answer.id}
                            onChange={() => handleQCMAnswer(question.id, answer.id)}
                            className="rounded"
                          />
                          <span className="text-laha-text">{answer.answer_text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setShowQCM(false)}>
                Annuler
              </Button>
              <Button onClick={handleQCMSubmit} disabled={qcmSubmitted}>
                {qcmSubmitted ? 'Soumis' : 'Soumettre le QCM'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Résultat QCM */}
        {qcmSubmitted && qcmScore !== null && (
          <AlertDialog open={true} onOpenChange={() => {}}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  {qcmPassed ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Félicitations !
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      QCM terminé
                    </>
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Votre score: {qcmScore}% 
                  {qcmData && ` (${qcmPassed ? 'Réussi' : 'Échec'} - ${qcmData.passing_score}% requis)`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button onClick={() => setQcmSubmitted(false)}>
                  Continuer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </AuthGuard>
  )
}

