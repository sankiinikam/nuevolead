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
  AlertCircle,
  Lock,
  GitBranch,
  KeyRound,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface TeamManagementProps {
  onRefresh?: () => void;
}

export default function TeamManagement({ onRefresh }: TeamManagementProps) {
  const { users, currentUser, isAdmin, isManager, refreshUsers } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'under_me' | 'all' | 'tree'>('under_me');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('SALES_EXECUTIVE');
  const [designation, setDesignation] = useState('Sales Executive');
  const [department, setDepartment] = useState('Field Sales');
  const [phone, setPhone] = useState('');
  const [targetRevenue, setTargetRevenue] = useState<number>(1000000);
  const [reportingToId, setReportingToId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Password reset modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordTargetUser, setPasswordTargetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Users reporting directly to the current user
  const directReports = users.filter((u) => u.reportingToId === currentUser?.id);

  // Computed metrics for current user's direct subordinates
  const directTarget = directReports.reduce((acc, u) => acc + (Number(u.targetRevenue) || 0), 0);
  const directWon = directReports.reduce((acc, u) => acc + (Number(u.stats?.wonRevenue) || 0), 0);
  const directPipeline = directReports.reduce((acc, u) => acc + (Number(u.stats?.pipelineValue) || 0), 0);

  // Overall organization stats
  const totalEmployees = users.length;
  const totalTarget = users.reduce((acc, u) => acc + (Number(u.targetRevenue) || 0), 0);
  const totalWon = users.reduce((acc, u) => acc + (Number(u.stats?.wonRevenue) || 0), 0);
  const teamPipeline = users.reduce((acc, u) => acc + (Number(u.stats?.pipelineValue) || 0), 0);
  const targetAchievement = totalTarget > 0 ? Math.round((totalWon / totalTarget) * 100) : 0;

  // Open modal specifically to create a user "Under Me"
  const handleOpenAddUnderMe = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('password123');
    setRole('SALES_EXECUTIVE');
    setDesignation('Sales Executive');
    setDepartment(currentUser?.department || 'Field Sales');
    setPhone('');
    setTargetRevenue(1000000);
    // Explicitly set reporting manager to logged in user
    setReportingToId(currentUser?.id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for general user creation
  const handleOpenAddGeneral = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('password123');
    setRole('SALES_EXECUTIVE');
    setDesignation('Sales Executive');
    setDepartment('Field Sales');
    setPhone('');
    setTargetRevenue(1000000);
    // Default to current user or top manager
    setReportingToId(currentUser?.id || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // Leave blank if not modifying
    setRole(user.role);
    setDesignation(user.designation || '');
    setDepartment(user.department || '');
    setPhone(user.phone || '');
    setTargetRevenue(user.targetRevenue || 1000000);
    setReportingToId(user.reportingToId || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Name and Email are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      const payload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        designation,
        department,
        phone,
        targetRevenue: Number(targetRevenue),
        reportingToId: reportingToId || null,
      };

      if (!editingUser && password) {
        payload.password = password;
      } else if (editingUser && password.trim()) {
        payload.password = password.trim();
      }

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save employee profile.');
      }

      await refreshUsers();
      if (onRefresh) onRefresh();
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName}? Any leads assigned to them will be unassigned.`)) {
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

  const handleOpenPasswordReset = (user: User) => {
    setPasswordTargetUser(user);
    setNewPassword('');
    setPasswordSuccess(false);
    setIsPasswordModalOpen(true);
  };

  const handleSavePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTargetUser || !newPassword.trim()) return;
    try {
      const res = await fetch(`/api/users/${passwordTargetUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update password');
      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 1500);
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

  const displayUsers = activeSubTab === 'under_me' ? directReports : users;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Subordinates under current user */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-900/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-2">
            <span>Direct Reports Under You</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {directReports.length} <span className="text-sm font-normal text-slate-500">Subordinates</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Reporting directly to <strong className="text-slate-800 dark:text-slate-200">{currentUser?.name}</strong>
          </p>
        </div>

        {/* Quota of subordinates under current user */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Subordinates Quota Target</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ₹{directTarget.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total sales quota assigned under you
          </p>
        </div>

        {/* Won Revenue by Direct Reports */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Won Revenue Under You</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{directWon.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Pipeline: ₹{directPipeline.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Total Organization Headcount */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Total Organization Users</span>
            <Building className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalEmployees} <span className="text-sm font-normal text-slate-500">Total Users</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Company-wide quota: ₹{totalTarget.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Main Header & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                User Admin & Reporting Hierarchy Console
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.role === 'ADMIN' ? '👑 Admin' : '👔 Manager'}) — Add employees under your supervision and define reporting lines
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Primary Action: Add User Under Me */}
          <button
            onClick={handleOpenAddUnderMe}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add User Under Me</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenAddGeneral}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
              title="Add user and select any manager"
            >
              <span>Add Other User</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Direct Reports vs All Users vs Tree */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('under_me')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'under_me'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direct Reports Under Me ({directReports.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('all')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'all'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Organization Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tree')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeSubTab === 'tree'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Hierarchy Tree Visualizer</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1 & 2: USER TABLES ======================= */}
      {activeSubTab !== 'tree' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {displayUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-12 h-12 mx-auto text-indigo-400/60" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Direct Subordinates Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any employees assigned directly under you. Click <strong>&quot;+ Add User Under Me&quot;</strong> to create a new team member reporting to you.
              </p>
              <button
                onClick={handleOpenAddUnderMe}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add User Under Me Now</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Designation / Dept</th>
                    <th className="py-3.5 px-4">Reports To</th>
                    <th className="py-3.5 px-4">Assigned Pipeline</th>
                    <th className="py-3.5 px-4">Annual Quota Progress</th>
                    <th className="py-3.5 px-4">Status</th>
                    {(isAdmin || isManager) && <th className="py-3.5 px-4 text-right">Admin Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {displayUsers.map((u) => {
                    const target = u.targetRevenue || 1;
                    const won = u.stats?.wonRevenue || 0;
                    const pct = Math.min(100, Math.round((won / target) * 100));
                    const isUnderCurrentUser = u.reportingToId === currentUser?.id;

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors ${
                          isUnderCurrentUser ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                        }`}
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
                                {isUnderCurrentUser && currentUser?.id !== u.id && (
                                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                    Under You
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
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="font-semibold">{u.reportingTo.name}</span>
                              {u.reportingTo.id === currentUser?.id ? (
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                  (You)
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  ({u.reportingTo.role === 'ADMIN' ? 'Admin' : 'Manager'})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              Top Level Leader
                            </span>
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
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                                u.isActive
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
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
                            <span className="text-[11px] text-emerald-600 font-semibold">Active</span>
                          )}
                        </td>

                        {/* Actions */}
                        {(isAdmin || isManager) && (
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Reset Password */}
                              <button
                                onClick={() => handleOpenPasswordReset(u)}
                                title="Reset User Password"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Profile */}
                              <button
                                onClick={() => handleOpenEdit(u)}
                                title="Edit Profile & Reporting Manager"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete (Admin only) */}
                              {isAdmin && u.id !== currentUser?.id && (
                                <button
                                  onClick={() => handleDelete(u.id, u.name)}
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
          )}
        </div>
      )}

      {/* ======================= TAB 3: HIERARCHY TREE ======================= */}
      {activeSubTab === 'tree' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Corporate Reporting Architecture
              </h3>
              <p className="text-xs text-slate-500">
                Visualizing managing leadership down to frontline account executives
              </p>
            </div>
            <button
              onClick={handleOpenAddUnderMe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Subordinate</span>
            </button>
          </div>

          {/* Root Leaders (Users with no reportingTo) */}
          <div className="space-y-6">
            {users
              .filter((u) => !u.reportingToId)
              .map((rootLeader) => {
                const rootSubordinates = users.filter((u) => u.reportingToId === rootLeader.id);

                return (
                  <div
                    key={rootLeader.id}
                    className="p-5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4"
                  >
                    {/* Top Level Leader Card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                          👑
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {rootLeader.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              Top Executive
                            </span>
                            {currentUser?.id === rootLeader.id && (
                              <span className="text-[10px] font-bold text-indigo-600">
                                (You)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {rootLeader.designation} • {rootLeader.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rootSubordinates.length} Direct Subordinates
                        </div>
                        <div className="text-[11px] text-emerald-600 font-semibold">
                          Quota: ₹{(rootLeader.targetRevenue || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Subordinates under this leader */}
                    {rootSubordinates.length > 0 && (
                      <div className="pl-6 border-l-2 border-indigo-300 dark:border-indigo-800 ml-5 space-y-4 pt-2">
                        {rootSubordinates.map((sub1) => {
                          const sub1Reports = users.filter((u) => u.reportingToId === sub1.id);

                          return (
                            <div
                              key={sub1.id}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                                    {sub1.role === 'MANAGER' ? '👔' : '💼'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                                        {sub1.name}
                                      </span>
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                        {sub1.role === 'MANAGER' ? 'Manager' : 'Executive'}
                                      </span>
                                      {currentUser?.id === sub1.id && (
                                        <span className="text-[10px] font-bold text-indigo-600">
                                          (You)
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                      {sub1.designation} • {sub1.email}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-bold text-emerald-600">
                                    ₹{(sub1.targetRevenue || 0).toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">
                                    Pipeline: ₹{(sub1.stats?.pipelineValue || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>

                              {/* Tier 3 Subordinates */}
                              {sub1Reports.length > 0 && (
                                <div className="pl-5 border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-2 pt-1">
                                  {sub1Reports.map((sub2) => (
                                    <div
                                      key={sub2.id}
                                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-[10px]">
                                          💼
                                        </div>
                                        <div>
                                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                            {sub2.name}
                                          </div>
                                          <div className="text-[10px] text-slate-400">
                                            {sub2.designation} • {sub2.email}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right text-[11px] font-semibold text-emerald-600">
                                        Target: ₹{(sub2.targetRevenue || 0).toLocaleString('en-IN')}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================= ADD / EDIT USER MODAL ======================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingUser ? `Edit Employee: ${editingUser.name}` : 'Create Subordinate Employee'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Define reporting line under your supervision and sales target quota
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
              
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Reporting manager highlight badge */}
              <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                    Assigned Reporting Manager
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {reportingToId === currentUser?.id
                      ? `Directly under You (${currentUser?.name})`
                      : users.find((u) => u.id === reportingToId)?.name || 'Top Level Leader'}
                  </p>
                </div>
                {reportingToId === currentUser?.id && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                    Direct Subordinate
                  </span>
                )}
              </div>

              {/* Name & Email */}
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
                    placeholder="e.g. Anjali Sharma"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20"
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
                    placeholder="anjali@nuevolead.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Password (for new user) */}
              {!editingUser && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Login Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password123"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Default is &quot;password123&quot;. The user can log in with this password.
                  </span>
                </div>
              )}

              {/* Role, Designation, Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                    <option value="MANAGER">Sales Director / Manager</option>
                    {isAdmin && <option value="ADMIN">System Administrator</option>}
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Reporting Manager Selector & Target Quota */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reports Directly To (Hierarchy)
                  </label>
                  <select
                    value={reportingToId}
                    onChange={(e) => setReportingToId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">None (Top Level Leader)</option>
                    {users
                      .filter((u) => u.id !== editingUser?.id && (u.role === 'ADMIN' || u.role === 'MANAGER'))
                      .map((mgr) => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.name} {mgr.id === currentUser?.id ? '(Under You - Current User)' : `(${mgr.role === 'ADMIN' ? 'Admin' : 'Manager'})`}
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
                    step="50000"
                    value={targetRevenue}
                    onChange={(e) => setTargetRevenue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingUser ? 'Update Employee' : 'Create User Under Me'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================= PASSWORD RESET MODAL ======================= */}
      {isPasswordModalOpen && passwordTargetUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Reset User Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    {passwordTargetUser.name} ({passwordTargetUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Password successfully updated!</span>
              </div>
            ) : (
              <form onSubmit={handleSavePasswordReset} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (e.g. password123)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
