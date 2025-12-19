"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logger from "@/lib/logger"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("Token de réinitialisation manquant")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          password_confirm: passwordConfirm,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        logger.info("Password reset successful", {}, { context: "reset-password" })
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.error || "Erreur lors de la réinitialisation")
        logger.error("Failed to reset password", new Error(data.error), { context: "reset-password" })
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      logger.error("Error in reset password", err as Error, { context: "reset-password" })
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-laha-surface/80 backdrop-blur-md rounded-2xl border border-laha-border p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/20 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-laha-gold mb-4">Mot de passe réinitialisé !</h1>
            <p className="text-laha-text-secondary mb-6">
              Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
            >
              Se connecter maintenant
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-laha-surface/80 backdrop-blur-md rounded-2xl border border-laha-border p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-laha-gold/20 rounded-full">
                <Lock className="h-8 w-8 text-laha-gold" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-laha-gold mb-2">Nouveau mot de passe</h1>
            <p className="text-laha-text-secondary">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-laha-text">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-laha-black-light/20 border-laha-border text-laha-text placeholder:text-laha-text-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-laha-text-secondary hover:text-laha-text"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-laha-text-secondary">
                Minimum 8 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-confirm" className="text-laha-text">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password-confirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="bg-laha-black-light/20 border-laha-border text-laha-text placeholder:text-laha-text-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-laha-text-secondary hover:text-laha-text"
                >
                  {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black font-semibold"
            >
              {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-laha-gold hover:text-laha-gold/80 text-sm transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}



