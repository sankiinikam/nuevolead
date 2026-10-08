'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSalesExecutive: boolean;
  setCurrentUser: (user: User) => void;
  refreshUsers: () => Promise<void>;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/users');
      if (res.ok) {
        const data: User[] = await res.json();
        setUsers(data);

        // If no user selected yet, default to Admin for full experience
        if (!currentUser && data.length > 0) {
          const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('nuevolead_user_id') : null;
          const found = data.find((u) => u.id === savedUserId) || data.find((u) => u.role === 'ADMIN') || data[0];
          setCurrentUser(found);
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

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nuevolead_user_id', user.id);
    }
  };

  const switchRole = (role: Role) => {
    const userWithRole = users.find((u) => u.role === role);
    if (userWithRole) {
      handleSetCurrentUser(userWithRole);
    }
  };

  const isAdmin = currentUser?.role === 'ADMIN';
  const isManager = currentUser?.role === 'MANAGER' || isAdmin;
  const isSalesExecutive = currentUser?.role === 'SALES_EXECUTIVE';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isLoading,
        isAdmin,
        isManager,
        isSalesExecutive,
        setCurrentUser: handleSetCurrentUser,
        refreshUsers: fetchUsers,
        switchRole,
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

