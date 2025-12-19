/**
 * Système de logging centralisé pour remplacer console.log
 * Respecte l'environnement (dev/prod) et permet de désactiver les logs en production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  level?: LogLevel
  context?: string
  data?: any
}

class Logger {
  private isDevelopment: boolean
  private enabled: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.enabled = process.env.NEXT_PUBLIC_ENABLE_LOGS !== 'false'
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false
    // En production, ne logger que les warnings et erreurs
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return false
    }
    return true
  }

  private formatMessage(message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? `[${context}]` : ''
    return `${timestamp} ${contextStr} ${message}`
  }

  debug(message: string, options?: LogOptions) {
    if (!this.shouldLog('debug')) return
    const formatted = this.formatMessage(message, options?.context)
    console.debug(formatted, options?.data || '')
  }

  info(message: string, options?: LogOptions) {
    if (!this.shouldLog('info')) return
    const formatted = this.formatMessage(message, options?.context)
    console.info(formatted, options?.data || '')
  }

  warn(message: string, options?: LogOptions) {
    if (!this.shouldLog('warn')) return
    const formatted = this.formatMessage(message, options?.context)
    console.warn(formatted, options?.data || '')
  }

  error(message: string, error?: Error | any, options?: LogOptions) {
    if (!this.shouldLog('error')) return
    const formatted = this.formatMessage(message, options?.context)
    if (error instanceof Error) {
      console.error(formatted, error.message, error.stack, options?.data || '')
    } else {
      console.error(formatted, error || options?.data || '')
    }
  }

  // Méthodes de compatibilité pour migration progressive
  log(message: string, data?: any) {
    this.info(message, { data })
  }
}

// Export d'une instance singleton
export const logger = new Logger()

// Export par défaut pour faciliter l'import
export default logger




