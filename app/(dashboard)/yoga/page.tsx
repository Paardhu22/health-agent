'use client';

import { YogaView } from '@/components/features/exercise/YogaView';
import { HistoryView } from '@/components/features/exercise/HistoryView';
import { YogaHeader } from '@/components/features/yoga/YogaHeader';

import { useSearchParams } from 'next/navigation';

export default function YogaPage() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');
    const isHistory = tab === 'history';

    return (
        <div className="max-w-4xl mx-auto pb-20 pt-6 animate-fadeIn">
            {/* Yoga Header */}
            <YogaHeader />

            {/* Content */}
            <div className="min-h-[400px]">
                {isHistory ? (
                    <HistoryView filterType="YOGA" />
                ) : (
                    <YogaView />
                )}
            </div>
        </div>
    );
}
