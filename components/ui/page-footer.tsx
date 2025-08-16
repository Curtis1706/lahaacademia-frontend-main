"use client"

import { motion } from "framer-motion"

export function PageFooter() {
  return (
    <footer className="border-t border-laha-border mt-20 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 text-center"
      >
        <p className="text-laha-text-secondary">
          © 2024 LAHA Editions. Tous droits réservés. 
          <span className="text-laha-gold"> Éducation pour tous, partout en Afrique.</span>
        </p>
      </motion.div>
    </footer>
  )
}
