'use client';

import React, { InputHTMLAttributes, ReactNode } from 'react';

export interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  prefix?: string;
}

export default function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  helperText,
  icon,
  prefix,
  autoComplete,
  disabled = false,
}: AuthInputProps) {
  return (
    <div className="auth-field-group">
      {label && (
        <div className="auth-field-label-row">
          <label htmlFor={id} className="auth-field-label">
            {label}
            {required && <span className="auth-req-dot">*</span>}
          </label>
        </div>
      )}

      <div className={`auth-input-wrapper ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
        {prefix && <span className="auth-input-prefix">{prefix}</span>}
        {icon && !prefix && <span className="auth-input-icon">{icon}</span>}

        <input
          id={id}
          type={type}
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

        .auth-input-prefix {
          font-size: 0.88rem;
          font-weight: 600;
          color: #7B2347;
          margin-right: 0.5rem;
        }

        .auth-input-icon {
          font-size: 1rem;
          color: #8C8580;
          margin-right: 0.5rem;
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
