'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import AuthButton from '@/components/auth/AuthButton';
import AuthAlert from '@/components/auth/AuthAlert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/customer/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Request failed');
      }

      setMessage('If an account exists with that email, password reset instructions have been sent.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we will send you a secure link to reset your account password."
      footerPrompt="Remembered your password?"
      footerLinkText="Sign in"
      footerLinkHref="/signin"
    >
      <div className="auth-form-stack">
        {errorMsg && <AuthAlert type="error" message={errorMsg} onDismiss={() => setErrorMsg('')} />}
        {message && <AuthAlert type="success" message={message} />}

        {!message && (
          <form onSubmit={handleSubmit} className="auth-form-stack">
            <AuthInput
              id="forgot-email"
              label="Account Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@gmail.com"
              required
              disabled={loading}
            />

            <AuthButton type="submit" loading={loading} loadingText="Sending Link...">
              Send Reset Link
            </AuthButton>
          </form>
        )}
      </div>

      <style jsx>{`
        .auth-form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
      `}</style>
    </AuthLayout>
  );
}
