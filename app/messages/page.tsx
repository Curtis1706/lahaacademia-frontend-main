"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import BlurText from "@/components/ui/blur-text"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(0)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Dr. Aminata Diallo",
      role: "Professeur de Mathématiques",
      avatar: "/placeholder.svg?height=50&width=50&text=AD",
      lastMessage: "Excellent travail sur les dérivées !",
      time: "Il y a 1h",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Prof. Jean-Baptiste",
      role: "Professeur de Physique",
      avatar: "/placeholder.svg?height=50&width=50&text=JB",
      lastMessage: "N'oubliez pas le devoir de physique",
      time: "Il y a 3h",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Support LAHA",
      role: "Équipe support",
      avatar: "/placeholder.svg?height=50&width=50&text=SL",
      lastMessage: "Votre certificat est prêt",
      time: "Il y a 1j",
      unread: 1,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Dr. Aminata Diallo",
      content: "Bonjour Koffi ! J'ai vu votre travail sur les dérivées, c'est excellent !",
      time: "14:30",
      isMe: false,
    },
    {
      id: 2,
      sender: "Moi",
      content: "Merci beaucoup Dr. Diallo ! J'ai beaucoup travaillé dessus.",
      time: "14:32",
      isMe: true,
    },
    {
      id: 3,
      sender: "Dr. Aminata Diallo",
      content: "Continuez comme ça ! Avez-vous des questions sur le prochain chapitre ?",
      time: "14:35",
      isMe: false,
    },
    {
      id: 4,
      sender: "Moi",
      content: "Oui, j'ai quelques difficultés avec les intégrales. Pourriez-vous m'expliquer ?",
      time: "14:37",
      isMe: true,
    },
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logique d'envoi de message
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
              <BlurText
                text="Messages"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-heading text-2xl font-bold text-white"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-white/10 bg-white/5 backdrop-blur-md">
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="overflow-y-auto">
            {conversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                  selectedConversation === index ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setSelectedConversation(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={conversation.avatar || "/placeholder.svg"}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-medium truncate">{conversation.name}</h3>
                      <span className="text-white/50 text-xs">{conversation.time}</span>
                    </div>
                    <p className="text-white/70 text-sm truncate">{conversation.role}</p>
                    <p className="text-white/60 text-sm truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={conversations[selectedConversation].avatar || "/placeholder.svg"}
                  alt={conversations[selectedConversation].name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{conversations[selectedConversation].name}</h3>
                  <p className="text-white/70 text-sm">{conversations[selectedConversation].role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isMe
                      ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white"
                      : "bg-white/10 text-white backdrop-blur-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isMe ? "text-white/80" : "text-white/60"}`}>{message.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="p-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
