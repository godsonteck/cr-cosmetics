'use client';

import React from 'react';
import { evaluatePasswordStrength } from '@/services/authService';

export default function PasswordStrength({ password = '' }: { password?: string }) {
  if (!password) return null;

  const { score, label, color, checks } = evaluatePasswordStrength(password);

  return (
    <div className="pwd-strength-container">
      <div className="pwd-strength-header">
        <span className="pwd-strength-title">Password Strength:</span>
        <span className="pwd-strength-label" style={{ color }}>
          {label}
        </span>
      </div>

      <div className="pwd-meter-bars">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className="pwd-meter-segment"
            style={{ backgroundColor: score >= step ? color : '#E7E2DA' }}
          />
        ))}
      </div>

      <div className="pwd-checks-list">
        <span className={`pwd-check-item ${checks.length ? 'met' : ''}`}>
          {checks.length ? '✓' : '○'} At least 8 characters
        </span>
        <span className={`pwd-check-item ${checks.mixed ? 'met' : ''}`}>
          {checks.mixed ? '✓' : '○'} Uppercase &amp; lowercase
        </span>
        <span className={`pwd-check-item ${checks.number ? 'met' : ''}`}>
          {checks.number ? '✓' : '○'} At least 1 number
        </span>
      </div>

      <style jsx>{`
        .pwd-strength-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 0.2rem;
          background: #FAF7F2;
          border: 1px solid #E7E2DA;
          border-radius: 6px;
          padding: 0.65rem 0.85rem;
        }
        .pwd-strength-header { display: flex; justify-content: space-between; font-size: 0.75rem; }
        .pwd-strength-title { color: #57534E; }
        .pwd-strength-label { font-weight: 700; }
        .pwd-meter-bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; height: 4px; }
        .pwd-meter-segment { border-radius: 2px; }
        .pwd-checks-list { display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.25rem; }
        .pwd-check-item { font-size: 0.72rem; color: #8C8580; display: flex; align-items: center; gap: 0.35rem; }
        .pwd-check-item.met { color: #166534; font-weight: 600; }
      `}</style>
    </div>
  );
}
