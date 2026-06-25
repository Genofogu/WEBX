import React from 'react';
import { DashboardStats } from '../types';
import { Users, Briefcase, FileText, CheckCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const cards = [
    { label: 'Total Listings', value: stats.totalListings, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-purple-400', bg: 'bg-purple-900/20' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-900/20' },
    { label: 'Shortlisted', value: stats.shortlistedCount, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#6366f1'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">{card.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      {stats.mostAppliedListing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Most Applied Listing</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-blue-400">{stats.mostAppliedListing.role}</h4>
              <p className="text-gray-400">{stats.mostAppliedListing.org_name}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white">{stats.mostAppliedListing.app_count}</p>
              <p className="text-gray-500 text-sm uppercase tracking-widest">Applications</p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Student Skills Distribution</h3>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.skillDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="skill" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: '#374151', opacity: 0.4 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {stats.skillDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
