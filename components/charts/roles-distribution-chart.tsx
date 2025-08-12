"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
  { name: 'Élèves', value: 245, color: '#60a5fa' }, // Bleu plus lumineux pour meilleur contraste
  { name: 'Professeurs', value: 43, color: '#34d399' }, // Vert plus lumineux
  { name: 'Parents', value: 89, color: '#fbbf24' }, // Jaune plus lumineux
  { name: 'Auteurs', value: 12, color: '#f87171' }, // Rouge plus lumineux  
  { name: 'Admins', value: 5, color: '#a78bfa' }, // Violet plus lumineux
]

export function RolesDistributionChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #d4af37',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500'
            }}
            formatter={(value: number, name: string) => [
              <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{value}</span>, 
              <span style={{ color: '#ffffff' }}>{name}</span>
            ]}
          />
          <Legend 
            wrapperStyle={{ 
              color: '#ffffff', 
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
