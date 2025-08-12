"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  from: number
  to: number
  duration?: number
  delay?: number
}

export function AnimatedCounter({ from, to, duration = 2, delay = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(from)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now()
      const startValue = from
      const endValue = to
      const animationDuration = duration * 1000

      const updateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)
        
        // Fonction d'easing pour une animation plus fluide
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic)
        
        setCount(currentValue)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        }
      }

      requestAnimationFrame(updateCount)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [from, to, duration, delay])

  return <span>{count}</span>
}
