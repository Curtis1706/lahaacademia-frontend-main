"use client"

import type React from "react"
import { motion } from "framer-motion"
import { GlowingEffect } from "./glowing-effect"
import { cn } from "@/lib/utils"

interface BentoItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  area: string
  gradient?: string
}

interface MagicBentoGridProps {
  items: BentoItem[]
  className?: string
}

export function MagicBentoGrid({ items, className }: MagicBentoGridProps) {
  return (
    <div className={cn("magic-bento", className)}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="bento-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative h-full rounded-2xl border border-white/10 p-2">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
            <div className="relative flex h-full flex-col justify-between gap-4 sm:gap-6 overflow-hidden rounded-xl p-4 sm:p-6">
              <div className="relative flex flex-1 flex-col justify-between gap-2 sm:gap-3">
                <div className="w-fit rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 sm:p-3">{item.icon}</div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="font-heading text-responsive-lg sm:text-responsive-xl lg:text-responsive-2xl font-semibold text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-responsive-sm sm:text-responsive-base text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
