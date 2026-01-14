'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GoogleErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Google authentication failed.';
  const message = searchParams.get('message');

  useEffect(() => {
    toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] px-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold text-[#2c2420]">Google Login Error</h1>
        <p className="text-sm text-muted-foreground">{error}</p>
        {message && <p className="text-xs text-muted-foreground">{message}</p>}

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
