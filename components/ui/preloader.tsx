"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 60)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="preloader">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="preloader-logo"
          >
            <Image
              src="/logo.png"
              alt="LAHA Editions"
              width={120}
              height={120}
              className="w-full h-full object-contain"
            />
          </motion.div>

          <motion.h2
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="preloader-text font-heading"
          >
            Chargement de votre académie...
          </motion.h2>

          <div className="preloader-progress">
            <motion.div className="preloader-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <motion.p
            className="text-white/80 mt-4 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {progress}% - Préparation de l'expérience éducative
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
