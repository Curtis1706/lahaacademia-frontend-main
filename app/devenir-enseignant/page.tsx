"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  GraduationCap,
  CheckCircle,
  DollarSign,
  FileText,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Star,
  Clock,
  Award,
  Globe,
  Lightbulb,
  ScrollText,
  FileUser,
  PartyPopper,
} from "lucide-react"
import Stepper, { Step } from "@/components/Stepper"
import CountUp from "@/components/ui/count-up"
import { GlassIcon } from "@/components/ui/glass-icon"
import Navigation from "@/components/Navigation"

export default function DevenirEnseignantPage() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      id: 1,
      icon: <FileText className="h-8 w-8 text-laha-gold" />,
      title: "Inscription",
      description: "Créez votre profil",
      details: "Remplissez votre profil avec vos informations personnelles et académiques",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      icon: <CheckCircle className="h-8 w-8 text-laha-gold" />,
      title: "Vérification",
      description: "Envoyez diplômes, CV + casier judiciaire",
      details: "Soumettez vos documents pour validation de votre profil",
      color: "from-green-500 to-green-600",
    },
    {
      id: 3,
      icon: <DollarSign className="h-8 w-8 text-laha-gold" />,
      title: "Enseignez",
      description: "Fixez vos tarifs (20 000 FCFA min/heure)",
      details: "Commencez à enseigner et gagnez selon vos tarifs",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const advantages = [
    {
      icon: <Calendar className="h-6 w-6 text-laha-gold" />,
      title: "Planifiez vos séances",
      description: "Gérez votre emploi du temps et vos disponibilités",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-laha-gold" />,
      title: "Suivez vos revenus",
      description: "Consultez vos gains en temps réel",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-laha-gold" />,
      title: "Accédez aux guides pédagogiques",
      description: "Ressources et méthodes d'enseignement",
    },
  ]

  const stats = [
    { number: "500+", label: "Enseignants actifs" },
    { number: "50,000+", label: "Élèves satisfaits" },
    { number: "15", label: "Pays couverts" },
    { number: "95%", label: "Taux de satisfaction" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface to-laha-gold-light-new">
      {/* Header unifié avec Navigation */}
      <Navigation currentPage="/devenir-enseignant" />

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-laha-text mb-6">
              Devenir Enseignant 
            </h1>
            <p className="text-xl sm:text-2xl text-laha-text-secondary mb-8 leading-relaxed">
              Rejoignez notre communauté d'enseignants qualifiés et transformez l'éducation en Afrique francophone
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/account-type"
                className="px-8 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-xl hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all text-lg flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                Commencer maintenant
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-laha-surface/20 text-laha-text hover:bg-laha-gold/20 hover:text-laha-gold transition-all rounded-xl border border-laha-border"
              >
                Déjà inscrit ?
                Se connecter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Processus en 3 étapes */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-laha-text mb-4">
              Processus en 3 étapes
            </h2>
            <p className="text-lg text-laha-text-secondary max-w-2xl mx-auto">
              Devenez enseignant répétiteur en quelques étapes simples
            </p>
          </motion.div>

          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(`Étape ${step}`)
            }}
            onFinalStepCompleted={() => console.log("Processus terminé!")}
            backButtonText="Précédent"
            nextButtonText="Suivant"
          >
            <Step>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-laha-gold to-laha-gold-warm rounded-full mb-6">
                  <FileText className="h-10 w-10 text-laha-black" />
                </div>
                <h3 className="text-2xl font-bold text-laha-text mb-4">Inscription</h3>
                <p className="text-laha-gold font-semibold mb-4">Créez votre profil</p>
                <p className="text-laha-text-secondary mb-6">
                  Remplissez votre profil avec vos informations personnelles et académiques. 
                  Cette étape est essentielle pour établir votre crédibilité en tant qu'enseignant.
                </p>
                <div className="bg-laha-gold/10 rounded-lg p-4 border border-laha-gold/20">
                  <div className="flex items-center justify-center gap-2">
                    <Lightbulb className="h-4 w-4 text-laha-gold" />
                    <p className="text-laha-text text-sm">
                      Conseil : Prenez le temps de bien remplir votre profil pour attirer plus d'élèves
                    </p>
                  </div>
                </div>
              </div>
            </Step>
            
            <Step>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-laha-gold to-laha-gold-warm rounded-full mb-6">
                  <CheckCircle className="h-10 w-10 text-laha-black" />
                </div>
                <h3 className="text-2xl font-bold text-laha-text mb-4">Vérification</h3>
                <p className="text-laha-gold font-semibold mb-4">Envoyez diplômes, CV + casier judiciaire</p>
                <p className="text-laha-text-secondary mb-6">
                  Soumettez vos documents pour validation de votre profil. Cette étape garantit 
                  la qualité et la sécurité de notre plateforme.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-laha-surface/20 rounded-lg p-3 border border-laha-border">
                    <div className="flex items-center gap-2">
                      <ScrollText className="h-4 w-4 text-laha-gold" />
                      <p className="text-laha-text text-sm font-medium">Diplômes</p>
                    </div>
                  </div>
                  <div className="bg-laha-surface/20 rounded-lg p-3 border border-laha-border">
                    <div className="flex items-center gap-2">
                      <FileUser className="h-4 w-4 text-laha-gold" />
                      <p className="text-laha-text text-sm font-medium">CV</p>
                    </div>
                  </div>
                  <div className="bg-laha-surface/20 rounded-lg p-3 border border-laha-border">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-laha-gold" />
                      <p className="text-laha-text text-sm font-medium">Casier judiciaire</p>
                    </div>
                  </div>
                </div>
              </div>
            </Step>
            
            <Step>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-laha-gold to-laha-gold-warm rounded-full mb-6">
                  <DollarSign className="h-10 w-10 text-laha-black" />
                </div>
                <h3 className="text-2xl font-bold text-laha-text mb-4">Enseignez</h3>
                <p className="text-laha-gold font-semibold mb-4">Fixez vos tarifs (20 000 FCFA min/heure)</p>
                <p className="text-laha-text-secondary mb-6">
                  Commencez à enseigner et gagnez selon vos tarifs. Vous avez le contrôle total 
                  sur votre emploi du temps et vos revenus.
                </p>
                <div className="bg-gradient-to-r from-laha-gold/10 to-laha-gold-warm/10 rounded-lg p-6 border border-laha-gold-dark/30 ">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PartyPopper className="h-5 w-5 text-laha-gold" />
                    <p className="text-laha-gold text-lg font-semibold">Félicitations !</p>
                  </div>
                  <p className="text-laha-text-secondary text-sm">
                    Vous êtes maintenant prêt à commencer votre parcours d'enseignant sur Lahacademia
                  </p>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </section>

      {/* Avantages enseignants */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-laha-text mb-4">
              Avantages enseignants
            </h2>
            <p className="text-lg text-laha-text-secondary max-w-2xl mx-auto">
              Fonctionnalités exclusives pour optimiser votre expérience d'enseignement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="bg-laha-surface/20 backdrop-blur-md border border-laha-border rounded-xl p-8 hover:bg-laha-gold/10 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {advantage.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-laha-text mb-2">{advantage.title}</h3>
                    <p className="text-laha-text-secondary">{advantage.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0 * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-laha-gold mb-2">
                <CountUp to={500} duration={2} delay={0.2} />+
              </div>
              <div className="text-laha-text-secondary text-sm">Enseignants actifs</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-laha-gold mb-2">
                <CountUp to={50000} duration={2.5} delay={0.4} separator="," />+
              </div>
              <div className="text-laha-text-secondary text-sm">Élèves satisfaits</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2 * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-laha-gold mb-2">
                <CountUp to={15} duration={1.5} delay={0.6} />
              </div>
              <div className="text-laha-text-secondary text-sm">Pays couverts</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3 * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-laha-gold mb-2">
                <CountUp to={95} duration={2} delay={0.8} />%
              </div>
              <div className="text-laha-text-secondary text-sm">Taux de satisfaction</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-laha-surface/5 backdrop-blur-md border border-laha-border rounded-xl p-8 sm:p-12"
          >
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-laha-text mb-4 sm:mb-6">
              Prêt à rejoindre notre équipe ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-laha-text-secondary mb-6 sm:mb-8 leading-relaxed">
              Commencez votre parcours d'enseignant répétiteur dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register/teacher"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all text-lg flex items-center justify-center gap-3"
              >
                Devenir enseignant
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-laha-surface/20 text-laha-text hover:bg-laha-gold/20 hover:text-laha-gold transition-all rounded-lg border border-laha-border"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <footer className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-laha-border">
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
                    <span className="font-heading text-lg sm:text-xl font-bold text-laha-text">Lahacademia</span>
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
                    <h4 className="text-laha-text font-semibold text-base mb-4">Plateforme</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/courses" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Cours
                        </Link>
                      </li>
                      <li>
                        <Link href="/teachers" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Enseignants
                        </Link>
                      </li>
                      <li>
                        <Link href="/pricing" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Tarifs
                        </Link>
                      </li>
                      <li>
                        <Link href="/mobile" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          App Mobile
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-laha-text font-semibold text-base mb-4">Support</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/help" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Centre d'aide
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/faq" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          FAQ
                        </Link>
                      </li>
                      <li>
                        <Link href="/status" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Statut
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-laha-text font-semibold text-base mb-4">Entreprise</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/about" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          À propos
                        </Link>
                      </li>
                      <li>
                        <Link href="/careers" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Carrières
                        </Link>
                      </li>
                      <li>
                        <Link href="/press" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Presse
                        </Link>
                      </li>
                      <li>
                        <Link href="/partners" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Partenaires
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-laha-text font-semibold text-base mb-4">Légal</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link href="/terms" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Confidentialité
                        </Link>
                      </li>
                      <li>
                        <Link href="/cookies" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Cookies
                        </Link>
                      </li>
                      <li>
                        <Link href="/licenses" className="text-laha-text-secondary hover:text-laha-text transition-colors text-sm">
                          Licences
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
      
                <div className="text-center pt-8 border-t border-laha-border">
                  <p className="text-laha-text-secondary text-sm leading-relaxed">
                    © 2024 LAHA Editions. Tous droits réservés. Révolutionner l'éducation en Afrique francophone.
                  </p>
                </div>
              </div>
            </footer>
    </div>
  )
} 




