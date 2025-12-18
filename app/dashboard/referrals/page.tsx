"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Gift,
  Copy,
  Users,
  TrendingUp,
  Share2,
  CheckCircle,
  Loader2,
  Star,
  Zap,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import logger from "@/lib/logger"

interface ReferralData {
  referral_code: string
  referral_link: string
  total_referrals: number
  pending_referrals: number
  active_referrals: number
  total_bonus: number
  bonus_currency: string
  referrals: Array<{
    id: string
    referee_name: string
    status: "pending" | "active"
    bonus_earned: number
    joined_date: string
  }>
}

const BONUS_TIERS = [
  { referrals: 1, bonus: 500, icon: Star },
  { referrals: 5, bonus: 3000, icon: Gift },
  { referrals: 10, bonus: 7500, icon: TrendingUp },
  { referrals: 20, bonus: 20000, icon: Zap },
]

export default function ReferralsPage() {
  return (
    <AuthGuard>
      <ReferralsContent />
    </AuthGuard>
  )
}

function ReferralsContent() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyCodeValue, setApplyCodeValue] = useState("")
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/referrals", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      }
    } catch (error) {
      logger.error("Error fetching referral data", error as Error, { context: "ReferralsPage" })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (referralData?.referral_link) {
      navigator.clipboard.writeText(referralData.referral_link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      logger.info("Referral link copied", {}, { context: "ReferralsPage" })
    }
  }

  const handleApplyCode = async () => {
    if (!applyCodeValue.trim()) return

    try {
      setApplying(true)
      setMessage(null)

      const response = await fetch("/api/referrals", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referral_code: applyCodeValue,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'application du code")
      }

      setMessage({
        type: "success",
        text: `Code appliqué ! Vous avez gagné ${data.bonus} ${data.currency}`,
      })
      setApplyCodeValue("")
      fetchReferralData()
      logger.info("Referral code applied", { bonus: data.bonus }, { context: "ReferralsPage" })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue"
      setMessage({ type: "error", text: errorMsg })
      logger.error("Error applying referral code", error as Error, { context: "ReferralsPage" })
    } finally {
      setApplying(false)
    }
  }

  const shareViaWhatsApp = () => {
    if (referralData?.referral_link) {
      const text = encodeURIComponent(
        `Rejoins-moi sur LAHACADEMIA ! 📚✨ Utilise mon code de parrainage et bénéficie d'un bonus exclusif : ${referralData.referral_link}`
      )
      window.open(`https://wa.me/?text=${text}`, "_blank")
    }
  }

  const getNextTier = () => {
    if (!referralData) return null
    return BONUS_TIERS.find((tier) => tier.referrals > referralData.total_referrals)
  }

  const nextTier = getNextTier()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-laha-gold mb-2">Programme de Parrainage</h1>
          <p className="text-laha-text-secondary">
            Invitez vos amis et gagnez des bonus exclusifs !
          </p>
        </div>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className="mb-6"
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Stats principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-laha-gold/10 rounded-lg">
                  <Users className="h-6 w-6 text-laha-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">
                    {referralData?.total_referrals || 0}
                  </p>
                  <p className="text-sm text-laha-text-secondary">Parrainages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">
                    {referralData?.active_referrals || 0}
                  </p>
                  <p className="text-sm text-laha-text-secondary">Actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Loader2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-text">
                    {referralData?.pending_referrals || 0}
                  </p>
                  <p className="text-sm text-laha-text-secondary">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Gift className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-laha-gold">
                    {referralData?.total_bonus || 0} {referralData?.bonus_currency || "XOF"}
                  </p>
                  <p className="text-sm text-laha-text-secondary">Bonus gagnés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Partager mon code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Partagez votre code
              </CardTitle>
              <CardDescription>
                Invitez vos amis et gagnez des bonus pour chaque inscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-laha-text-secondary mb-2 block">
                  Votre code de parrainage
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralData?.referral_code || ""}
                    readOnly
                    className="font-mono text-lg font-bold text-center"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="px-4"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-laha-text-secondary mb-2 block">
                  Lien de parrainage
                </label>
                <Input
                  value={referralData?.referral_link || ""}
                  readOnly
                  className="text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCopyLink}
                  className="flex-1 bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </Button>
                <Button
                  onClick={shareViaWhatsApp}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Utiliser un code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Vous avez un code ?
              </CardTitle>
              <CardDescription>
                Entrez le code de parrainage d'un ami pour obtenir votre bonus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-laha-text-secondary mb-2 block">
                  Code de parrainage
                </label>
                <Input
                  placeholder="Entrez le code..."
                  value={applyCodeValue}
                  onChange={(e) => setApplyCodeValue(e.target.value.toUpperCase())}
                  className="font-mono text-lg"
                />
              </div>

              <Button
                onClick={handleApplyCode}
                disabled={!applyCodeValue.trim() || applying}
                className="w-full bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
              >
                {applying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Application...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Appliquer le code
                  </>
                )}
              </Button>

              <div className="bg-laha-gold/10 rounded-lg p-4 border border-laha-gold/20">
                <p className="text-sm text-laha-text-secondary">
                  💡 <strong>Astuce :</strong> Demandez à vos amis de partager leur code
                  avec vous. Vous recevrez tous les deux un bonus !
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Paliers de bonus */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Paliers de récompenses</CardTitle>
            <CardDescription>
              Plus vous parrainez, plus vous gagnez !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {BONUS_TIERS.map((tier, index) => {
                const Icon = tier.icon
                const isUnlocked = (referralData?.total_referrals || 0) >= tier.referrals
                const isCurrent =
                  nextTier?.referrals === tier.referrals

                return (
                  <div
                    key={index}
                    className={`relative p-6 rounded-lg border-2 transition-all ${
                      isUnlocked
                        ? "bg-laha-gold/10 border-laha-gold"
                        : isCurrent
                        ? "bg-blue-500/10 border-blue-500"
                        : "bg-laha-surface/20 border-laha-border opacity-60"
                    }`}
                  >
                    {isUnlocked && (
                      <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-laha-gold" />
                    )}
                    <Icon className="h-8 w-8 mx-auto mb-3 text-laha-gold" />
                    <p className="text-center font-bold text-lg mb-1">
                      {tier.referrals} parrainages
                    </p>
                    <p className="text-center text-2xl font-bold text-laha-gold">
                      {tier.bonus} XOF
                    </p>
                    {isCurrent && (
                      <Badge className="w-full mt-2 bg-blue-500 text-white justify-center">
                        Prochain palier
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Liste des parrainages */}
        {referralData && referralData.referrals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Vos parrainages</CardTitle>
              <CardDescription>
                Historique de vos invitations ({referralData.referrals.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {referralData.referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between p-4 bg-laha-surface/20 rounded-lg border border-laha-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-laha-gold/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-laha-gold" />
                      </div>
                      <div>
                        <p className="font-semibold text-laha-text">{ref.referee_name}</p>
                        <p className="text-sm text-laha-text-secondary">
                          Inscrit le {new Date(ref.joined_date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          ref.status === "active"
                            ? "bg-green-500/10 text-green-700 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                        }
                      >
                        {ref.status === "active" ? "Actif" : "En attente"}
                      </Badge>
                      <p className="text-sm font-bold text-laha-gold mt-1">
                        +{ref.bonus_earned} XOF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


