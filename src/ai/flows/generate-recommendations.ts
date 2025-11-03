
'use server';
/**
 * @fileOverview An AI agent for generating personalized fitness and diet recommendations.
 * This file should only be used on the server.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define schemas and types in the same file, but do not export them directly
// when using 'use server'. Only the async function should be exported.
const GenerateRecommendationsInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  goal: z
    .enum(['lose_weight', 'bulk_up', 'get_fit'])
    .describe('The primary fitness goal of the user.'),
  activityLevel: z
    .enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active'])
    .describe("The user's current activity level."),
  medical: z
    .string()
    .optional()
    .describe('A list of any medical conditions, deficiencies, or allergies the user has.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "A full body photo of the user, as a data URI. This is optional but helps in providing a more accurate assessment. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  workoutPlan: z.string().describe("A detailed, easy-to-read workout plan in Markdown format. It should specify frequency (days per week), types of exercises (cardio, strength, flexibility), and specific examples of exercises for each category. Explain why this plan is suitable for the user's goal."),
  dietPlan: z.string().describe("A detailed, easy-to-read diet and nutrition plan in Markdown format. It should provide general guidelines, macronutrient balance suggestions, and sample meal ideas for breakfast, lunch, and dinner. CRUCIALLY, it must explicitly mention and accommodate the user's stated medical conditions, allergies, or deficiencies. If none are provided, state that the plan is a general recommendation and they should consult a doctor."),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: { schema: GenerateRecommendationsInputSchema },
  output: { schema: GenerateRecommendationsOutputSchema },
  prompt: `You are an expert fitness coach and registered dietitian. Your task is to create a personalized workout and diet plan based on the user's information. Be encouraging, clear, and professional. The output MUST be in user-friendly and easy-to-read Markdown format.

User's Information:
- Age: {{age}}
- Weight: {{weight}} kg
- Height: {{height}} cm
- Primary Goal: {{goal}}
- Activity Level: {{activityLevel}}
{{#if medical}}- Medical Conditions/Allergies: {{{medical}}}{{#if}}
{{#if photoDataUri}}- Photo: {{media url=photoDataUri}}{{#if}}

Based on this information, provide a comprehensive and actionable plan.

## Workout Plan

Generate a detailed workout plan. It should be easy to follow.
- Start with a summary of the approach (e.g., "This is a 4-day/week plan focusing on...").
- Use Markdown headings (like '### Week 1-4: Foundation') and bullet points.
- Structure the workout by days (e.g., '#### Day 1: Full Body Strength', '#### Day 2: Cardio & Core').
- For each day, list the exercises as a bulleted list (e.g., '- Squats: 3 sets x 10-12 reps').
- Include a 'Rest and Recovery' section.

## Diet & Nutrition Plan

Generate a detailed diet and nutrition plan.
- Start with a summary of the dietary strategy.
- Use Markdown headings for different sections (e.g., '### Daily Caloric Goal', '### Macronutrient Split').
- Provide sample meal ideas using a bulleted list for Breakfast, Lunch, and Dinner.
- **IMPORTANT**: You MUST strictly adhere to any medical conditions, deficiencies, or allergies mentioned. If the user mentions an allergy (e.g., peanuts), do not include that ingredient in your suggestions. If no medical information is given, create a general healthy plan and explicitly state that they should consult with a healthcare professional before starting any new diet.

Format your entire response as a single JSON object that conforms to the output schema.
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


// This is the only export from this 'use server' file.
export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

  