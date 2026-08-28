'use client';

import React, { ReactNode } from 'react';

export interface AuthButtonProps {
  children: ReactNode;
  type?: 'submit' | 'button' | 'reset';
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  successText?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark';
}

export default function AuthButton({
  children,
  type = 'submit',
  loading = false,
  loadingText = 'Please wait...',
  success = false,
  successText = 'Success!',
  disabled = false,
  onClick,
  variant = 'primary',
}: AuthButtonProps) {
  const isDisabled = disabled || loading || success;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`auth-btn auth-btn--${variant}`}
    >
      {loading && <span className="auth-btn-spinner" aria-hidden="true" />}
      {success && <span className="auth-btn-check">✓</span>}
      <span>{loading ? loadingText : success ? successText : children}</span>

      <style jsx>{`
        .auth-btn {
          width: 100%;
          padding: 0.85rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          border: none;
        }

        .auth-btn--primary {
          background: #7B2347;
          color: #fff;
        }

        .auth-btn--dark {
          background: #2D1820;
          color: #fff;
        }

        .auth-btn--secondary {
          background: #fff;
          color: #1C1917;
          border: 1.5px solid #E7E2DA;
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: btn-spin 0.6s linear infinite;
        }

        @keyframes btn-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
