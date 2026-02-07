'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileAlertProps {
    isComplete: boolean;
    completionStep?: number;
}

export function ProfileAlert({ isComplete, completionStep = 0 }: ProfileAlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (isComplete || !isVisible) return null;

    return (
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-3 relative animate-fadeIn">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-full shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-amber-800">
                            Your profile is incomplete
                        </h3>
                        <p className="text-sm text-amber-600">
                            Complete your health profile to get personalized AI recommendations.
                        </p>
                    </div>
                </div>

                <Link
                    href="/profile"
                    className="whitespace-nowrap inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm"
                >
                    Complete Profile
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
