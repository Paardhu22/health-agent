'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { GradientButton } from '@/components/ui/gradient-button';

export function OldHeroCTA() {
    return (
        <section className="w-full bg-black/[0.96] relative overflow-hidden min-h-screen flex items-center">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                {/* Left content */}
                <div className="flex-1 p-8 md:p-16 relative z-10 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">
                        Try your new personal health assistant
                    </h2>
                    <div className="flex flex-col items-center md:items-start gap-8">
                        <p className="text-xl text-neutral-300 max-w-2xl">
                            Get personalized diet plans, exercise routines, yoga recommendations, and health guidance tailored to your unique profile. Powered by advanced AI.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <GradientButton asChild className="z-20 text-lg h-14 min-w-[200px] cursor-pointer">
                                <Link href="/register">
                                    Get Started Now
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Link>
                            </GradientButton>
                        </div>
                    </div>
                </div>

                {/* Right content - Spline Scene */}
                <div className="flex-1 relative h-[50vh] md:h-auto w-full min-h-[500px]">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </div>
        </section>
    );
}
