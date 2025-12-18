"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import logger from "@/lib/logger"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        logger.info("Password reset email sent", { email }, { context: "forgot-password" })
      } else {
        setError(data.error || "Erreur lors de l'envoi de l'email")
        logger.error("Failed to send reset email", new Error(data.error), { context: "forgot-password" })
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      logger.error("Error in forgot password", err as Error, { context: "forgot-password" })
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
            <h1 className="text-2xl font-bold text-laha-gold mb-4">Email envoyé !</h1>
            <p className="text-laha-text-secondary mb-6">
              Un email de réinitialisation a été envoyé à <strong className="text-laha-text">{email}</strong>.
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
            >
              Retour à la connexion
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
                <Mail className="h-8 w-8 text-laha-gold" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-laha-gold mb-2">Mot de passe oublié ?</h1>
            <p className="text-laha-text-secondary">
              Entrez votre email et nous vous enverrons un lien de réinitialisation
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
              <Label htmlFor="email" className="text-laha-text">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-laha-black-light/20 border-laha-border text-laha-text placeholder:text-laha-text-secondary"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-laha-gold hover:bg-laha-gold/90 text-laha-black font-semibold"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-laha-gold hover:text-laha-gold/80 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

