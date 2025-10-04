import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, totalStars = 5, size = 20, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const partialStarWidth = (rating % 1) * 100;
  const hasPartialStar = partialStarWidth > 0;
  const emptyStars = totalStars - fullStars - (hasPartialStar ? 1 : 0);

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={size} className="text-primary" />
      ))}
      {hasPartialStar && (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
          <Star size={size} className="text-muted-foreground/50" fill="currentColor"/>
          <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: `${partialStarWidth}%` }}>
            <Star size={size} fill="currentColor" className="text-primary" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-muted-foreground/50" />
      ))}
    </div>
  );
}
