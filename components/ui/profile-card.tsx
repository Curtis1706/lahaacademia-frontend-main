"use client"

import type React from "react"
import { useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  avatarUrl?: string
  name?: string
  title?: string
  handle?: string
  status?: string
  contactText?: string
  showUserInfo?: boolean
  enableTilt?: boolean
  enableMobileTilt?: boolean
  onContactClick?: () => void
  className?: string
}

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
}

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max)

const round = (value: number, precision = 3) => Number.parseFloat(value.toFixed(precision))

const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin))

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

export function ProfileCard({
  avatarUrl = "/placeholder.svg?height=400&width=300",
  name = "Utilisateur LAHA",
  title = "Élève",
  handle = "user",
  status = "En ligne",
  contactText = "Contacter",
  showUserInfo = true,
  enableTilt = true,
  enableMobileTilt = false,
  onContactClick,
  className = "",
}: ProfileCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null

    let rafId: number | null = null

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth
      const height = card.clientHeight
      const percentX = clamp((100 / width) * offsetX)
      const percentY = clamp((100 / height) * offsetY)
      const centerX = percentX - 50
      const centerY = percentY - 50

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      }

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value)
      })
    }

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement,
    ) => {
      const startTime = performance.now()
      const targetX = wrap.clientWidth / 2
      const targetY = wrap.clientHeight / 2

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = clamp(elapsed / duration)
        const easedProgress = easeInOutCubic(progress)
        const currentX = adjust(easedProgress, 0, 1, startX, targetX)
        const currentY = adjust(easedProgress, 0, 1, startY, targetY)

        updateCardTransform(currentX, currentY, card, wrap)

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop)
        }
      }

      rafId = requestAnimationFrame(animationLoop)
    }

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      },
    }
  }, [enableTilt])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const card = cardRef.current
      const wrap = wrapRef.current
      if (!card || !wrap || !animationHandlers) return

      const rect = card.getBoundingClientRect()
      animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap)
    },
    [animationHandlers],
  )

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current
    const wrap = wrapRef.current
    if (!card || !wrap || !animationHandlers) return

    animationHandlers.cancelAnimation()
    wrap.classList.add("active")
    card.classList.add("active")
  }, [animationHandlers])

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent) => {
      const card = cardRef.current
      const wrap = wrapRef.current
      if (!card || !wrap || !animationHandlers) return

      const rect = card.getBoundingClientRect()
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap,
      )

      wrap.classList.remove("active")
      card.classList.remove("active")
    },
    [animationHandlers],
  )

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return

    const card = cardRef.current
    const wrap = wrapRef.current
    if (!card || !wrap) return

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap)
    animationHandlers.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap)

    return () => {
      animationHandlers.cancelAnimation()
    }
  }, [enableTilt, animationHandlers])

  return (
    <div ref={wrapRef} className={cn("pc-card-wrapper", className)}>
      <motion.section
        ref={cardRef}
        className="pc-card"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        whileHover={{ scale: enableTilt ? 1 : 1.02 }}
      >
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <img className="avatar" src={avatarUrl || "/placeholder.svg"} alt={`${name} avatar`} loading="lazy" />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img src={avatarUrl || "/placeholder.svg"} alt={`${name} mini avatar`} loading="lazy" />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <button className="pc-contact-btn" onClick={onContactClick} type="button">
                  {contactText}
                </button>
              </div>
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
