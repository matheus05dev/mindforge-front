'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // First set token with temp data
      setAuth(token, { email: 'loading...', name: 'Loading...' });
      
      // Then fetch real user data
      useAuthStore.getState().fetchUser().then(() => {
          toast.success('Login com GitHub realizado com sucesso!');
          router.push('/');
      });
    } else {
      toast.error('Falha ao processar login com GitHub.');
      router.push('/login');
    }
  }, [router, searchParams, setAuth]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Autenticando...</p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
