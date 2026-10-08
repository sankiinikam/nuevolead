'use client';

import React, { useState } from 'react';
import { Lead } from '@/types';
import {
  X,
  Send,
  MessageSquare,
  Clock,
  History,
  PhoneCall,
  Video,
  Mail,
  Users
} from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSaveFollowUp: (data: any) => Promise<void>;
}

const FOLLOW_UP_TYPES = [
  { value: 'Phone Call', label: 'Phone Call', icon: PhoneCall },
  { value: 'Direct Visit', label: 'Direct In-Person Visit', icon: Users },
  { value: 'Virtual Meeting / Demo', label: 'Virtual Demo / Video Call', icon: Video },
  { value: 'Email Follow-up', label: 'Email Follow-up', icon: Mail },
];

export default function FollowUpModal({
  isOpen,
  onClose,
  lead,
  onSaveFollowUp,
}: FollowUpModalProps) {
  const [followUpType, setFollowUpType] = useState('Phone Call');
  const [followUpDate, setFollowUpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [followUpTime, setFollowUpTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [leadStatus, setLeadStatus] = useState<Lead['status']>(lead?.status || 'Warm');
  const [contactPerson, setContactPerson] = useState(lead?.contactName || lead?.contacts?.[0]?.name || '');
  const [discussionSummary, setDiscussionSummary] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [smsAlert, setSmsAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Keep state synced with opened lead
  React.useEffect(() => {
    if (lead) {
      setLeadStatus(lead.status);
      setContactPerson(lead.contactName || lead.contacts?.[0]?.name || '');
      setDiscussionSummary('');
      setNextAction('');
      setNextFollowUpDate('');
      setError('');
    }
  }, [lead, isOpen]);

  if (!isOpen || !lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionSummary.trim()) {
      setError('Please provide minutes of the discussion.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await onSaveFollowUp({
        leadId: lead.id,
        followUpDate,
        followUpTime,
        followUpType,
        leadStatus,
        contactPerson,
        discussionSummary: discussionSummary.trim(),
        nextAction: nextAction.trim() || undefined,
        nextFollowUpDate: nextFollowUpDate || undefined,
        smsAlert,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pastFollowUps = lead.followUps || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Log Follow-Up & Interaction
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lead.customerName} ({lead.leadNumber}) • Current Status:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.status}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content layout: Form left, Past history right */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
          
          {/* New Follow-Up Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              New Interaction Details
            </h3>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Interaction Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Interaction Channel / Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FOLLOW_UP_TYPES.map((t) => {
                  const Icon = t.icon;
                  const isSel = followUpType === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFollowUpType(t.value)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        isSel
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date, Time & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Interaction Date
                </label>
                <input
                  type="date"
                  required
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Spoke With
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Decision Maker Name"
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Status Update on Follow Up */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Update Lead Stage to:
              </label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Hot">Hot (High Probability)</option>
                <option value="Warm">Warm (Active Discussions)</option>
                <option value="Cold">Cold (Early Stage)</option>
                <option value="Future-Prospect">Future Prospect (Deferred)</option>
                <option value="Close-Won">Close-Won (Deal Closed)</option>
                <option value="Close-Lost">Close-Lost (Lost/Dropped)</option>
              </select>
            </div>

            {/* Discussion summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discussion Minutes & Remarks <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={discussionSummary}
                onChange={(e) => setDiscussionSummary(e.target.value)}
                placeholder="Key objections raised, pricing feedback, client questions addressed..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Next Action & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Next Action Item
                </label>
                <input
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  placeholder="e.g. Share product test certificate"
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Next Follow-Up
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* SMS alert toggle (PDF Page 15) */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="smsAlert"
                checked={smsAlert}
                onChange={(e) => setSmsAlert(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="smsAlert" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                Enable automated SMS & Email reminder notification for next follow-up date
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Saving Follow-Up...' : 'Log Follow-Up & Update Status'}
              </button>
            </div>
          </form>

          {/* Historical Follow-Up Timeline (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-50/50 dark:bg-slate-800/30 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Activity History ({pastFollowUps.length})
              </h3>
            </div>

            {pastFollowUps.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No previous interactions logged yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Log the first follow-up using the form on the left.
                </p>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700 before:z-0">
                {pastFollowUps.map((fu, idx) => (
                  <div key={fu.id || idx} className="relative z-10 pl-7 space-y-1">
                    <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900" />
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {new Date(fu.followUpDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                        {fu.followUpTime && ` at ${fu.followUpTime}`}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {fu.leadStatus}
                      </span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {fu.followUpType}
                        </span>
                        {fu.contactPerson && (
                          <span className="truncate max-w-[120px]">
                            With: {fu.contactPerson}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                        {fu.discussionSummary}
                      </p>

                      {fu.nextFollowUpDate && (
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500">
                          <span>Next: {fu.nextAction || 'Follow up'}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {new Date(fu.nextFollowUpDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
