'use client';

import Link from 'next/link';
import { User, Target, AlertCircle } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface ProfileSidebarProps {
    user: any; // Ideally user generic type
    healthProfile: any;
}

export function ProfileSidebar({ user, healthProfile }: ProfileSidebarProps) {
    if (!healthProfile) {
        return (
            <div className="sticky top-24 bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 text-center">
                <User className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="font-medium text-health-text mb-2">Complete Profile</h3>
                <p className="text-sm text-zinc-500 mb-6">
                    Set up your health profile to get AI recommendations.
                </p>
                <GradientButton asChild className="w-full">
                    <Link href="/profile/setup">Start Setup</Link>
                </GradientButton>
            </div>
        );
    }

    return (
        <div className="sticky top-24 bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-semibold text-health-text">{user.name}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">Patient</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <StatItem label="Age" value={`${healthProfile.age || '-'}`} />
                <StatItem label="Weight" value={`${healthProfile.weight || '-'} kg`} />
                <StatItem label="Height" value={`${healthProfile.height || '-'} cm`} />
                <StatItem label="BMI" value={calculateBMI(healthProfile.weight, healthProfile.height)} />
            </div>

            {/* Goal */}
            <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary-500" />
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Current Goal</span>
                </div>
                <p className="font-medium text-health-text">
                    {healthProfile.primaryGoal ? formatGoal(healthProfile.primaryGoal) : 'Not set'}
                </p>
            </div>

            {/* Conditions */}
            {healthProfile.existingConditions && healthProfile.existingConditions.length > 0 && (
                <div className="pt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Conditions</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {healthProfile.existingConditions.map((c: string) => (
                            <span key={c} className="px-2 py-1 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-md text-xs text-zinc-600 dark:text-zinc-400">
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="pt-4">
                <Link href="/profile" className="block w-full text-center py-2 text-sm text-zinc-500 hover:text-primary-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    Edit Profile Details
                </Link>
            </div>

        </div>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white dark:bg-black p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 mb-1">{label}</p>
            <p className="font-semibold text-health-text">{value}</p>
        </div>
    )
}

function calculateBMI(weight?: number, height?: number) {
    if (!weight || !height) return '-';
    // BMI = kg/m^2
    const m = height / 100;
    return (weight / (m * m)).toFixed(1);
}

function formatGoal(goal: string) {
    return goal.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
}
