'use client';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) {
      return; // Wait for auth state to load
    }

    if (!user) {
      router.replace('/'); // Not logged in, redirect to home
      return;
    }

    user.getIdTokenResult().then(idTokenResult => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      if (!isAdminClaim) {
        router.replace('/'); // Not an admin, redirect to home
      }
    });

  }, [user, loading, router]);


  if (isAdmin === null || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  // Fallback, though redirection should have happened.
  return null;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
