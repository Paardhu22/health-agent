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
            return { success: false, error: 'Not authenticated' };
        }

        const session = await prisma.workoutSession.create({
            data: {
                userId: user.id,
                ...data,
            },
        });

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
