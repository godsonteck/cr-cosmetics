'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CustomerUser } from '@/types';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}

interface AuthContextType {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  admin: StaffUser | null;
  isAdminAuthenticated: boolean;
  hasAdminPermission: (permKey: string) => boolean;
  loading: boolean;
  signInCustomer: (creds: Record<string, unknown>) => Promise<CustomerUser>;
  signUpCustomer: (data: Record<string, unknown>) => Promise<unknown>;
  signInWithGoogle: () => Promise<never>;
  signOutCustomer: () => Promise<void>;
  signInAdmin: (creds: Record<string, unknown>) => Promise<StaffUser>;
  signOutAdmin: () => Promise<void>;
  refreshSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [admin, setAdmin] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadCustomerSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/customer/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.customer) {
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (e) {
      console.error('Error loading customer session:', e);
      setCustomer(null);
    }
  }, []);

  const loadAdminSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/admin/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.staff) {
        setAdmin(data.staff);
      } else {
        setAdmin(null);
      }
    } catch (e) {
      console.error('Error loading admin session:', e);
      setAdmin(null);
    }
  }, []);

  const loadSessions = useCallback(async () => {
    await Promise.all([loadCustomerSession(), loadAdminSession()]);
    setLoading(false);
  }, [loadCustomerSession, loadAdminSession]);

  useEffect(() => {
    loadSessions();

    const handleAuthChange = () => {
      loadSessions();
    };

    window.addEventListener('cr-auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('cr-auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [loadSessions]);

  const signInCustomer = async (creds: Record<string, unknown>): Promise<CustomerUser> => {
    const res = await fetch('/api/auth/customer/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign in failed');
    setCustomer(data.customer);
    window.dispatchEvent(new CustomEvent('cr-auth-changed'));
    return data.customer;
  };

  const signUpCustomer = async (data: Record<string, unknown>): Promise<unknown> => {
    const res = await fetch('/api/auth/customer/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Registration failed');
    setCustomer(result.customer);
    window.dispatchEvent(new CustomEvent('cr-auth-changed'));
    return result;
  };

  const signInWithGoogle = async (): Promise<never> => {
    throw new Error('Google sign-in not yet implemented');
  };

  const signOutCustomer = async (): Promise<void> => {
    await fetch('/api/auth/customer/signout', {
      method: 'POST',
      credentials: 'include',
    });
    setCustomer(null);
    window.dispatchEvent(new CustomEvent('cr-auth-changed'));
  };

  const signInAdmin = async (creds: Record<string, unknown>): Promise<StaffUser> => {
    const res = await fetch('/api/auth/admin/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(creds),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin sign in failed');
    setAdmin(data.staff);
    window.dispatchEvent(new CustomEvent('cr-auth-changed'));
    return data.staff;
  };

  const signOutAdmin = async (): Promise<void> => {
    await fetch('/api/auth/admin/signout', {
      method: 'POST',
      credentials: 'include',
    });
    setAdmin(null);
    window.dispatchEvent(new CustomEvent('cr-auth-changed'));
  };

  const hasAdminPermission = (permKey: string): boolean => {
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return admin.permissions?.includes(permKey) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        admin,
        isAdminAuthenticated: !!admin,
        hasAdminPermission,
        loading,
        signInCustomer,
        signUpCustomer,
        signInWithGoogle,
        signOutCustomer,
        signInAdmin,
        signOutAdmin,
        refreshSessions: loadSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
