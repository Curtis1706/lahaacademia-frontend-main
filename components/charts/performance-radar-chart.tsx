"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { subject: 'Satisfaction', thisMonth: 92, lastMonth: 88, fullMark: 100 },
  { subject: 'Engagement', thisMonth: 85, lastMonth: 79, fullMark: 100 },
  { subject: 'Rétention', thisMonth: 78, lastMonth: 73, fullMark: 100 },
  { subject: 'Performance', thisMonth: 94, lastMonth: 90, fullMark: 100 },
  { subject: 'Qualité', thisMonth: 89, lastMonth: 85, fullMark: 100 },
  { subject: 'Support', thisMonth: 96, lastMonth: 92, fullMark: 100 },
]

export function PerformanceRadarChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#3a3a3a" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#d4af37', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fill: '#d4af37', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Ce mois"
            dataKey="thisMonth"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Mois dernier"
            dataKey="lastMonth"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend 
            wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
