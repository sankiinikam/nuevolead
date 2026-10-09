'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSalesExecutive: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data: User[] = await res.json();
        setUsers(data);

        // Check if there is a saved session in localStorage
        const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('nuevolead_user_id') : null;
        if (savedUserId) {
          const matched = data.find((u) => u.id === savedUserId && u.isActive);
          if (matched) {
            setCurrentUser(matched);
          } else {
            // Saved user no longer exists or deactivated
            if (typeof window !== 'undefined') {
              localStorage.removeItem('nuevolead_user_id');
            }
            setCurrentUser(null);
          }
        } else {
          // No user logged in: remain null (do NOT auto-login as Admin!)
          setCurrentUser(null);
        }
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please check your credentials.',
        };
      }

      const loggedUser: User = data.user;
      setCurrentUser(loggedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('nuevolead_user_id', loggedUser.id);
      }

      // Re-fetch users to get updated hierarchy lists
      await fetchUsers();

      return { success: true };
    } catch (err: any) {
      console.error('Login request failed:', err);
      return {
        success: false,
        error: err.message || 'Network error while attempting to log in.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nuevolead_user_id');
    }
  };

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('nuevolead_user_id', user.id);
      } else {
        localStorage.removeItem('nuevolead_user_id');
      }
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isManager = currentUser?.role === 'MANAGER';
  const isSalesExecutive = currentUser?.role === 'SALES_EXECUTIVE';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        isAuthenticated,
        isAdmin,
        isManager,
        isSalesExecutive,
        login,
        logout,
        setCurrentUser: handleSetCurrentUser,
        refreshUsers: fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
