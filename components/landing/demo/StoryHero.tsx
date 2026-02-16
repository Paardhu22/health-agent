'use client';

import { motion } from 'framer-motion';
import { GradientButton } from '@/components/ui/gradient-button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export function StoryHero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8 max-w-4xl"
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500">
                        Your Health,<br />
                        Unified.
                    </h1>

                    <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Stop juggling apps. Meet the first AI Agent that connects your diet, workouts, and medical data into one cohesive intelligence.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <GradientButton asChild className="h-12 px-8 text-base">
                            <Link href="#demo">
                                See How It Works
                            </Link>
                        </GradientButton>
                        <Link href="/login" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium px-4 py-2">
                            Login
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Dashboard Visual - The "Floating Slab" Effect */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 20, y: 100 }}
                animate={{ opacity: 1, scale: 1, rotateX: 10, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="relative z-10 mt-16 w-full max-w-6xl perspective-1000"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.15)] border border-white/10 bg-black/50 backdrop-blur-sm transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out"
                    style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg)' }}
                >
                    {/* 
                 SEARCH-THEMED PLACEHOLDER IMAGE
                 In a real implementation, this would be a high-res screenshot of the actual dashboard.
                 For now, we'll create a stylized "Dashboard UI" representation using code or a placeholder image if available.
             */}
                    <div className="aspect-[16/9] bg-neutral-900 flex relative overflow-hidden">
                        {/* Sidebar Mock */}
                        <div className="w-16 border-r border-white/5 flex flex-col items-center py-4 gap-4 bg-black/20">
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 text-xs font-bold">H</div>
                            <div className="w-8 h-8 rounded-md bg-white/5"></div>
                            <div className="w-8 h-8 rounded-md bg-white/5"></div>
                            <div className="w-8 h-8 rounded-md bg-white/5"></div>
                        </div>

                        {/* Main Content Mock */}
                        <div className="flex-1 p-6 flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                                    <div className="h-3 w-24 bg-white/5 rounded"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/5"></div>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500"></div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center text-green-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <span className="text-xs text-green-400 font-mono">+12%</span>
                                    </div>
                                    <div className="h-3 w-16 bg-white/10 rounded mb-1"></div>
                                    <div className="h-6 w-20 bg-white/20 rounded"></div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <span className="text-xs text-blue-400 font-mono">Synced</span>
                                    </div>
                                    <div className="h-3 w-16 bg-white/10 rounded mb-1"></div>
                                    <div className="h-6 w-12 bg-white/20 rounded"></div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-500">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                                        </div>
                                    </div>
                                    <div className="h-3 w-16 bg-white/10 rounded mb-1"></div>
                                    <div className="h-6 w-24 bg-white/20 rounded"></div>
                                </div>
                            </div>

                            {/* Big Chart Area */}
                            <div className="flex-1 bg-white/5 rounded-lg border border-white/5 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent"></div>
                                <div className="flex items-end justify-between h-full gap-2 pt-4 px-2">
                                    {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary-500/20 rounded-t-sm relative group">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-primary-500/60 rounded-t-sm transition-all duration-300 group-hover:bg-primary-500"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Notification */}
                        <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <div className="text-xs text-white font-medium">Goal Reached</div>
                                <div className="text-[10px] text-neutral-400">Daily calorie target met</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glow under the dashboard */}
                <div className="absolute -inset-4 bg-primary-500/20 blur-[100px] -z-10 rounded-full opacity-50"></div>
            </motion.div>
        </section>
    );
}
