'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Lead, FollowUp, User } from '@/types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  Phone,
  Mail,
  User as UserIcon,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
  Plus,
  Filter,
  X
} from 'lucide-react';

interface FollowUpCalendarProps {
  onOpenFollowUp: (lead: Lead) => void;
  onOpenLeadDetail: (lead: Lead) => void;
}

export default function FollowUpCalendar({
  onOpenFollowUp,
  onOpenLeadDetail,
}: FollowUpCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [calendarData, setCalendarData] = useState<{
    scheduled: Lead[];
    logged: FollowUp[];
  }>({ scheduled: [], logged: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch calendar events
  const fetchCalendar = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/calendar?assignedToId=${selectedRepId}`);
      if (res.ok) {
        const data = await res.json();
        setCalendarData(data);
      }
    } catch (e) {
      console.error('Error fetching calendar:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users for filter
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [selectedRepId]);

  // Calendar month math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateString(now.toISOString().split('T')[0]);
  };

  // Group scheduled leads by date YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map: { [key: string]: Lead[] } = {};

    calendarData.scheduled.forEach((lead) => {
      if (lead.nextFollowUpDate) {
        const key = lead.nextFollowUpDate.split('T')[0];
        if (!map[key]) map[key] = [];
        map[key].push(lead);
      }
    });

    return map;
  }, [calendarData.scheduled]);

  // Today string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Events for selected date drawer/modal
  const selectedDateEvents = useMemo(() => {
    if (!selectedDateString) return [];
    return eventsByDate[selectedDateString] || [];
  }, [selectedDateString, eventsByDate]);

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'Hot':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'Warm':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Cold':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border-sky-200 dark:border-sky-900';
      case 'Close-Won':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'Future-Prospect':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Calendar Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <span>{monthNames[month]} {year}</span>
          </h2>
        </div>

        {/* Filter Controls & Legend */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Sales Rep Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRepId}
              onChange={(e) => setSelectedRepId(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="all">All Sales Representatives</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === 'ADMIN' ? 'Admin' : u.role === 'MANAGER' ? 'Manager' : 'Rep'})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Urgency Legend */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Hot
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Warm
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Cold
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Future
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Won
            </span>
          </div>
        </div>
      </div>

      {/* Main Month Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-800/40 py-2.5">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Date cells grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60 min-h-[580px]">
          
          {/* 1. Leading days from previous month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
            return (
              <div
                key={`prev-${i}`}
                className="p-2 bg-slate-50/30 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600 min-h-[100px]"
              >
                <span className="text-xs font-medium">{dayNum}</span>
              </div>
            );
          })}

          {/* 2. Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dayStr === todayStr;
            const isSelected = dayStr === selectedDateString;
            const dayEvents = eventsByDate[dayStr] || [];
            const hasEvents = dayEvents.length > 0;
            const isOverdue = dayStr < todayStr && dayEvents.some((l) => !['Close-Won', 'Close-Lost'].includes(l.status));

            return (
              <div
                key={dayStr}
                onClick={() => setSelectedDateString(dayStr)}
                className={`p-2 transition-all cursor-pointer min-h-[105px] flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500 z-10'
                    : isToday
                    ? 'bg-blue-50/30 dark:bg-blue-950/20'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isSelected
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {isOverdue && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Due
                    </span>
                  )}
                </div>

                {/* Event badges */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDateString(dayStr);
                      }}
                      className={`px-1.5 py-1 rounded text-[10px] font-medium border truncate transition-all flex items-center justify-between ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      <span className="truncate">{lead.customerName}</span>
                      <span className="text-[9px] font-bold opacity-75 shrink-0 ml-1">
                        ₹{(lead.dealValue ? Math.round(lead.dealValue / 1000) : 0)}k
                      </span>
                    </div>
                  ))}

                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>

                {/* Hover prompt */}
                {dayEvents.length === 0 && (
                  <span className="text-[10px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view
                  </span>
                )}
              </div>
            );
          })}

          {/* 3. Trailing days to fill 7x5 or 7x6 grid */}
          {(() => {
            const totalSlots = firstDayOfMonth + daysInMonth;
            const remaining = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
            return Array.from({ length: remaining }).map((_, i) => (
              <div
                key={`next-${i}`}
                className="p-2 bg-slate-50/30 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600 min-h-[100px]"
              >
                <span className="text-xs font-medium">{i + 1}</span>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Date Details Inspector Modal */}
      {selectedDateString && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Scheduled Follow-Ups for{' '}
                    {new Date(selectedDateString).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedDateEvents.length} engagement{selectedDateEvents.length === 1 ? '' : 's'} scheduled
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDateString(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Engagements list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedDateEvents.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No follow-ups scheduled for this day
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select another date or log a follow-up from the Pipeline tab.
                  </p>
                </div>
              ) : (
                selectedDateEvents.map((lead) => {
                  const latestFollowUp = lead.followUps?.[0];

                  return (
                    <div
                      key={lead.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm space-y-3"
                    >
                      {/* Top Bar: Lead # & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {lead.leadNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Deal Value: ₹{Number(lead.dealValue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Company Name */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lead.customerName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                          {lead.city && <span>📍 {lead.city}</span>}
                          {lead.industry && <span>🏭 {lead.industry}</span>}
                          {lead.assignedTo && (
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              👤 Assigned: {lead.assignedTo.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Person Details */}
                      {(lead.contactName || lead.contacts?.[0]?.name) && (
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {lead.contactName || lead.contacts?.[0]?.name}
                            </span>
                            {lead.designation && (
                              <span className="text-slate-500"> — {lead.designation}</span>
                            )}
                          </div>
                          {lead.mobile && (
                            <a
                              href={`tel:${lead.mobile}`}
                              className="font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {lead.mobile}
                            </a>
                          )}
                        </div>
                      )}

                      {/* Discussion Summary & Next Action */}
                      <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                        {lead.discussionSummary && (
                          <p>
                            <strong>Discussion:</strong> {lead.discussionSummary}
                          </p>
                        )}
                        {lead.nextStep && (
                          <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                            <strong>Action Item:</strong> {lead.nextStep}
                          </p>
                        )}
                        {lead.managerRemarks && (
                          <p className="text-purple-700 dark:text-purple-300 text-[11px] bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg">
                            <strong>Manager Note:</strong> {lead.managerRemarks}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedDateString(null);
                            onOpenLeadDetail(lead);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Full Lead
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDateString(null);
                            onOpenFollowUp(lead);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Log Interaction
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end">
              <button
                onClick={() => setSelectedDateString(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
