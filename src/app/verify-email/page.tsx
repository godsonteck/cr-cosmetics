'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthAlert from '@/components/auth/AuthAlert';
import AuthButton from '@/components/auth/AuthButton';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error');
        setErrorMsg('Invalid or missing verification token.');
        return;
      }

      try {
        const res = await fetch('/api/auth/customer/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Email verification failed.');
      }
    }

    verify();
  }, [token]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Verifying your account email address..."
      footerPrompt="Need help?"
      footerLinkText="Go to Homepage"
      footerLinkHref="/"
    >
      <div className="auth-form-stack">
        {status === 'verifying' && <AuthAlert type="warning" message="Verifying your email token, please wait..." />}
        {status === 'error' && <AuthAlert type="error" message={errorMsg} />}
        {status === 'success' && <AuthAlert type="success" message="Your email has been verified! You can now sign in and enjoy full account features." />}

        {status === 'success' && (
          <AuthButton onClick={() => router.push('/signin')}>
            Proceed to Sign In &rarr;
          </AuthButton>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
