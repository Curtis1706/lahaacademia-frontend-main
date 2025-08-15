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
      className="text-center mb-12 mx-auto"
    >
      <BlurText 
        text={title}
        className="text-4xl md:text-6xl font-bold text-laha-gold mb-6" 
      />
      <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
