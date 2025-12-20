import Logo from '../logo';
import Link from 'next/link';

const footerLinks = {
  shop: [
    { title: 'Sneakers', href: '/sneakers' },
    { title: 'Shoes', href: '/shoes' },
    { title: 'Sale', href: '/sale' },
  ],
  about: [
    { title: 'Our Story', href: '#' },
    { title: 'Contact Us', href: '#' },
    { title: 'FAQs', href: '#' },
  ],
  legal: [
    { title: 'Terms of Service', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Return Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">The Sole of Kenya. Step into Greatness with the finest footwear collection.</p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Shop</h3>
              <ul className="space-y-2">
                {footerLinks.shop.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground mb-4">About Us</h3>
              <ul className="space-y-2">
                {footerLinks.about.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map(link => (
                  <li key={link.title}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SoleMate. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
