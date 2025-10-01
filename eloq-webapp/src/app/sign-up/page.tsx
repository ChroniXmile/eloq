'use client';

import { useEffect } from 'react';

export default function SignUpRedirect() {
  useEffect(() => {
    window.location.href = '/elements/clerk/sign-up';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecting to sign up...</p>
      </div>
    </div>
  );
}