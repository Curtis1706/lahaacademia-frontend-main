"use client"

import { useState } from "react"
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Heart,
  MessageCircle,
  Clock,
  Users,
  Star,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileVideo,
  Archive,
  Eye,
  Maximize2,
  Minimize2
} from "lucide-react"
import { ImprovedVideoPlayer } from './ImprovedVideoPlayer'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: {
    id: string
    title: string
    description: string
    type: 'book' | 'video' | 'document'
    fileUrl?: string
    thumbnailUrl?: string
    duration?: number
    fileSize?: number
    pageCount?: number
    fileType?: string
    quality?: string
    language?: string
    author?: string
    subject?: string
    class_level?: string
    tags?: string[]
    price?: number
    viewCount?: number
    rating?: number
    isLiked?: boolean
    allowDownloads?: boolean
    allowPreview?: boolean
  }
}

export function PreviewModal({ isOpen, onClose, content }: PreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLiked, setIsLiked] = useState(content?.isLiked || false)

  if (!isOpen || !content) return null

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />
      case 'ppt':
      case 'pptx':
        return <FileImage className="h-8 w-8 text-orange-500" />
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo className="h-8 w-8 text-purple-500" />
      default:
        return <Archive className="h-8 w-8 text-gray-500" />
    }
  }

  const renderContentPreview = () => {
    switch (content.type) {
      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            {content.fileUrl ? (
              <ImprovedVideoPlayer
                videoUrl={content.fileUrl}
                title={content.title}
                poster={content.thumbnailUrl}
              />
            ) : content.thumbnailUrl ? (
              <div className="relative">
                <img 
                  src={content.thumbnailUrl} 
                  alt={content.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black rounded-full w-16 h-16"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-800">
                <Play className="h-16 w-16 text-gray-400" />
              </div>
            )}
            
          </div>
        )

      case 'book':
      case 'document':
        return (
          <div className="space-y-4">
            {/* Aperçu du fichier */}
            <div className="border-2 border-dashed border-laha-border rounded-lg p-8 text-center">
              {content.thumbnailUrl ? (
                <img 
                  src={content.thumbnailUrl} 
                  alt={content.title}
                  className="mx-auto max-h-64 rounded-lg shadow-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  {getFileIcon(content.fileType || 'pdf')}
                  <div>
                    <p className="text-laha-text font-medium">{content.title}</p>
                    <p className="text-laha-text-secondary text-sm">
                      {content.fileType?.toUpperCase()} • {content.fileSize ? formatFileSize(content.fileSize) : 'Taille inconnue'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Informations du fichier */}
            <Card className="bg-laha-surface/50 border-laha-border">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-laha-text-secondary">Type:</span>
                    <span className="text-laha-text ml-2">{content.fileType?.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-laha-text-secondary">Taille:</span>
                    <span className="text-laha-text ml-2">{content.fileSize ? formatFileSize(content.fileSize) : 'N/A'}</span>
                  </div>
                  {content.pageCount && (
                    <div>
                      <span className="text-laha-text-secondary">Pages:</span>
                      <span className="text-laha-text ml-2">{content.pageCount}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-laha-text-secondary">Langue:</span>
                    <span className="text-laha-text ml-2">{content.language || 'Français'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-laha-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-laha-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {content.type === 'video' && <Play className="h-5 w-5 text-laha-gold" />}
              {content.type === 'book' && <FileText className="h-5 w-5 text-laha-gold" />}
              {content.type === 'document' && <Archive className="h-5 w-5 text-laha-gold" />}
              <h2 className="text-xl font-bold text-laha-text">Prévisualisation</h2>
            </div>
            <Badge variant="outline" className="border-laha-border text-laha-text">
              {content.type === 'video' ? 'Vidéo' : content.type === 'book' ? 'Livre' : 'Document'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-laha-border text-laha-text hover:bg-laha-surface"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
              {isLiked ? 'Aimé' : 'Aimer'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-laha-border text-laha-text hover:bg-laha-surface"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-laha-border text-laha-text hover:bg-laha-surface"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Titre et description */}
            <div>
              <h1 className="text-2xl font-bold text-laha-text mb-2">{content.title}</h1>
              <p className="text-laha-text-secondary">{content.description}</p>
            </div>

            {/* Métadonnées */}
            <div className="flex flex-wrap gap-2">
              {content.subject && (
                <Badge variant="outline" className="border-laha-border text-laha-text">
                  {content.subject}
                </Badge>
              )}
              {content.class_level && (
                <Badge variant="outline" className="border-laha-border text-laha-text">
                  {content.class_level}
                </Badge>
              )}
              {content.language && (
                <Badge variant="outline" className="border-laha-border text-laha-text">
                  {content.language}
                </Badge>
              )}
              {content.quality && (
                <Badge variant="outline" className="border-laha-border text-laha-text">
                  {content.quality}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-laha-surface text-laha-text">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Statistiques */}
            <div className="flex items-center gap-6 text-sm text-laha-text-secondary">
              {content.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{content.viewCount} vues</span>
                </div>
              )}
              {content.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{content.rating}/5</span>
                </div>
              )}
              {content.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(content.duration)}</span>
                </div>
              )}
            </div>

            {/* Prévisualisation du contenu */}
            <div className="border border-laha-border rounded-lg p-4">
              {renderContentPreview()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-laha-border">
              <div className="flex items-center gap-2">
                {content.price && content.price > 0 ? (
                  <Badge className="bg-laha-gold text-laha-black">
                    {content.price} FCFA
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-green-500/20 text-green-500">
                    Gratuit
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {content.allowDownloads && (
                  <Button className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                )}
                
                <Button variant="outline" className="border-laha-border text-laha-text hover:bg-laha-surface">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Commenter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
