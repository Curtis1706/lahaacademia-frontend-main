"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatedThemeToggler } from "./magicui/animated-theme-toggler";
import { useTheme } from "next-themes";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navigationItems = [
    { href: "/qui-sommes-nous", label: "Qui-sommes nous ?" },
    { href: "/devenir-enseignant", label: "Devenir Enseignant" },
    { href: "/nos-ouvrages", label: "Nos ouvrages" },
    { href: "/nos-resultats", label: "Nos résultats" },
    { href: "/contact", label: "Contact" },
  ];

  // Couleurs adaptatives selon le thème
  const textColor = theme === "dark" ? "text-white" : "text-laha-text";
  const hoverColor = "hover:text-laha-gold";
  const activeColor = theme === "dark" ? "text-white" : "text-laha-gold";

  return (
    <header className="relative bg-card/50 backdrop-blur-sm">
      <nav className="flex items-center px-6 py-4 max-w-8xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="LAHA Editions"
            width={40}
            height={40}
            className="rounded-lg w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
          />
          <span className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-laha-gold">
            Lahacademia
          </span>
        </Link>

        {/* Navigation Desktop - Centrée */}
        <div className="hidden lg:flex items-center space-x-8 mx-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                currentPage === item.href
                  ? `${activeColor} font-semibold`
                  : `${textColor} ${hoverColor}`
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
          <AnimatedThemeToggler />
          <Link
            href="/login"
            className={`${textColor} ${hoverColor} transition-colors font-medium`}
          >
            Se connecter
          </Link>
          <Link
            href="/account-type"
            className="px-6 py-2 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all"
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden p-2 ${textColor}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md z-50">
          <div className="px-6 py-6 space-y-5">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-3 px-4 rounded-lg transition-all ${
                  currentPage === item.href
                    ? "text-laha-gold font-semibold bg-laha-gold/10"
                    : `${textColor} ${hoverColor} hover:bg-muted/50`
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6 space-y-4">
              <div className="flex justify-center">
                <AnimatedThemeToggler />
              </div>
              <div className={`text-center text-sm ${textColor} mb-4`}>
                Changer de thème
              </div>
              <Link
                href="/login"
                className={`block py-3 px-4 ${textColor} ${hoverColor} hover:bg-muted/50 rounded-lg transition-all`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/account-type"
                className="block w-full px-6 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-medium rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all text-center transform hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
