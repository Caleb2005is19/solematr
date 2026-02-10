
'use client';

import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Breadcrumbs from '@/components/breadcrumbs';
import { getPlaceholderImage } from '@/lib/placeholder-images';

type Order = {
  id: string;
  items: {
    name: string;
    price: number;
    size: number;
    quantity: number;
    imageUrl: string;
  }[];
  totalPrice: number;
  status: 'unfulfilled' | 'fulfilled' | 'shipped' | 'cancelled';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function UserOrdersPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const noImagePlaceholder = getPlaceholderImage('placeholder-no-image');

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'orders');
  }, [firestore, user]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const sortedOrders = orders?.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Account', href: '/account' },
          { label: 'My Orders', href: '/account/orders', isActive: true },
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Here is a list of your past and current orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center"><Skeleton className="h-6 w-24 rounded-full mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sortedOrders && sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                        <div className="font-medium text-primary">Order #{order.id.slice(0, 7)}...</div>
                        <div className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt.seconds * 1000), 'MMMM d, yyyy')}
                        </div>
                         <div className="mt-2 flex flex-wrap gap-2">
                            {order.items.map(item => (
                                <div key={item.name + item.size} className="relative h-10 w-10" title={`${item.name} (Size ${item.size})`}>
                                    <Image 
                                        src={item.imageUrl || noImagePlaceholder?.imageUrl || ''} 
                                        alt={item.name}
                                        fill
                                        sizes="40px"
                                        className="rounded-md object-cover border"
                                    />
                                </div>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center align-middle">
                      <Badge
                        className={cn({
                          'bg-green-600/20 text-green-400 border-green-600/40': order.status === 'fulfilled' || order.status === 'shipped',
                          'bg-yellow-600/20 text-yellow-400 border-yellow-600/40': order.status === 'unfulfilled',
                          'bg-red-600/20 text-red-400 border-red-600/40': order.status === 'cancelled',
                        })}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium align-middle">KSH {order.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    You haven't placed any orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
