"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BlurText from "@/components/ui/blur-text"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
            <BlurText
              text="Conditions d'utilisation"
              delay={100}
              animateBy="words"
              direction="top"
              className="font-heading text-2xl font-bold text-white"
            />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 mb-8">Dernière mise à jour : 15 décembre 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptation des conditions</h2>
              <p className="text-white/80 mb-4">
                En accédant et en utilisant Lahacademia, vous acceptez d'être lié par ces conditions d'utilisation. Si
                vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description du service</h2>
              <p className="text-white/80 mb-4">
                Lahacademia est une plateforme éducative numérique conçue spécifiquement pour l'écosystème francophone
                africain. Nous proposons des cours, des ressources pédagogiques et des outils d'apprentissage adaptés
                aux programmes scolaires africains.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Comptes utilisateurs</h2>
              <div className="text-white/80 space-y-4">
                <p>Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous vous engagez à :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fournir des informations exactes et complètes</li>
                  <li>Maintenir la sécurité de votre mot de passe</li>
                  <li>Notifier immédiatement toute utilisation non autorisée de votre compte</li>
                  <li>Être responsable de toutes les activités sous votre compte</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Utilisation acceptable</h2>
              <div className="text-white/80 space-y-4">
                <p>Vous vous engagez à ne pas :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Utiliser le service à des fins illégales ou non autorisées</li>
                  <li>Partager du contenu offensant, diffamatoire ou inapproprié</li>
                  <li>Tenter d'accéder aux comptes d'autres utilisateurs</li>
                  <li>Perturber le fonctionnement du service</li>
                  <li>Copier ou distribuer le contenu sans autorisation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Propriété intellectuelle</h2>
              <p className="text-white/80 mb-4">
                Tout le contenu présent sur Lahacademia, incluant mais non limité aux textes, images, vidéos, logos et
                logiciels, est protégé par les droits d'auteur et autres droits de propriété intellectuelle. Vous ne
                pouvez pas reproduire, distribuer ou modifier ce contenu sans autorisation écrite préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Paiements et remboursements</h2>
              <div className="text-white/80 space-y-4">
                <p>Pour les services payants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Les paiements sont traités de manière sécurisée</li>
                  <li>Les prix sont indiqués en Francs CFA (FCFA)</li>
                  <li>Les remboursements sont possibles dans les 7 jours suivant l'achat</li>
                  <li>Certains contenus peuvent être soumis à des conditions spéciales</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation de responsabilité</h2>
              <p className="text-white/80 mb-4">
                Lahacademia ne peut être tenu responsable des dommages directs, indirects, accessoires ou consécutifs
                résultant de l'utilisation ou de l'impossibilité d'utiliser le service. Nous nous efforçons de maintenir
                le service disponible, mais ne garantissons pas une disponibilité continue.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Modifications des conditions</h2>
              <p className="text-white/80 mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront publiées
                sur cette page avec une date de mise à jour. Votre utilisation continue du service après les
                modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Résiliation</h2>
              <p className="text-white/80 mb-4">
                Nous pouvons suspendre ou résilier votre compte à tout moment en cas de violation de ces conditions.
                Vous pouvez également fermer votre compte à tout moment depuis vos paramètres.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact</h2>
              <p className="text-white/80 mb-4">
                Pour toute question concernant ces conditions d'utilisation, contactez-nous à : support@Lahacademia.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
