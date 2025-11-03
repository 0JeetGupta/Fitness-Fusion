'use server';

import { generateRecommendations } from '@/ai/flows/generate-recommendations';
import type { GenerateRecommendationsInput } from '@/ai/flows/recommendations.d';

export async function getAiRecommendations(
  input: GenerateRecommendationsInput
) {
  // The AI flow is called securely on the server.
  return await generateRecommendations(input);
}
