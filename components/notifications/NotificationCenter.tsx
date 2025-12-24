"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import logger from "@/lib/logger"
import Link from "next/link"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
  action_url?: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?unread_only=false', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const notifs = data.results || data.notifications || data || []
        setNotifications(notifs.slice(0, 10)) // Limiter à 10
        setUnreadCount(notifs.filter((n: Notification) => !n.is_read).length)
      }
    } catch (error) {
      logger.error('Error loading notifications', error as Error, { context: 'NotificationCenter' })
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/mark-read`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok || response.status === 204) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      logger.error('Error marking notification as read', error as Error, { context: 'NotificationCenter' })
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok || response.status === 204) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      logger.error('Error marking all as read', error as Error, { context: 'NotificationCenter' })
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCheck className="h-5 w-5 text-green-500" />
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-laha-gold" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `Il y a ${days}j`
    if (hours > 0) return `Il y a ${hours}h`
    if (minutes > 0) return `Il y a ${minutes}min`
    return 'À l\'instant'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-laha-gold/10"
        >
          <Bell className="h-5 w-5 text-laha-text" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-laha-surface border-laha-border" align="end">
        <div className="flex items-center justify-between p-4 border-b border-laha-border">
          <h3 className="font-semibold text-laha-text">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={loading}
              className="text-xs text-laha-gold hover:text-laha-gold/80"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-laha-text-secondary">
              <Bell className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-laha-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-laha-black-light/20 transition-colors ${
                    !notification.is_read ? 'bg-laha-gold/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-laha-text">
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex-shrink-0 text-laha-gold hover:text-laha-gold/80"
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-laha-text-secondary mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-laha-text-secondary mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                      {notification.action_url && (
                        <Link
                          href={notification.action_url}
                          className="text-xs text-laha-gold hover:underline mt-2 inline-block"
                          onClick={() => setOpen(false)}
                        >
                          Voir plus →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t border-laha-border">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="text-sm text-laha-gold hover:text-laha-gold/80 block text-center"
          >
            Voir toutes les notifications →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}



