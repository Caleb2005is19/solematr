import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BrowsingHistoryProvider } from '@/context/browsing-history-context';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: {
    default: 'SoleMate - The Sole of Kenya.',
    template: '%s | SoleMate',
  },
  description: 'Step into Greatness. The best collection of sneakers, shoes, and boots in Kenya. Quality footwear for every style.',
  keywords: ['sneakers Kenya', 'shoe store Nairobi', 'buy shoes online Kenya', 'mens shoes Kenya', 'womens shoes Kenya'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased", fontBody.variable)}>
        <BrowsingHistoryProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </CartProvider>
        </BrowsingHistoryProvider>
      </body>
    </html>
  );
}
