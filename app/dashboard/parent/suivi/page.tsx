'use client'
import { useState, useEffect } from 'react'
import { BarChart3, Clock, BookOpen, TrendingUp, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface ActivityData {
  child_id: number
  child_name: string
  date: string
  screen_time: number
  courses_completed: number
  exercises_done: number
  time_spent_learning: number
  subjects: string[]
}

export default function SuiviActivites() {
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedChild, setSelectedChild] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [selectedPeriod, selectedChild])

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        ...(selectedChild && { child_id: selectedChild.toString() })
      })
      
      const res = await fetch(`/api/parents/activities?${params}`)
      const data = await res.json()
      setActivities(data)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalScreenTime = activities.reduce((sum, activity) => sum + activity.screen_time, 0)
  const totalLearningTime = activities.reduce((sum, activity) => sum + activity.time_spent_learning, 0)
  const totalCourses = activities.reduce((sum, activity) => sum + activity.courses_completed, 0)
  const totalExercises = activities.reduce((sum, activity) => sum + activity.exercises_done, 0)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-laha-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-gray-900 to-laha-black p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Suivi des Activités</h1>
          <p className="text-white/70">Analysez l'utilisation et les progrès de vos enfants</p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-laha-gold/50"
              >
                <option value="day">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/70 text-sm">Temps d'écran total</p>
                <p className="text-2xl font-bold text-white">{formatTime(totalScreenTime)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/70 text-sm">Temps d'apprentissage</p>
                <p className="text-2xl font-bold text-white">{formatTime(totalLearningTime)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-laha-gold" />
              <div>
                <p className="text-white/70 text-sm">Cours terminés</p>
                <p className="text-2xl font-bold text-white">{totalCourses}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/70 text-sm">Exercices réalisés</p>
                <p className="text-2xl font-bold text-white">{totalExercises}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Détail par enfant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Détail par Enfant</h3>
          
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-white">{activity.child_name}</h4>
                  <span className="text-white/60 text-sm">{activity.date}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Temps d'écran</p>
                    <p className="text-white font-semibold">{formatTime(activity.screen_time)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Apprentissage</p>
                    <p className="text-white font-semibold">{formatTime(activity.time_spent_learning)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Cours</p>
                    <p className="text-white font-semibold">{activity.courses_completed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Exercices</p>
                    <p className="text-white font-semibold">{activity.exercises_done}</p>
                  </div>
                </div>
                
                {activity.subjects.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white/70 text-sm mb-2">Matières étudiées:</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.subjects.map((subject, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-laha-gold/20 text-laha-gold text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}