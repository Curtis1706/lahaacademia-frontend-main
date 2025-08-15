"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Globe, 
  Heart, 
  Shield, 
  Smartphone, 
  GraduationCap,
  Award,
  Target,
  Lightbulb,
  TrendingUp,
  Menu,
  X,
  Tablet,
  MessageCircle,
  Brain,
  Lock,
  BarChart3,
  Wifi,
  Languages
} from "lucide-react"
import BlurText from "@/components/ui/blur-text"
import CountUp from "@/components/ui/count-up"
import { GlassIcon } from "@/components/ui/glass-icon"
import { cn } from "@/lib/utils"
import { BackgroundGradient } from "@/components/ui/background-gradient"

export default function QuiSommesNousPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = [
    { number: 100, label: "Ouvrages au Bénin", suffix: "+", icon: <BookOpen className="h-6 w-6" /> },
    { number: 25, label: "Années d'expérience", suffix: "+", icon: <Award className="h-6 w-6" /> },
    { number: 10, label: "Pays africains", suffix: "+", icon: <Globe className="h-6 w-6" /> },
    { number: 1997, label: "Année de création", suffix: "", icon: <Target className="h-6 w-6" /> },
  ]

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-laha-gold" />,
      title: "Manuels scolaires officiels",
      description: "Adaptés par pays (Bénin, Togo, Côte d'Ivoire, Sénégal...)"
    },
    {
      icon: <Smartphone className="h-6 w-6 text-laha-gold" />,
      title: "Vidéos pédagogiques",
      description: "Courtes, exercices interactifs, examens blancs"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-laha-gold" />,
      title: "Forum par classe",
      description: "Messagerie éducative et espace productions écrites"
    },
    {
      icon: <Brain className="h-6 w-6 text-laha-gold" />,
      title: "Assistant IA",
      description: "Suivi des progrès et recommandations personnalisées"
    }
  ]

  const publicCible = [
    { icon: <GraduationCap className="h-5 w-5" />, text: "Élèves du primaire, secondaire et supérieur" },
    { icon: <Users className="h-5 w-5" />, text: "Adultes jamais scolarisés ou en reconversion" },
    { icon: <Heart className="h-5 w-5" />, text: "Personnes en situation de handicap" },
    { icon: <Shield className="h-5 w-5" />, text: "Parents, enseignants et institutions" }
  ]

  const ecosysteme = [
    { icon: <TrendingUp className="h-5 w-5" />, text: "Abonnement à coût réduit" },
    { icon: <Tablet className="h-5 w-5" />, text: "Location de tablettes solaires préchargées" },
    { icon: <BookOpen className="h-5 w-5" />, text: "Freemium pour les élèves avec manuel papier" },
    { icon: <Wifi className="h-5 w-5" />, text: "Plateforme hors-ligne et en langues locales" }
  ]

  const securite = [
    { icon: <Lock className="h-5 w-5" />, text: "Contenu protégé contre la copie" },
    { icon: <Shield className="h-5 w-5" />, text: "Système de validation et contrôle parental" },
    { icon: <BarChart3 className="h-5 w-5" />, text: "Tableaux de bord analytiques" },
    { icon: <Award className="h-5 w-5" />, text: "Enseignants et auteurs rigoureusement sélectionnés" }
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
            <Link href="/#features" className="text-white/80 hover:text-laha-gold transition-colors">
              Qui-sommes nous ?
            </Link>
            <Link href="/devenir-enseignant" className="text-white/80 hover:text-laha-gold transition-colors">
              Devenir Enseignant
            </Link>
            <Link href="" className="text-white/80 hover:text-laha-gold transition-colors">
              Nos ouvrages
            </Link>
            <Link href="/nos-resultats" className="text-white/80 hover:text-laha-gold transition-colors">
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
                href="/#features"
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

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BlurText
              text="Qui sommes-nous ?"
              delay={150}
              animateBy="words"
              direction="top"
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 justify-center"
            />
            <p className="text-xl sm:text-2xl text-white/80 mb-8 leading-relaxed">
              L'histoire de LAHACADEMIA et notre mission pour une éducation accessible à tous
            </p>
          </motion.div>
        </div>
      </section>

      {/* Histoire et Mission */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
                Une vision née d'une expérience vécue
              </h2>
              <div className="space-y-4 text-white/80">
                <p>
                  <strong className="text-laha-gold">LAHACADEMIA</strong> est la plateforme éducative numérique francophone conçue par <strong className="text-laha-gold">LAHA ÉDITIONS</strong>, une maison d'édition africaine fondée en 1997.
                </p>
                <p>
                  Depuis plus de 25 ans, LAHA ÉDITIONS s'est donnée pour mission de rendre l'éducation accessible à tous, en proposant des manuels scolaires de qualité à des prix abordables.
                </p>
                <p>
                  Le fondateur, <span className="text-laha-gold font-bold">Monsieur LALEYE</span>, a été témoin de situations bouleversantes : des élèves contraints de partager des manuels par manque de moyens, une jeune fille tombée enceinte après avoir demandé un livre à son professeur, et une nièce qui devait débourser 13 000 francs CFA – soit 20 % du salaire médian béninois – pour un seul manuel scolaire.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl"
            >
              <BackgroundGradient>
                <div className="flex flex-col items-center text-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="p-2 bg-laha-gold/20 rounded-full backdrop-blur-sm group-hover:bg-laha-gold/30 transition-colors duration-300 mb-3">
                    <Target className="h-6 w-6 text-laha-gold group-hover:text-laha-gold-light transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-lg text-white group-hover:text-laha-gold transition-colors duration-300">
                      Notre Impact
                    </p>
                    <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">Notre manuel révolutionnaire</p>
                  </div>
                </div>

                <div className="flex justify-center my-4">
                  <Image
                    src="/Livres-LAHA/BEPC.png"
                    alt="BEPC - Guide de préparation"
                    height={400}
                    width={400}
                    className="object-contain rounded-lg shadow-lg"
                  />
                </div>

                <div className="text-content">
                  <h1 className="font-bold text-xl md:text-2xl text-white mb-4 text-center group-hover:text-laha-gold transition-colors duration-300">
                    BEPC - Guide de préparation
                  </h1>

                  <p className="text-sm text-white/70 mb-4 text-center group-hover:text-white/90 transition-colors duration-300">
                    Guide complet de préparation au BEPC (Brevet d'Études du Premier Cycle). Exercices et conseils méthodologiques.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-lg p-3">
                      <span className="text-white/90 text-sm">Prix initial</span>
                      <span className="text-white line-through text-sm">15 000 FCFA</span>
                    </div>
                    <div className="flex items-center justify-between bg-laha-gold/20 backdrop-blur-sm rounded-lg p-3">
                      <span className="text-white font-medium text-sm">Prix LAHA</span>
                      <span className="text-laha-gold font-bold">1 200 FCFA</span>
                    </div>
                    <div className="text-center">
                      <span className="text-laha-gold font-bold text-lg">12.5x moins cher</span>
                    </div>
                  </div>

                  <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-laha-black mt-4 text-xs font-bold dark:bg-zinc-800 mx-auto">
                    <span>Consulter maintenant</span>
                    <span className="bg-laha-gold text-laha-black rounded-full text-[0.6rem] px-2 py-0 font-bold">
                      GRATUIT
                    </span>
                  </button>
                </div>
              </BackgroundGradient>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-laha-gold mb-2">
                  <CountUp to={stat.number} duration={2} delay={0.2 + index * 0.1} />
                  {stat.suffix}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Cible */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
              LAHACADEMIA : une plateforme pour une éducation inclusive
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Dans la continuité de sa mission sociale, LAHA ÉDITIONS a lancé LAHACADEMIA, une plateforme numérique éducative pensée pour tous
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicCible.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-laha-gold/20 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
              Une plateforme complète
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Accessible via tablette sécurisée et application web, LAHACADEMIA propose un écosystème éducatif complet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Écosystème Durable */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
                Un écosystème éducatif durable
              </h2>
              <p className="text-white/80 mb-6">
                LAHACADEMIA repose sur un modèle économique social et inclusif, conçu pour être accessible à tous, partout en Afrique.
              </p>
              <div className="space-y-4">
                {ecosysteme.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-laha-gold">
                      {item.icon}
                    </div>
                    <span className="text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-laha-gold-dark/10 backdrop-blur-md rounded-2xl p-8 border border-laha-gold-dark/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-8 w-8 text-laha-gold" />
                <h3 className="text-2xl font-bold text-laha-gold">Services Disponibles</h3>
              </div>
              <div className="space-y-3 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Révisions et exercices interactifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Questions aux auteurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Cours particuliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Classes virtuelles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Stages intensifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-laha-gold rounded-full"></div>
                  <span>Préparation examens nationaux</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sécurité et Performance */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-laha-gold mb-6">
              Sécurité, inclusion et performance
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto">
              Une plateforme sécurisée avec des profils adaptés et des outils analytiques avancés
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securite.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-laha-gold-dark/10 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-laha-gold/20 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <p className="text-white/80 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-12 bg-laha-gold-dark/10 backdrop-blur-md rounded-2xl p-8 border border-laha-gold-dark/20 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <BarChart3 className="h-8 w-8 text-laha-gold" />
              <h3 className="text-2xl font-bold text-laha-gold">Plateforme Analytique</h3>
            </div>
            <p className="text-white/80 max-w-3xl mx-auto">
              Parents, professeurs et administrateurs peuvent suivre les performances, niveaux d'engagement, revenus, paiements, et contenus utilisés via des tableaux de bord dynamiques.
            </p>
          </motion.div>
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
              Rejoignez la révolution éducative africaine
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-6 sm:mb-8 leading-relaxed">
              Découvrez comment LAHACADEMIA transforme l'éducation en Afrique francophone
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/account-type"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all transform hover:scale-105"
              >
                Commencer maintenant
              </Link>
              <Link
                href="/devenir-enseignant"
                className="w-full sm:w-auto px-8 py-4 border border-laha-gold text-laha-gold font-semibold rounded-lg hover:bg-laha-gold hover:text-laha-black transition-all"
              >
                Devenir enseignant
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






