'use client';

import React from 'react';
import { 
  Plus, 
  Download, 
  BookOpen, 
  LayoutList, 
  Kanban as KanbanIcon,
  Search,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  viewMode: 'table' | 'kanban';
  setViewMode: (mode: 'table' | 'kanban') => void;
  onOpenNewLead: () => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Navbar({
  viewMode,
  setViewMode,
  onOpenNewLead,
  onOpenExport,
  onOpenGuide,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">ApexPulse</span>
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-200">CRM 1.0</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Enterprise Lead & Opportunity Cloud</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads by company, city, ID, contact..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Actions & View Switcher */}
          <div className="flex items-center gap-2.5">
            {/* View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  viewMode === 'table' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KanbanIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
            </div>

            {/* User Guide */}
            <button
              onClick={onOpenGuide}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-sm flex items-center gap-1.5"
              title="View Complete Manual"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline text-xs font-semibold">Manual</span>
            </button>

            {/* Export Leads */}
            <button
              onClick={onOpenExport}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition text-sm flex items-center gap-1.5"
              title="Export to Excel"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden lg:inline text-xs font-semibold">Export</span>
            </button>

            {/* Primary Add Lead */}
            <button
              onClick={onOpenNewLead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-500/25 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
