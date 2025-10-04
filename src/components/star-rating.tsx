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
  const emptyStars = totalStars - Math.ceil(rating);
  const partialStar = rating % 1 !== 0;

  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={size} className="text-primary" />
      ))}
      {partialStar && (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={size} className="text-gray-400" />
          <div style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: `${(rating % 1) * 100}%` }}>
            <Star size={size} fill="currentColor" className="text-primary" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-400" />
      ))}
    </div>
  );
}
