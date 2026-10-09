'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Building2,
  Users
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoAccounts = [
    {
      role: '👑 System Administrator',
      title: 'Managing Director & Global Admin',
      name: 'Rajesh Singhania',
      email: 'admin@nuevolead.com',
      password: 'password123',
      badgeColor: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
    },
    {
      role: '👔 Sales Director / Manager',
      title: 'Regional Head (Has Subordinates)',
      name: 'Vikram Malhotra',
      email: 'manager@nuevolead.com',
      password: 'password123',
      badgeColor: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
    },
    {
      role: '💼 Sales Executive',
      title: 'Sr. Corporate Account Executive',
      name: 'Sanket Deshmukh',
      email: 'sanket@nuevolead.com',
      password: 'password123',
      badgeColor: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',
    },
  ];

  const handleFillDemo = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const res = await login(email.trim(), password);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage('');
    try {
      setIsLoading(true);
      const res = await login(accEmail, accPass);
      if (!res.success) {
        setErrorMessage(res.error || 'Login failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden text-slate-100">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-lg z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-xl shadow-indigo-500/30 mb-2">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Nuevo Lead CRM
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              v1.0
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Enterprise Sales Pipeline & Multi-Tier Hierarchy Cloud
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Sign In to Your Workspace</h2>
            <p className="text-xs text-slate-400">
              Enter your corporate credentials to access your pipeline
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Work Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nuevolead.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-indigo-400">
                  Default: password123
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Nuevo Lead</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Pills */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Quick Demo Login
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Supabase Live
              </span>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer group"
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {acc.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {acc.email} • <span className="text-slate-500">{acc.title}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(acc.email, acc.password);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0 ml-2"
                  >
                    Login →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Security Badges */}
        <div className="text-center space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Role-Based Access
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              Supabase Cloud DB
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Multi-Tier Hierarchy
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Nuevo Lead CRM V1.0 • Enterprise Sales Operating System
          </p>
        </div>

      </div>

    </div>
  );
}

