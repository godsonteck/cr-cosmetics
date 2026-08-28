'use client';

import React, { useState } from 'react';

export interface GoogleAuthButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (msg: string) => void;
  text?: string;
  disabled?: boolean;
  signInWithGoogle?: () => Promise<any>;
}

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  disabled = false,
  signInWithGoogle,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      if (signInWithGoogle) {
        const user = await signInWithGoogle();
        if (onSuccess) onSuccess(user);
      }
    } catch (err: any) {
      if (onError) onError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="btn-google-auth"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={text}
    >
      <svg className="google-icon" width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.35 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span>{loading ? 'Connecting with Google...' : text}</span>

      <style jsx>{`
        .btn-google-auth {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.8rem 1.25rem;
          background: #ffffff;
          border: 1.5px solid #E7E2DA;
          border-radius: 8px;
          color: #1C1917;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-google-auth:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>
    </button>
  );
}
