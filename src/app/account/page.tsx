
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function AccountPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.displayName || 'Valued Customer'}!
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>View your order history and manage your details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/account/orders">
                <Package className="mr-2 h-4 w-4" />
                View My Orders
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
