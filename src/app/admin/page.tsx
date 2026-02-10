'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Package, Users, DollarSign, Activity, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useAuth, useFirestore, useFunctions } from '@/firebase';
import { doc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { httpsCallable } from 'firebase/functions';
import React, { useState, useEffect } from 'react';
import type { Shoe } from '@/lib/types';
import { ProductForm } from '@/app/admin/_components/product-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getAdminUsers } from '@/app/admin/_actions/get-users-action';
import { getAdminOrders } from './_actions/get-orders-action';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

type Order = {
  id: string;
  userId: string | null;
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

type AppUser = {
    id: string;
    email: string | null;
    displayName: string | null;
};

// --- TABS ---

function DashboardTab({ orders, users, shoes }: { orders: Order[] | null, users: AppUser[] | null, shoes: Shoe[] | null }) {
    const totalRevenue = orders?.reduce((acc, order) => acc + order.totalPrice, 0) || 0;
    const salesData = orders
        ? Object.entries(
            orders
              .filter(order => order.createdAt && typeof order.createdAt.seconds === 'number')
              .reduce((acc: { [key: string]: number }, order) => {
                const month = format(new Date(order.createdAt.seconds * 1000), 'MMM');
                acc[month] = (acc[month] || 0) + order.totalPrice;
                return acc;
            }, {})
        ).map(([name, total]) => ({ name, total }))
        : [];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">KSH {totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">from {orders?.length || 0} orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{shoes?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Live products in store</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">User accounts created</p>
                </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={salesData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KSH ${value}`} />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}

function OrdersTab({ orders, loading, onUpdate, error }: { orders: Order[] | null, loading: boolean, onUpdate: () => void, error: string | null }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const noImagePlaceholder = getPlaceholderImage('placeholder-no-image');


  const handleStatusUpdate = async (orderId: string, userId: string | null, newStatus: Order['status']) => {
    if (!firestore) return;
    
    // If the order has a userId, it's in a user's subcollection.
    // Otherwise, it's in the top-level 'orders' collection for guests.
    const orderRef = userId
      ? doc(firestore, 'users', userId, 'orders', orderId)
      : doc(firestore, 'orders', orderId);
    
    try {
        await updateDoc(orderRef, { status: newStatus });
        toast({
            title: "Order Updated",
            description: `Order status has been set to ${newStatus}.`,
        });
        onUpdate(); // Trigger a refresh of the order list
    } catch (err: any) {
        console.error("Failed to update order status:", err);
        let description = "Could not update the order status.";
        if (err.message?.includes('permission-denied') || err.message?.includes('insufficient permissions')) {
            description = "You don't have permission to update this. This might be a guest order. Guest order status updates need to be enabled in your Firestore Rules."
        }
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: description,
        });
    }
  };
  
  if (error) {
    return <div className="text-destructive">Error loading orders: {error}</div>;
  }

  const sortedOrders = orders?.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

  return (
    <>
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
                      {order.createdAt && typeof order.createdAt.seconds === 'number' ? format(new Date(order.createdAt.seconds * 1000), 'MMM d, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      KSH {order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.status === 'fulfilled' ? 'default' : order.status === 'unfulfilled' ? 'secondary' : 'outline'}
                        className={cn({
                            'bg-green-600/20 text-green-400 border-green-600/40': order.status === 'fulfilled' || order.status === 'shipped',
                            'bg-yellow-600/20 text-yellow-400 border-yellow-600/40': order.status === 'unfulfilled',
                            'bg-blue-600/20 text-blue-400 border-blue-600/40': order.status === 'shipped',
                            'bg-red-600/20 text-red-400 border-red-600/40': order.status === 'cancelled',
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
                            <DropdownMenuItem onClick={() => setViewingOrder(order)}>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, order.userId, 'unfulfilled')}>Mark as Unfulfilled</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, order.userId, 'fulfilled')}>Mark as Fulfilled</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, order.userId, 'shipped')}>Mark as Shipped</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, order.userId, 'cancelled')} className="text-destructive">Cancel Order</DropdownMenuItem>
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
      
      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Viewing details for order #{viewingOrder?.id.slice(0, 7)}...
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <>
              <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-1">
                                <p className="font-medium">{viewingOrder.customerInfo.name}</p>
                                <p className="text-muted-foreground">{viewingOrder.customerInfo.email}</p>
                                <p className="text-muted-foreground pt-2">
                                    {viewingOrder.customerInfo.address}<br />
                                    {viewingOrder.customerInfo.city}, {viewingOrder.customerInfo.postalCode}<br />
                                    {viewingOrder.customerInfo.country}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge 
                                        className={cn({
                                            'bg-green-600/20 text-green-400 border-green-600/40': viewingOrder.status === 'fulfilled' || viewingOrder.status === 'shipped',
                                            'bg-yellow-600/20 text-yellow-400 border-yellow-600/40': viewingOrder.status === 'unfulfilled',
                                            'bg-blue-600/20 text-blue-400 border-blue-600/40': viewingOrder.status === 'shipped',
                                            'bg-red-600/20 text-red-400 border-red-600/40': viewingOrder.status === 'cancelled',
                                        })}
                                    >{viewingOrder.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span>{viewingOrder.createdAt && typeof viewingOrder.createdAt.seconds === 'number' ? format(new Date(viewingOrder.createdAt.seconds * 1000), 'MMM d, yyyy') : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-2">
                                    <span>Total:</span>
                                    <span>KSH {viewingOrder.totalPrice.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Items ({viewingOrder?.items?.length || 0})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {viewingOrder?.items && viewingOrder.items.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {viewingOrder.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={item.imageUrl || noImagePlaceholder?.imageUrl || ''}
                                                            alt={item.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-md object-cover border"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">KSH {(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No items found in this order.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4">
                  <Button variant="outline" onClick={() => setViewingOrder(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProductsTab({shoes, loading, error, onSave, onDelete}: {shoes: Shoe[] | null, loading: boolean, error: Error | null, onSave: () => void, onDelete: (shoeId: string) => void}) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
    const [shoeToDelete, setShoeToDelete] = useState<string | null>(null);
    const firestore = useFirestore();
    const { toast } = useToast();
    const noImagePlaceholder = getPlaceholderImage('placeholder-no-image');

    const handleEdit = (shoe: Shoe) => {
        setSelectedShoe(shoe);
        setIsFormOpen(true);
    }
    
    const handleAdd = () => {
        setSelectedShoe(null);
        setIsFormOpen(true);
    }

    const handleFormClose = (saved: boolean) => {
        setIsFormOpen(false);
        if (saved) {
            onSave();
        }
    }

    const confirmDelete = (shoeId: string) => {
        setShoeToDelete(shoeId);
    }

    const executeDelete = async () => {
        if (!shoeToDelete || !firestore) return;
        
        const docRef = doc(firestore, 'shoes', shoeToDelete);

        try {
            await deleteDoc(docRef);
            toast({ title: 'Product Deleted', description: 'The product has been removed from the store.' });
            onDelete(shoeToDelete);
        } catch (err: any) {
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: err.message || 'Could not delete the product.',
            });
        } finally {
            setShoeToDelete(null);
        }
    }

    return (
        <>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Product Management</CardTitle>
                                <CardDescription>Add, edit, or remove products from your store.</CardDescription>
                            </div>
                            <Button onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4"/> Add Product</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                        <TableCell><Skeleton className="h-16 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : shoes && shoes.length > 0 ? (
                                    shoes.map((shoe) => (
                                        <TableRow key={shoe.id}>
                                            <TableCell className="hidden sm:table-cell">
                                                <img
                                                    alt={shoe.name}
                                                    className="aspect-square rounded-md object-cover"
                                                    height="64"
                                                    src={shoe.images && shoe.images.length > 0 ? shoe.images[0].url : noImagePlaceholder?.imageUrl}
                                                    width="64"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{shoe.name}</TableCell>
                                            <TableCell>{shoe.brand}</TableCell>
                                            <TableCell className="hidden md:table-cell">KSH {shoe.price.toFixed(2)}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEdit(shoe)}>
                                                        <Edit className="mr-2 h-4 w-4"/>Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => confirmDelete(shoe.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4"/>Delete
                                                    </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">No products found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DialogContent className="sm:max-w-[800px] grid max-h-[90vh] grid-rows-[auto_minmax(0,1fr)]">
                    <DialogHeader>
                        <DialogTitle>{selectedShoe ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>
                            {selectedShoe ? 'Update the details for this product.' : 'Fill in the form to add a new product to your store.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto -mr-4 pr-4">
                        <ProductForm shoe={selectedShoe} onFormSubmit={handleFormClose} />
                    </div>
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={!!shoeToDelete} onOpenChange={(open) => !open && setShoeToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product
                        and remove its data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={executeDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

function UsersTab({initialUsers, loading, onAdminMade}: {initialUsers: AppUser[] | null, loading: boolean, onAdminMade: () => void}) {
  const { toast } = useToast();
  const functions = useFunctions();
  
  const handleMakeAdmin = async (userId: string) => {
    if (!functions) return;
    toast({ title: 'Processing...', description: 'Attempting to grant admin privileges.' });
    
    const setUserRole = httpsCallable(functions, 'setUserRole');
    try {
      await setUserRole({ userId, role: 'admin' });
      toast({
        title: "Success",
        description: `User ${userId} has been made an admin. They may need to log out and back in to see changes.`,
      });
      onAdminMade();
    } catch (error: any) {
      console.error("Error setting user role:", error);
       toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: error.message || 'You do not have permission to perform this action.',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user roles and permissions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                 <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))
            ) : initialUsers && initialUsers.length > 0 ? (
                initialUsers.map(user => (
                <TableRow key={user.id}>
                    <TableCell>{user.displayName || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleMakeAdmin(user.id)}>
                        Make Admin
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


// --- MAIN PAGE ---

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

  const [adminUsers, setAdminUsers] = useState<AppUser[] | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // --- DATA FETCHING ---
  const shoesQuery = useMemoFirebase(() => {
    if(!firestore) return null;
    return collection(firestore, 'shoes');
  }, [firestore, refreshKey]);

  const { data: shoes, isLoading: shoesLoading, error: shoesError } = useCollection<Shoe>(shoesQuery);
  
  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
        setUsersLoading(true);
        const result = await getAdminUsers();
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Failed to load users',
                description: result.error
            });
            setAdminUsers([]);
        } else {
            setAdminUsers(result.users);
        }
        setUsersLoading(false);
    }
    fetchUsers();
  }, [refreshKey, toast]);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
        setOrdersLoading(true);
        const result = await getAdminOrders();
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Failed to load orders',
                description: result.error
            });
            setOrders([]);
            setOrdersError(result.error);
        } else {
            setOrders(result.orders);
            setOrdersError(null);
        }
        setOrdersLoading(false);
    }
    fetchOrders();
  }, [refreshKey, toast]);

  const handleRefresh = () => {
    setRefreshKey(k => k + 1);
  }

  const handleProductDelete = (deletedShoeId: string) => {
    // Optimistically update the UI by removing the deleted shoe from the state
    setRefreshKey(k => k + 1);
  }


  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your store's sales, products, and customers.</p>
      </div>

       <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard"><Activity className="mr-2 h-4 w-4"/>Dashboard</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4"/>Orders</TabsTrigger>
          <TabsTrigger value="products"><Package className="mr-2 h-4 w-4"/>Products</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4"/>Users</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
            <DashboardTab orders={orders} users={adminUsers} shoes={shoes} />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab orders={orders} loading={ordersLoading} onUpdate={handleRefresh} error={ordersError} />
        </TabsContent>
        <TabsContent value="products">
          <ProductsTab shoes={shoes} loading={shoesLoading} error={shoesError as Error | null} onSave={handleRefresh} onDelete={handleProductDelete} />
        </TabsContent>
        <TabsContent value="users">
          <UsersTab initialUsers={adminUsers} loading={usersLoading} onAdminMade={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
