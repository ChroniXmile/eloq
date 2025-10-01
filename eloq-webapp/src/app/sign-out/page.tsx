'use client';

import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    // Redirect to sign-in page which handles sign-out
    window.location.href = '/elements/clerk/sign-in';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Signing out...</p>
      </div>
    </div>
  );
}