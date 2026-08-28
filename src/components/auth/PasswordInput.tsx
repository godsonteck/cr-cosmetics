'use client';

import React, { useState, InputHTMLAttributes, ReactNode } from 'react';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  helperText?: string;
  rightAction?: ReactNode;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  required = false,
  error,
  helperText,
  autoComplete = 'current-password',
  disabled = false,
  rightAction,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-field-group">
      <div className="auth-field-label-row">
        {label && (
          <label htmlFor={id} className="auth-field-label">
            {label}
            {required && <span className="auth-req-dot">*</span>}
          </label>
        )}
        {rightAction && <div className="auth-label-action">{rightAction}</div>}
      </div>

      <div className={`auth-input-wrapper ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
        <span className="auth-input-icon">🔒</span>

        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className="auth-input-control"
          aria-invalid={!!error}
        />

        <button
          type="button"
          className="auth-toggle-pwd-btn"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      {error && (
        <div className="auth-field-error" role="alert">
          <span>⚠ {error}</span>
        </div>
      )}

      {!error && helperText && (
        <div className="auth-field-helper">{helperText}</div>
      )}

      <style jsx>{`
        .auth-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          width: 100%;
        }

        .auth-field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-field-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1C1917;
        }

        .auth-req-dot { color: #7B2347; }

        .auth-input-wrapper {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1.5px solid #E7E2DA;
          border-radius: 8px;
          padding: 0 0.85rem;
        }

        .auth-input-wrapper.has-error {
          border-color: #991B1B;
          background: #FEF2F2;
        }

        .auth-input-icon {
          font-size: 0.95rem;
          margin-right: 0.5rem;
          opacity: 0.6;
        }

        .auth-input-control {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 0;
          font-size: 0.92rem;
          color: #1C1917;
          outline: none;
        }

        .auth-toggle-pwd-btn {
          background: none;
          border: none;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .auth-field-error {
          font-size: 0.75rem;
          color: #991B1B;
          font-weight: 500;
        }

        .auth-field-helper {
          font-size: 0.75rem;
          color: #57534E;
        }
      `}</style>
    </div>
  );
}
