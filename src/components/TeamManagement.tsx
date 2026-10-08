'use client';

import React, { useState } from 'react';
import { User, Role } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  UserPlus,
  ShieldCheck,
  TrendingUp,
  Target,
  Award,
  Building,
  Mail,
  Phone,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface TeamManagementProps {
  onRefresh?: () => void;
}

export default function TeamManagement({ onRefresh }: TeamManagementProps) {
  const { users, currentUser, isAdmin, refreshUsers } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('SALES_EXECUTIVE');
  const [designation, setDesignation] = useState('Sales Executive');
  const [department, setDepartment] = useState('Field Sales');
  const [phone, setPhone] = useState('');
  const [targetRevenue, setTargetRevenue] = useState<number>(1000000);
  const [reportingToId, setReportingToId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Overall team stats
  const totalEmployees = users.length;
  const totalTarget = users.reduce((acc, u) => acc + (Number(u.targetRevenue) || 0), 0);
  const totalWon = users.reduce((acc, u) => acc + (Number(u.stats?.wonRevenue) || 0), 0);
  const teamPipeline = users.reduce((acc, u) => acc + (Number(u.stats?.pipelineValue) || 0), 0);
  const targetAchievement = totalTarget > 0 ? Math.round((totalWon / totalTarget) * 100) : 0;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('SALES_EXECUTIVE');
    setDesignation('Sales Executive');
    setDepartment('Field Sales');
    setPhone('');
    setTargetRevenue(1000000);
    // Default reporting manager to current manager or admin
    const defaultManager = users.find((u) => u.role === 'MANAGER' || u.role === 'ADMIN');
    setReportingToId(defaultManager?.id || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDesignation(user.designation || '');
    setDepartment(user.department || '');
    setPhone(user.phone || '');
    setTargetRevenue(user.targetRevenue || 1000000);
    setReportingToId(user.reportingToId || '');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const payload = {
        name: name.trim(),
        email: email.trim(),
        role,
        designation,
        department,
        phone,
        targetRevenue: Number(targetRevenue),
        reportingToId: reportingToId || undefined,
      };

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save employee.');
      }

      await refreshUsers();
      if (onRefresh) onRefresh();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this employee? Their leads will be unassigned.')) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete employee.');
      await refreshUsers();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleActiveStatus = async (user: User) => {
    try {
      await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      await refreshUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getRoleBadge = (r: Role) => {
    switch (r) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            👑 Admin / Director
          </span>
        );
      case 'MANAGER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            👔 Sales Director / Manager
          </span>
        );
      case 'SALES_EXECUTIVE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            💼 Sales Executive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Sales Headcount</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalEmployees} Members
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-tier reporting hierarchy</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Annual Team Target</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{totalTarget.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Combined sales quota</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Team Won Revenue</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{totalWon.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{targetAchievement}%</span>
            <span>of quota achieved</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Live Team Pipeline</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{teamPipeline.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active closing opportunities</p>
        </div>
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Hierarchy & Sales Organization Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define reporting managers, assign sales quotas, and monitor revenue performance per employee
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Sales Employee</span>
          </button>
        )}
      </div>

      {/* Employee List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Role & Hierarchy</th>
                <th className="py-3.5 px-4">Designation / Dept</th>
                <th className="py-3.5 px-4">Reports To</th>
                <th className="py-3.5 px-4">Assigned Pipeline</th>
                <th className="py-3.5 px-4">Target Quota Progress</th>
                <th className="py-3.5 px-4">Status</th>
                {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {users.map((u) => {
                const target = u.targetRevenue || 1;
                const won = u.stats?.wonRevenue || 0;
                const pct = Math.min(100, Math.round((won / target) * 100));

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Employee Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {u.name}
                            {currentUser?.id === u.id && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Designation */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {u.designation || 'Sales Executive'}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {u.department || 'Sales'}
                      </span>
                    </td>

                    {/* Hierarchy Reports To */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.reportingTo ? (
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="font-semibold">{u.reportingTo.name}</span>
                          <span className="text-[10px] text-slate-400">
                            ({u.reportingTo.role === 'ADMIN' ? 'Admin' : 'Manager'})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Top Level Leader</span>
                      )}
                    </td>

                    {/* Assigned Pipeline */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {u.stats?.totalLeads || 0} leads
                        <span className="text-slate-400 font-normal">
                          {' '}({u.stats?.hotLeads || 0} hot)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Pipeline: ₹{(u.stats?.pipelineValue || 0).toLocaleString('en-IN')}
                      </div>
                    </td>

                    {/* Quota Progress */}
                    <td className="py-3.5 px-4 min-w-[160px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{won.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400">
                          Target: ₹{(u.targetRevenue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isAdmin ? (
                        <button
                          onClick={() => toggleActiveStatus(u)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600">Active</span>
                      )}
                    </td>

                    {/* Actions */}
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Employee & Quota"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {u.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              title="Delete Employee"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingUser ? `Edit Employee: ${editingUser.name}` : 'Add Sales Team Member'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Set role hierarchy, quota expectations, and reporting lines
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="v.malhotra@corp.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                    <option value="MANAGER">Sales Director / Manager</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Account Executive"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Field Sales"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reporting Manager (Hierarchy)
                  </label>
                  <select
                    value={reportingToId}
                    onChange={(e) => setReportingToId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">None (Top Executive)</option>
                    {users
                      .filter((u) => u.id !== editingUser?.id && (u.role === 'ADMIN' || u.role === 'MANAGER'))
                      .map((mgr) => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.name} ({mgr.role === 'ADMIN' ? 'Admin' : 'Manager'}) — {mgr.designation}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Annual Target Quota (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingUser ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
