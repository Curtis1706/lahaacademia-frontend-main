"use client"

import { useState, useEffect } from "react"
import { Bell, Check, CheckCheck, Settings, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import logger from "@/lib/logger"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
  action_url?: string
}

interface NotificationPreferences {
  email_enabled: boolean
  sms_enabled: boolean
  push_enabled: boolean
  notification_types: {
    courses: boolean
    payments: boolean
    messages: boolean
    system: boolean
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    loadData()
  }, [filter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [notifsRes, prefsRes] = await Promise.all([
        fetch(`/api/notifications?unread_only=${filter === 'unread' ? 'true' : 'false'}`, {
          credentials: 'include'
        }),
        fetch('/api/notifications/preferences', { credentials: 'include' })
      ])

      if (notifsRes.ok) {
        const data = await notifsRes.json()
        setNotifications(data.results || data.notifications || data || [])
      }

      if (prefsRes.ok) {
        const data = await prefsRes.json()
        setPreferences(data)
      }
    } catch (error) {
      logger.error('Error loading notifications', error as Error, { context: 'notifications/page' })
    } finally {
      setLoading(false)
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
      }
    } catch (error) {
      logger.error('Error marking as read', error as Error, { context: 'notifications/page' })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok || response.status === 204) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      }
    } catch (error) {
      logger.error('Error marking all as read', error as Error, { context: 'notifications/page' })
    }
  }

  const updatePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...preferences, ...newPrefs })
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
        alert('Préférences mises à jour')
      }
    } catch (error) {
      logger.error('Error updating preferences', error as Error, { context: 'notifications/page' })
      alert('Erreur lors de la mise à jour')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 text-green-500'
      case 'warning': return 'bg-yellow-500/20 text-yellow-500'
      case 'error': return 'bg-red-500/20 text-red-500'
      default: return 'bg-laha-gold/20 text-laha-gold'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-laha-gold mb-2">Notifications</h1>
              <p className="text-laha-text-secondary">
                {unreadCount > 0
                  ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                  : 'Toutes les notifications sont lues'}
              </p>
            </div>
            <Button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="bg-laha-gold hover:bg-laha-gold/90 text-laha-black"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          </div>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-laha-surface/80">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-laha-gold data-[state=active]:text-laha-black">
              <Settings className="h-4 w-4 mr-2" />
              Préférences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-6">
            {/* Filtres */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-laha-gold text-laha-black' : ''}
              >
                Toutes
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                onClick={() => setFilter('unread')}
                className={filter === 'unread' ? 'bg-laha-gold text-laha-black' : ''}
              >
                Non lues ({unreadCount})
              </Button>
            </div>

            {/* Liste des notifications */}
            <div className="space-y-3">
              {loading ? (
                <Card className="bg-laha-surface/80 border-laha-border">
                  <CardContent className="p-8 text-center text-laha-text-secondary">
                    Chargement...
                  </CardContent>
                </Card>
              ) : notifications.length === 0 ? (
                <Card className="bg-laha-surface/80 border-laha-border">
                  <CardContent className="p-8 text-center text-laha-text-secondary">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune notification</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`bg-laha-surface/80 border-laha-border ${
                      !notification.is_read ? 'ring-2 ring-laha-gold/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-laha-text flex items-center gap-2">
                              {notification.title}
                              <Badge className={getTypeColor(notification.type)}>
                                {notification.type}
                              </Badge>
                            </h3>
                            {!notification.is_read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-laha-gold hover:text-laha-gold/80"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Marquer lu
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-laha-text-secondary mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-laha-text-secondary">
                              {formatDate(notification.created_at)}
                            </p>
                            {notification.action_url && (
                              <Link
                                href={notification.action_url}
                                className="text-sm text-laha-gold hover:underline"
                              >
                                Voir plus →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            {preferences && (
              <Card className="bg-laha-surface/80 border-laha-border">
                <CardHeader>
                  <CardTitle className="text-laha-gold">Paramètres de Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Canaux */}
                  <div>
                    <h3 className="text-lg font-semibold text-laha-text mb-4">Canaux de notification</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email_enabled}
                          onChange={(e) =>
                            updatePreferences({ email_enabled: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Notifications par Email</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.sms_enabled}
                          onChange={(e) =>
                            updatePreferences({ sms_enabled: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Notifications par SMS</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.push_enabled}
                          onChange={(e) =>
                            updatePreferences({ push_enabled: e.target.checked })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Notifications Push (Navigateur)</span>
                      </label>
                    </div>
                  </div>

                  {/* Types de notifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-laha-text mb-4">Types de notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_types.courses}
                          onChange={(e) =>
                            updatePreferences({
                              notification_types: {
                                ...preferences.notification_types,
                                courses: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Cours et formations</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_types.payments}
                          onChange={(e) =>
                            updatePreferences({
                              notification_types: {
                                ...preferences.notification_types,
                                payments: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Paiements et abonnements</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_types.messages}
                          onChange={(e) =>
                            updatePreferences({
                              notification_types: {
                                ...preferences.notification_types,
                                messages: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Messages et communications</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.notification_types.system}
                          onChange={(e) =>
                            updatePreferences({
                              notification_types: {
                                ...preferences.notification_types,
                                system: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-laha-text">Notifications système</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



