"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface InfiniteScrollProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  direction?: "horizontal" | "vertical"
  speed?: "slow" | "medium" | "fast"
  pauseOnHover?: boolean
  className?: string
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  direction = "horizontal",
  speed = "medium",
  pauseOnHover = true,
  className = "",
}: InfiniteScrollProps<T>) {
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const speedMap = {
    slow: 50,
    medium: 30,
    fast: 15,
  }

  const duplicatedItems = [...items, ...items]

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        ref={scrollRef}
        className={`flex ${direction === "vertical" ? "flex-col" : "flex-row"} gap-4 sm:gap-6`}
        animate={{
          x: direction === "horizontal" ? [0, -50 + "%"] : 0,
          y: direction === "vertical" ? [0, -50 + "%"] : 0,
        }}
        transition={{
          duration: speedMap[speed],
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {renderItem(item, index)}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
