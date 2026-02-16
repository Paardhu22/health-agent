'use client';

import { WorkoutView } from '@/components/features/exercise/WorkoutView';
import { HistoryView } from '@/components/features/exercise/HistoryView';
import { ExerciseHeader } from '@/components/features/exercise/ExerciseHeader';

import { useSearchParams } from 'next/navigation';

export default function ExercisePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const isHistory = tab === 'history';

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 animate-fadeIn">
      {/* Exercise Header */}
      <ExerciseHeader />

      {/* Content */}
      <div className="min-h-[400px]">
        {isHistory ? (
          <HistoryView filterType="EXERCISE" />
        ) : (
          <WorkoutView />
        )}
      </div>
    </div>
  );
}
