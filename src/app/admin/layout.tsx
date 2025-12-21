'use client';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait for auth state to be fully loaded
    }

    if (!user) {
      router.replace('/'); // Not logged in, redirect to home
      return;
    }

    // Force a token refresh to get the latest custom claims.
    user.getIdTokenResult(true).then(idTokenResult => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      if (!isAdminClaim) {
        console.log("User is not an admin, redirecting.");
        router.replace('/'); // Not an admin, redirect to home
      }
    }).catch(error => {
        console.error("Error getting ID token result:", error);
        setIsAdmin(false);
        router.replace('/');
    });

  }, [user, isUserLoading, router]);


  if (isAdmin === null || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying permissions...</p>
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
