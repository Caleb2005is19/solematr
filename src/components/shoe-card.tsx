import Link from 'next/link';
import Image from 'next/image';
import type { Shoe } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ShoeCardProps {
  shoe: Shoe;
}

export default function ShoeCard({ shoe }: ShoeCardProps) {
  return (
    <Link href={`/product/${shoe.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardHeader className="p-0">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={shoe.images[0].url}
              alt={shoe.images[0].alt}
              data-ai-hint={shoe.images[0].hint}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              loading="lazy"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{shoe.brand}</p>
          <h3 className="font-semibold text-lg truncate group-hover:text-primary">{shoe.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="font-bold text-lg text-foreground">KSH {shoe.price.toFixed(2)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
