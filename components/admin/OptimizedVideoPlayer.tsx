"use client"

import ReactPlayer from 'react-player'
import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'

interface OptimizedVideoPlayerProps {
  src: string
  poster?: string
  title?: string
}

export function OptimizedVideoPlayer({ src, poster, title }: OptimizedVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [played, setPlayed] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  const playerRef = useRef<ReactPlayer>(null)

  // Construire l'URL optimisée avec cache-busting
  const getOptimizedUrl = (originalUrl: string) => {
    if (!originalUrl) return null
    
    let baseUrl = originalUrl
    
    // Si c'est une URL Django media, la convertir vers l'endpoint public
    if (originalUrl.includes('localhost:8000/media/')) {
      const mediaPath = originalUrl.split('media/')[1]
      baseUrl = `http://localhost:8000/public/video/${mediaPath}`
    }
    // Si c'est déjà une URL complète, l'utiliser
    else if (originalUrl.startsWith('http')) {
      baseUrl = originalUrl
    }
    // Si c'est une URL relative Django, la convertir vers l'endpoint public
    else if (originalUrl.startsWith('/media/')) {
      const mediaPath = originalUrl.replace('/media/', '')
      baseUrl = `http://localhost:8000/public/video/${mediaPath}`
    }
    // Si c'est juste un chemin, l'ajouter à l'endpoint public
    else {
      baseUrl = `http://localhost:8000/public/video/${originalUrl}`
    }
    
    // Ajouter un paramètre de cache-busting pour forcer le rechargement
    const timestamp = Date.now()
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}t=${timestamp}`
  }

  const optimizedUrl = getOptimizedUrl(src)
  
  console.log('🎥 OptimizedVideoPlayer - URL originale:', src)
  console.log('🎥 OptimizedVideoPlayer - URL optimisée:', optimizedUrl)

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setMuted(newVolume === 0)
  }

  const handleMute = () => {
    setMuted(!muted)
  }

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value))
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.currentTarget.value))
    }
  }

  const handleDuration = (duration: number) => {
    console.log('📊 Durée détectée par React Player:', duration, 'secondes')
    console.log('📊 Durée en minutes:', Math.round(duration / 60), 'minutes')
    setDuration(duration)
  }

  const handleReady = () => {
    console.log('✅ React Player prêt:', optimizedUrl)
    console.log('📊 Durée détectée:', duration, 'secondes')
    console.log('🎬 Titre de la vidéo:', title)
    setIsReady(true)
    setError(null)
  }

  const handleError = (error: any) => {
    console.error('❌ Erreur React Player:', error)
    console.error('URL tentée:', optimizedUrl)
    console.error('URL originale:', src)
    setError(`Erreur de lecture: ${error?.message || 'URL inaccessible'}`)
    setIsReady(false)
  }

  const handleStart = () => {
    console.log('▶️ Lecture démarrée')
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  if (!optimizedUrl) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-red-300 mb-2">❌ URL vidéo invalide</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {/* Lecteur vidéo */}
      <div className="relative w-full h-64">
        <ReactPlayer
          ref={playerRef}
          url={optimizedUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={muted ? 0 : volume}
          onReady={handleReady}
          onStart={handleStart}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={handleError}
          config={{
            file: {
              attributes: {
                poster: poster,
                preload: 'metadata'
              }
            }
          }}
        />
        
        {/* Overlay de contrôle personnalisé */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Barre de progression */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={played}
              onChange={handleSeekChange}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          {/* Contrôles */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="hover:text-blue-400 transition-colors"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              
              <button
                onClick={handleMute}
                className="hover:text-blue-400 transition-colors"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                value={muted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                {duration > 0 ? `${formatTime(duration * played)} / ${formatTime(duration)}` : '0:00 / 0:00'}
              </span>
              
              <button className="hover:text-blue-400 transition-colors">
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages d'état */}
      {error && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-center p-4">
            <div className="text-red-300 mb-2">❌ Erreur de lecture</div>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      )}
      
      {!isReady && !error && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>Chargement de la vidéo...</div>
          </div>
        </div>
      )}
      
    </div>
  )
}
