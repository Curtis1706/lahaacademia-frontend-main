"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'Jan', revenus: 85000, depenses: 45000, benefice: 40000 },
  { name: 'Fév', revenus: 125000, depenses: 67000, benefice: 58000 },
  { name: 'Mar', revenus: 165000, depenses: 89000, benefice: 76000 },
  { name: 'Avr', revenus: 210000, depenses: 112000, benefice: 98000 },
  { name: 'Mai', revenus: 285000, depenses: 156000, benefice: 129000 },
  { name: 'Jun', revenus: 340000, depenses: 189000, benefice: 151000 },
]

export function RevenueTrendChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorBenefice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
            tickFormatter={(value) => `${(value/1000).toFixed(0)}K`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #10b981',
              borderRadius: '8px',
              color: '#ffffff'
            }}
            formatter={(value, name) => [`${Number(value).toLocaleString()} FCFA`, name]}
          />
          <Legend 
            wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
          />
          <Area
            type="monotone"
            dataKey="revenus"
            stackId="1"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenus)"
            name="Revenus"
          />
          <Area
            type="monotone"
            dataKey="depenses"
            stackId="2"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorDepenses)"
            name="Dépenses"
          />
          <Area
            type="monotone"
            dataKey="benefice"
            stackId="3"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorBenefice)"
            name="Bénéfice"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
