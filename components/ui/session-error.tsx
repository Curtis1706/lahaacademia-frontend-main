"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface SessionErrorProps {
  error: string
  onRetry?: () => void
  showRetryButton?: boolean
}

export function SessionError({ error, onRetry, showRetryButton = true }: SessionErrorProps) {
  const isSessionExpired = error.includes('Session expirée') || error.includes('Non authentifié')
  
  const handleReconnect = () => {
    const currentPath = window.location.pathname
    window.location.href = `/login?message=${encodeURIComponent(error)}&redirect=${encodeURIComponent(currentPath)}`
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">
          <AlertCircle className="mx-auto" />
        </div>
        
        <h2 className="text-red-500 text-xl font-semibold mb-2">
          Erreur lors du chargement des données
        </h2>
        
        <p className="text-laha-text/70 text-sm mb-6">
          {error}
        </p>

        {isSessionExpired && (
          <div className="space-y-3">
            <p className="text-laha-text/70 text-sm">
              Votre session a expiré. Veuillez vous reconnecter pour continuer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                onClick={handleReconnect}
                className="bg-laha-gold hover:bg-laha-gold/90 text-white"
              >
                Se reconnecter
              </Button>
              
              {showRetryButton && onRetry && (
                <Button 
                  onClick={onRetry}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Réessayer
                </Button>
              )}
            </div>
            
            <p className="text-laha-text/50 text-xs">
              Redirection automatique dans quelques secondes...
            </p>
          </div>
        )}

        {!isSessionExpired && showRetryButton && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        )}
      </div>
    </div>
  )
}


