'use client';

import React from 'react';

export default function AuthDivider({ text = 'or continue with' }: { text?: string }) {
  return (
    <div className="auth-divider">
      <div className="divider-line" />
      <span className="divider-text">{text}</span>
      <div className="divider-line" />

      <style jsx>{`
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0.25rem 0;
        }
        .divider-line { flex: 1; height: 1px; background: #E7E2DA; }
        .divider-text { font-size: 0.78rem; color: #57534E; font-weight: 500; }
      `}</style>
    </div>
  );
}
