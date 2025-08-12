"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Lun', sessions: 12, reservations: 8, revenus: 25000 },
  { name: 'Mar', sessions: 19, reservations: 14, revenus: 35000 },
  { name: 'Mer', sessions: 15, reservations: 11, revenus: 28000 },
  { name: 'Jeu', sessions: 22, reservations: 18, revenus: 42000 },
  { name: 'Ven', sessions: 28, reservations: 24, revenus: 58000 },
  { name: 'Sam', sessions: 35, reservations: 29, revenus: 72000 },
  { name: 'Dim', sessions: 18, reservations: 12, revenus: 31000 },
]

export function ActivityChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
              border: '1px solid #d4af37',
              borderRadius: '8px',
              color: '#d4af37'
            }}
          />
                           <Bar 
                   dataKey="sessions" 
                   fill="#60a5fa" 
                   radius={[4, 4, 0, 0]}
                   name="Sessions"
                 />
                 <Bar 
                   dataKey="reservations" 
                   fill="#34d399" 
                   radius={[4, 4, 0, 0]}
                   name="Réservations"
                 />
                 <Bar 
                   dataKey="revenus" 
                   fill="#fbbf24" 
                   radius={[4, 4, 0, 0]}
                   name="Revenus (FCFA)"
                 />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
