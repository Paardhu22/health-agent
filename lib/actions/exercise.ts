'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ActivityType, IntensityLevel, MoodLevel } from '@prisma/client';

export interface SaveSessionData {
    activityType: ActivityType;
    duration: number;
    calories?: number;
    title: string;
    exercises?: any;
    difficulty?: IntensityLevel;
    feeling?: MoodLevel;
    notes?: string;
}

export interface ExerciseActionResult {
    success: boolean;
    error?: string;
    data?: any;
}

export async function saveWorkoutSession(
    data: SaveSessionData
): Promise<ExerciseActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            console.error('Save session failed: User not authenticated');
            return { success: false, error: 'Not authenticated' };
        }

        console.log('Saving workout session for user:', user.id, 'Data:', JSON.stringify(data, null, 2));

        const session = await prisma.workoutSession.create({
            data: {
                userId: user.id,
                activityType: data.activityType,
                duration: data.duration,
                calories: data.calories,
                title: data.title,
                difficulty: data.difficulty,
                feeling: data.feeling,
                notes: data.notes,
                exercises: data.exercises ?? {}, // Ensure strictly defined or empty object
            },
        });

        console.log('Session saved successfully:', session.id);

        revalidatePath('/exercise');
        return { success: true, data: session };
    } catch (error) {
        console.error('Save session error:', error);
        return { success: false, error: 'Failed to save session' };
    }
}

export async function getWorkoutHistory(): Promise<ExerciseActionResult> {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const history = await prisma.workoutSession.findMany({
            where: { userId: user.id },
            orderBy: { completedAt: 'desc' },
            take: 50,
        });

        return { success: true, data: history };
    } catch (error) {
        console.error('Get history error:', error);
        return { success: false, error: 'Failed to get history' };
    }
}
