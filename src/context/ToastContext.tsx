'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Toast {
  id: string;
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
}

interface ToastOptions {
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = ({ title, message, type = 'info', duration = 3500 }: ToastOptions) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: Toast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="cr-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`cr-toast-item cr-toast-${toast.type}`}>
            <div className="cr-toast-content">
              {toast.title && <div className="cr-toast-title">{toast.title}</div>}
              {toast.message && <div className="cr-toast-message">{toast.message}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="cr-toast-close"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
