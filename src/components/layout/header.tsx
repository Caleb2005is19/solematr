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
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
                 <Link href="/sale" passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-bold text-red-500")}>
                    Sale
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
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
                  <SheetTitle className="mb-4"><Logo onClick={() => setIsMobileMenuOpen(false)} /></SheetTitle>
                  <SheetDescription className="sr-only">Main menu</SheetDescription>
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
