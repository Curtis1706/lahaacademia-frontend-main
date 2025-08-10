"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Sidebar, SidebarBody, SidebarLink, SidebarProvider } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  IconBrandTabler,
  IconUsers,
  IconUserShield,
  IconBooks,
  IconReportAnalytics,
  IconSettings,
  IconHome,
  IconBell,
  IconChartBar,
} from "@tabler/icons-react"
import {
  Users as UsersIcon,
  BookOpen,
  Bell,
  ShieldCheck,
  Settings,
  ChartBar,
} from "lucide-react"

export default function AdminDashboard() {
  const [open, setOpen] = useState(true)

  const links = [
    { label: "Aperçu", href: "#", icon: <IconHome className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Utilisateurs", href: "#users", icon: <IconUsers className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rôles & Permissions", href: "#roles", icon: <IconUserShield className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Cours & Sessions", href: "#courses", icon: <IconBooks className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Notifications", href: "#notifications", icon: <IconBell className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Rapports & Statistiques", href: "#reports", icon: <IconReportAnalytics className="h-5 w-5 shrink-0 text-white" /> },
    { label: "Paramètres", href: "#settings", icon: <IconSettings className="h-5 w-5 shrink-0 text-white" /> },
  ]

  return (
    <AuthGuard requiredRoles={["admin", "super_admin"]}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-1 flex-col overflow-x-hidden sidebar-scrollbar-hidden">
                <Logo open={open} />
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: "Administrateur",
                    href: "#",
                    icon: (
                      <img
                        src="/placeholder.svg?height=50&width=50&text=AD"
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
          <AdminContent />
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

function Logo({ open }: { open: boolean }) {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white">
      <Image src="/logo.png" alt="LAHA Editions" width={24} height={24} className="rounded" />
      {open && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-white font-heading">
          Lahacademia Admin
        </motion.span>
      )}
    </a>
  )
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-4 border border-laha-gold-dark/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-laha-gold/20 rounded-lg">{icon}</div>
        <div>
          <p className="text-laha-gold-light/70 text-sm">{title}</p>
          <p className="text-laha-gold-light text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="bg-laha-black-light/20 backdrop-blur-md rounded-xl p-6 border border-laha-gold-dark/20">
      <h2 className="text-xl font-semibold text-laha-gold-light mb-4">{title}</h2>
      {children}
    </div>
  )
}

function AdminContent() {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-laha-gold-dark/20 bg-gradient-to-br from-laha-black/50 to-laha-gold-dark/30 backdrop-blur-md p-4 md:p-8 overflow-y-auto">
        {/* Aperçu */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white font-heading mb-2">Tableau de bord Administrateur</h1>
          <p className="text-white/70">Supervisez l’activité, gérez les utilisateurs, les cours et la qualité.</p>
        </div>

        {/* Statistiques clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Utilisateurs actifs" value="2,134" icon={<UsersIcon className="h-5 w-5 text-laha-gold" />} />
          <StatCard title="Cours actifs" value="128" icon={<BookOpen className="h-5 w-5 text-laha-gold-warm" />} />
          <StatCard title="Incidents ouverts" value="5" icon={<ShieldCheck className="h-5 w-5 text-laha-gold-soft" />} />
          <StatCard title="Taux satisfaction" value="92%" icon={<ChartBar className="h-5 w-5 text-laha-gold" />} />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section id="users" title="Gestion des utilisateurs">
            <p className="text-laha-gold-light/80 text-sm mb-3">Créer/éditer les comptes, changer les rôles, activer/désactiver.</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-laha-gold/20 text-laha-gold rounded">Créer un utilisateur</button>
              <button className="px-3 py-2 bg-laha-gold-soft/20 text-laha-gold-soft rounded">Importer (CSV)</button>
              <button className="px-3 py-2 bg-laha-gold-warm/20 text-laha-gold-warm rounded">Voir tous</button>
            </div>
          </Section>

          <Section id="roles" title="Rôles & permissions">
            <p className="text-laha-gold-light/80 text-sm mb-3">Configurer les accès pour admin, super admin, teacher, student, parent, author.</p>
            <ul className="list-disc list-inside text-laha-gold-light/80 text-sm space-y-1">
              <li>Matrices de permissions</li>
              <li>Politiques de sécurité & 2FA</li>
              <li>Audit des actions sensibles</li>
            </ul>
          </Section>

          <Section id="courses" title="Cours & sessions">
            <p className="text-laha-gold-light/80 text-sm mb-3">Valider les contenus, gérer la qualité, planifier les sessions.</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-laha-gold/20 text-laha-gold rounded">Créer un cours</button>
              <button className="px-3 py-2 bg-laha-gold-soft/20 text-laha-gold-soft rounded">Modérer les cours</button>
              <button className="px-3 py-2 bg-laha-gold-warm/20 text-laha-gold-warm rounded">Calendrier des sessions</button>
            </div>
          </Section>

          <Section id="notifications" title="Notifications & communication">
            <p className="text-laha-gold-light/80 text-sm mb-3">Campagnes, annonces, alertes système.</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-2 bg-laha-gold/20 text-laha-gold rounded">Nouvelle annonce</button>
              <button className="px-3 py-2 bg-laha-gold-soft/20 text-laha-gold-soft rounded">Campagnes email/SMS</button>
            </div>
          </Section>

          <Section id="reports" title="Rapports & statistiques">
            <p className="text-laha-gold-light/80 text-sm mb-3">Performance pédagogique, revenus, engagement.</p>
            <div className="grid grid-cols-1 gap-2 text-sm text-laha-gold-light/80">
              <div className="bg-laha-black-light/10 rounded p-3">Revenus mensuels (bientôt…)</div>
              <div className="bg-laha-black-light/10 rounded p-3">Engagement par segment (bientôt…)</div>
              <div className="bg-laha-black-light/10 rounded p-3">Qualité des contenus (bientôt…)</div>
            </div>
          </Section>

          <Section id="settings" title="Paramètres généraux">
            <p className="text-laha-gold-light/80 text-sm mb-3">Branding, paiements, intégrations.</p>
            <ul className="list-disc list-inside text-laha-gold-light/80 text-sm space-y-1">
              <li>Identité visuelle</li>
              <li>Méthodes de paiement</li>
              <li>Intégrations (email, SMS, analytics)</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  )
}






