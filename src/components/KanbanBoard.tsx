'use client';

import React from 'react';
import { Lead } from '@/types';
import {
  Clock,
  MapPin,
  MessageSquare
} from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onOpenFollowUp: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
}

const COLUMNS: { id: Lead['status']; title: string; color: string; bg: string; dot: string }[] = [
  { id: 'Hot', title: 'Hot Deals', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900', dot: 'bg-rose-500' },
  { id: 'Warm', title: 'Warm Prospects', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900', dot: 'bg-amber-500' },
  { id: 'Cold', title: 'Cold / Initial', color: 'text-sky-700 dark:text-sky-400', bg: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900', dot: 'bg-sky-500' },
  { id: 'Future-Prospect', title: 'Future Prospects', color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900', dot: 'bg-purple-500' },
  { id: 'Close-Won', title: 'Closed Won', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900', dot: 'bg-emerald-500' },
  { id: 'Close-Lost', title: 'Closed Lost', color: 'text-slate-700 dark:text-slate-400', bg: 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800', dot: 'bg-slate-400' },
];

export default function KanbanBoard({
  leads,
  onEditLead,
  onOpenFollowUp,
  onUpdateStatus,
}: KanbanBoardProps) {
  const getColumnLeads = (status: Lead['status']) => {
    return leads.filter((l) => l.status === status);
  };

  const calculateColumnTotal = (columnLeads: Lead[]) => {
    return columnLeads.reduce((acc, l) => {
      const val = l.status === 'Close-Won' ? (l.orderValue || l.dealValue || 0) : (l.dealValue || 0);
      return acc + Number(val);
    }, 0);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {COLUMNS.map((col) => {
          const colLeads = getColumnLeads(col.id);
          const colTotal = calculateColumnTotal(colLeads);

          return (
            <div
              key={col.id}
              className={`flex-1 min-w-[280px] max-w-[320px] rounded-xl border flex flex-col max-h-[calc(100vh-220px)] ${col.bg}`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-inherit bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className={`text-sm font-bold tracking-tight ${col.color}`}>
                      {col.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {colLeads.length}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Total Value:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    ₹{colTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {colLeads.length === 0 ? (
                  <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400">No leads in this stage</p>
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const displayVal = lead.status === 'Close-Won' 
                      ? (lead.orderValue || lead.dealValue) 
                      : lead.dealValue;

                    return (
                      <div
                        key={lead.id}
                        className="bg-white dark:bg-slate-900 rounded-lg p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 group"
                      >
                        {/* Top: Lead # & Value */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                            {lead.leadNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ₹{Number(displayVal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Company Name */}
                        <h4
                          onClick={() => onEditLead(lead)}
                          className="font-semibold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1 mb-1 transition-colors"
                        >
                          {lead.customerName}
                        </h4>

                        {/* Contact Person & Location */}
                        <div className="space-y-1 mb-3 text-xs text-slate-500 dark:text-slate-400">
                          {(lead.contactName || lead.contacts?.[0]?.name) && (
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {lead.contactName || lead.contacts?.[0]?.name}
                              </span>
                              {lead.designation && (
                                <span className="text-slate-400 text-[11px]">
                                  • {lead.designation}
                                </span>
                              )}
                            </div>
                          )}
                          {lead.city && (
                            <div className="flex items-center gap-1 text-[11px]">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{lead.city}</span>
                            </div>
                          )}
                          {lead.assignedTo && (
                            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                              👤 {lead.assignedTo.name}
                            </div>
                          )}
                        </div>

                        {/* Next Follow Up or Warning */}
                        {lead.nextFollowUpDate && (
                          <div className="mb-3 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Next Follow-Up:
                            </span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {new Date(lead.nextFollowUpDate).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}

                        {/* Card Action Bar */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => onOpenFollowUp(lead)}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Log Follow-Up
                          </button>

                          {/* Quick Stage Mover */}
                          <div className="relative group/select">
                            <select
                              value={lead.status}
                              onChange={(e) => onUpdateStatus(lead.id, e.target.value as Lead['status'])}
                              className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded px-2 py-1 border-0 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="Hot">Move: Hot</option>
                              <option value="Warm">Move: Warm</option>
                              <option value="Cold">Move: Cold</option>
                              <option value="Future-Prospect">Move: Future</option>
                              <option value="Close-Won">Move: Won</option>
                              <option value="Close-Lost">Move: Lost</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
