"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ParentSidebar } from "@/components/parent/parent-sidebar"
import { Loader2 } from "lucide-react"

/**
 * Redirection vers la page de réservation principale  
 * Toute la logique de réservation est centralisée dans /dashboard/bookings
 */
export default function ParentBookRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/dashboard/bookings")
  }, [router])

  return (
    <AuthGuard requiredRole="parent">
      <ParentSidebar>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-laha-gold mx-auto mb-4" />
          <p className="text-laha-text-secondary">Redirection vers la réservation...</p>
        </div>
      </ParentSidebar>
    </AuthGuard>
  )
}




