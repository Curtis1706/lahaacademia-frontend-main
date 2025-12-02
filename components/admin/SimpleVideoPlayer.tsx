"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface SimpleVideoPlayerProps {
  src: string
  poster?: string
  title?: string
}

export function SimpleVideoPlayer({ src, poster, title }: SimpleVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)

  // Construire l'URL optimisée
  const getOptimizedUrl = (originalUrl: string) => {
    if (!originalUrl) return null
    
    let baseUrl = originalUrl
    
    // Si c'est une URL Django media, la convertir vers le proxy Next.js
    if (originalUrl.includes('localhost:8000/media/')) {
      const mediaPath = originalUrl.split('media/')[1]
      baseUrl = `/api/media/${mediaPath}`
    }
    // Si c'est déjà une URL complète, l'utiliser
    else if (originalUrl.startsWith('http')) {
      baseUrl = originalUrl
    }
    // Si c'est une URL relative Django, la convertir vers le proxy Next.js
    else if (originalUrl.startsWith('/media/')) {
      const mediaPath = originalUrl.replace('/media/', '')
      baseUrl = `/api/media/${mediaPath}`
    }
    // Si c'est juste un chemin, l'ajouter au proxy Next.js
    else {
      baseUrl = `/api/media/${originalUrl}`
    }
    
    // Ajouter un paramètre de cache-busting pour forcer le rechargement
    const timestamp = Date.now()
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}t=${timestamp}`
  }

  const optimizedUrl = getOptimizedUrl(src)
  
  console.log('🎥 SimpleVideoPlayer - URL originale:', src)
  console.log('🎥 SimpleVideoPlayer - URL optimisée:', optimizedUrl)

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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setMuted(true)
    } else {
      setMuted(false)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const handleSeekChange = (value: number[]) => {
    if (videoRef.current) {
      const newTime = value[0] * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const total = videoRef.current.duration
      setCurrentTime(current)
      setProgress(total > 0 ? current / total : 0)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsReady(true)
      setIsLoading(false)
      setError(null)
      console.log('✅ Vidéo HTML5 prête:', optimizedUrl)
      console.log('📊 Durée détectée:', videoRef.current.duration, 'secondes')
    }
  }

  const handleError = () => {
    console.error('❌ Erreur vidéo HTML5:', optimizedUrl)
    console.error('❌ URL originale:', src)
    console.error('❌ État de la vidéo:', videoRef.current?.readyState)
    console.error('❌ Erreur de la vidéo:', videoRef.current?.error)
    setError('Erreur de lecture de la vidéo')
    setIsLoading(false)
    setIsReady(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
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
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Vidéo HTML5 */}
      <video
        ref={videoRef}
        src={optimizedUrl}
        poster={poster}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onError={handleError}
        onCanPlay={handleCanPlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        preload="metadata"
        crossOrigin="anonymous"
        controls={true}
        playsInline
      />

      {/* Overlay de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="text-white text-center">
            <Loader2 className="h-12 w-12 animate-spin text-laha-primary mx-auto mb-2" />
            <div className="text-lg">Chargement de la vidéo...</div>
          </div>
        </div>
      )}

      {/* Overlay d'erreur */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75 z-10">
          <div className="text-white text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <div className="text-lg">{error}</div>
          </div>
        </div>
      )}

      {/* Contrôles natifs du navigateur */}
      {/* Les contrôles personnalisés sont désactivés car nous utilisons controls={true} */}
    </div>
  )
}
