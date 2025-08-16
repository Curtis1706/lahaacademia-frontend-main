"use client"

import { motion } from "framer-motion"
import BlurText from "./blur-text"

interface HeroSectionProps {
  title: string
  description: string
}

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 mx-auto max-w-4xl"
    >
      <BlurText 
        text={title}
        className="text-4xl md:text-6xl font-bold text-laha-gold mb-6 text-center" 
      />
      <p className="text-xl text-laha-text-secondary max-w-3xl mx-auto leading-relaxed text-center">
        {description}
      </p>
    </motion.div>
  )
}
