'use client';

// Workout View Component
// Refactored from original ExercisePage

import { useState } from 'react';
import { getExerciseRecommendation } from '@/lib/actions/recommendations';
import {
    Dumbbell,
    Loader2,
    AlertCircle,
    RefreshCw,
    Clock,
    Flame,
    Heart,
    Shield,
    ChevronDown,
    ChevronUp,
    Play,
    CheckCircle2,
    Target,
    Printer
} from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const BODY_PARTS = [
    { id: 'full_body', label: 'Full Body', emoji: '🏋️' },
    { id: 'chest', label: 'Chest', emoji: '💪' },
    { id: 'back', label: 'Back', emoji: '🔙' },
    { id: 'shoulders', label: 'Shoulders', emoji: '🦾' },
    { id: 'arms', label: 'Arms', emoji: '💪' },
    { id: 'legs', label: 'Legs', emoji: '🦵' },
    { id: 'core', label: 'Core/Abs', emoji: '🎯' },
    { id: 'glutes', label: 'Glutes', emoji: '🍑' },
];

const FITNESS_LEVELS = [
    { id: 'beginner', label: 'Beginner', desc: 'New to exercise' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Regular exercise' },
    { id: 'advanced', label: 'Advanced', desc: 'Experienced' },
];

export function WorkoutView() {
    const [isLoading, setIsLoading] = useState(false);
    const [exercisePlan, setExercisePlan] = useState<any>(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState('full_body');
    const [fitnessLevel, setFitnessLevel] = useState('intermediate');
    const [specificRequest, setSpecificRequest] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

    async function generateExercisePlan() {
        setIsLoading(true);
        setError(null);
        setCompletedExercises(new Set());

        const bodyPart = selectedBodyPart === 'full_body' ? undefined : selectedBodyPart;
        const request = specificRequest
            ? `${specificRequest}. Fitness level: ${fitnessLevel}`
            : `Fitness level: ${fitnessLevel}`;

        const result = await getExerciseRecommendation(bodyPart, request);

        if (result.success) {
            setExercisePlan(result.data);
        } else {
            setError(result.error || 'Failed to generate exercise plan');
        }

        setIsLoading(false);
    }

    function toggleExerciseComplete(index: number) {
        const newSet = new Set(completedExercises);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setCompletedExercises(newSet);
    }

    function handlePrint() {
        window.print();
    }

    return (
        <div className="space-y-6">
            {/* Selection Section - Hide on print */}
            <div className="card mb-6 no-print">
                <h2 className="font-semibold text-health-text mb-4">Customize Your Workout</h2>

                {/* Body Part Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-health-text mb-2">
                        Target Area
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {BODY_PARTS.map((part) => (
                            <button
                                key={part.id}
                                onClick={() => setSelectedBodyPart(part.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                    selectedBodyPart === part.id
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'bg-white/5 border-white/10 text-health-text hover:bg-white/10'
                                )}
                            >
                                {part.emoji} {part.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fitness Level */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-health-text mb-2">
                        Fitness Level
                    </label>
                    <div className="flex gap-2">
                        {FITNESS_LEVELS.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setFitnessLevel(level.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                                    fitnessLevel === level.id
                                        ? 'bg-primary-600 border-primary-600 text-white'
                                        : 'bg-white/5 border-white/10 text-health-text hover:bg-white/10'
                                )}
                            >
                                {level.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Specific Request */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-health-text mb-2">
                        Additional Requirements (optional)
                    </label>
                    <textarea
                        value={specificRequest}
                        onChange={(e) => setSpecificRequest(e.target.value)}
                        placeholder="e.g., 'No equipment available' or 'Focus on strength building'"
                        className="textarea"
                        rows={2}
                    />
                </div>

                <div className="flex gap-2">
                    <GradientButton
                        onClick={generateExercisePlan}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : exercisePlan ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate Plan
                            </>
                        ) : (
                            <>
                                <Dumbbell className="w-4 h-4 mr-2" />
                                Generate Exercise Plan
                            </>
                        )}
                    </GradientButton>

                    {exercisePlan && (
                        <button
                            onClick={handlePrint}
                            className="btn-secondary"
                            title="Print Plan"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}
            </div>

            {/* Exercise Plan Display */}
            {exercisePlan && (
                <div id="printable-content" className="space-y-6 animate-fadeIn">
                    {/* Print Header */}
                    <div className="hidden print:block mb-8 text-center">
                        <h1 className="text-3xl font-bold text-primary-800 mb-2">Personalized Workout Plan</h1>
                        <p className="text-gray-600">Generated by Health Agent on {format(new Date(), 'PPP')}</p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card p-4 print:shadow-none print:border">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-600 print:text-black" />
                                <span className="text-sm text-health-muted print:text-gray-600">Duration</span>
                            </div>
                            <p className="text-xl font-bold text-health-text print:text-black">{exercisePlan.totalDuration || '45'} min</p>
                        </div>
                        <div className="card p-4 print:shadow-none print:border">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame className="w-4 h-4 text-orange-600 print:text-black" />
                                <span className="text-sm text-health-muted print:text-gray-600">Est. Calories</span>
                            </div>
                            <p className="text-xl font-bold text-health-text print:text-black">{exercisePlan.estimatedCalories || '300'}</p>
                        </div>
                        <div className="card p-4 print:shadow-none print:border">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-primary-600 print:text-black" />
                                <span className="text-sm text-health-muted print:text-gray-600">Exercises</span>
                            </div>
                            <p className="text-xl font-bold text-health-text print:text-black">{exercisePlan.exercises?.length || 0}</p>
                        </div>
                        <div className="card p-4 no-print">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-health-muted">Completed</span>
                            </div>
                            <p className="text-xl font-bold text-health-text">
                                {completedExercises.size}/{exercisePlan.exercises?.length || 0}
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar - Hide on print */}
                    {exercisePlan.exercises && (
                        <div className="card p-4 no-print">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-health-text">Workout Progress</span>
                                <span className="text-health-muted">
                                    {Math.round((completedExercises.size / exercisePlan.exercises.length) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                                    style={{ width: `${(completedExercises.size / exercisePlan.exercises.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Warmup */}
                    {exercisePlan.warmup && exercisePlan.warmup.length > 0 && (
                        <div className="card print:shadow-none print:break-inside-avoid">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="w-5 h-5 text-red-500 print:text-black" />
                                <h3 className="font-semibold text-health-text print:text-black">Warm Up</h3>
                                <span className="text-sm text-health-muted print:text-gray-600">(5-10 min)</span>
                            </div>
                            <ul className="space-y-2">
                                {exercisePlan.warmup.map((item: any, i: number) => (
                                    <li key={i} className="text-sm text-health-text flex items-start gap-2 print:text-black">
                                        <Play className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <span><span className="font-medium">{item.name}</span> <span className="text-health-muted print:text-gray-600">({item.duration})</span></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Exercises */}
                    <div className="card print:shadow-none">
                        <h3 className="font-semibold text-health-text mb-4 print:text-black">Exercises</h3>
                        <div className="space-y-3">
                            {exercisePlan.exercises?.map((exercise: any, index: number) => (
                                <ExerciseCard
                                    key={index}
                                    exercise={exercise}
                                    index={index}
                                    isCompleted={completedExercises.has(index)}
                                    onToggleComplete={() => toggleExerciseComplete(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cooldown */}
                    {exercisePlan.cooldown && exercisePlan.cooldown.length > 0 && (
                        <div className="card print:shadow-none print:break-inside-avoid">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart className="w-5 h-5 text-blue-500 print:text-black" />
                                <h3 className="font-semibold text-health-text print:text-black">Cool Down</h3>
                                <span className="text-sm text-health-muted print:text-gray-600">(5-10 min)</span>
                            </div>
                            <ul className="space-y-2">
                                {exercisePlan.cooldown.map((item: any, i: number) => (
                                    <li key={i} className="text-sm text-health-text flex items-start gap-2 print:text-black">
                                        <Play className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                        <span><span className="font-medium">{item.name}</span> <span className="text-health-muted print:text-gray-600">({item.duration})</span></span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Safety Warnings */}
                    {exercisePlan.safetyWarnings && exercisePlan.safetyWarnings.length > 0 && (
                        <div className="card bg-red-500/10 border-red-500/20 print:bg-transparent print:border-gray-200 print:break-inside-avoid">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-5 h-5 text-red-500 print:text-black" />
                                <h3 className="font-semibold text-red-500 print:text-black">Safety Warnings</h3>
                            </div>
                            <ul className="space-y-2">
                                {exercisePlan.safetyWarnings.map((warning: string, i: number) => (
                                    <li key={i} className="text-sm text-red-400 flex items-start gap-2 print:text-black">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Modifications */}
                    {exercisePlan.modifications && exercisePlan.modifications.length > 0 && (
                        <div className="card bg-blue-500/10 border-blue-500/20 print:bg-transparent print:border-gray-200 print:break-inside-avoid">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-5 h-5 text-blue-500 print:text-black" />
                                <h3 className="font-semibold text-blue-400 print:text-black">Modifications</h3>
                            </div>
                            <ul className="space-y-2">
                                {exercisePlan.modifications.map((mod: string, i: number) => (
                                    <li key={i} className="text-sm text-blue-300 print:text-black">• {mod}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Disclaimer */}
                    <div className="p-4 rounded-lg bg-white/5 text-sm text-health-muted print:bg-transparent print:text-xs print:mt-8">
                        <strong>⚠️ Disclaimer:</strong> This exercise plan is for general wellness purposes only.
                        Consult a healthcare provider before starting any new exercise program.
                    </div>
                </div>
            )}
        </div>
    );
}

function ExerciseCard({
    exercise,
    index,
    isCompleted,
    onToggleComplete
}: {
    exercise: any;
    index: number;
    isCompleted: boolean;
    onToggleComplete: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={cn(
                "rounded-lg border transition-all print:border-gray-200 print:break-inside-avoid",
                isCompleted
                    ? 'bg-green-500/10 border-green-500/50 print:bg-transparent'
                    : 'border-health-border hover:border-primary-500/50'
            )}
        >
            <div className="p-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleComplete}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors no-print",
                            isCompleted
                                ? 'bg-green-600 text-white'
                                : 'bg-white/5 text-health-muted hover:bg-white/10'
                        )}
                    >
                        {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <span className="font-medium">{index + 1}</span>
                        )}
                    </button>

                    <span className="hidden print:inline-block font-bold mr-2 text-black">{index + 1}.</span>

                    <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${isCompleted ? 'text-green-500 line-through print:text-black print:no-underline' : 'text-health-text print:text-black'}`}>
                            {exercise.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1 print:text-sm">
                            {exercise.sets && (
                                <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20 print:border-gray-300 print:bg-gray-100 print:text-black">
                                    {exercise.sets} sets
                                </span>
                            )}
                            {exercise.reps && (
                                <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 border border-green-500/20 print:border-gray-300 print:bg-gray-100 print:text-black">
                                    {exercise.reps} reps
                                </span>
                            )}
                            {exercise.duration && (
                                <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/20 print:border-gray-300 print:bg-gray-100 print:text-black">
                                    {exercise.duration}
                                </span>
                            )}
                            {exercise.restBetweenSets && (
                                <span className="text-xs px-2 py-1 rounded bg-white/5 text-health-muted border border-white/10 print:border-gray-300 print:bg-gray-100 print:text-black">
                                    Rest: {exercise.restBetweenSets}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Always expand on print */}
                <div className={cn("mt-4 pl-12 print:pl-6", !isExpanded && "hidden print:block")}>
                    <div className="space-y-3">
                        {exercise.description && (
                            <p className="text-sm text-health-muted print:text-gray-600">{exercise.description}</p>
                        )}
                        {exercise.instructions && exercise.instructions.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-health-text mb-2 print:text-black">Instructions:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    {exercise.instructions.map((step: string, i: number) => (
                                        <li key={i} className="text-sm text-health-muted print:text-black">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                <span className="text-sm text-health-muted print:text-gray-600">Targets: </span>
                                {exercise.targetMuscles.map((muscle: string, i: number) => (
                                    <span key={i} className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-400 border border-primary-500/20 print:border-gray-300 print:bg-gray-100 print:text-black">
                                        {muscle}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full mt-2 flex justify-center p-2 hover:bg-white/5 rounded-lg transition-colors no-print"
                >
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-health-muted" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-health-muted" />
                    )}
                </button>
            </div>
        </div >
    );
}
