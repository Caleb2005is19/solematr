import Link from 'next/link';
import { PawPrint } from 'lucide-react';
import React from 'react';

type LogoProps = {
  onClick?: () => void;
};

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  const content = (
    <>
      <PawPrint className="h-7 w-7 text-primary" />
      SoleMate
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
      >
        {content}
      </button>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
      {content}
    </Link>
  );
};

export default Logo;
