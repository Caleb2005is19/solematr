'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { fetchStyleRecommendation } from '@/app/actions';
import { useBrowsingHistory } from '@/hooks/use-browsing-history';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function StyleRecommender() {
  const [preferences, setPreferences] = useState('');
  const [recommendation, setRecommendation] = useState<{ style: string; reasoning: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { history } = useBrowsingHistory();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleGetRecommendation = async () => {
    startTransition(async () => {
      setRecommendation(null);
      const result = await fetchStyleRecommendation(preferences, history);
      
      if ('error' in result) {
        toast({
            variant: "destructive",
            title: "Recommendation Error",
            description: result.error,
        });
      } else {
        setRecommendation(result);
        toast({
            title: "Style Recommended!",
            description: "We've found a style we think you'll love.",
        });
      }
    });
  };

  const applyStyleFilter = () => {
    if (!recommendation) return;

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('style', recommendation.style);
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="text-primary" />
          AI Style Finder
        </CardTitle>
        <CardDescription>
          Tell us what you like and we'll suggest a shoe style for you. Your browsing history is also used.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="e.g., I like minimalist sneakers, something comfortable for walking, and I prefer neutral colors like black or grey."
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            rows={4}
            disabled={isPending}
          />
          {recommendation && (
             <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Our Recommendation: {recommendation.style}</AlertTitle>
                <AlertDescription>
                  {recommendation.reasoning}
                </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleGetRecommendation} disabled={isPending} className="w-full sm:w-auto flex-grow">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Suggestion
        </Button>
        {recommendation && (
            <Button onClick={applyStyleFilter} variant="secondary" className="w-full sm:w-auto flex-grow">
                Show me '{recommendation.style}' shoes
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
