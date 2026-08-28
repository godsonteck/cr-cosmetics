'use client';

import React from 'react';

export interface AuthAlertProps {
  type?: 'error' | 'success' | 'warning';
  message: string;
  onDismiss?: () => void;
}

export default function AuthAlert({ type = 'error', message, onDismiss }: AuthAlertProps) {
  if (!message) return null;

  return (
    <div className={`auth-alert auth-alert--${type}`} role="alert">
      <span className="auth-alert-icon">
        {type === 'error' && '⚠️'}
        {type === 'success' && '✅'}
        {type === 'warning' && '⏳'}
      </span>
      <div className="auth-alert-content">
        <p>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="auth-alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}

      <style jsx>{`
        .auth-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .auth-alert--error {
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
        }

        .auth-alert--success {
          background: #F0FDF4;
          border: 1px solid #86EFAC;
          color: #166534;
        }

        .auth-alert-icon { font-size: 1rem; flex-shrink: 0; }
        .auth-alert-content { flex: 1; }
        .auth-alert-content p { margin: 0; }
        .auth-alert-dismiss {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: inherit;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
