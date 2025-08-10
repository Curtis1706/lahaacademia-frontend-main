"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import BlurText from "@/components/ui/blur-text"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Image src="/logo.png" alt="LAHA Editions" width={80} height={80} className="rounded-lg mx-auto mb-6" />

          <BlurText
            text="404"
            delay={100}
            animateBy="characters"
            direction="top"
            className="font-heading text-6xl font-bold text-laha-gold mb-4"
          />

          <BlurText
            text="Page non trouvée"
            delay={200}
            animateBy="words"
            direction="bottom"
            className="font-heading text-2xl font-semibold text-laha-gold-light mb-4"
          />

          <p className="text-laha-gold-light/70 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-laha-gold to-laha-gold-warm px-6 py-3 rounded-lg text-laha-black font-medium hover:from-laha-gold/80 hover:to-laha-gold-warm/80 transition-all"
          >
            <Home className="h-5 w-5" />
            Accueil
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-laha-black-light/20 backdrop-blur-md px-6 py-3 rounded-lg text-laha-gold-light hover:bg-laha-black-light/30 transition-colors border border-laha-gold-dark/20"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>
        </motion.div>
      </div>
    </div>
  )
}

