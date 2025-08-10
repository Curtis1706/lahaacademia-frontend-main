"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Camera, Edit, Save, X, Star, Award, BookOpen, Clock } from "lucide-react"
import BlurText from "@/components/ui/blur-text"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Koffi",
    lastName: "Asante",
    email: "koffi.asante@email.com",
    phone: "+225 07 12 34 56 78",
    bio: "Élève passionné de mathématiques et de sciences. Toujours à la recherche de nouveaux défis académiques.",
    school: "Lycée Moderne de Cocody",
    class: "Terminale S",
    birthDate: "2005-03-15",
    address: "Abidjan, Côte d'Ivoire",
  })

  const achievements = [
    { title: "Premier de classe", description: "Mathématiques - Novembre 2024", icon: "🏆", date: "Nov 2024" },
    { title: "Participation active", description: "Forums de discussion", icon: "💬", date: "Oct 2024" },
    { title: "Assidu", description: "100% de présence ce mois", icon: "⭐", date: "Déc 2024" },
    { title: "Mentor junior", description: "Aide aux apprenants de seconde", icon: "🎓", date: "Sep 2024" },
  ]

  const stats = [
    { label: "Cours suivis", value: "12", icon: <BookOpen className="h-5 w-5 text-blue-400" /> },
    { label: "Heures d'étude", value: "145h", icon: <Clock className="h-5 w-5 text-orange-400" /> },
    { label: "Moyenne générale", value: "16.5/20", icon: <Star className="h-5 w-5 text-yellow-400" /> },
    { label: "Récompenses", value: "8", icon: <Award className="h-5 w-5 text-pink-400" /> },
  ]

  const handleSave = () => {
    // Logique de sauvegarde
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
              <BlurText
                text="Mon Profil"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-heading text-2xl font-bold text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-orange-500 px-4 py-2 rounded-lg text-white font-medium hover:from-blue-600 hover:to-orange-600 transition-all"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />

                <div className="relative z-10 text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src="/placeholder.svg?height=120&width=120&text=KA"
                      alt="Profile"
                      className="w-24 h-24 rounded-full mx-auto"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600 transition-colors">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-white/70 mb-4">{profileData.class}</p>

                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-white/80 text-sm">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">{stat.icon}</div>
                    <p className="text-white text-lg font-bold">{stat.value}</p>
                    <p className="text-white/70 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Informations personnelles</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Téléphone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">École</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => handleInputChange("school", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.school}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Classe</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.class}
                      onChange={(e) => handleInputChange("class", e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white p-3 bg-white/5 rounded-lg">{profileData.class}</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Récompenses & Achievements</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="text-white font-medium">{achievement.title}</h4>
                        <p className="text-white/70 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                    <p className="text-white/50 text-xs">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
