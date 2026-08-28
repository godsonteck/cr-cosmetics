'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrength from '@/components/auth/PasswordStrength';
import AuthButton from '@/components/auth/AuthButton';
import AuthAlert from '@/components/auth/AuthAlert';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Missing password reset token. Please request a new reset link.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/customer/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Reset failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter a new password for your CR Cosmetics & Essentials account."
      footerPrompt="Need help?"
      footerLinkText="Back to sign in"
      footerLinkHref="/signin"
    >
      <div className="auth-form-stack">
        {errorMsg && <AuthAlert type="error" message={errorMsg} onDismiss={() => setErrorMsg('')} />}
        {success && <AuthAlert type="success" message="Password reset successfully! Redirecting to sign in..." />}

        {!success && (
          <form onSubmit={handleSubmit} className="auth-form-stack">
            <div>
              <PasswordInput
                id="reset-password"
                label="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                disabled={loading}
              />
              <PasswordStrength password={password} />
            </div>

            <PasswordInput
              id="reset-confirm-password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              disabled={loading}
            />

            <AuthButton type="submit" loading={loading} loadingText="Resetting...">
              Set New Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
