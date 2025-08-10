"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import BlurText from "@/components/ui/blur-text"

export default function PrivacyPage() {
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
              text="Politique de confidentialité"
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
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-white/80 mb-4">
                LAHA Editions s'engage à protéger votre vie privée. Cette politique explique comment nous collectons,
                utilisons et protégeons vos informations personnelles lorsque vous utilisez Lahacademia.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Informations collectées</h2>
              <div className="text-white/80 space-y-4">
                <h3 className="text-lg font-medium text-white">Informations que vous nous fournissez :</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nom, prénom et informations de contact</li>
                  <li>Informations de compte (email, mot de passe)</li>
                  <li>Informations académiques (classe, école)</li>
                  <li>Contenu que vous créez ou partagez</li>
                </ul>

                <h3 className="text-lg font-medium text-white mt-6">Informations collectées automatiquement :</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Données d'utilisation et de navigation</li>
                  <li>Adresse IP et informations sur l'appareil</li>
                  <li>Cookies et technologies similaires</li>
                  <li>Données de performance et d'analyse</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Utilisation des informations</h2>
              <div className="text-white/80 space-y-4">
                <p>Nous utilisons vos informations pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fournir et améliorer nos services éducatifs</li>
                  <li>Personnaliser votre expérience d'apprentissage</li>
                  <li>Communiquer avec vous sur votre compte et nos services</li>
                  <li>Assurer la sécurité de la plateforme</li>
                  <li>Analyser l'utilisation pour améliorer nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Partage des informations</h2>
              <div className="text-white/80 space-y-4">
                <p>
                  Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les cas
                  suivants :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Avec votre consentement explicite</li>
                  <li>Avec les enseignants pour le suivi pédagogique</li>
                  <li>Avec les parents (pour les comptes d'apprenants mineurs)</li>
                  <li>Pour respecter les obligations légales</li>
                  <li>Pour protéger nos droits et la sécurité des utilisateurs</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Sécurité des données</h2>
              <p className="text-white/80 mb-4">
                Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger
                vos informations contre l'accès non autorisé, la modification, la divulgation ou la destruction.
                Cependant, aucune méthode de transmission sur Internet n'est 100% sécurisée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Vos droits</h2>
              <div className="text-white/80 space-y-4">
                <p>Vous avez le droit de :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accéder à vos informations personnelles</li>
                  <li>Corriger ou mettre à jour vos informations</li>
                  <li>Supprimer votre compte et vos données</li>
                  <li>Limiter le traitement de vos données</li>
                  <li>Vous opposer au traitement de vos données</li>
                  <li>Demander la portabilité de vos données</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Cookies</h2>
              <p className="text-white/80 mb-4">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser
                l'utilisation du site et personnaliser le contenu. Vous pouvez gérer vos préférences de cookies dans les
                paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Conservation des données</h2>
              <p className="text-white/80 mb-4">
                Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services
                et respecter nos obligations légales. Les données des comptes inactifs peuvent être supprimées après une
                période d'inactivité prolongée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Modifications de cette politique</h2>
              <p className="text-white/80 mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons des
                modifications importantes par email ou via une notification sur la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact</h2>
              <p className="text-white/80 mb-4">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                contactez-nous à : privacy@Lahacademia.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
