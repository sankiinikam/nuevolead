'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Lead } from '@/types';
import { Navbar } from '@/components/Navbar';
import StatsGrid from '@/components/StatsGrid';
import LeadTable from '@/components/LeadTable';
import KanbanBoard from '@/components/KanbanBoard';
import LeadModal from '@/components/LeadModal';
import FollowUpModal from '@/components/FollowUpModal';
import ExportModal from '@/components/ExportModal';
import UserGuideModal from '@/components/UserGuideModal';
import {
  Plus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Modals state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState<Lead | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (statusFilter && statusFilter !== 'all' && statusFilter !== 'followup') {
        params.set('status', statusFilter);
      }

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load leads');
      const data = await res.json();
      setLeads(data);
    } catch (err: any) {
      showToast(err.message || 'Error loading leads', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  // Lead Modal handlers
  const handleOpenNewLead = () => {
    setLeadToEdit(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = async (leadData: any) => {
    try {
      const isUpdating = !!leadData.id;
      const url = isUpdating ? `/api/leads/${leadData.id}` : '/api/leads';
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save lead');
      }

      showToast(
        isUpdating
          ? `Lead "${leadData.customerName}" successfully updated!`
          : `New lead "${leadData.customerName}" created!`
      );
      await fetchLeads();
    } catch (err: any) {
      throw err;
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete lead');
      showToast('Lead deleted successfully');
      await fetchLeads();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete lead', 'error');
    }
  };

  // Follow-Up modal handlers
  const handleOpenFollowUp = (lead: Lead) => {
    setSelectedLeadForFollowUp(lead);
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUp = async (followUpData: any) => {
    try {
      const res = await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followUpData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to record follow-up');
      }

      showToast('Follow-up interaction logged & lead stage updated!');
      await fetchLeads();
    } catch (err: any) {
      throw err;
    }
  };

  // Quick Stage Update from Kanban
  const handleQuickUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      // Optimistic local update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );

      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update stage');
      showToast(`Lead moved to "${newStatus}" stage`);
      await fetchLeads();
    } catch (err: any) {
      showToast(err.message || 'Failed to update stage', 'error');
      await fetchLeads();
    }
  };

  // Filter leads locally for custom filters (e.g. follow-up due)
  const displayLeads = leads.filter((l) => {
    if (statusFilter === 'followup') {
      const today = new Date().toISOString().split('T')[0];
      return l.nextFollowUpDate && l.nextFollowUpDate.split('T')[0] <= today && !['Close-Won', 'Close-Lost'].includes(l.status);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenNewLead={handleOpenNewLead}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI Summary Cards */}
        <StatsGrid
          leads={leads}
          activeFilter={statusFilter}
          onFilterStatus={(st) => setStatusFilter(statusFilter === st ? 'all' : st)}
        />

        {/* Action & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Pipeline' },
              { id: 'Hot', label: 'Hot Deals' },
              { id: 'Warm', label: 'Warm' },
              { id: 'Cold', label: 'Cold' },
              { id: 'Future-Prospect', label: 'Future' },
              { id: 'Close-Won', label: 'Won' },
              { id: 'Close-Lost', label: 'Lost' },
            ].map((tab) => {
              const isSelected = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right action utilities */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => fetchLeads()}
              title="Refresh Pipeline"
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>User Guide</span>
            </button>

            <button
              onClick={handleOpenNewLead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* View Switcher: Table or Kanban */}
        {isLoading && leads.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 mx-auto text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Loading ApexPulse CRM Pipeline...
            </p>
          </div>
        ) : viewMode === 'table' ? (
          <LeadTable
            leads={displayLeads}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
            onOpenFollowUp={handleOpenFollowUp}
            onOpenLeadDetail={handleEditLead}
          />
        ) : (
          <KanbanBoard
            leads={displayLeads}
            onEditLead={handleEditLead}
            onOpenFollowUp={handleOpenFollowUp}
            onUpdateStatus={handleQuickUpdateStatus}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
              A
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">ApexPulse CRM V1.0</span>
            <span>— Free Full-Stack Cloud Edition</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Standard Operating Procedures (PDF Manual)
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Excel / CSV Exporter
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        leadToEdit={leadToEdit}
        onSave={handleSaveLead}
      />

      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        lead={selectedLeadForFollowUp}
        onSaveFollowUp={handleSaveFollowUp}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <UserGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
