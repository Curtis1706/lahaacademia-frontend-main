"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface ChartCardProps {
  title: string
  children: ReactNode
  delay?: number
  className?: string
}

export function ChartCard({ title, children, delay = 0, className = "" }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300 ${className}`}
    >
      <motion.h3 
        className="text-lg font-semibold text-laha-gold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
