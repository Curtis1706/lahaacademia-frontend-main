"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { Loader2 } from "lucide-react"

/**
 * Redirection vers la page de paiements principale
 * Toute la logique de paiement et historique est centralisée dans /dashboard/payments
 */
export default function ParentPaymentsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/payments")
  }, [router])

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-laha-gold mx-auto mb-4" />
            <p className="text-laha-text-secondary">Redirection vers les paiements...</p>
          </div>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}


