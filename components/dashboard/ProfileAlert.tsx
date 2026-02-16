'use client';

import Link from 'next/link';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileAlertProps {
    isComplete: boolean;
    completionStep?: number;
}

export function ProfileAlert({ isComplete, completionStep = 0 }: ProfileAlertProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isComplete) {
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    return (
        <AnimatePresence>
            {!isComplete && isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="fixed top-6 left-8 z-[90] max-w-sm w-full"
                >
                    <div className="bg-zinc-950/80 backdrop-blur-3xl border border-amber-500/20 rounded-[2rem] p-5 shadow-2xl shadow-amber-900/10 flex items-start gap-4 relative overflow-hidden group">
                        {/* Glow Effect - added pointer-events-none to prevent blocking clicks */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-colors duration-500 pointer-events-none" />

                        <div className="p-3 bg-amber-500/10 rounded-2xl shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>

                        <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-sm font-bold text-amber-200 uppercase tracking-widest">
                                    Profile Incomplete
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-all active:scale-90"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-amber-500/80 font-medium leading-relaxed mb-4">
                                Complete your health profile to get personalized AI recommendations.
                            </p>

                            <Link
                                href="/profile"
                                className="group/btn relative inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-amber-900/40"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Complete Now
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
