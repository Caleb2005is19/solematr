'use server';

import { getStyleRecommendation } from '@/ai/flows/style-recommendation';
import { getShoes } from '@/lib/data';
import type { Shoe } from '@/lib/types';

export async function fetchStyleRecommendation(
  preferences: string,
  historyIds: string[]
): Promise<{ style: string; reasoning: string } | { error: string }> {
  try {
    const allShoes = await getShoes();
    const historyShoes = historyIds
      .map(id => allShoes.find(shoe => shoe.id === id))
      .filter((shoe): shoe is Shoe => shoe !== undefined);

    if (historyShoes.length === 0 && !preferences) {
        return { error: "Please provide some preferences or browse some shoes first to get a recommendation." };
    }

    const browsingHistory = historyShoes.length > 0 
        ? `The user has viewed the following shoes: ${historyShoes.map(s => `${s.name} (${s.brand}, ${s.style})`).join(', ')}.`
        : 'The user has not viewed any shoes yet.';

    const userPreferences = preferences || 'User has not specified any preferences.';
    
    const result = await getStyleRecommendation({
      userPreferences,
      browsingHistory,
    });

    return {
      style: result.styleRecommendation,
      reasoning: result.reasoning,
    };
  } catch (error) {
    console.error('Error fetching style recommendation:', error);
    return { error: 'Failed to get style recommendation. Please try again later.' };
  }
}
