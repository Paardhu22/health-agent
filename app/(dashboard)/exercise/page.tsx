'use client';

import { WorkoutView } from '@/components/features/exercise/WorkoutView';
import { YogaView } from '@/components/features/exercise/YogaView';
import { HistoryView } from '@/components/features/exercise/HistoryView';

import { useSearchParams } from 'next/navigation';

export default function ExercisePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const isYoga = tab === 'yoga';
  const isHistory = tab === 'history';

  let title = 'Fitness & Movement';
  let subtitle = 'Personalized workout plans to reach your fitness goals';

  if (isYoga) {
    title = 'Yoga & Mindfulness';
    subtitle = 'Personalized yoga sequences for your mind and body';
  } else if (isHistory) {
    title = 'Activity History';
    subtitle = 'Track your completed workouts and yoga sessions';
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6 no-print">
        <h1 className="text-2xl font-bold text-health-text">
          {title}
        </h1>
        <p className="text-health-muted">
          {subtitle}
        </p>
      </div>

      {/* Content */}
      <div className="animate-fadeIn">
        {isHistory ? (
          <HistoryView />
        ) : isYoga ? (
          <YogaView />
        ) : (
          <WorkoutView />
        )}
      </div>
    </div>
  );
}
