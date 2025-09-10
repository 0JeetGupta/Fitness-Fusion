'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { analyzeAthleteForm, AnalyzeAthleteFormOutput } from '@/ai/flows/analyze-athlete-form';
import { segmentExerciseVideo, SegmentExerciseVideoOutput } from '@/ai/flows/segment-exercise-videos';
import type { Test } from '@/lib/data';
import { Loader2, Upload, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisResults } from './analysis-results';
import { BenchmarkDisplay } from './benchmark-display';

export function TestAnalysisClient({ test }: { test: Test }) {
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formAnalysis, setFormAnalysis] = useState<AnalyzeAthleteFormOutput | null>(null);
  const [segmentation, setSegmentation] = useState<SegmentExerciseVideoOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setVideoPreview(previewUrl);
      setFormAnalysis(null);
      setSegmentation(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({ title: 'Error', description: 'Please select a video file first.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setFormAnalysis(null);
    setSegmentation(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;

        try {
          const [formAnalysisResult, segmentationResult] = await Promise.all([
            analyzeAthleteForm({ videoDataUri: dataUri, exerciseType: test.name }),
            segmentExerciseVideo({ videoDataUri: dataUri, exerciseType: test.name }),
          ]);

          setFormAnalysis(formAnalysisResult);
          setSegmentation(segmentationResult);
          toast({ title: 'Analysis Complete', description: 'Your performance has been analyzed.' });
        } catch (error) {
          console.error('AI analysis failed:', error);
          toast({ title: 'Analysis Failed', description: 'Could not analyze the video. Please try again.', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast({ title: 'Error', description: 'Failed to read the video file.', variant: 'destructive' });
      };
    } catch (error) {
      setIsLoading(false);
      console.error('File processing error:', error);
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    }
  };

  const handleSubmission = () => {
    toast({
      title: 'Data Submitted',
      description: 'Your verified performance data has been sent to SAI for evaluation.',
    });
  };

  const reps = segmentation?.segments?.length || 0;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline">Upload Performance</CardTitle>
          <CardDescription>Select a video of you performing the test.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <Video className="mx-auto h-12 w-12" />
                <p>Your video preview will appear here.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="video-upload" className="w-full">
              <Button asChild className="w-full cursor-pointer">
                <span><Upload className="mr-2 h-4 w-4" /> Choose Video</span>
              </Button>
            </label>
            {file && <p className="text-sm text-muted-foreground text-center">Selected: {file.name}</p>}
          </div>

          <Button onClick={handleAnalyze} disabled={isLoading || !file} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Analyzing...' : 'Analyze Performance'}
          </Button>
        </CardContent>
      </Card>
      
      {(formAnalysis || segmentation) && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Analysis & Feedback</CardTitle>
            <CardDescription>Here's the breakdown of your performance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {reps > 0 && <BenchmarkDisplay test={test} userScore={reps} />}
            <AnalysisResults formAnalysis={formAnalysis} segmentation={segmentation} />
            <Button onClick={handleSubmission} className="w-full" size="lg">
              Securely Submit to SAI
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
