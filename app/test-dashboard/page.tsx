"use client"

import { motion } from 'framer-motion'
import { UsersEvolutionChart } from '@/components/charts/users-evolution-chart'
import { RolesDistributionChart } from '@/components/charts/roles-distribution-chart'
import { ActivityChart } from '@/components/charts/activity-chart'
import { RevenueTrendChart } from '@/components/charts/revenue-trend-chart'
import { PerformanceRadarChart } from '@/components/charts/performance-radar-chart'
import { StatCard } from '@/components/ui/stat-card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { ChartCard } from '@/components/ui/chart-card'
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react'

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-laha-gold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Test Dashboard Modernisé
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Utilisateurs Actifs"
            value={<AnimatedCounter from={0} to={1234} delay={0.2} />}
            change="+12% ce mois"
            changeType="positive"
            icon={Users}
            delay={0.1}
          />
          <StatCard
            title="Cours Disponibles"
            value={<AnimatedCounter from={0} to={456} delay={0.4} />}
            change="+8% ce mois"
            changeType="positive"
            icon={BookOpen}
            delay={0.2}
          />
          <StatCard
            title="Revenus"
            value="2.4M FCFA"
            change="+15% ce mois"
            changeType="positive"
            icon={DollarSign}
            delay={0.3}
          />
          <StatCard
            title="Croissance"
            value="98%"
            change="+5% ce mois"
            changeType="positive"
            icon={TrendingUp}
            delay={0.4}
          />
        </div>

        {/* Charts Grid 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ChartCard title="Évolution Utilisateurs & Revenus" delay={0.5}>
            <UsersEvolutionChart />
          </ChartCard>
          
          <ChartCard title="Répartition des Rôles" delay={0.6}>
            <RolesDistributionChart />
          </ChartCard>
          
          <ChartCard title="Activité Hebdomadaire" delay={0.7}>
            <ActivityChart />
          </ChartCard>
        </div>

        {/* Charts Grid 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Tendances Financières" delay={0.8}>
            <RevenueTrendChart />
          </ChartCard>
          
          <ChartCard title="Performance Globale" delay={0.9}>
            <PerformanceRadarChart />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
