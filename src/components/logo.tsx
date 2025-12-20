import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
      <PawPrint className="h-7 w-7 text-primary" />
      SoleMate
    </Link>
  );
}
