"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface PageHeaderProps {
  currentPage: string
}

export function PageHeader({ currentPage }: PageHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { href: "/", label: "Accueil", isActive: currentPage === "accueil" },
    { href: "/nos-ouvrages", label: "Nos ouvrages", isActive: currentPage === "nos-ouvrages" },
    { href: "/qui-sommes-nous", label: "Qui sommes-nous", isActive: currentPage === "qui-sommes-nous" },
    { href: "/nos-resultats", label: "Nos résultats", isActive: currentPage === "nos-resultats" },
    { href: "/devenir-enseignant", label: "Devenir enseignant", isActive: currentPage === "devenir-enseignant" }
  ]

  return (
    <header className="relative bg-white/5 dark:bg-black/10 backdrop-blur-xl border-b border-white/10 dark:border-white/5 shadow-lg">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="LAHA Editions"
            width={40}
            height={40}
            className="rounded-lg w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
          <span className="text-xl font-bold text-laha-gold">Lahacademia</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                item.isActive
                  ? "text-laha-gold font-semibold"
                  : "text-gray-300 hover:text-laha-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-laha-gold"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white/10 dark:bg-black/20 backdrop-blur-xl border-t border-white/20 dark:border-white/10 shadow-2xl z-50"
        >
          <div className="p-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-3 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                  item.isActive
                    ? "text-laha-gold font-semibold bg-laha-gold/20 dark:bg-laha-gold/30 border border-laha-gold/30 shadow-lg"
                    : "text-gray-300 hover:text-laha-gold hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-md border border-transparent hover:border-white/20"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  )
}
