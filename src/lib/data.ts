import {
  PersonStanding,
  Footprints,
  Repeat,
  Trophy,
  Medal,
  Dumbbell,
  Zap,
  Star,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { PlaceHolderImages } from './placeholder-images';

export type Test = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const tests: Test[] = [
  {
    id: 'vertical-jump',
    name: 'Vertical Jump',
    description: 'Measure your explosive leg power.',
    icon: PersonStanding,
  },
  {
    id: 'shuttle-run',
    name: 'Shuttle Run',
    description: 'Test your agility and speed.',
    icon: Footprints,
  },
  {
    id: 'sit-ups',
    name: 'Sit-ups',
    description: 'Assess your abdominal strength.',
    icon: Repeat,
  },
  {
    id: 'endurance-run',
    name: 'Endurance Run',
    description: 'Evaluate your cardiovascular fitness.',
    icon: Wind,
  },
];

export type Benchmark = {
  [key: string]: {
    unit: string;
    levels: {
      beginner: number;
      intermediate: number;
      advanced: number;
      elite: number;
    };
  };
};

export const benchmarks: Benchmark = {
  'sit-ups': {
    unit: 'reps',
    levels: {
      beginner: 15,
      intermediate: 30,
      advanced: 45,
      elite: 60,
    },
  },
  'vertical-jump': {
    unit: 'cm',
    levels: {
      beginner: 20,
      intermediate: 40,
      advanced: 60,
      elite: 80,
    },
  },
  'shuttle-run': {
    unit: 's',
    levels: {
      elite: 9,
      advanced: 10,
      intermediate: 11,
      beginner: 12,
    },
  },
  'endurance-run': {
    unit: 'm',
    levels: {
      beginner: 1600,
      intermediate: 2400,
      advanced: 3200,
      elite: 5000,
    },
  },
};

export type BadgeData = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  image: string;
};

export const badges: BadgeData[] = [
  {
    id: 'jump-starter',
    name: 'Jump Starter',
    description: 'Completed your first vertical jump test.',
    icon: Star,
    image: PlaceHolderImages.find(img => img.id === 'badge-jump-1')?.imageUrl || '',
  },
  {
    id: 'endurance-rookie',
    name: 'Endurance Rookie',
    description: 'Completed your first endurance run.',
    icon: Star,
    image: PlaceHolderImages.find(img => img.id === 'badge-endurance-1')?.imageUrl || '',
  },
  {
    id: 'sit-up-pro',
    name: 'Sit-up Pro',
    description: 'Achieved 50 sit-ups in a single test.',
    icon: Medal,
    image: PlaceHolderImages.find(img => img.id === 'badge-situp-1')?.imageUrl || '',
  },
  {
    id: 'agility-master',
    name: 'Agility Master',
    description: 'Top score in the shuttle run.',
    icon: Trophy,
    image: PlaceHolderImages.find(img => img.id === 'badge-run-2')?.imageUrl || '',
  },
    {
    id: 'power-jumper',
    name: 'Power Jumper',
    description: 'Reached elite level in vertical jump.',
    icon: Zap,
    image: PlaceHolderImages.find(img => img.id === 'badge-jump-2')?.imageUrl || '',
  },
  {
    id: 'core-champion',
    name: 'Core Champion',
    description: 'Mastered the sit-up challenge.',
    icon: Dumbbell,
    image: PlaceHolderImages.find(img => img.id === 'badge-run-1')?.imageUrl || '',
  },
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  avatar: string;
};

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Ravi Kumar', score: 4850, avatar: 'https://picsum.photos/seed/L1/40/40' },
  { rank: 2, name: 'Priya Sharma', score: 4720, avatar: 'https://picsum.photos/seed/L2/40/40' },
  { rank: 3, name: 'Amit Singh', score: 4680, avatar: 'https://picsum.photos/seed/L3/40/40' },
  { rank: 4, name: 'Anjali Das', score: 4510, avatar: 'https://picsum.photos/seed/L4/40/40' },
  { rank: 5, name: 'You', score: 4490, avatar: 'https://picsum.photos/seed/You/40/40' },
];

export function getTestById(id: string | undefined): Test | undefined {
  if (!id) return undefined;
  return tests.find(test => test.id === id);
}
