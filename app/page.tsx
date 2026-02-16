'use client';

import { StoryHero } from '@/components/landing/demo/StoryHero';
import { NarrativeFeatures } from '@/components/landing/demo/NarrativeFeatures';
import { OldHeroCTA } from '@/components/landing/demo/OldHeroCTA';
import { SuccessStory } from '@/components/landing/SuccessStory';
import { FreeDietPlanGenerator } from '@/components/landing/FreeDietPlanGenerator';
import { GradientButton } from '@/components/ui/gradient-button';
import { Typewriter } from '@/components/ui/typewriter';
import { Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary-500/30">

      {/* Navigation (Reused from Main Page) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white leading-tight">Health</span>
              <div className="text-sm font-medium text-primary-500">
                <Typewriter
                  text={["Agent", "Partner", "Advisor"]}
                  speed={70}
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar={"_"}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <GradientButton asChild variant="variant" className="min-w-[100px] px-4 py-2 h-10 text-sm">
                <Link href="/login">
                  Sign In
                </Link>
              </GradientButton>
              <GradientButton asChild className="min-w-[120px] px-6 py-2 h-10 text-sm">
                <Link href="/register">
                  Get Started
                </Link>
              </GradientButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Subtle Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <main className="relative z-10">
        {/* 1. New Story Hero (Dashboard Tilt) */}
        <StoryHero />

        {/* 2. Expanded Narrative (Scroll Story) */}
        <NarrativeFeatures />

        {/* 3. Reused Success Story */}
        <section className="relative">
          <SuccessStory />
        </section>

        {/* 4. "Try It Now" - Old Hero Design */}
        <OldHeroCTA />

        {/* 5. Diet Generator & Final Footer Area */}
        <section className="py-20 px-4 relative bg-gradient-to-t from-black via-black to-transparent">
          <div className="max-w-5xl mx-auto space-y-16">
            {/* Calculator */}
            <FreeDietPlanGenerator />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10 bg-black relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-600" />
              <span className="font-semibold text-white">Health Agent</span>
            </div>
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Health Agent. All rights reserved.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
