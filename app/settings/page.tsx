"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from "lucide-react"
import BlurText from "@/components/ui/blur-text"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowMessages: true,
    },
    appearance: {
      theme: "dark",
      language: "fr",
    },
  })

  const handleToggle = (category: string, setting: string) => {
    setSettings(prev => {
      if (category === 'notifications') {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [setting]: !prev.notifications[setting as keyof typeof prev.notifications]
          }
        }
      } else if (category === 'privacy') {
        return {
          ...prev,
          privacy: {
            ...prev.privacy,
            [setting]: !prev.privacy[setting as keyof typeof prev.privacy]
          }
        }
      } else if (category === 'appearance') {
        return {
          ...prev,
          appearance: {
            ...prev.appearance,
            [setting]: !prev.appearance[setting as keyof typeof prev.appearance]
          }
        }
      }
      return prev
    })
  }

  const settingSections = [
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5 text-laha-gold" />,
      items: [
        {
          key: "email",
          label: "Notifications par email",
          description: "Recevoir les notifications importantes par email",
        },
        { key: "push", label: "Notifications push", description: "Notifications en temps réel sur votre appareil" },
        { key: "sms", label: "Notifications SMS", description: "Recevoir des SMS pour les alertes urgentes" },
        { key: "marketing", label: "Communications marketing", description: "Recevoir des offres et actualités" },
      ],
    },
    {
      title: "Confidentialité",
      icon: <Shield className="h-5 w-5 text-laha-gold-warm" />,
      items: [
        { key: "profileVisible", label: "Profil visible", description: "Permettre aux autres de voir votre profil" },
        { key: "showOnlineStatus", label: "Statut en ligne", description: "Afficher quand vous êtes connecté" },
        {
          key: "allowMessages",
          label: "Autoriser les messages",
          description: "Recevoir des messages d'autres utilisateurs",
        },
      ],
    },
    {
      title: "Apparence",
      icon: <Palette className="h-5 w-5 text-laha-gold-soft" />,
      items: [
        { key: "theme", label: "Thème", description: "Choisir l'apparence de l'interface" },
        { key: "language", label: "Langue", description: "Langue de l'interface" },
      ],
    },
    {
      title: "Autres",
      icon: <Globe className="h-5 w-5 text-laha-gold-light" />,
      items: [
        { key: "help", label: "Centre d'aide", description: "FAQ et support technique" },
        { key: "logout", label: "Déconnexion", description: "Se déconnecter de votre compte" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark">
      {/* Header */}
      <header className="border-b border-laha-gold-dark/20 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-laha-gold-light/70 hover:text-laha-gold-light transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
              <BlurText
                text="Paramètres"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-heading text-2xl font-bold text-laha-gold"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Notifications & Privacy & Appearance & Other Settings */}
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-laha-black-light/30 backdrop-blur-md rounded-2xl p-6 border border-laha-gold-dark/30"
            >
              <h3 className="text-xl font-semibold text-laha-gold-light mb-6 flex items-center gap-2">
                {section.icon}
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-laha-black-light/20 rounded-lg border border-laha-gold-dark/10">
                    <div>
                      <h4 className="text-laha-gold-light font-medium">{item.label}</h4>
                      <p className="text-laha-gold-light/70 text-sm">{item.description}</p>
                    </div>
                    {item.key === "theme" || item.key === "language" ? (
                      <select
                        value={settings.appearance[item.key as keyof typeof settings.appearance]}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            appearance: { ...prev.appearance, [item.key]: e.target.value },
                          }))
                        }
                        className="bg-laha-black-light/40 border border-laha-gold-dark/30 rounded-lg px-3 py-2 text-laha-gold-light focus:outline-none focus:ring-2 focus:ring-laha-gold focus:border-laha-gold-warm"
                      >
                        {item.key === "theme" ? (
                          <>
                            <option value="dark">Sombre</option>
                            <option value="light">Clair</option>
                            <option value="auto">Automatique</option>
                          </>
                        ) : (
                          <>
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                          </>
                        )}
                      </select>
                    ) : item.key === "help" ? (
                      <Link
                        href="/help"
                        className="flex items-center gap-3 p-4 bg-laha-black-light/20 rounded-lg hover:bg-laha-gold-dark/20 transition-colors border border-laha-gold-dark/10"
                      >
                        <HelpCircle className="h-5 w-5 text-laha-gold" />
                        <div>
                          <h4 className="text-laha-gold-light font-medium">Centre d'aide</h4>
                          <p className="text-laha-gold-light/70 text-sm">FAQ et support technique</p>
                        </div>
                      </Link>
                    ) : item.key === "logout" ? (
                      <button className="flex items-center gap-3 p-4 bg-laha-black-light/20 rounded-lg hover:bg-red-900/30 transition-colors w-full text-left border border-red-800/20">
                        <LogOut className="h-5 w-5 text-red-400" />
                        <div>
                          <h4 className="text-red-300 font-medium">Déconnexion</h4>
                          <p className="text-laha-gold-light/70 text-sm">Se déconnecter de votre compte</p>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggle(section.title.toLowerCase(), item.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          (() => {
                            const categoryKey = section.title.toLowerCase() as keyof typeof settings
                            const categorySettings = settings[categoryKey]
                            if (typeof categorySettings === 'object' && categorySettings !== null) {
                              return (categorySettings as any)[item.key] 
                                ? "bg-gradient-to-r from-laha-gold to-laha-gold-warm"
                                : "bg-laha-black-light/40"
                            }
                            return "bg-laha-black-light/40"
                          })()
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-laha-gold-light shadow-sm transition-transform ${
                            (() => {
                              const categoryKey = section.title.toLowerCase() as keyof typeof settings
                              const categorySettings = settings[categoryKey]
                              if (typeof categorySettings === 'object' && categorySettings !== null) {
                                return (categorySettings as any)[item.key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }
                              return "translate-x-1"
                            })()
                          }`}
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}












