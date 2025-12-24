
'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Don't do anything until Firebase auth state is resolved
    if (isUserLoading) {
      return; 
    }

    // If no user, redirect to home
    if (!user) {
      router.replace('/'); 
      return;
    }

    // User is available, check for admin claim
    user.getIdTokenResult(true).then(idTokenResult => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      if (!isAdminClaim) {
        // If not an admin, redirect
        router.replace('/'); 
      }
    }).catch(error => {
        // If there's an error getting the token, treat as not admin
        console.error("Error getting ID token result:", error);
        setIsAdmin(false);
        router.replace('/');
    });

  }, [user, isUserLoading, router]);


  // While checking user status and admin claim, show a loading state
  if (isAdmin === null || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  // If the user is a confirmed admin, render the content
  if (isAdmin) {
    return <>{children}</>;
  }

  // If not admin, this will be null while redirecting
  return null;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
