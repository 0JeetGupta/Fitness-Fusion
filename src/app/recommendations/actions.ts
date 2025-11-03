'use server';

import {
  generateRecommendations,
} from '@/ai/flows/generate-recommendations';
import type { GenerateRecommendationsInput } from '@/ai/flows/recommendations.d';

export async function getAiRecommendations(
  input: GenerateRecommendationsInput
) {
  return await generateRecommendations(input);
}
