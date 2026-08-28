'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrength from '@/components/auth/PasswordStrength';
import AuthButton from '@/components/auth/AuthButton';
import AuthAlert from '@/components/auth/AuthAlert';
import { useAuth } from '@/context/AuthContext';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const { signUpCustomer } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password || password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await signUpCustomer({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(redirectTarget);
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join CR Cosmetics & Essentials for faster checkout, order tracking, and member offers."
      footerPrompt="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref={`/signin${redirectTarget !== '/account' ? `?redirect=${encodeURIComponent(redirectTarget)}` : ''}`}
    >
      <div className="auth-form-stack">
        {errorMsg && (
          <AuthAlert type="error" message={errorMsg} onDismiss={() => setErrorMsg('')} />
        )}

        {success && (
          <AuthAlert type="success" message="Account created successfully! Redirecting you now..." />
        )}

        <form onSubmit={handleSubmit} className="auth-form-stack" noValidate>
          <AuthInput
            id="signup-fullname"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Abena Osei"
            required
            disabled={loading || success}
          />

          <AuthInput
            id="signup-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abena@example.com"
            required
            disabled={loading || success}
          />

          <AuthInput
            id="signup-phone"
            label="Ghana Phone Number (Optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="059 215 3306"
            disabled={loading || success}
          />

          <div>
            <PasswordInput
              id="signup-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              disabled={loading || success}
            />
            <PasswordStrength password={password} />
          </div>

          <AuthButton
            type="submit"
            loading={loading}
            loadingText="Creating account..."
            success={success}
            successText="Account Created!"
            disabled={loading || success}
          >
            Create Account
          </AuthButton>
        </form>
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
