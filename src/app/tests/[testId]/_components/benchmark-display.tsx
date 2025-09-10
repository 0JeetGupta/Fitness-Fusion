'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { benchmarks, Test } from '@/lib/data';

interface BenchmarkDisplayProps {
  test: Test;
  userScore: number;
}

export function BenchmarkDisplay({ test, userScore }: BenchmarkDisplayProps) {
  const benchmark = benchmarks[test.id];
  if (!benchmark) return null;

  const { unit, levels } = benchmark;
  const maxLevel = Math.max(...Object.values(levels));
  const progress = (userScore / maxLevel) * 100;
  
  let performanceTier = 'Beginner';
  if (userScore >= levels.elite) {
    performanceTier = 'Elite';
  } else if (userScore >= levels.advanced) {
    performanceTier = 'Advanced';
  } else if (userScore >= levels.intermediate) {
    performanceTier = 'Intermediate';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-headline">Performance Benchmark</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-4xl font-bold text-primary">{userScore}</p>
          <p className="text-muted-foreground">{unit}</p>
        </div>
        <Progress value={progress} className="w-full mb-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{maxLevel}</span>
        </div>
        <p className="mt-4 text-center">
          Your performance is at an <span className="font-bold text-primary">{performanceTier}</span> level.
        </p>
      </CardContent>
    </Card>
  );
}
