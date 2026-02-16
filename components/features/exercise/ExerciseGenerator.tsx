'use client';

import { useState } from 'react';
import { Loader2, MoveRight } from 'lucide-react';
import { CustomSelect } from '@/components/ui/custom-select';
import { GradientButton } from '@/components/ui/gradient-button';

interface Option {
    id: string;
    label: string;
}

interface ExerciseGeneratorProps {
    type: 'WORKOUT' | 'YOGA';
    onGenerate: (data: any) => void;
    isLoading: boolean;
}

export function ExerciseGenerator({ type, onGenerate, isLoading }: ExerciseGeneratorProps) {
    // State for selections
    const [part, setPart] = useState(type === 'WORKOUT' ? 'full_body' : 'general');
    const [duration, setDuration] = useState('30');
    const [level, setLevel] = useState('beginner');

    // Options
    const PARTS: Option[] = type === 'WORKOUT'
        ? [
            { id: 'full_body', label: 'Full Body' },
            { id: 'abs', label: 'Core' },
            { id: 'legs', label: 'Legs' },
            { id: 'arms', label: 'Arms' },
            { id: 'chest', label: 'Chest' },
            { id: 'back', label: 'Back' },
        ]
        : [
            { id: 'general', label: 'Everything' },
            { id: 'flexibility', label: 'Flexibility' },
            { id: 'stress_relief', label: 'Stress Relief' },
            { id: 'strength', label: 'Strength' },
            { id: 'sleep', label: 'Sleep' },
        ];

    const DURATIONS = ['15', '30', '45', '60'];
    const LEVELS = ['beginner', 'intermediate', 'advanced'];

    const handleSubmit = () => {
        onGenerate({ part, duration, level });
    };

    return (
        <div className="py-12 px-4 max-w-4xl mx-auto text-center space-y-12 animate-fadeIn min-h-[50vh] flex flex-col justify-center items-center">

            {/* Mad Libs Sentence */}
            <div className="text-2xl md:text-5xl leading-relaxed md:leading-[1.4] text-health-text font-light tracking-tight">
                <span>I want to work on my </span>

                <CustomSelect
                    value={part}
                    onChange={setPart}
                    options={PARTS}
                    className="align-baseline mx-2"
                />

                <span> for </span>

                <CustomSelect
                    value={duration}
                    onChange={setDuration}
                    options={DURATIONS.map(d => ({ id: d, label: `${d} mins` }))}
                    className="align-baseline mx-2"
                />

                <span className="hidden md:inline">, </span>
                <br className="block md:hidden my-4" />

                <span>suited for a </span>

                <CustomSelect
                    value={level}
                    onChange={setLevel}
                    options={LEVELS.map(l => ({ id: l, label: `${l} level` }))}
                    className="align-baseline mx-2"
                />

                <span> person.</span>
            </div>

            {/* Action Button */}
            <div className="pt-12 pb-4">
                <GradientButton
                    variant="variant"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="group relative inline-flex items-center gap-3 px-12 py-6 rounded-full text-xl font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-primary-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="tracking-wide">Designing...</span>
                        </>
                    ) : (
                        <>
                            <span className="tracking-wide">Generate Plan</span>
                            <MoveRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </GradientButton>

                {!isLoading && (
                    <p className="mt-4 text-sm text-health-muted animate-fadeIn opacity-60">
                        Press to create your personalized routine
                    </p>
                )}
            </div>
        </div>
    );
}
