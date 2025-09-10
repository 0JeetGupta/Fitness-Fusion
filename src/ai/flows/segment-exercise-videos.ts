'use server';

/**
 * @fileOverview Automatically detects and segments exercise videos into individual repetitions or actions.
 *
 * - segmentExerciseVideo - A function that handles the exercise video segmentation process.
 * - SegmentExerciseVideoInput - The input type for the segmentExerciseVideo function.
 * - SegmentExerciseVideoOutput - The return type for the segmentExerciseVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SegmentExerciseVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of an athlete performing an exercise, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  exerciseType: z.string().describe('The type of exercise being performed.'),
});
export type SegmentExerciseVideoInput = z.infer<typeof SegmentExerciseVideoInputSchema>;

const SegmentExerciseVideoOutputSchema = z.object({
  segments: z.array(
    z.object({
      startTime: z.number().describe('The start time of the segment in seconds.'),
      endTime: z.number().describe('The end time of the segment in seconds.'),
      action: z.string().describe('The action performed in the segment.'),
    })
  ).describe('An array of segments, each representing a repetition or action.'),
  analysis: z.string().describe('The overall analysis of the video and segments.'),
});
export type SegmentExerciseVideoOutput = z.infer<typeof SegmentExerciseVideoOutputSchema>;

export async function segmentExerciseVideo(input: SegmentExerciseVideoInput): Promise<SegmentExerciseVideoOutput> {
  return segmentExerciseVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'segmentExerciseVideoPrompt',
  input: {schema: SegmentExerciseVideoInputSchema},
  output: {schema: SegmentExerciseVideoOutputSchema},
  prompt: `You are an AI assistant that analyzes exercise videos and segments them into individual repetitions or actions.

You will receive a video of an athlete performing an exercise and the type of exercise being performed. You will then analyze the video and identify the start and end times of each repetition or action.

Output the segments as an array of JSON objects, where each object contains the start time, end time, and action performed in the segment.

Also provide an overall analysis of the video and segments.

Exercise Type: {{{exerciseType}}}
Video: {{media url=videoDataUri}}

Example Output:
{
  "segments": [
    {
      "startTime": 0,
      "endTime": 5,
      "action": "Squat"
    },
    {
      "startTime": 5,
      "endTime": 10,
      "action": "Squat"
    }
  ],
  "analysis": "The video shows the athlete performing squats. The athlete performed 2 squats in the video."
}
`,
});

const segmentExerciseVideoFlow = ai.defineFlow(
  {
    name: 'segmentExerciseVideoFlow',
    inputSchema: SegmentExerciseVideoInputSchema,
    outputSchema: SegmentExerciseVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
