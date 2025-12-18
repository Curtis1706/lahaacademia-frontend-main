"use client"

import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import logger from '@/lib/logger'

interface VideoPlayerProps {
  src: string
  poster?: string
  onReady?: () => void
  onError?: (error: any) => void
}

export function VideoPlayer({ src, poster, onReady, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!videoRef.current) return

    // Configuration Video.js
    const videoElement = document.createElement('video-js')
    videoElement.className = 'vjs-default-skin'
    videoRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'metadata',
      poster: poster,
      sources: [{
        src: src,
        type: 'video/mp4'
      }],
      html5: {
        vhs: {
          overrideNative: false
        },
        nativeVideoTracks: true,
        nativeAudioTracks: true,
        nativeTextTracks: true
      }
    })

    playerRef.current = player

    // Event listeners
    player.ready(() => {
      logger.debug('Video.js player ready', null, { context: 'VideoPlayer' })
      onReady?.()
    })

    player.on('error', (error: any) => {
      logger.error('Video.js playback error', error, { context: 'VideoPlayer' })
      onError?.(error)
    })

    player.on('loadstart', () => {
      logger.debug('Video.js loadstart', { src }, { context: 'VideoPlayer' })
    })

    player.on('canplay', () => {
      logger.debug('Video.js canplay', null, { context: 'VideoPlayer' })
    })

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [src, poster, onReady, onError])

  return (
    <div className="video-player-container">
      <div ref={videoRef} />
    </div>
  )
}
