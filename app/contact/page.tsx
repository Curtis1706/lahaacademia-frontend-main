"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Facebook, Twitter, Linkedin, Instagram, GraduationCap, Users, BookOpen } from "lucide-react";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Navigation from "@/components/Navigation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-background via-laha-surface to-laha-gold-light-new">
      <Navigation currentPage="/contact" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-laha-text mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-laha-text-secondary max-w-3xl mx-auto">
            Nous sommes là pour vous accompagner dans votre parcours éducatif. 
            N'hésitez pas à nous contacter pour toute question ou demande.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <BackgroundGradient>
              <h2 className="text-2xl font-bold text-laha-text mb-6">
                Envoyez-nous un message
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-laha-text mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-laha-text-secondary">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-laha-text mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-laha-border rounded-lg bg-laha-surface text-laha-text placeholder-laha-text-secondary focus:ring-2 focus:ring-laha-gold focus:border-transparent transition-all"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-laha-text mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-laha-border rounded-lg bg-laha-surface text-laha-text placeholder-laha-text-secondary focus:ring-2 focus:ring-laha-gold focus:border-transparent transition-all"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-laha-text mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-laha-border rounded-lg bg-laha-surface text-laha-text placeholder-laha-text-secondary focus:ring-2 focus:ring-laha-gold focus:border-transparent transition-all"
                      placeholder="Sujet de votre message"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-laha-text mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-laha-border rounded-lg bg-laha-surface text-laha-text placeholder-laha-text-secondary focus:ring-2 focus:ring-laha-gold focus:border-transparent transition-all resize-none"
                      placeholder="Décrivez votre demande..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold py-3 px-6 rounded-lg hover:from-laha-gold-warm hover:to-laha-gold-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-laha-black border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </BackgroundGradient>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-laha-text mb-6">
                  Nos coordonnées
                </h2>
                <p className="text-laha-text-secondary mb-6">
                  Retrouvez-nous sur nos différents canaux de communication. 
                  Notre équipe est disponible pour vous accompagner.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-laha-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-laha-text mb-1">Email</h3>
                    <p className="text-laha-text-secondary">contact@lahacademia.com</p>
                    <p className="text-sm text-laha-text-secondary">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-laha-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-laha-text mb-1">Téléphone</h3>
                    <p className="text-laha-text-secondary">+229 XX XX XX XX</p>
                    <p className="text-sm text-laha-text-secondary">Lun-Ven: 8h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-laha-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-laha-text mb-1">Adresse</h3>
                    <p className="text-laha-text-secondary">
                      Cotonou, Bénin<br />
                      Quartier Akpakpa
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-laha-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-laha-text mb-1">Horaires</h3>
                    <p className="text-laha-text-secondary">
                      Lundi - Vendredi: 8h00 - 18h00<br />
                      Samedi: 9h00 - 13h00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Réseaux sociaux et FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {/* Réseaux sociaux */}
          {/* <div className="bg-laha-surface rounded-2xl  p-8 border border-laha-border text-center mx-auto">
            <h3 className="text-xl font-bold text-laha-text mb-4">
              Suivez-nous
            </h3>
            <p className="text-laha-text-secondary mb-6">
              Restez connecté avec nos dernières actualités et ressources éducatives.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center hover:bg-laha-gold hover:text-laha-black transition-all group">
                <Facebook className="w-6 h-6 text-laha-gold group-hover:text-laha-black transition-colors" />
              </a>
              <a href="#" className="w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center hover:bg-laha-gold hover:text-laha-black transition-all group">
                <Twitter className="w-6 h-6 text-laha-gold group-hover:text-laha-black transition-colors" />
              </a>
              <a href="#" className="w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center hover:bg-laha-gold hover:text-laha-black transition-all group">
                <Linkedin className="w-6 h-6 text-laha-gold group-hover:text-laha-black transition-colors" />
              </a>
              <a href="#" className="w-12 h-12 bg-laha-gold/10 rounded-lg flex items-center justify-center hover:bg-laha-gold hover:text-laha-black transition-all group">
                <Instagram className="w-6 h-6 text-laha-gold group-hover:text-laha-black transition-colors" />
              </a>
            </div>
          </div> */}
        </motion.div>

        {/* FAQ Unique avec Accordéon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-laha-text mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-laha-text-secondary text-lg max-w-3xl mx-auto">
              Découvrez toutes les réponses à vos questions sur LAHACADEMIA
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-laha-surface rounded-2xl p-8 border border-laha-border">
              <div className="space-y-4">
                {/* Question 1 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Comment créer un compte sur LAHACADEMIA ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Créez votre compte en quelques étapes simples : cliquez sur "S'inscrire" en haut à droite, 
                      remplissez le formulaire avec vos informations (nom, email, mot de passe), confirmez votre 
                      email et vous aurez accès à toutes nos ressources éducatives gratuitement.
                    </p>
                  </div>
                </details>

                {/* Question 2 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Les manuels sont-ils gratuits ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Oui, absolument ! Tous nos manuels scolaires, cours et ressources pédagogiques sont 
                      disponibles gratuitement pour les enseignants, élèves et parents. Notre mission est de 
                      démocratiser l'accès à l'éducation de qualité.
                    </p>
                  </div>
                </details>

                {/* Question 3 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Quels navigateurs sont supportés ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      LAHACADEMIA est compatible avec tous les navigateurs modernes : Chrome, Firefox, Safari, 
                      Edge et Opera. Nous recommandons d'utiliser la version la plus récente de votre navigateur 
                      pour une expérience optimale.
                    </p>
                  </div>
                </details>

                {/* Question 4 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Comment télécharger les manuels ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Pour télécharger un manuel : naviguez vers la section "Nos ouvrages", sélectionnez le 
                      livre souhaité, cliquez sur le bouton "Télécharger" et choisissez le format (PDF, EPUB). 
                      Les téléchargements sont instantanés et sans limite.
                    </p>
                  </div>
                </details>

                {/* Question 5 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    La plateforme est-elle disponible hors ligne ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Oui ! Une fois téléchargés, tous nos manuels et ressources sont accessibles hors ligne. 
                      Vous pouvez également activer le mode hors ligne dans les paramètres pour synchroniser 
                      automatiquement vos contenus favoris.
                    </p>
                  </div>
                </details>

                {/* Question 6 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Comment fonctionne le système de notation ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Notre système de notation permet aux utilisateurs d'évaluer les ressources de 1 à 5 étoiles 
                      et de laisser des commentaires. Ces évaluations aident la communauté à identifier les 
                      meilleures ressources et nous permettent d'améliorer continuellement notre contenu.
                    </p>
                  </div>
                </details>

                {/* Question 7 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Comment signaler un problème technique ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Si vous rencontrez un problème technique, utilisez le formulaire de contact en bas de page 
                      ou envoyez-nous un email à support@lahacademia.com. Notre équipe technique répond dans 
                      les 24h et s'engage à résoudre rapidement tous les problèmes.
                    </p>
                  </div>
                </details>

                {/* Question 8 */}
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-laha-text font-medium p-4 bg-laha-surface/50 rounded-lg hover:bg-laha-surface/70 transition-colors">
                    Les données sont-elles sécurisées ?
                    <span className="text-laha-gold group-open:rotate-180 transition-transform duration-300">▼</span>
                  </summary>
                  <div className="mt-3 p-4 bg-laha-surface/30 rounded-lg border-l border-laha-gold/20">
                    <p className="text-laha-text-secondary">
                      Absolument ! Nous utilisons les technologies de cryptage les plus avancées (SSL/TLS, 
                      chiffrement AES-256) pour protéger vos données personnelles. Votre vie privée et la 
                      sécurité de vos informations sont notre priorité absolue.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-laha-gold to-laha-gold-warm rounded-2xl p-8 text-laha-black"
        >
          <h3 className="text-2xl font-bold mb-4">
            Prêt à commencer votre apprentissage ?
          </h3>
          <p className="text-laha-black/80 mb-6 max-w-2xl mx-auto">
            Rejoignez des milliers d'élèves et d'enseignants qui font confiance à LAHA Academia 
            pour leur réussite éducative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/nos-ouvrages"
              className="px-8 py-3 bg-laha-black text-laha-gold font-semibold rounded-lg hover:bg-laha-black-light transition-all"
            >
              Découvrir nos ouvrages
            </a>
            <a
              href="/devenir-enseignant"
              className="px-8 py-3 border-2 border-laha-black text-laha-black font-semibold rounded-lg hover:bg-laha-black hover:text-laha-gold transition-all"
            >
              Devenir enseignant
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer simplifié */}
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
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-laha-gold/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-laha-gold" />
                </div>
                <span className="text-xs text-laha-text-secondary">Cours</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-laha-gold/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-laha-gold" />
                </div>
                <span className="text-xs text-laha-text-secondary">Communauté</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-laha-gold/20 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-laha-gold" />
                </div>
                <span className="text-xs text-laha-text-secondary">Ressources</span>
              </div>
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
  );
}
