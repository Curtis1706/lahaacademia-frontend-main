"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logger from '@/lib/logger'

interface ImprovedVideoPlayerProps {
  videoUrl: string
  title: string
  poster?: string
}

export const ImprovedVideoPlayer: React.FC<ImprovedVideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  poster 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buffered, setBuffered] = useState(0)
  const [volume, setVolume] = useState(0.8)

  // Optimiser l'URL pour utiliser le proxy Next.js
  const getOptimizedUrl = (originalUrl: string) => {
    if (!originalUrl) return null
    
    // Si c'est une URL Django media, la convertir vers le proxy Next.js
    if (originalUrl.includes('localhost:8000/media/')) {
      const mediaPath = originalUrl.split('media/')[1]
      return `/api/media/${mediaPath}`
    }
    // Si c'est déjà une URL complète, l'utiliser
    else if (originalUrl.startsWith('http')) {
      return originalUrl
    }
    // Si c'est une URL relative Django, la convertir vers le proxy Next.js
    else if (originalUrl.startsWith('/media/')) {
      const mediaPath = originalUrl.replace('/media/', '')
      return `/api/media/${mediaPath}`
    }
    // Si c'est juste un chemin, l'ajouter au proxy Next.js
    else {
      return `/api/media/${originalUrl}`
    }
  }

  const optimizedUrl = getOptimizedUrl(videoUrl)

  logger.debug('ImprovedVideoPlayer initialized', {
    originalUrl: videoUrl,
    optimizedUrl,
    title
  }, { context: 'ImprovedVideoPlayer' })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      logger.debug('Video metadata loaded', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      }, { context: 'ImprovedVideoPlayer' })
      setDuration(video.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const percentage = (bufferedEnd / video.duration) * 100
        setBuffered(percentage)
        logger.debug(`Video buffer: ${percentage.toFixed(1)}%`, null, { context: 'ImprovedVideoPlayer' })
      }
    }

    const handleCanPlay = () => {
      logger.debug('Video ready to play', null, { context: 'ImprovedVideoPlayer' })
      setIsLoading(false)
    }

    const handleWaiting = () => {
      logger.debug('Video waiting for data', null, { context: 'ImprovedVideoPlayer' })
      setIsLoading(true)
    }

    const handlePlaying = () => {
      logger.debug('Video playing', null, { context: 'ImprovedVideoPlayer' })
      setIsLoading(false)
    }

    const handleError = (e: Event) => {
      const videoError = (e.target as HTMLVideoElement).error
      logger.error('Video playback error', new Error(videoError?.message || 'Unknown video error'), {
        context: 'ImprovedVideoPlayer',
        data: { code: videoError?.code, message: videoError?.message }
      })
      setError(`Erreur de lecture: ${videoError?.message || 'Inconnue'}`)
      setIsLoading(false)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(err => {
          logger.error('Failed to play video', err as Error, { context: 'ImprovedVideoPlayer/togglePlay' })
          setError('Impossible de lire la vidéo')
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleSeek = (value: number[]) => {
    const time = value[0] * duration
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (error) {
    return (
      <div className="w-full h-64 bg-red-900 bg-opacity-75 rounded-lg flex items-center justify-center">
        <div className="text-white text-center p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-lg font-medium mb-2">❌ Erreur de lecture</p>
          <p className="text-sm text-red-300 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
            size="sm"
          >
            Recharger la page
          </Button>
        </div>
      </div>
    )
  }

  if (!optimizedUrl) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-2" />
          <div className="text-red-300 mb-2">❌ URL vidéo invalide</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
      {/* Vidéo HTML5 */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={optimizedUrl}
        poster={poster}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
      >
        <source src={optimizedUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la balise vidéo.
      </video>

      {/* Overlay de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-white text-center">
            <Loader2 className="h-12 w-12 animate-spin text-laha-primary mx-auto mb-2" />
            <div className="text-lg">Chargement de la vidéo...</div>
          </div>
        </div>
      )}

      {/* Contrôles personnalisés */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Barre de progression */}
        <div className="mb-3">
          <div className="relative h-1 bg-gray-600 rounded-full overflow-hidden">
            {/* Buffer */}
            <div
              className="absolute h-full bg-gray-400"
              style={{ width: `${buffered}%` }}
            ></div>
            {/* Progression */}
            <div
              className="absolute h-full bg-laha-primary"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
            {/* Slider invisible pour le contrôle */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.0001"
              value={duration > 0 ? currentTime / duration : 0}
              onChange={(e) => handleSeek([parseFloat(e.target.value)])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Contrôles */}
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-gray-700">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-gray-700">
              {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange([parseFloat(e.target.value)])}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  '--slider-track-background': `linear-gradient(to right, #facc15 ${volume * 100}%, #4b5563 ${volume * 100}%)`
                } as React.CSSProperties}
              />
            </div>

            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">Buffer: {buffered.toFixed(1)}%</span>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-gray-700">
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

