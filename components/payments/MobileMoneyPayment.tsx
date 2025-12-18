"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Smartphone, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import logger from "@/lib/logger"
import Image from "next/image"

interface MobileMoneyPaymentProps {
  amount: number
  currency?: string
  description?: string
  paymentType?: "subscription" | "course" | "stage"
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export function MobileMoneyPayment({
  amount,
  currency = "XOF",
  description = "Paiement LAHACADEMIA",
  paymentType = "subscription",
  onSuccess,
  onError,
  onCancel,
}: MobileMoneyPaymentProps) {
  const [provider, setProvider] = useState<"mtn" | "orange" | "">("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [transactionId, setTransactionId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!provider || !phoneNumber) {
      setErrorMessage("Veuillez sélectionner un opérateur et saisir votre numéro")
      return
    }

    // Validation du numéro de téléphone (format africain)
    const phoneRegex = /^(\+?[0-9]{1,3})?[0-9]{8,12}$/
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      setErrorMessage("Numéro de téléphone invalide")
      return
    }

    try {
      setIsProcessing(true)
      setStatus("pending")
      setErrorMessage("")

      logger.info("Initiating mobile money payment", {
        provider,
        amount,
        currency,
        paymentType,
      }, { context: "MobileMoneyPayment" })

      const response = await fetch("/api/payments/mobile-money/initiate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider,
          phone_number: phoneNumber.replace(/\s/g, ""),
          amount,
          currency,
          description,
          payment_type: paymentType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'initiation du paiement")
      }

      setTransactionId(data.transaction_id)
      
      // Vérifier le statut du paiement toutes les 3 secondes
      const checkStatus = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            `/api/payments/mobile-money/status/${data.transaction_id}`,
            {
              credentials: "include",
            }
          )

          const statusData = await statusResponse.json()

          if (statusData.status === "completed") {
            clearInterval(checkStatus)
            setStatus("success")
            setIsProcessing(false)
            logger.info("Payment completed successfully", { transaction_id: data.transaction_id }, { context: "MobileMoneyPayment" })
            onSuccess?.(data.transaction_id)
          } else if (statusData.status === "failed") {
            clearInterval(checkStatus)
            setStatus("error")
            setIsProcessing(false)
            const error = "Le paiement a échoué. Veuillez réessayer."
            setErrorMessage(error)
            logger.error("Payment failed", new Error(error), { context: "MobileMoneyPayment" })
            onError?.(error)
          }
        } catch (err) {
          logger.error("Error checking payment status", err as Error, { context: "MobileMoneyPayment" })
        }
      }, 3000)

      // Arrêter de vérifier après 5 minutes (timeout)
      setTimeout(() => {
        if (status === "pending") {
          clearInterval(checkStatus)
          setStatus("error")
          setIsProcessing(false)
          const error = "Le paiement a expiré. Veuillez réessayer."
          setErrorMessage(error)
          onError?.(error)
        }
      }, 300000) // 5 minutes

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue"
      setStatus("error")
      setErrorMessage(errorMsg)
      setIsProcessing(false)
      logger.error("Error initiating payment", error as Error, { context: "MobileMoneyPayment" })
      onError?.(errorMsg)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Paiement Mobile Money
        </CardTitle>
        <CardDescription>
          Payez facilement avec MTN Money ou Orange Money
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Montant */}
          <div className="bg-laha-gold/10 p-4 rounded-lg text-center">
            <p className="text-sm text-laha-text-secondary mb-1">Montant à payer</p>
            <p className="text-3xl font-bold text-laha-gold">
              {amount.toLocaleString()} {currency}
            </p>
            <p className="text-xs text-laha-text-secondary mt-1">{description}</p>
          </div>

          {/* Sélection de l'opérateur */}
          <div className="space-y-2">
            <Label htmlFor="provider">Opérateur Mobile Money</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as "mtn" | "orange")}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Sélectionnez votre opérateur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                      M
                    </div>
                    MTN Money
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      O
                    </div>
                    Orange Money
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Numéro de téléphone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+229 XX XX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-laha-text-secondary">
              Entrez le numéro associé à votre compte Mobile Money
            </p>
          </div>

          {/* Messages de statut */}
          {status === "pending" && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <strong>Paiement en cours...</strong>
                <br />
                Veuillez composer <strong>#150#</strong> sur votre téléphone pour valider le paiement.
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                <strong>Paiement réussi !</strong>
                <br />
                Transaction ID: {transactionId}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          {status !== "success" && (
            <>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isProcessing || !provider || !phoneNumber}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  "Payer maintenant"
                )}
              </Button>
            </>
          )}
          {status === "success" && (
            <Button type="button" className="w-full" onClick={onCancel}>
              Terminer
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}


