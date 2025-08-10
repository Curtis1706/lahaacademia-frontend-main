"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { GraduationCap, Users, BookOpen, UserCheck } from "lucide-react"
import Link from "next/link"

import BlurText from "@/components/ui/blur-text"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const accountTypes = [
  {
    id: "student",
    title: "Apprenant",
    description: "Accédez à des milliers de cours, suivez votre progression et connectez-vous avec vos pairs",
    icon: <GraduationCap className="h-8 w-8" />,
    color: "blue",
    features: ["Cours interactifs", "Suivi de progression", "Forums apprenants", "Examens blancs"],
  },
  {
    id: "teacher",
    title: "Enseignant",
    description: "Enseignez, gérez vos apprenants et suivez vos revenus sur notre plateforme",
    icon: <UserCheck className="h-8 w-8" />,
    color: "orange",
    features: ["Gestion des cours", "Planning flexible", "Suivi des revenus", "Outils pédagogiques"],
  },
  {
    id: "parent",
    title: "Parent",
    description: "Suivez les progrès de vos enfants et communiquez avec leurs enseignants",
    icon: <Users className="h-8 w-8" />,
    color: "pink",
    features: ["Suivi des enfants", "Communications", "Rapports détaillés", "Alertes personnalisées"],
  },
  {
    id: "author",
    title: "Auteur",
    description: "Créez du contenu éducatif et répondez aux questions des apprenants",
    icon: <BookOpen className="h-8 w-8" />,
    color: "blue",
    features: ["Création de contenu", "Q&R apprenants", "Revenus partagés", "Outils d'édition"],
  },
]

export default function AccountTypePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedType) {
      // Rediriger vers le formulaire spécifique selon le type
      switch (selectedType) {
        case 'student':
          router.push('/register')
          break
        case 'teacher':
          router.push('/register/teacher')
          break
        case 'parent':
          router.push('/register/parent')
          break
        case 'author':
          router.push('/register/author')
          break
        default:
          router.push('/register')
      }
    }
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "border-laha-gold-dark/30 bg-laha-gold-dark/10 hover:border-laha-gold/50 hover:bg-laha-gold/20"
      case "orange":
        return "border-laha-gold-warm/30 bg-laha-gold-warm/10 hover:border-laha-gold-warm/50 hover:bg-laha-gold-warm/20"
      case "pink":
        return "border-laha-gold-soft/30 bg-laha-gold-soft/10 hover:border-laha-gold-soft/50 hover:bg-laha-gold-soft/20"
      default:
        return "border-laha-gold-dark/30 bg-laha-gold-dark/10 hover:border-laha-gold/50 hover:bg-laha-gold/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <Image src="/logo.png" alt="LAHA Editions" width={50} height={50} className="rounded-lg" />
            <span className="font-heading text-2xl font-bold text-laha-gold">LAHACADEMIA</span>
          </Link>

          <BlurText
            text="Quel type de compte souhaitez-vous créer ?"
            delay={150}
            animateBy="words"
            direction="top"
            className="font-heading text-3xl md:text-4xl font-bold text-white mb-4"
          />

          <BlurText
            text="Choisissez le profil qui correspond le mieux à vos besoins"
            delay={200}
            animateBy="words"
            direction="bottom"
            className="text-lg text-white/70"
          />
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {accountTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div
                className={`relative h-full rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
                  selectedType === type.id ? "ring-2 ring-laha-gold scale-105" : ""
                } ${getColorClasses(type.color)}`}
                onClick={() => setSelectedType(type.id)}
              >
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

                <div className="relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-laha-black-light/20 backdrop-blur-md mb-4">
                    <div className="text-laha-gold">{type.icon}</div>
                  </div>

                  <h3 className="font-heading text-xl font-semibold text-laha-gold-light mb-2">{type.title}</h3>

                  <p className="text-laha-gold-light/70 text-sm mb-4">{type.description}</p>

                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-laha-gold-light/60 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {selectedType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded-full bg-laha-gold flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 text-laha-black" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={handleContinue}
            disabled={!selectedType}
            className={`px-8 py-4 rounded-lg font-semibold transition-all ${
              selectedType
                ? "bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black hover:from-laha-gold-warm hover:to-laha-gold-dark"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continuer avec {selectedType ? accountTypes.find((t) => t.id === selectedType)?.title : "votre choix"}
          </motion.button>

          <p className="text-white/60 text-sm mt-4">
            Vous pourrez modifier ces informations plus tard dans vos paramètres
          </p>
        </div>
      </div>
    </div>
  )
}








