'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import CartIcon from '@/components/cart-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Menu, User, LogIn, LogOut, Shield } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';


const sneakerCategories = [
    { title: "All Sneakers", href:"/sneakers", description: "Explore our entire sneaker collection."},
    { title: "Streetwear", href:"/sneakers/streetwear", description: "Style for the streets." },
    { title: "Running", href:"/sneakers/running", description: "Performance and comfort." },
    { title: "Basketball", href:"/sneakers/basketball", description: "Dominate the court." },
]

const shoeCategories = [
    { title: "All Shoes", href:"/shoes", description: "Discover our full range of shoes."},
    { title: "Formal", href:"/shoes/formal", description: "Elegance for any occasion." },
    { title: "Boots", href:"/shoes/boots", description: "Rugged and ready." },
    { title: "Casual", href:"/shoes/casual", description: "Everyday comfort and style." },
]

function UserAuthButton() {
    const { user } = useAuth();
    const auth = getAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            user.getIdTokenResult().then(idTokenResult => {
                const isAdminClaim = !!idTokenResult.claims.admin;
                setIsAdmin(isAdminClaim);
            });
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };
    
    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin/orders"><Shield className="mr-2 h-4 w-4" />Admin Panel</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Button onClick={handleGoogleSignIn}>
            <LogIn className="mr-2 h-4 w-4"/>
            Login
        </Button>
    )
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Sneakers</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {sneakerCategories.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Shoes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {shoeCategories.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
               <NavigationMenuItem>
                <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "font-bold text-red-500")}>
                  <Link href="/sale">
                    Sale
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex">
                <UserAuthButton />
            </div>
            <CartIcon />
            {/* Mobile Navigation */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle><Logo onClick={() => setIsMobileMenuOpen(false)} /></SheetTitle>
                  <SheetDescription>Main menu for SoleMate</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                    <nav className="flex flex-col gap-4">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="sneakers">
                                <AccordionTrigger className="text-lg font-semibold">Sneakers</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4">
                                        {sneakerCategories.map(item => (
                                            <SheetClose asChild key={item.title}>
                                                <Link href={item.href} className="hover:text-primary">{item.title}</Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="shoes">
                                <AccordionTrigger className="text-lg font-semibold">Shoes</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-4 pl-4">
                                        {shoeCategories.map(item => (
                                            <SheetClose asChild key={item.title}>
                                                <Link href={item.href} className="hover:text-primary">{item.title}</Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <SheetClose asChild>
                            <Link href="/sale" className="text-lg font-semibold text-red-500 hover:underline">Sale</Link>
                        </SheetClose>
                    </nav>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <UserAuthButton />
                </div>
              </SheetContent>
            </Sheet>
        </div>

      </div>
    </header>
  );
}


const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & { title: string; href: string; }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
