"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Globe,
  Award,
  Play,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
  Shield,
  Zap,
  Heart,
  Smartphone,
  ChevronDown,
  Quote,
} from "lucide-react"

import { Preloader } from "@/components/ui/preloader"
import { PixelTransition } from "@/components/ui/pixel-transition"
import BlurText from "@/components/ui/blur-text"
import { GlassIcon } from "@/components/ui/glass-icon"
import { ProfileCard } from "@/components/ui/profile-card"
import { InfiniteScroll } from "@/components/ui/infinite-scroll"
import { CardSwap } from "@/components/ui/card-swap"
import Tablet3DSection from "@/components/Tablet3DSection"

export default function HomePage() {
  const [showContent, setShowContent] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 3500)
    return () => clearTimeout(timer)
  }, [])

  const bentoItems = [
    {
      id: "1",
      title: "Cours Interactifs",
      description:
        "Des milliers de cours adaptés au programme africain francophone avec vidéos HD, exercices pratiques et évaluations en temps réel",
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />,
      area: "col-span-1 md:col-span-6 lg:col-span-4",
    },
    {
      id: "2",
      title: "Enseignants Certifiés",
      description:
        "Une équipe de plus de 500 enseignants qualifiés, diplômés des meilleures universités africaines et internationales",
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />,
      area: "col-span-1 md:col-span-6 lg:col-span-4",
    },
    {
      id: "3",
      title: "IA Personnalisée",
      description:
        "Intelligence artificielle avancée qui s'adapte à votre rythme d'apprentissage et identifie vos points forts et faibles",
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />,
      area: "col-span-1 md:col-span-12 lg:col-span-4",
    },
    {
      id: "4",
      title: "Réseau Panafricain",
      description:
        "Connectez-vous avec plus de 50,000 étudiants de 15 pays africains francophones. Forums, groupes d'étude et mentorat",
      icon: <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />,
      area: "col-span-1 md:col-span-6 lg:col-span-6",
    },
  ]

  const teachers = [
    {
      name: "Dr. Aminata Diallo",
      title: "Professeure de Mathématiques",
      handle: "aminata_math",
      status: "En ligne",
      avatarUrl: "/placeholder.svg?height=400&width=300&text=Dr.+Aminata",
    },
    {
      name: "Prof. Jean-Baptiste Kouame",
      title: "Professeur de Physique",
      handle: "jb_physique",
      status: "En ligne",
      avatarUrl: "/placeholder.svg?height=400&width=300&text=Prof.+Jean",
    },
    {
      name: "Dr. Fatou Ndiaye",
      title: "Professeure de Français",
      handle: "fatou_francais",
      status: "Occupée",
      avatarUrl: "/placeholder.svg?height=400&width=300&text=Dr.+Fatou",
    },
    {
      name: "Prof. Kwame Asante",
      title: "Professeur d'Histoire",
      handle: "kwame_histoire",
      status: "En ligne",
      avatarUrl: "/placeholder.svg?height=400&width=300&text=Prof.+Kwame",
    },
    {
      name: "Dr. Mariam Touré",
      title: "Professeure de Chimie",
      handle: "mariam_chimie",
      status: "En ligne",
      avatarUrl: "/placeholder.svg?height=400&width=300&text=Dr.+Mariam",
    },
  ]

  const testimonials = [
    {
      name: "Koffi Asante",
      role: "Élève Terminale S - Côte d'Ivoire",
      content:
        "Lahacademia m'a permis d'améliorer mes notes de 5 points en moyenne ! Les cours de mathématiques sont exceptionnels et les enseignants sont toujours disponibles.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=KA",
    },
    {
      name: "Aïcha Traoré",
      role: "Étudiante en Médecine - Mali",
      content:
        "Les cours sont parfaitement adaptés au système éducatif africain. J'ai réussi mon concours d'entrée en médecine grâce à la préparation intensive proposée.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=AT",
    },
    {
      name: "Mamadou Diop",
      role: "Parent d'élève - Sénégal",
      content:
        "Je peux enfin suivre les progrès de mon fils en temps réel. Les rapports détaillés et les alertes m'aident à mieux l'accompagner dans sa scolarité.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=MD",
    },
    {
      name: "Fatima Ouattara",
      role: "Professeure - Burkina Faso",
      content:
        "En tant qu'enseignante, cette plateforme m'a permis d'atteindre plus d'étudiants et d'améliorer mes revenus tout en gardant la qualité pédagogique.",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60&text=FO",
    },
  ]

  const features = [
    {
      icon: <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />,
      title: "Application Mobile",
      description: "Apprenez partout, même hors ligne avec notre app mobile optimisée",
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />,
      title: "Sécurisé & Fiable",
      description: "Vos données sont protégées avec un chiffrement de niveau bancaire",
    },
    {
      icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />,
      title: "Apprentissage Rapide",
      description: "Méthodes pédagogiques innovantes pour un apprentissage 3x plus rapide",
    },
    {
      icon: <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-400" />,
      title: "Support 24/7",
      description: "Une équipe dédiée disponible 24h/24 pour vous accompagner",
    },
  ]

  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "Toujours",
      features: [
        "Accès à 10 cours de base",
        "Forums communautaires",
        "Certificats de participation",
        "Support par email",
      ],
      popular: false,
      cta: "Commencer gratuitement",
    },
    {
      name: "Étudiant",
      price: "2,500",
      period: "par mois",
      features: [
        "Accès illimité à tous les cours",
        "Cours en direct avec enseignants",
        "Suivi personnalisé par IA",
        "Certificats officiels",
        "Support prioritaire 24/7",
        "Groupes d'étude privés",
      ],
      popular: true,
      cta: "Essai gratuit 7 jours",
    },
    {
      name: "Premium",
      price: "5,000",
      period: "par mois",
      features: [
        "Tout du plan Étudiant",
        "Cours particuliers (2h/mois)",
        "Préparation aux concours",
        "Accès anticipé aux nouveautés",
        "Mentorat personnalisé",
        "Garantie réussite",
      ],
      popular: false,
      cta: "Essai gratuit 14 jours",
    },
  ]

 /*  const faqItems = [
    {
      question: "Comment fonctionne Lahacademia ?",
      answer:
        "Lahacademia est une plateforme d'apprentissage en ligne qui propose des cours interactifs, des exercices pratiques et un suivi personnalisé. Vous pouvez apprendre à votre rythme, participer à des cours en direct et échanger avec d'autres étudiants.",
    },
    {
      question: "Les certificats sont-ils reconnus officiellement ?",
      answer:
        "Oui, nos certificats sont reconnus par les ministères de l'éducation de 12 pays africains francophones. Ils peuvent être utilisés pour des candidatures universitaires ou professionnelles.",
    },
    {
      question: "Puis-je accéder aux cours sans connexion internet ?",
      answer:
        "Oui, notre application mobile permet de télécharger les cours pour un accès hors ligne. Vous pouvez étudier même sans connexion internet et synchroniser vos progrès une fois reconnecté.",
    },
    {
      question: "Comment puis-je contacter un professeur ?",
      answer:
        "Vous pouvez contacter vos enseignants via la messagerie intégrée, participer aux sessions de questions-réponses en direct, ou réserver des cours particuliers selon votre plan d'abonnement.",
    },
    {
      question: "Y a-t-il une garantie de remboursement ?",
      answer:
        "Oui, nous offrons une garantie de remboursement de 30 jours si vous n'êtes pas satisfait de nos services. De plus, le plan Premium inclut une garantie réussite.",
    },
  ]
 */
  if (!showContent) {
    return <Preloader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark overflow-x-hidden">
      <PixelTransition trigger="scroll" />

      {/* Header */}
      <header className="relative z-50 py-4 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-8xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/logo.png"
              alt="LAHA Editions"
              width={40}
              height={40}
              className="rounded-lg w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            <span className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-laha-gold">Lahacademia</span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">

            <Link href="/qui-sommes-nous" className="text-white/80 hover:text-laha-gold transition-colors">
              Qui-sommes nous ?
            </Link>
            <Link href="/devenir-enseignant" className="text-white/80 hover:text-laha-gold transition-colors">
              Devenir Enseignant
            </Link>
            <Link href="/nos-ouvrages" className="text-white/80 hover:text-laha-gold transition-colors">
            Nos ouvrages
            </Link>
            <Link href="/nos-resultats" className="text-white/80 hover:text-laha-gold transition-colors">
              Nos résultats
            </Link>
            <Link href="#contact" className="text-white/80 hover:text-laha-gold transition-colors">
              Contact
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white/80 hover:text-laha-gold transition-colors font-medium"
            >
              Se connecter
            </Link>
            <Link
              href="/account-type"
              className="px-6 py-2 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all"
            >
              S'inscrire
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-laha-black-light/95 backdrop-blur-md border-t border-laha-gold-dark/20"
          >
            <div className="px-4 py-4 space-y-4">
              <a
                href="#features"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#teachers"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devenir enseignat
              </a>
              <a
                href="#pricing"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tarifs
              </a>
              <a
                href="#about"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </a>
              <div className="pt-4 border-t border-laha-gold-dark/20 space-y-3">
                <Link
                  href="/login"
                  className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/account-type"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-medium rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center">
          <BlurText
            text="Bienvenue à Lahacademia"
            delay={150}
            animateBy="words"
            direction="top"
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6"
          />

          <BlurText
            text="La première plateforme éducative révolutionnaire conçue spécifiquement pour l'écosystème éducatif francophone africain"
            delay={200}
            animateBy="words"
            direction="bottom"
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/account-type"
              className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
            >
              Commencer maintenant
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-laha-gold-light hover:text-laha-gold transition-colors px-6 py-3 lg:px-8 lg:py-4 bg-laha-black-light/20 hover:bg-laha-gold-dark/20 rounded-lg text-sm lg:text-base border border-laha-gold-dark/30">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-laha-gold-dark/20 backdrop-blur-md flex items-center justify-center border border-laha-gold-dark/40">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-1 text-laha-gold" />
              </div>
              Voir la démo
            </button>
          </motion.div>

          {/* Animation de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center text-white/60 cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-sm mb-2">Découvrir plus</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Révélée au scroll */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Une expérience éducative complète
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos fonctionnalités innovantes conçues pour révolutionner l'apprentissage en Afrique francophone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {bentoItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative h-full rounded-2xl border border-white/10 p-2"
              >
                <div className="relative flex h-full flex-col justify-between gap-4 sm:gap-6 overflow-hidden rounded-xl p-4 sm:p-6 bg-white/5 backdrop-blur-md">
                  <div className="relative flex flex-1 flex-col justify-between gap-2 sm:gap-3">
                    <div className="w-fit rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 sm:p-3">
                      {item.icon}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <h3 className="font-heading text-responsive-lg sm:text-responsive-xl lg:text-responsive-2xl font-semibold text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-responsive-sm sm:text-responsive-base text-white/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-black-light/20 backdrop-blur-md border border-laha-gold-dark/20 rounded-xl p-6 sm:p-8 text-center hover:scale-105 transition-transform duration-300 min-h-[280px] flex flex-col justify-between"
              >
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-laha-gold/20 to-laha-gold-warm/20 border border-laha-gold-dark/30 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-laha-gold-light mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-laha-gold-light/70 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Teachers Section */}
      <motion.section id="teachers" className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Nos enseignants Certifiés
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Une équipe de plus de 500 enseignants qualifiés, diplômés des meilleures universités africaines et
              internationales
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <InfiniteScroll
              items={teachers}
              renderItem={(teacher) => (
                <div className="flex-shrink-0 w-64 mr-6">
                  <ProfileCard
                    {...teacher}
                    contactText="Réserver"
                    enableTilt={true}
                    onContactClick={() => console.log(`Contact ${teacher.name}`)}
                  />
                </div>
              )}
              speed="slow"
              pauseOnHover={true}
            />
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ce que disent nos apprenants
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Plus de 50,000 apprenants nous font confiance à travers l'Afrique francophone
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <CardSwap autoPlay={true} interval={5000} swapDirection="flip-horizontal">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold text-base sm:text-lg">{testimonial.name}</h4>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-400/30" />
                    <p className="text-white text-base sm:text-lg leading-relaxed pl-6">{testimonial.content}</p>
                  </div>
                </div>
              ))}
            </CardSwap>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Choisissez votre plan
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Des tarifs adaptés à tous les budgets, avec la possibilité de commencer gratuitement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative bg-laha-black-light/20 backdrop-blur-md border border-laha-gold-dark/20 rounded-xl p-6 sm:p-8 ${
                  plan.popular ? "ring-2 ring-laha-gold scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black px-4 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-laha-gold-light mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-laha-gold">{plan.price}</span>
                    <span className="text-laha-gold-light/60 text-sm ml-1">FCFA</span>
                  </div>
                  <p className="text-laha-gold-light/70 text-sm">{plan.period}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-laha-gold mt-0.5 flex-shrink-0" />
                      <span className="text-laha-gold-light/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full px-6 py-3 font-semibold rounded-lg transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black hover:from-laha-gold-warm hover:to-laha-gold-dark"
                      : "bg-laha-black-light/20 text-laha-gold-light hover:bg-laha-gold-dark/20 border border-laha-gold-dark/30"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Tablet3DSection />

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 sm:p-12"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Prêt à révolutionner votre apprentissage ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 leading-relaxed">
              Rejoignez plus de 50,000 étudiants qui transforment déjà leur avenir avec Lahacademia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/account-type"
                className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all inline-flex items-center justify-center gap-2"
              >
                Choisir mon profil
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-laha-black-light/20 text-laha-gold-light hover:bg-laha-gold-dark/20 hover:text-laha-gold transition-all rounded-lg border border-laha-gold-dark/30"
              >
                Déjà inscrit ? Se connecter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.png"
                alt="LAHA Editions"
                width={32}
                height={32}
                className="rounded-lg w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="font-heading text-lg sm:text-xl font-bold text-white">Lahacademia</span>
            </div>

            <div className="flex items-center justify-center space-x-4 sm:space-x-6">
              <GlassIcon
                icon={<GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Cours"
                variant="blue"
                size="sm"
              />
              <GlassIcon
                icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Communauté"
                variant="orange"
                size="sm"
              />
              <GlassIcon
                icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-laha-gold" />}
                label="Ressources"
                variant="pink"
                size="sm"
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold text-base mb-4">Plateforme</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="text-white/70 hover:text-white transition-colors text-sm">
                    Cours
                  </Link>
                </li>
                <li>
                  <Link href="/teachers" className="text-white/70 hover:text-white transition-colors text-sm">
                    Enseignants
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link href="/mobile" className="text-white/70 hover:text-white transition-colors text-sm">
                    App Mobile
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-white/70 hover:text-white transition-colors text-sm">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/70 hover:text-white transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-white/70 hover:text-white transition-colors text-sm">
                    Statut
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white/70 hover:text-white transition-colors text-sm">
                    Carrières
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="text-white/70 hover:text-white transition-colors text-sm">
                    Presse
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="text-white/70 hover:text-white transition-colors text-sm">
                    Partenaires
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                    Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/70 hover:text-white transition-colors text-sm">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="text-white/70 hover:text-white transition-colors text-sm">
                    Licences
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm leading-relaxed">
              © 2024 LAHA Editions. Tous droits réservés. Révolutionner l'éducation en Afrique francophone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}













