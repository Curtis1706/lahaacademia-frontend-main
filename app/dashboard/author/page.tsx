"use client"

import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBook,
  IconEdit,
  IconChartBar,
  IconCurrencyDollar,
  IconMessage,
  IconEye,
  IconHeart,
  IconBell,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { BookOpen, Edit, Eye, DollarSign, TrendingUp, MessageSquare, Star, Users } from "lucide-react"

export default function AuthorDashboard() {
  const links = [
    {
      label: "Tableau de bord",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Contenus",
      href: "#",
      icon: <IconBook className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Créer",
      href: "#",
      icon: <IconEdit className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Aperçu",
      href: "#",
      icon: <IconEye className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Q&R apprenants",
      href: "#",
      icon: <IconMessage className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Revenus",
      href: "#",
      icon: <IconCurrencyDollar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Favoris",
      href: "#",
      icon: <IconHeart className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Mes Alertes",
      href: "#",
      icon: <IconBell className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Statistiques",
      href: "#",
      icon: <IconChartBar className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Profil",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Paramètres",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-white" />,
    },
    {
      label: "Déconnexion",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-white" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Prof. Marie Kouassi",
                  href: "#",
                  icon: (
                    <img
                      src="/placeholder.svg?height=50&width=50&text=MK"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        <AuthorDashboardContent />
      </div>
    </SidebarProvider>
  )
}

const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white font-heading"
      >
        Lahacademia
      </motion.span>
    </a>
  )
}

const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
    </a>
  )
}

const AuthorDashboardContent = () => {
  const myContent = [
    {
      title: "Guide Mathématiques Terminale",
      type: "Livre",
      views: 1250,
      rating: 4.9,
      earnings: "15,000 FCFA",
      status: "published",
    },
    {
      title: "Exercices Physique Première",
      type: "Exercices",
      views: 890,
      rating: 4.7,
      earnings: "8,500 FCFA",
      status: "published",
    },
    { title: "Cours Chimie Seconde", type: "Cours", views: 0, rating: 0, earnings: "0 FCFA", status: "draft" },
  ]

  const recentQuestions = [
    {
      student: "Koffi Asante",
      question: "Comment résoudre les équations du second degré ?",
      subject: "Mathématiques",
      time: "Il y a 1h",
    },
    { student: "Aïcha Traoré", question: "Explication sur la loi d'Ohm", subject: "Physique", time: "Il y a 3h" },
    { student: "Mamadou Diop", question: "Différence entre atome et molécule", subject: "Chimie", time: "Il y a 5h" },
  ]

  const contentStats = [
    { title: "Total vues", value: "2,140", icon: <Eye className="h-5 w-5 text-laha-gold" />, change: "+12%" },
    {
      title: "Revenus totaux",
      value: "23,500 FCFA",
      icon: <DollarSign className="h-5 w-5 text-laha-gold-warm" />,
      change: "+8%",
    },
    { title: "Note moyenne", value: "4.8/5", icon: <Star className="h-5 w-5 text-laha-gold-soft" />, change: "+0.2" },
    { title: "apprenants actifs", value: "156", icon: <Users className="h-5 w-5 text-laha-gold" />, change: "+15%" },
  ]

  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-laha-gold font-heading mb-2">Tableau de bord Auteur</h1>
          <p className="text-laha-gold-light/70">Bienvenue, Prof. Marie ! Créez et gérez vos contenus éducatifs.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {contentStats.map((stat, index) => (
            <div key={index} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-laha-gold/20 rounded-lg">{stat.icon}</div>
                <div>
                  <p className="text-laha-gold-light/70 text-sm">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-laha-gold-light text-xl font-bold">{stat.value}</p>
                    <span className="text-laha-gold text-xs">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* My Content */}
          <div className="lg:col-span-2 bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-laha-gold-light flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-laha-gold" />
                Mes Contenus
              </h2>
              <button className="bg-gradient-to-r from-laha-gold to-laha-gold-warm px-4 py-2 rounded-lg text-laha-black text-sm font-medium hover:from-laha-gold/80 hover:to-laha-gold-warm/80 transition-all">
                Créer nouveau
              </button>
            </div>
            <div className="space-y-4">
              {myContent.map((content, index) => (
                <div key={index} className="bg-laha-black-light/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-laha-gold-light font-medium">{content.title}</h3>
                      <p className="text-laha-gold-light/70 text-sm">{content.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          content.status === "published"
                            ? "bg-laha-gold/20 text-laha-gold"
                            : "bg-laha-gold-warm/20 text-laha-gold-warm"
                        }`}
                      >
                        {content.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      <span className="text-laha-gold text-sm font-medium">{content.earnings}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-laha-gold-light/70 mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {content.views} vues
                    </span>
                    {content.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-laha-gold-soft" />
                        {content.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Modifier
                    </button>
                    <button className="bg-laha-gold-warm/20 hover:bg-laha-gold-warm/30 text-laha-gold-warm px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Statistiques
                    </button>
                    <button className="bg-laha-gold-soft/20 hover:bg-laha-gold-soft/30 text-laha-gold-soft px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Aperçu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Messages & Questions */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-laha-gold-soft" />
                Messages & Questions
              </h2>
              <div className="space-y-3">
                {[
                  {
                    student: "Koffi Asante",
                    message: "Comment résoudre les équations du second degré ?",
                    type: "question",
                    time: "Il y a 1h",
                  },
                  {
                    student: "Aïcha Traoré",
                    message: "Merci pour votre livre de physique",
                    type: "message",
                    time: "Il y a 3h",
                  },
                  {
                    student: "Mamadou Diop",
                    message: "Différence entre atome et molécule",
                    type: "question",
                    time: "Il y a 5h",
                  },
                ].map((item, index) => (
                  <div key={index} className="bg-laha-black-light/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-laha-gold-light font-medium text-sm">{item.student}</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.type === "question"
                              ? "bg-laha-gold-warm/20 text-laha-gold-warm"
                              : "bg-laha-gold/20 text-laha-gold"
                          }`}
                        >
                          {item.type === "question" ? "Question" : "Message"}
                        </span>
                      </div>
                      <span className="text-laha-gold-light/50 text-xs">{item.time}</span>
                    </div>
                    <p className="text-laha-gold-light/60 text-xs mb-2">{item.message}</p>
                    <button className="bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold px-2 py-1 rounded text-xs transition-colors">
                      Répondre
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 bg-laha-gold-soft/20 hover:bg-laha-gold-soft/30 text-laha-gold-soft p-2 rounded-lg text-sm transition-colors">
                Voir tous les messages
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
              <h2 className="text-lg font-semibold text-laha-gold-light mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <button className="w-full bg-laha-gold/20 hover:bg-laha-gold/30 text-laha-gold p-3 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Créer un nouveau cours
                </button>
                <button className="w-full bg-laha-gold-warm/20 hover:bg-laha-gold-warm/30 text-laha-gold-warm p-3 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Ajouter des exercices
                </button>
                <button className="w-full bg-laha-gold-soft/20 hover:bg-laha-gold-soft/30 text-laha-gold-soft p-3 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Répondre aux questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}









