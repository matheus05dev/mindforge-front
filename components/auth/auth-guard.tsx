'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  useEffect(() => {
    // Wait for hydration
    if (!_hasHydrated) return;

    // List of public routes that don't satisfy the guard
    const publicRoutes = ['/login', '/register', '/'];
    
    // Check if the current path is public
    // We allow '/' as public for now, or maybe not depending on requirements.
    // Assuming dashboard is protected.
    
    const isPublic = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublic) {
      router.push('/login');
    } else if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
        // If already logged in, redirect away from auth pages
        router.push('/dashboard'); // Redirect to dashboard instead of /
    }
    
    setIsLoading(false);
  }, [isAuthenticated, pathname, router, _hasHydrated]);

  if (isLoading || !_hasHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
