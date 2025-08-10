"use client"

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Globe, 
  Heart, 
  Shield, 
  Smartphone, 
  GraduationCap,
  Award,
  Target,
  CheckCircle,
  Menu,
  X,
  Brain,
  Clock,
  MessageCircle,
  Calendar,
  RefreshCw,
  CreditCard,
  Briefcase,
  BarChart3,
  Star,
  Lock,
  Accessibility,
  Volume2,
  UserCheck,
  Zap,
  ArrowLeft,
  Percent,
  ThumbsUp,
  Repeat,
  UserPlus,
  MapPin,
  Languages,
  Headphones,
  Eye
} from "lucide-react"
import BlurText from "@/components/ui/blur-text"
import CountUp from "@/components/ui/count-up"
import { InfiniteScroll } from "@/components/ui/infinite-scroll"
import { GlassIcon } from "@/components/ui/glass-icon"

export default function NosResultatsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const impactPedagogique = [
    { icon: <GraduationCap className="h-6 w-6" />, stat: "95%", text: "Taux de réussite aux examens" },
    { icon: <TrendingUp className="h-6 w-6" />, stat: "+40%", text: "Amélioration des notes" },
    { icon: <BookOpen className="h-6 w-6" />, stat: "500+", text: "Cours disponibles" },
    { icon: <CheckCircle className="h-6 w-6" />, stat: "89%", text: "des élèves ont amélioré leurs résultats en moins de 3 mois" },
    { icon: <BookOpen className="h-6 w-6" />, stat: "800+", text: "livres numériques adaptés aux programmes de 10+ pays" },
    { icon: <Brain className="h-6 w-6" />, stat: "+3,1", text: "points de progression moyenne sur les bulletins" },
    { icon: <Target className="h-6 w-6" />, stat: "57 000+", text: "exercices interactifs réalisés" },
    { icon: <Clock className="h-6 w-6" />, stat: "78%", text: "des élèves utilisent la plateforme 4+ fois/semaine" },
    { icon: <Award className="h-6 w-6" />, stat: "73%", text: "des élèves en examen gèrent mieux leurs révisions" }
  ]

  const encadrement = [
    { icon: <Users className="h-6 w-6" />, stat: "1:15", text: "Ratio enseignant/élève" },
    { icon: <Clock className="h-6 w-6" />, stat: "24/7", text: "Support disponible" },
    { icon: <MessageCircle className="h-6 w-6" />, stat: "2h", text: "Temps de réponse moyen" },
    { icon: <Users className="h-6 w-6" />, stat: "4 200+", text: "enseignants et tuteurs certifiés actifs" },
    { icon: <MessageCircle className="h-6 w-6" />, stat: "22 000+", text: "heures de tutorat dispensées" },
    { icon: <Calendar className="h-6 w-6" />, stat: "97,5%", text: "de taux de respect des cours planifiés" },
    { icon: <UserCheck className="h-6 w-6" />, stat: "92%", text: "des apprenants recommandent leur tuteur" }
  ]

  const fidelite = [
    { icon: <RefreshCw className="h-6 w-6" />, stat: "74%", text: "des utilisateurs se réabonnent après 3 mois" },
    { icon: <CreditCard className="h-6 w-6" />, stat: "81%", text: "des parents trouvent les abonnements abordables" },
    { icon: <Zap className="h-6 w-6" />, stat: "95%", text: "des premium activent 3+ modules" }
  ]

  const stages = [
    { icon: <TrendingUp className="h-6 w-6" />, stat: "71%", text: "des élèves en stage ont +2 points de moyenne" },
    { icon: <Briefcase className="h-6 w-6" />, stat: "90%", text: "des adultes voient la plateforme comme un levier pro" },
    { icon: <GraduationCap className="h-6 w-6" />, stat: "12 000+", text: "inscrits aux formations métiers" },
    { icon: <BarChart3 className="h-6 w-6" />, stat: "+40%", text: "d'engagement pendant les vacances" }
  ]

  const accessibilite = [
    { icon: <Accessibility className="h-6 w-6" />, stat: "8,5%", text: "des apprenants en situation de handicap" },
    { icon: <Volume2 className="h-6 w-6" />, stat: "100%", text: "navigation inclusive (audio, sous-titres)" },
    { icon: <Users className="h-6 w-6" />, stat: "17%", text: "des inscrits ont plus de 50 ans" },
    { icon: <CheckCircle className="h-6 w-6" />, stat: "91%", text: "des adultes déclarent un gain d'autonomie" }
  ]

  const satisfaction = [
    { icon: <Star className="h-6 w-6" />, stat: "96%", text: "des parents déclarent un meilleur suivi scolaire" },
    { icon: <Heart className="h-6 w-6" />, stat: "90%", text: "trouvent l'interface simple et motivante" },
    { icon: <Smartphone className="h-6 w-6" />, stat: "94%", text: "préfèrent réviser sur la plateforme" },
    { icon: <Lock className="h-6 w-6" />, stat: "100%", text: "des espaces de discussion sécurisés" },
    { icon: <Globe className="h-6 w-6" />, stat: "230 000+", text: "connexions actives sur 6 mois" }
  ]

  const temoignages = [
    {
      quote: "Mon fils avait du mal à suivre en classe. Avec LAHACADEMIA, il révise seul à la maison et échange avec ses professeurs. Il a eu 15 en sciences au dernier trimestre, c'est une première !",
      name: "Aline",
      title: "Mère d'élève à Libreville"
    },
    {
      quote: "LAHACADEMIA m'a permis de compléter mon revenu tout en aidant des élèves à distance. Je peux suivre leur progression, leur proposer des exercices adaptés et voir leur évolution.",
      name: "Rodrigue",
      title: "Enseignant de mathématiques à Porto-Novo"
    },
    {
      quote: "Je prépare mes examens avec la plateforme. Les vidéos expliquent bien et les quiz m'aident à savoir ce que je dois encore revoir. J'ai gagné 3 points de moyenne en 2 mois.",
      name: "Grâce",
      title: "🇨🇩 Élève de terminale à Kinshasa"
    },
    {
      quote: "Grâce à LAHACADEMIA, j'ai pu reprendre mes études tout en travaillant. Les cours sont flexibles et s'adaptent à mon emploi du temps chargé.",
      name: "Mamadou",
      title: "🇸🇳 Adulte en formation à Dakar"
    },
    {
      quote: "La plateforme a transformé ma façon d'enseigner. Mes élèves sont plus engagés et leurs résultats se sont nettement améliorés.",
      name: "Fatou",
      title: "🇲🇱 Enseignante de français à Bamako"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark">
      {/* Header */}
      <header className="relative border-b border-laha-gold-dark/20">
        <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="LAHA Editions"
              width={40}
              height={40}
              className="rounded-lg w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            <span className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-laha-gold">Lahacademia</span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/qui-sommes-nous" className="text-white/80 hover:text-laha-gold transition-colors">
              Qui-sommes nous ?
            </Link>
            <Link href="/devenir-enseignant" className="text-white/80 hover:text-laha-gold transition-colors">
              Devenir Enseignant
            </Link>
            <Link href="" className="text-white/80 hover:text-laha-gold transition-colors">
              Nos ouvrages
            </Link>
            <Link href="/nos-resultats" className="text-laha-gold transition-colors">
              Nos résultats
            </Link>
            <Link href="/#contact" className="text-white/80 hover:text-laha-gold transition-colors">
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
            className="md:hidden absolute top-full left-0 right-0 bg-laha-black-light/95 backdrop-blur-md border-t border-laha-gold-dark/20 z-50"
          >
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/qui-sommes-nous"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Qui-sommes nous ?
              </Link>
              <Link
                href="/devenir-enseignant"
                className="block py-2 text-laha-gold-light/80 hover:text-laha-gold-light transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Devenir Enseignant
              </Link>
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

      {/* Back Button */}
      {/* <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-laha-gold hover:text-laha-gold-light transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div> */}

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BlurText
              text="Nos Résultats"
              delay={150}
              animateBy="words"
              direction="top"
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 justify-center"
            />
            <p className="text-xl sm:text-2xl text-white/80 mb-8 leading-relaxed">
              LAHACADEMIA s'impose comme une plateforme de référence en matière d'éducation numérique en Afrique francophone. Nos chiffres témoignent de l'impact réel sur les élèves, enseignants, familles et adultes en formation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Pédagogique */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
             Impact pédagogique
            </h2>
          </motion.div>

          <HoverEffect items={impactPedagogique} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" />
        </div>
      </section>

      {/* Encadrement et Tutorat */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
              Encadrement et tutorat
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {encadrement.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-laha-gold/20 rounded-full">
                    <div className="text-laha-gold">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-laha-gold mb-2">{item.stat}</div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fidélité et Abonnements */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
               Fidélité et abonnements
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {fidelite.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-8 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-laha-gold/20 rounded-full">
                    <div className="text-laha-gold">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-laha-gold mb-4">{item.stat}</div>
                <p className="text-white/80">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stages Intensifs */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
               Stages intensifs & formations professionnelles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-laha-gold/20 rounded-full">
                    <div className="text-laha-gold">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-laha-gold mb-2">{item.stat}</div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibilité et Inclusion */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
               Accessibilité et inclusion
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessibilite.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-laha-gold/20 rounded-full">
                    <div className="text-laha-gold">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-laha-gold mb-2">{item.stat}</div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Satisfaction Générale */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
              Satisfaction générale
            </h2>
          </motion.div>

          <HoverEffect items={satisfaction} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" />
        </div>
      </section>

      {/* Témoignages */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
               Témoignages
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Découvrez les expériences de nos utilisateurs à travers l'Afrique francophone
            </p>
          </motion.div>

          <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
            <InfiniteScroll
              items={temoignages}
              renderItem={(temoignage, index) => (
                <div className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 w-[350px] h-[200px] flex flex-col">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-laha-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-laha-gold font-bold">{temoignage.name?.[0] || '👤'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1 truncate">{temoignage.name}</h4>
                      <p className="text-laha-gold text-sm mb-2 truncate">{temoignage.title}</p>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-4">{temoignage.quote}</p>
                    </div>
                  </div>
                </div>
              )}
              direction="horizontal"
              speed="slow"
              pauseOnHover={true}
            />
          </div>
        </div>
      </section>

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
              Rejoignez nos 230 000+ utilisateurs actifs
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 leading-relaxed">
              Faites partie de la révolution éducative africaine et transformez votre parcours d'apprentissage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/account-type"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all transform hover:scale-105"
              >
                Commencer maintenant
              </Link>
              <Link
                href="/qui-sommes-nous"
                className="w-full sm:w-auto px-8 py-4 border border-laha-gold text-laha-gold font-semibold rounded-lg hover:bg-laha-gold hover:text-laha-black transition-all"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
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









