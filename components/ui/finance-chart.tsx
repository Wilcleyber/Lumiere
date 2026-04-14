"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface FinanceChartProps {
  data: { date: string; value: number }[];
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="h-[300px] w-full bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 ml-2">
        Fluxo de Receita (7 dias)
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              fontWeight: 'bold'
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[10, 10, 10, 10]} 
            barSize={40}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? '#0f172a' : '#e2e8f0'} 
                className="hover:fill-emerald-500 transition-all duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
