"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Sparkles, X, Loader2 } from "lucide-react"
import { MobileMoneyPayment } from "@/components/payments/MobileMoneyPayment"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import logger from "@/lib/logger"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  duration: "monthly" | "quarterly" | "yearly"
  duration_label: string
  features: string[]
  popular?: boolean
  discount?: number
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "monthly",
    name: "Mensuel",
    price: 5000,
    currency: "XOF",
    duration: "monthly",
    duration_label: "par mois",
    features: [
      "Accès illimité à tous les cours",
      "Téléchargement des ressources PDF",
      "Support prioritaire",
      "Examens blancs illimités",
      "Accès aux forums privés",
    ],
  },
  {
    id: "quarterly",
    name: "Trimestriel",
    price: 12000,
    currency: "XOF",
    duration: "quarterly",
    duration_label: "par trimestre",
    popular: true,
    discount: 20,
    features: [
      "Tous les avantages du plan Mensuel",
      "Économisez 20%",
      "1 session de tutorat offerte",
      "Accès anticipé aux nouveaux contenus",
      "Certificats de progression",
    ],
  },
  {
    id: "yearly",
    name: "Annuel",
    price: 40000,
    currency: "XOF",
    duration: "yearly",
    duration_label: "par an",
    discount: 33,
    features: [
      "Tous les avantages du plan Trimestriel",
      "Économisez 33%",
      "3 sessions de tutorat offertes",
      "Stage intensif gratuit",
      "Badge Premium exclusif",
      "Accès à vie aux contenus téléchargés",
    ],
  },
]

export default function SubscriptionsPage() {
  return (
    <AuthGuard>
      <SubscriptionsContent />
    </AuthGuard>
  )
}

function SubscriptionsContent() {
  const { user } = useAuth()
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    fetchCurrentSubscription()
  }, [])

  const fetchCurrentSubscription = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/payments/subscriptions", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(data.current_subscription)
      }
    } catch (error) {
      logger.error("Error fetching subscription", error as Error, { context: "SubscriptionsPage" })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    logger.info("Subscription payment successful", { transactionId, plan: selectedPlan?.id }, { context: "SubscriptionsPage" })
    
    // Recharger l'abonnement actuel
    fetchCurrentSubscription()
    
    // Fermer le dialog après 2 secondes
    setTimeout(() => {
      setShowPayment(false)
      setSelectedPlan(null)
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    logger.error("Subscription payment failed", new Error(error), { context: "SubscriptionsPage" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-10 w-10 text-laha-gold" />
            <h1 className="text-4xl font-bold text-laha-gold">Passez à Premium</h1>
          </div>
          <p className="text-lg text-laha-text-secondary max-w-2xl mx-auto">
            Débloquez tout le potentiel de LAHACADEMIA avec un accès illimité à tous les contenus,
            cours, tutorats et plus encore !
          </p>
        </div>

        {/* Abonnement actuel */}
        {loading ? (
          <div className="flex justify-center mb-8">
            <Loader2 className="h-8 w-8 animate-spin text-laha-gold" />
          </div>
        ) : currentSubscription ? (
          <Card className="mb-8 border-laha-gold bg-gradient-to-r from-laha-gold/10 to-laha-gold-warm/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-laha-gold" />
                    Abonnement Actif
                  </CardTitle>
                  <CardDescription>
                    Vous êtes actuellement abonné au plan{" "}
                    <strong className="text-laha-gold">{currentSubscription.plan_name}</strong>
                  </CardDescription>
                </div>
                <Badge className="bg-laha-gold text-laha-black">Premium</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-laha-text-secondary">Date de début :</span>
                  <p className="font-medium text-laha-text">
                    {new Date(currentSubscription.start_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <span className="text-laha-text-secondary">Date d'expiration :</span>
                  <p className="font-medium text-laha-text">
                    {new Date(currentSubscription.end_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <span className="text-laha-text-secondary">Renouvellement :</span>
                  <p className="font-medium text-laha-text">
                    {currentSubscription.auto_renew ? "Automatique" : "Manuel"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Plans d'abonnement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? "border-laha-gold shadow-lg shadow-laha-gold/20 scale-105"
                  : "border-laha-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-laha-gold text-laha-black px-4 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  {plan.discount && (
                    <Badge variant="outline" className="mb-2 text-green-600 border-green-600">
                      -{plan.discount}%
                    </Badge>
                  )}
                  <div className="text-4xl font-bold text-laha-gold">
                    {plan.price.toLocaleString()}
                    <span className="text-sm text-laha-text-secondary ml-1">{plan.currency}</span>
                  </div>
                  <p className="text-sm text-laha-text-secondary mt-1">{plan.duration_label}</p>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-laha-gold shrink-0 mt-0.5" />
                      <span className="text-sm text-laha-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                      : "bg-laha-surface hover:bg-laha-surface/80"
                  }`}
                  disabled={currentSubscription?.plan_id === plan.id}
                >
                  {currentSubscription?.plan_id === plan.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Plan actif
                    </>
                  ) : (
                    "Choisir ce plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Section FAQ ou avantages */}
        <div className="bg-laha-surface/20 rounded-xl p-8 border border-laha-border">
          <h2 className="text-2xl font-bold text-laha-gold mb-6 text-center">
            Pourquoi passer à Premium ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Check className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-laha-text mb-1">Accès illimité</h3>
                <p className="text-sm text-laha-text-secondary">
                  Tous les cours, vidéos, documents et QCM sans restriction
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Check className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-laha-text mb-1">Support prioritaire</h3>
                <p className="text-sm text-laha-text-secondary">
                  Réponses rapides de nos enseignants et support technique
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Check className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-laha-text mb-1">Certificats officiels</h3>
                <p className="text-sm text-laha-text-secondary">
                  Obtenez des certificats de progression et de réussite
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-laha-gold/20 rounded-lg">
                <Check className="h-5 w-5 text-laha-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-laha-text mb-1">Sans engagement</h3>
                <p className="text-sm text-laha-text-secondary">
                  Annulez ou changez de plan à tout moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog de paiement */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finaliser votre abonnement</DialogTitle>
            <DialogDescription>
              Plan sélectionné : <strong>{selectedPlan?.name}</strong> -{" "}
              {selectedPlan?.price.toLocaleString()} {selectedPlan?.currency}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            {selectedPlan && (
              <MobileMoneyPayment
                amount={selectedPlan.price}
                currency={selectedPlan.currency}
                description={`Abonnement ${selectedPlan.name} - LAHACADEMIA`}
                paymentType="subscription"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={() => {
                  setShowPayment(false)
                  setSelectedPlan(null)
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}




