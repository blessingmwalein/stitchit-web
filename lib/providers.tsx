'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '@/components/theme-provider';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { hydrateAuth } from '@/store/slices/authSlice';
import { Toaster } from '@/components/ui/sonner';

function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <AuthHydrator />
        <Toaster />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
