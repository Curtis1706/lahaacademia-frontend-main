"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Calendar, Eye, BookOpen, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface BookCardProps {
  id: number
  title: string
  cover: string
  year: string
  countryName: string
  rating: number
  views: number
  downloads: number
  isNew?: boolean
  series?: string
  description: string
}

export function BookCard({
  id,
  title,
  cover,
  year,
  countryName,
  rating,
  views,
  downloads,
  isNew = false,
  series,
  description,
}: BookCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }} 
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <Card className="overflow-hidden border border-laha-border rounded-2xl shadow-sm hover:shadow-xl hover:shadow-laha-gold/10 transition-all duration-300 bg-laha-surface/50 hover:bg-laha-surface/70 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <Image
            src={cover}
            alt={title}
            width={300}
            height={400}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isNew && (
            <Badge className="absolute top-2 right-2 bg-laha-gold text-laha-black border-0 font-bold text-xs px-2 py-1">
              NOUVEAU
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-laha-text/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Location and Year */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm text-laha-text-secondary">
              <MapPin className="h-4 w-4" />
              {countryName}
            </div>
            <div className="flex items-center gap-1 text-sm text-laha-text-secondary">
              <Calendar className="h-4 w-4" />
              {year}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-laha-text line-clamp-2 group-hover:text-laha-gold transition-colors">
            {title}
          </h3>

          {/* Series */}
          {series && (
            <p className="text-xs text-laha-gold/70 font-medium">
              Collection : {series}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-laha-text-secondary line-clamp-2 flex-1">
            {description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-laha-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                strokeWidth={1.5}
                className={i < Math.floor(rating) ? "fill-current" : ""}
              />
            ))}
            <span className="text-sm text-laha-text ml-1">{rating.toFixed(1)}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-laha-text-secondary">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {downloads.toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 mt-auto">
            <Button className="flex-1 bg-laha-gold text-laha-black hover:bg-laha-gold-warm transition-colors flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              Consulter
            </Button>
            <Button variant="outline" size="icon" className="border-laha-border text-laha-text-secondary hover:text-laha-gold hover:border-laha-gold">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
