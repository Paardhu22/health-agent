'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
    { id: 'practice', label: 'Practice', href: '/yoga' },
    { id: 'history', label: 'History', href: '/yoga?tab=history' },
];

export function YogaHeader() {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'practice';

    return (
        <div className="space-y-6 mb-8">
            <div>
                <h1 className="text-3xl font-light text-health-text">
                    Yoga & Mindfulness
                </h1>
                <p className="text-zinc-500 mt-1">
                    Restore balance with personalized yoga flows.
                </p>
            </div>

            {/* Minimalist Tabs */}
            <div className="flex items-center gap-6 border-b border-zinc-100 dark:border-zinc-800 pb-1">
                {TABS.map((tab) => {
                    const isActive = tab.id === 'practice'
                        ? !searchParams.get('tab')
                        : searchParams.get('tab') === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href}
                            className={cn(
                                "text-sm font-medium pb-4 transition-colors relative",
                                isActive
                                    ? "text-primary-600 dark:text-primary-400"
                                    : "text-zinc-400 hover:text-health-text"
                            )}
                        >
                            {tab.label}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
