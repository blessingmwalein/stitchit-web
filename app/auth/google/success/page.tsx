'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setSession } from '@/store/slices/authSlice';
import type { Client } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function safeParseClient(raw: string | null): Client | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as Client;
  } catch {
    try {
      return JSON.parse(raw) as Client;
    } catch {
      return null;
    }
  }
}

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const token = searchParams.get('token');
  const clientParam = searchParams.get('client');

  const parsedClient = useMemo(() => safeParseClient(clientParam), [clientParam]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Missing token from Google login.');
      return;
    }

    if (!parsedClient) {
      // Not fatal: we can still store token and let hydration fetch /profile.
      // But for now we require client to keep UX deterministic.
      setError('Missing client data from Google login.');
      return;
    }

    dispatch(setSession({ token, client: parsedClient }));
    router.replace('/profile');
  }, [dispatch, parsedClient, router, token]);

  if (!error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Finishing Google sign-in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-[#2c2420]">Google Sign-in Error</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
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
