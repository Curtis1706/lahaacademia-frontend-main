"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PixelTransitionProps {
  trigger?: "scroll" | "route-change" | "manual"
  direction?: "horizontal" | "vertical" | "diagonal"
  duration?: number
  onComplete?: () => void
}

export function PixelTransition({
  trigger = "scroll",
  direction = "horizontal",
  duration = 0.8,
  onComplete,
}: PixelTransitionProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger === "scroll") {
      const handleScroll = () => {
        const scrollY = window.scrollY
        const windowHeight = window.innerHeight

        if (scrollY > windowHeight * 0.3 && !isActive) {
          setIsActive(true)
          setTimeout(() => {
            setIsActive(false)
            onComplete?.()
          }, duration * 1000)
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [trigger, isActive, duration, onComplete])

  if (!isActive) return null

  const getTransitionVariants = () => {
    switch (direction) {
      case "vertical":
        return {
          initial: { y: "-100%" },
          animate: { y: "100%" },
          exit: { y: "100%" },
        }
      case "diagonal":
        return {
          initial: { x: "-100%", y: "-100%" },
          animate: { x: "100%", y: "100%" },
          exit: { x: "100%", y: "100%" },
        }
      default:
        return {
          initial: { x: "-100%" },
          animate: { x: "100%" },
          exit: { x: "100%" },
        }
    }
  }

  return (
    <motion.div
      className="pixel-transition"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getTransitionVariants()}
      transition={{ duration, ease: "easeInOut" }}
    >
      <div className="pixel-grid" />
    </motion.div>
  )
}
