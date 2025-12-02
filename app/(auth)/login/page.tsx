"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

import BlurText from "@/components/ui/blur-text"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { useAuth, type LoginResponse } from "@/hooks/use-auth"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Gérer les messages d'erreur depuis l'URL
  useEffect(() => {
    const message = searchParams.get('message')
    if (message) {
      setError(message)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result: LoginResponse = await login(formData.email, formData.password)
      
      if (result.success) {
        // Redirection basée sur le rôle réel renvoyé par le backend
        const role = result.user?.role || 'student'
        console.log('Connexion réussie, rôle:', role)
        
        // Vérifier s'il y a une redirection spécifique demandée
        const redirectTo = searchParams.get('redirect')
        if (redirectTo) {
          console.log('Redirection vers:', redirectTo)
          router.push(redirectTo)
        } else if (role === 'admin' || role === 'super_admin') {
          console.log('Redirection vers dashboard admin')
          router.push('/dashboard/admin')
        } else {
          console.log('Redirection vers dashboard:', role)
          router.push(`/dashboard/${role}`)
        }
      } else {
        setError(result.error || "Erreur de connexion")
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      setError("Erreur interne du serveur")
    } finally {
      setIsLoading(false)
    }
  }

  // plus de heuristique email->role; on s'aligne sur la réponse backend

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user starts typing
    if (error) {
      setError("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <Image src="/logo.png" alt="LAHA Editions" width={50} height={50} className="rounded-lg" />
            <span className="font-heading text-2xl font-bold text-laha-gold">Lahacademia</span>
          </Link>

          <BlurText
            text="Bon retour parmi nous !"
            delay={150}
            animateBy="words"
            direction="top"
            className="font-heading text-3xl font-bold text-white mb-2"
          />

          <BlurText
            text="Connectez-vous pour accéder à votre espace personnel"
            delay={200}
            animateBy="words"
            direction="bottom"
            className="text-white/70"
          />
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div className="relative rounded-2xl border border-white/10 p-8 backdrop-blur-md">
            <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500" />
                  <span className="ml-2 text-sm text-white/70">Se souvenir de moi</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm py-3 rounded-lg text-laha-black font-semibold hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <p className="text-white/70 text-sm mb-2">Comptes de démonstration :</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-white/60">
                  <strong>Élève:</strong> student@demo.com
                </div>
                <div className="text-white/60">
                  <strong>Prof:</strong> teacher@demo.com
                </div>
                <div className="text-white/60">
                  <strong>Parent:</strong> parent@demo.com
                </div>
                <div className="text-white/60">
                  <strong>Auteur:</strong> author@demo.com
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-white/70">
            Pas encore de compte ?{" "}
            <Link href="/account-type" className="text-laha-gold hover:text-laha-gold-soft font-medium">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}








