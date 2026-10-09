'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Plus, 
  Download, 
  BookOpen, 
  LayoutList, 
  Kanban as KanbanIcon,
  Search,
  Sparkles,
  Calendar as CalendarIcon,
  Users,
  ChevronDown,
  ShieldCheck,
  LogOut,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'pipeline' | 'calendar' | 'team';
  setActiveTab: (tab: 'pipeline' | 'calendar' | 'team') => void;
  viewMode: 'table' | 'kanban';
  setViewMode: (mode: 'table' | 'kanban') => void;
  onOpenNewLead: () => void;
  onOpenExport: () => void;
  onOpenGuide: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onOpenNewLead,
  onOpenExport,
  onOpenGuide,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  const { currentUser, isAdmin, isManager, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            👑 Admin
          </span>
        );
      case 'MANAGER':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            👔 Manager
          </span>
        );
      case 'SALES_EXECUTIVE':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            💼 Sales Rep
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">Nuevo Lead</span>
                <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-200 dark:border-blue-900">
                  CRM 1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Enterprise Cloud CRM
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Follow-Up Calendar</span>
            </button>

            {/* Admin User Management Tab */}
            {(isAdmin || isManager) && (
              <button
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'team'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span>{isAdmin ? 'User Admin & Hierarchy' : 'My Team'}</span>
                {isAdmin && (
                  <span className="w-2 h-2 rounded-full bg-purple-500" title="Admin access" />
                )}
              </button>
            )}
          </nav>

          {/* Search Bar (visible on pipeline tab) */}
          {activeTab === 'pipeline' && (
            <div className="flex-1 max-w-xs hidden xl:block">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads, companies..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Right Action Tools & User Profile / Logout */}
          <div className="flex items-center gap-2">
            
            {/* View Switcher (only on pipeline tab) */}
            {activeTab === 'pipeline' && (
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    viewMode === 'table' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Table View"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    viewMode === 'kanban' 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                  title="Kanban Board"
                >
                  <KanbanIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pipeline</span>
                </button>
              </div>
            )}

            {/* Export Leads */}
            <button
              onClick={onOpenExport}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition text-xs flex items-center gap-1.5"
              title="Export to Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline font-semibold">Export</span>
            </button>

            {/* Primary Add Lead */}
            <button
              onClick={onOpenNewLead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>

            {/* Authenticated User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser?.name || 'User'}
                  </div>
                  <div className="text-[9px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {currentUser?.role === 'ADMIN'
                      ? '👑 Admin'
                      : currentUser?.role === 'MANAGER'
                      ? '👔 Manager'
                      : '💼 Sales Rep'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile & Logout Dropdown */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-3 animate-fadeIn text-xs space-y-3">
                    
                    {/* User Identity Header */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Logged In User
                        </span>
                        {getRoleBadge(currentUser?.role)}
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {currentUser?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentUser?.email}
                      </p>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-500 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{currentUser?.designation || 'Sales Team'}</span>
                        <span>•</span>
                        <span>{currentUser?.department || 'Field Sales'}</span>
                      </div>
                    </div>

                    {/* Hierarchy Info */}
                    {currentUser?.reportingTo && (
                      <div className="px-2 py-1 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Reports to: <strong className="text-slate-800 dark:text-slate-200">{currentUser.reportingTo.name}</strong></span>
                      </div>
                    )}

                    {/* Quick Navigation Links */}
                    <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {(isAdmin || isManager) && (
                        <button
                          onClick={() => {
                            setActiveTab('team');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                            <span>{isAdmin ? 'User Admin & Hierarchy' : 'Team Members'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Open →</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onOpenGuide();
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>CRM Operating Guide</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Docs</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-bold flex items-center justify-center gap-2 transition-colors border border-rose-200 dark:border-rose-900/60"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Nuevo Lead</span>
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
