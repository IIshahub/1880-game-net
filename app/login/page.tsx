'use client';

import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-screen">
          <div className="auth-card">
            <p className="auth-subtitle">Loading…</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
