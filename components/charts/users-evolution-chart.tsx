"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'Jan', utilisateurs: 120, cours: 45, revenus: 85000 },
  { name: 'Fév', utilisateurs: 190, cours: 67, revenus: 125000 },
  { name: 'Mar', utilisateurs: 250, cours: 89, revenus: 165000 },
  { name: 'Avr', utilisateurs: 320, cours: 112, revenus: 210000 },
  { name: 'Mai', utilisateurs: 450, cours: 156, revenus: 285000 },
  { name: 'Jun', utilisateurs: 520, cours: 189, revenus: 340000 },
]

export function UsersEvolutionChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
          <XAxis 
            dataKey="name" 
            stroke="#d4af37" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#d4af37" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              color: '#ffffff'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="utilisateurs" 
            stroke="#60a5fa" 
            strokeWidth={3}
            dot={{ fill: '#60a5fa', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#60a5fa', strokeWidth: 2 }}
            name="Utilisateurs"
          />
          <Line 
            type="monotone" 
            dataKey="cours" 
            stroke="#34d399" 
            strokeWidth={3}
            dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#34d399', strokeWidth: 2 }}
            name="Cours"
          />
          <Line 
            type="monotone" 
            dataKey="revenus" 
            stroke="#fbbf24" 
            strokeWidth={3}
            dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2 }}
            name="Revenus (K FCFA)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
