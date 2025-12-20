'use client';

import { useCollection } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Package } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Define the Order type based on backend.json
type Order = {
  id: string;
  userId: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    shoeId: string;
    name: string;
    price: number;
    size: number;
    quantity: number;
    imageUrl: string;
  }[];
  totalPrice: number;
  paymentMethod: 'card' | 'mpesa';
  status: 'unfulfilled' | 'fulfilled' | 'shipped' | 'cancelled';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function AdminOrdersPage() {
  const { data: orders, loading, error } = useCollection<Order>('orders');
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    try {
        await updateDoc(orderRef, { status: newStatus });
        toast({
            title: "Order Updated",
            description: `Order status changed to ${newStatus}.`,
        });
    } catch(err) {
        console.error("Failed to update order status", err);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the order status.",
        });
    }
  };
  
  if (error) {
    return <div className="text-destructive">Error loading orders: {error.message}</div>;
  }

  const sortedOrders = orders?.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8" />
          Order Management
        </h1>
        <p className="text-muted-foreground">View and manage all customer orders.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all recent orders placed in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                   <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : sortedOrders && sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.customerInfo.name}</div>
                      <div className="text-sm text-muted-foreground hidden md:inline">{order.customerInfo.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(new Date(order.createdAt.seconds * 1000), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      KSH {order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === 'fulfilled' ? 'default' : order.status === 'unfulfilled' ? 'secondary' : 'outline'}
                        className={cn({
                            'bg-green-600/20 text-green-400 border-green-600/40': order.status === 'fulfilled',
                            'bg-yellow-600/20 text-yellow-400 border-yellow-600/40': order.status === 'unfulfilled',
                        })}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'fulfilled')}>Mark as Fulfilled</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'shipped')}>Mark as Shipped</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-destructive">Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No orders found.
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
