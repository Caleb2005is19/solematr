
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
    if (isUserLoading) {
      return; 
    }

    if (!user) {
      router.replace('/'); 
      return;
    }

    user.getIdTokenResult(true).then(idTokenResult => {
      const isAdminClaim = !!idTokenResult.claims.admin;
      setIsAdmin(isAdminClaim);
      if (!isAdminClaim) {
        console.log("User is not an admin, redirecting.");
        router.replace('/'); 
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

  return null;
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminGuard>{children}</AdminGuard>
}
