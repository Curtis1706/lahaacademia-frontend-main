"use client"

import { useState, useRef, useEffect } from 'react'

interface RobustVideoPlayerProps {
  src: string
  poster?: string
  title?: string
}

export function RobustVideoPlayer({ src, poster, title }: RobustVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fallbackUrls, setFallbackUrls] = useState<string[]>([])

  // Générer les URLs de fallback
  useEffect(() => {
    if (!src) return

    const urls: string[] = []
    
    // URL originale
    urls.push(src)
    
    // Si c'est une URL Django /media/, créer les variantes
    if (src.includes('/media/')) {
      const mediaPath = src.split('/media/')[1]
      
      // URL Django directe
      urls.push(`http://localhost:8000/media/${mediaPath}`)
      
      // URL via notre endpoint optimisé
      urls.push(`http://localhost:8000/api/video/${mediaPath}`)
      
      // URL via proxy Next.js
      urls.push(`/api/media/${mediaPath}`)
    }
    
    // Si c'est une URL relative, créer les variantes absolues
    if (src.startsWith('/')) {
      urls.push(`http://localhost:8000${src}`)
      urls.push(`http://localhost:3000${src}`)
    }
    
    setFallbackUrls([...new Set(urls)]) // Supprimer les doublons
    setCurrentSrc(urls[0])
  }, [src])

  const handleError = () => {
    console.error('❌ Erreur de lecture vidéo:', currentSrc)
    
    // Essayer l'URL suivante
    const currentIndex = fallbackUrls.indexOf(currentSrc)
    if (currentIndex < fallbackUrls.length - 1) {
      const nextUrl = fallbackUrls[currentIndex + 1]
      console.log('🔄 Tentative avec URL de fallback:', nextUrl)
      setCurrentSrc(nextUrl)
      setError(null)
    } else {
      setError('Impossible de charger la vidéo avec toutes les URLs disponibles')
      setIsLoading(false)
    }
  }

  const handleLoadStart = () => {
    console.log('🔄 Début du chargement:', currentSrc)
    setIsLoading(true)
    setError(null)
  }

  const handleCanPlay = () => {
    console.log('✅ Vidéo prête à être lue:', currentSrc)
    setIsLoading(false)
    setError(null)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video) {
      console.log('📊 Métadonnées chargées:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState
      })
    }
  }

  const handleLoadedData = () => {
    console.log('📁 Données vidéo chargées')
  }

  const handlePlay = () => {
    console.log('▶️ Lecture démarrée')
  }

  const handlePause = () => {
    console.log('⏸️ Lecture en pause')
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>Chargement de la vidéo...</div>
            <div className="text-sm text-gray-300 mt-1">{currentSrc}</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50 z-10">
          <div className="text-white text-center p-4">
            <div className="text-red-300 mb-2">❌ Erreur de lecture</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs text-gray-300 mt-2">URL: {currentSrc}</div>
          </div>
        </div>
      )}

      <video 
        ref={videoRef}
        src={currentSrc}
        className="w-full h-64 object-cover rounded-lg"
        controls
        preload="metadata"
        poster={poster}
        onError={handleError}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleLoadedData}
        onPlay={handlePlay}
        onPause={handlePause}
      >
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      
      {/* Debug info */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <div>URL: {currentSrc}</div>
        <div>Fallbacks: {fallbackUrls.length}</div>
        {error && <div className="text-red-300">Erreur: {error}</div>}
      </div>
    </div>
  )
}

