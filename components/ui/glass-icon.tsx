"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassIconProps {
  icon: React.ReactNode
  label?: string
  size?: "sm" | "md" | "lg"
  variant?: "blue" | "orange" | "pink"
  onClick?: () => void
  className?: string
}

export function GlassIcon({ icon, label, size = "md", variant = "blue", onClick, className }: GlassIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8 p-2",
    md: "w-12 h-12 p-3",
    lg: "w-16 h-16 p-4",
  }

  const variantClasses = {
    blue: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40",
    orange: "bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40",
    pink: "bg-pink-400/10 border-pink-400/20 hover:bg-pink-400/20 hover:border-pink-400/40",
  }

  return (
    <motion.button
      className={cn(
        "glass-icon rounded-xl backdrop-blur-md transition-all duration-300 flex items-center justify-center",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      title={label}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </motion.button>
  )
}

