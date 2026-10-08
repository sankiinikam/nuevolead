'use client';

import React from 'react';
import { Lead } from '@/types';
import { 
  Building2, 
  Flame, 
  CheckCircle2, 
  Clock, 
  TrendingUp 
} from 'lucide-react';

interface StatsGridProps {
  leads: Lead[];
  onFilterStatus?: (status: string) => void;
  activeFilter?: string;
}

export default function StatsGrid({ leads, onFilterStatus, activeFilter }: StatsGridProps) {
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'Hot').length;
  const warmLeads = leads.filter(l => l.status === 'Warm').length;
  const coldLeads = leads.filter(l => l.status === 'Cold').length;
  const wonLeads = leads.filter(l => l.status === 'Close-Won');
  const wonRevenue = wonLeads.reduce((acc, l) => acc + (Number(l.orderValue) || Number(l.dealValue) || 0), 0);
  
  const totalPipeline = leads
    .filter(l => !['Close-Won', 'Close-Lost'].includes(l.status))
    .reduce((acc, l) => acc + (Number(l.dealValue) || 0), 0);

  // Check follow-ups scheduled for today or overdue
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingFollowUps = leads.filter(l => {
    if (!l.nextFollowUpDate || ['Close-Won', 'Close-Lost'].includes(l.status)) return false;
    return l.nextFollowUpDate.split('T')[0] <= todayStr;
  }).length;

  const stats = [
    {
      id: 'all',
      title: 'Total Active Pipeline',
      value: totalLeads.toString(),
      subtext: `${totalLeads - wonLeads.length} open opportunities`,
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
      borderHover: 'hover:border-blue-400',
      filterValue: 'all',
    },
    {
      id: 'Hot',
      title: 'Hot Opportunities',
      value: hotLeads.toString(),
      subtext: `${warmLeads} Warm • ${coldLeads} Cold`,
      icon: Flame,
      color: 'from-rose-500 to-orange-500',
      bgColor: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
      borderHover: 'hover:border-rose-400',
      filterValue: 'Hot',
    },
    {
      id: 'Close-Won',
      title: 'Closed-Won Revenue',
      value: `₹${wonRevenue.toLocaleString('en-IN')}`,
      subtext: `${wonLeads.length} closed deals won`,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
      borderHover: 'hover:border-emerald-400',
      filterValue: 'Close-Won',
    },
    {
      id: 'pipeline',
      title: 'Open Deal Value',
      value: `₹${totalPipeline.toLocaleString('en-IN')}`,
      subtext: 'Weighted forecast value',
      icon: TrendingUp,
      color: 'from-violet-600 to-purple-600',
      bgColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
      borderHover: 'hover:border-purple-400',
      filterValue: 'all',
    },
    {
      id: 'followups',
      title: 'Follow-Ups Due',
      value: pendingFollowUps.toString(),
      subtext: pendingFollowUps > 0 ? 'Requires immediate action' : 'All schedules on track',
      icon: Clock,
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
      borderHover: 'hover:border-amber-400',
      filterValue: 'followup',
      badge: pendingFollowUps > 0 ? 'Urgent' : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        const isSelected = activeFilter === s.filterValue && s.filterValue !== 'all';
        return (
          <div
            key={s.id}
            onClick={() => onFilterStatus && onFilterStatus(s.filterValue)}
            className={`cursor-pointer group relative bg-white dark:bg-slate-900 rounded-xl p-4 border transition-all duration-200 shadow-sm hover:shadow-md ${
              isSelected
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-indigo-100 dark:shadow-none'
                : 'border-slate-200 dark:border-slate-800'
            } ${s.borderHover}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {s.title}
              </span>
              <div className={`p-2 rounded-lg ${s.bgColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {s.value}
              </div>
              {s.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                  {s.badge}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {s.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
