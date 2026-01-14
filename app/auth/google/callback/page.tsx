'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch } from '@/store/hooks';
import { setSession } from '@/store/slices/authSlice';
import { toast } from 'sonner';

const REG_DATA_KEY = 'google_registration_data';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const sessionKey = searchParams.get('session');

    if (!sessionKey) {
      setStatus('error');
      const message = 'Missing session key from Google redirect. Please try again.';
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    (async () => {
      try {
        const res = await authApi.exchangeGoogleSession({ session: sessionKey });
        const data = res.data;

        if (data.type === 'login') {
          dispatch(setSession({ token: data.token, client: data.client }));
          toast.success('Logged in with Google');
          router.replace('/profile');
          return;
        }

        // type === 'register'
        sessionStorage.setItem(REG_DATA_KEY, JSON.stringify(data));
        toast.success('Google account found — complete registration');
        router.replace('/auth/google/register');
      } catch (err: any) {
        setStatus('error');
        const message = err?.message || 'Failed to complete Google authentication.';
        setErrorMessage(message);
        toast.error(message);
      }
    })();
  }, [dispatch, router, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Processing Google login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-[#2c2420]">Google Authentication Error</h1>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
          <Button asChild className="rounded-full bg-[var(--orange)] hover:bg-[var(--orange-dark)] text-white">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
