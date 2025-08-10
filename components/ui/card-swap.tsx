"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CardSwapProps {
  children: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  swapDirection?: "flip-horizontal" | "flip-vertical" | "slide"
  className?: string
}

export function CardSwap({
  children,
  autoPlay = true,
  interval = 4000,
  swapDirection = "flip-horizontal",
  className = "",
}: CardSwapProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, children.length])

  const getVariants = () => {
    switch (swapDirection) {
      case "flip-vertical":
        return {
          enter: { rotateX: 90, opacity: 0 },
          center: { rotateX: 0, opacity: 1 },
          exit: { rotateX: -90, opacity: 0 },
        }
      case "slide":
        return {
          enter: { x: 300, opacity: 0 },
          center: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
        }
      default: // flip-horizontal
        return {
          enter: { rotateY: 90, opacity: 0 },
          center: { rotateY: 0, opacity: 1 },
          exit: { rotateY: -90, opacity: 0 },
        }
    }
  }

  const variants = getVariants()

  return (
    <div className={`relative w-full ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
        {children.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors touch-target ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
