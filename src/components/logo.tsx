import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold font-headline text-primary tracking-tight">
      <PawPrint className="h-7 w-7" />
      SoleMate
    </Link>
  );
}
