'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { Quote } from 'lucide-react';

export function SuccessStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const stories = [
        {
            title: "THE STRUGGLE",
            image: "https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?q=80&w=1200&auto=format&fit=crop", // Stressed/Tired
            description: "Feeling constantly tired and unsure what to eat.",
            quote: "I knew I needed a change, but I didn't know where to start.",
        },
        {
            title: "THE SOLUTION",
            image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop", // Workout/During
            description: "Personalized diet plans and daily workouts.",
            quote: "The AI suggestions were surprisingly accurate!",
        },
        {
            title: "THE RESULT",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop", // Happy/Fit
            description: "More energy, better sleep, and fitness goals reached.",
            quote: "I feel like a completely new person.",
        },
        {
            title: "MAINTENANCE",
            image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop", // Healthy Food (Safe URL)
            description: "Learning to cook healthy meals that taste amazing.",
            quote: "It's not a diet anymore, it's just how I eat.",
        },
        {
            title: "LIFESTYLE",
            image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1200&auto=format&fit=crop", // Running/Active
            description: "Finding joy in movement and staying active daily.",
            quote: "I actually look forward to my workouts now.",
        },
        {
            title: "BALANCE",
            image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1200&auto=format&fit=crop", // Yoga/Meditation
            description: "Mental clarity and stress management through mindfulness.",
            quote: "Health is about more than just the physical.",
        }
    ];

    return (
        <ReactLenis root>
            <div className="bg-black">
                <header className='text-white relative w-full bg-black grid place-content-center h-[50vh] overflow-hidden'>
                    <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm font-medium mb-4">
                            <Quote className="w-4 h-4" />
                            <span>Success Stories</span>
                        </div>
                        <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4'>
                            Real Stories <br />
                            <span className="text-primary-500">Real Results</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Scroll to see Sarah's transformation journey with Health Agent.
                        </p>
                    </div>
                </header>

                {/* Sticky Container */}
                <div ref={containerRef} className="relative h-[600vh] bg-black">
                    <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                        {stories.map((story, index) => (
                            <StorySection
                                key={index}
                                story={story}
                                index={index}
                                total={stories.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>

                {/* Spacer for next section */}
                <div className="h-[20vh] bg-black" />
            </div>
        </ReactLenis>
    );
}

function StorySection({ story, index, total, scrollYProgress }: { story: any, index: number, total: number, scrollYProgress: MotionValue<number> }) {
    // Calculate the range of scroll where this story should be visible
    // Each story gets a segment of 1/total
    const step = 1 / total;
    const start = index * step;
    const end = start + step;

    // Opacity transition: Fade in at start, fade out at end
    // For the fast scroll effect, we want a tighter transition
    const opacity = useTransform(
        scrollYProgress,
        [start, start + step * 0.2, end - step * 0.2, end],
        [0, 1, 1, 0]
    );

    // Scale effect for a subtle "zoom in" feel
    const scale = useTransform(
        scrollYProgress,
        [start, end],
        [0.8, 1]
    );

    // Simple z-index management: active one is on top if needed, but opacity handles visibility mostly
    // const zIndex = useTransform(scrollYProgress, (v) => (v >= start && v < end ? 10 : 0));

    return (
        <motion.div
            style={{ opacity, scale }}
            className="absolute inset-0 w-full h-full flex flex-col justify-center items-center"
        >
            {/* Background Image - Full Screen */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover opacity-60"
                    priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/60 z-10" /> {/* Dark Overlay */}
            </div>

            {/* Text Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl">
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-2xl">
                    {story.title}
                </h2>

                <div className="space-y-6">
                    <p className="text-2xl md:text-3xl text-white/90 font-medium leading-relaxed drop-shadow-lg">
                        {story.description}
                    </p>
                    <div className="inline-block relative">
                        <p className="text-xl md:text-2xl text-primary-400 italic font-serif">
                            "{story.quote}"
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
