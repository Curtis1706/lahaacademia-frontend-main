"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number | ReactNode
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  delay?: number
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  delay = 0 
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-gradient-to-br from-laha-black-light/20 to-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 hover:border-laha-gold/30 transition-all duration-300 hover:shadow-xl hover:shadow-laha-gold/10"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-laha-gold-light/70 mb-1">
            {title}
          </p>
          <motion.div 
            className="text-2xl font-bold text-laha-gold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.p 
              className={`text-xs mt-1 ${changeColors[changeType]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.4 }}
            >
              {change}
            </motion.p>
          )}
        </div>
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.1 }}
          className="h-12 w-12 rounded-full bg-laha-gold/20 flex items-center justify-center"
        >
          <Icon className="h-6 w-6 text-laha-gold" />
        </motion.div>
      </div>
    </motion.div>
  )
}
