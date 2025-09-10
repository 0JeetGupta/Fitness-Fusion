'use server';

/**
 * @fileOverview An AI agent that analyzes athlete form in a video and provides feedback.
 *
 * - analyzeAthleteForm - A function that handles the athlete form analysis process.
 * - AnalyzeAthleteFormInput - The input type for the analyzeAthleteForm function.
 * - AnalyzeAthleteFormOutput - The return type for the analyzeAthleteForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAthleteFormInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of an athlete performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exerciseType: z.string().describe('The type of exercise being performed.'),
});
export type AnalyzeAthleteFormInput = z.infer<typeof AnalyzeAthleteFormInputSchema>;

const AnalyzeAthleteFormOutputSchema = z.object({
  analysis: z.string().describe('The AI analysis of the athlete form, including measurements and observations.'),
});
export type AnalyzeAthleteFormOutput = z.infer<typeof AnalyzeAthleteFormOutputSchema>;

export async function analyzeAthleteForm(input: AnalyzeAthleteFormInput): Promise<AnalyzeAthleteFormOutput> {
  return analyzeAthleteFormFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAthleteFormPrompt',
  input: {schema: AnalyzeAthleteFormInputSchema},
  output: {schema: AnalyzeAthleteFormOutputSchema},
  prompt: `You are an expert sports coach analyzing athlete form during exercise.

You will analyze the provided video of the athlete performing the specified exercise and provide feedback on their technique.
Focus on relevant measurements and observations, and include them in your analysis.

Exercise Type: {{{exerciseType}}}
Video: {{media url=videoDataUri}}

Analysis: `,
});

const analyzeAthleteFormFlow = ai.defineFlow(
  {
    name: 'analyzeAthleteFormFlow',
    inputSchema: AnalyzeAthleteFormInputSchema,
    outputSchema: AnalyzeAthleteFormOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
