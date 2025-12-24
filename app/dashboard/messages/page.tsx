"use client"

import { useState, useEffect, useRef } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Send,
  Search,
  User,
  Clock,
  Shield,
  CheckCheck,
  Loader2,
  AlertCircle,
} from "lucide-react"
import logger from "@/lib/logger"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  recipient: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
  is_read: boolean
  is_filtered: boolean
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  last_message: string
  last_message_time: string
  unread_count: number
}

export default function MessagesPage() {
  return (
    <AuthGuard>
      <MessagesContent />
    </AuthGuard>
  )
}

function MessagesContent() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/messages/conversations", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.results || [])
      }
    } catch (error) {
      logger.error("Error fetching conversations", error as Error, { context: "MessagesPage" })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversation_id=${conversationId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.results || [])
      }
    } catch (error) {
      logger.error("Error fetching messages", error as Error, { context: "MessagesPage" })
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSending(true)

      const response = await fetch("/api/messages", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient_id: selectedConversation.participant.id,
          content: newMessage,
          conversation_id: selectedConversation.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message")
      }

      const data = await response.json()

      // Ajouter le message à la liste
      setMessages([...messages, data])
      setNewMessage("")

      // Si le message a été filtré, afficher une alerte
      if (data.is_filtered) {
        alert("⚠️ Votre message contenait du contenu inapproprié qui a été modéré.")
      }

      logger.info("Message sent", { message_id: data.id }, { context: "MessagesPage" })
    } catch (error) {
      logger.error("Error sending message", error as Error, { context: "MessagesPage" })
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface/50 to-laha-gold-light-new/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold mb-2">Messagerie</h1>
          <p className="text-laha-text-secondary">
            Communiquez en toute sécurité avec les autres membres
          </p>
        </div>

        {/* Alerte de sécurité */}
        <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Messagerie sécurisée
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Les numéros de téléphone, emails et liens externes sont automatiquement
                  filtrés. Tous les échanges sont modérés pour votre protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interface de messagerie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des conversations */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-laha-text-secondary" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-laha-gold" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-laha-text-secondary">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune conversation</p>
                </div>
              ) : (
                <div className="divide-y divide-laha-border">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-laha-surface/50 transition-colors ${
                        selectedConversation?.id === conv.id ? "bg-laha-gold/10" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-laha-gold/20 flex items-center justify-center flex-shrink-0">
                          {conv.participant.avatar ? (
                            <img
                              src={conv.participant.avatar}
                              alt={conv.participant.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-laha-gold" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-laha-text truncate">
                              {conv.participant.name}
                            </p>
                            {conv.unread_count > 0 && (
                              <Badge className="bg-laha-gold text-laha-black">
                                {conv.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-laha-text-secondary truncate">
                            {conv.last_message}
                          </p>
                          <p className="text-xs text-laha-text-secondary mt-1">
                            {new Date(conv.last_message_time).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zone de messages */}
          <Card className="lg:col-span-2 flex flex-col" style={{ height: "600px" }}>
            {selectedConversation ? (
              <>
                {/* Header de conversation */}
                <CardHeader className="border-b border-laha-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-laha-gold/20 flex items-center justify-center">
                      {selectedConversation.participant.avatar ? (
                        <img
                          src={selectedConversation.participant.avatar}
                          alt={selectedConversation.participant.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-laha-gold" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-laha-text">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-xs text-laha-text-secondary">
                        {selectedConversation.participant.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-laha-text-secondary">
                      <p>Aucun message pour le moment</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.sender.id !== selectedConversation.participant.id
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isOwn
                                ? "bg-laha-gold text-laha-black"
                                : "bg-laha-surface border border-laha-border"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <Clock className="h-3 w-3 opacity-70" />
                              <span className="text-xs opacity-70">
                                {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isOwn && msg.is_read && (
                                <CheckCheck className="h-3 w-3 opacity-70" />
                              )}
                            </div>
                            {msg.is_filtered && (
                              <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                                <span className="text-xs text-yellow-600">
                                  Message modéré
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Zone de saisie */}
                <div className="p-4 border-t border-laha-border">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      rows={2}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="bg-laha-gold hover:bg-laha-gold-warm text-laha-black"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-laha-text-secondary mt-2">
                    Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full text-laha-text-secondary">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une conversation pour commencer</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}




