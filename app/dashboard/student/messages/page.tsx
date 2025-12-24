"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

/**
 * Redirection vers la messagerie principale
 * Les élèves utilisent le même système de messagerie que tous les utilisateurs
 */
export default function StudentMessagesRedirect() {
  useEffect(() => {
    redirect("/dashboard/messages")
  }, [])

  // Redirection immédiate côté serveur
  redirect("/dashboard/messages")
}




