
'use server';

import { generateRecommendations, type GenerateRecommendationsInput } from '@/ai/flows/generate-recommendations';

// This function is the ONLY thing the client will interact with.
// It's a secure boundary between the client and server.
export async function getAiRecommendations(input: GenerateRecommendationsInput) {
  // The AI flow is called securely on the server.
  // The client never sees the implementation details.
  return await generateRecommendations(input);
}
