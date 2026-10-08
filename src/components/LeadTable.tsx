'use client';

import React, { useState } from 'react';
import { Lead } from '@/types';
import {
  Building2,
  Clock,
  Flame,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowUpDown,
  MapPin
} from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onOpenFollowUp: (lead: Lead) => void;
  onOpenLeadDetail: (lead: Lead) => void;
}

export default function LeadTable({
  leads,
  onEditLead,
  onDeleteLead,
  onOpenFollowUp,
  onOpenLeadDetail,
}: LeadTableProps) {
  const [sortField, setSortField] = useState<keyof Lead>('visitDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Hot':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            Hot
          </span>
        );
      case 'Warm':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Warm
          </span>
        );
      case 'Cold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Cold
          </span>
        );
      case 'Close-Won':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Close-Won
          </span>
        );
      case 'Close-Lost':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Close-Lost
          </span>
        );
      case 'Future-Prospect':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Future Prospect
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const isFollowUpDue = (dateString?: string) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString.split('T')[0] <= today;
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
        <Building2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Leads Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No records match your active search or filter criteria. Create a new lead or clear your filters to display leads.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th
                onClick={() => handleSort('leadNumber')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Lead # <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th
                onClick={() => handleSort('customerName')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Company / Account <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4">Primary Contact</th>
              <th
                onClick={() => handleSort('visitDate')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Entry Date <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th
                onClick={() => handleSort('dealValue')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  Deal Value <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="py-3.5 px-4">Next Follow-Up</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {sortedLeads.map((lead) => {
              const followUpOverdue = isFollowUpDue(lead.nextFollowUpDate) && !['Close-Won', 'Close-Lost'].includes(lead.status);
              const displayVal = lead.status === 'Close-Won' 
                ? (lead.orderValue || lead.dealValue) 
                : lead.dealValue;

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Lead # */}
                  <td className="py-3.5 px-4 font-mono font-medium text-xs text-indigo-600 dark:text-indigo-400">
                    <button
                      onClick={() => onOpenLeadDetail(lead)}
                      className="hover:underline flex items-center gap-1 text-left"
                    >
                      {lead.leadNumber}
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">
                      By {lead.enteredBy}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      <button
                        onClick={() => onOpenLeadDetail(lead)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                      >
                        {lead.customerName}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {lead.city && (
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {lead.city}
                        </span>
                      )}
                      {lead.industry && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                          {lead.industry}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">
                      {lead.contactName || (lead.contacts?.[0]?.name) || '—'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {lead.designation || (lead.contacts?.[0]?.designation) || ''}
                      {lead.mobile && (
                        <span className="block font-mono text-[11px] text-slate-400">
                          {lead.mobile}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Entry Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-700 dark:text-slate-300">
                      {formatDate(lead.visitDate)}
                    </div>
                    <span className="text-[11px] text-slate-400 capitalize">
                      {lead.visitType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>

                  {/* Deal Value */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                    ₹{displayVal ? Number(displayVal).toLocaleString('en-IN') : '0'}
                    {lead.products?.length > 0 && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {lead.products.length} product{lead.products.length > 1 ? 's' : ''} quoted
                      </span>
                    )}
                  </td>

                  {/* Next Follow Up */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {lead.nextFollowUpDate ? (
                      <div>
                        <div
                          className={`text-xs font-medium flex items-center gap-1 ${
                            followUpOverdue
                              ? 'text-rose-600 dark:text-rose-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(lead.nextFollowUpDate)}
                        </div>
                        {followUpOverdue && (
                          <span className="text-[10px] text-rose-500 font-semibold uppercase">
                            Due Now
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">None set</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Log Follow Up */}
                      <button
                        onClick={() => onOpenFollowUp(lead)}
                        title="Log Follow-Up Interaction"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Edit Lead */}
                      <button
                        onClick={() => onEditLead(lead)}
                        title="Edit Full Lead"
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete Lead */}
                      {confirmDeleteId === lead.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950 p-1 rounded-md border border-rose-200 dark:border-rose-900">
                          <button
                            onClick={() => {
                              onDeleteLead(lead.id);
                              setConfirmDeleteId(null);
                            }}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-xs text-slate-500 px-1 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="py-3 px-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Showing {sortedLeads.length} leads</span>
        <span>Nuevo Lead Engine</span>
      </div>
    </div>
  );
}
