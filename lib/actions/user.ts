'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateUserPreferences(preferences: Record<string, boolean>) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: 'Unauthorized' };
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                preferences: preferences as any
            }
        });

        revalidatePath('/settings');
        return { success: 'Preferences updated' };
    } catch (error) {
        return { error: 'Something went wrong!' };
    }
}

export async function deleteAccount() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return { error: 'Unauthorized' };
        }

        await prisma.user.delete({
            where: {
                id: user.id
            }
        });

        return { success: 'Account deleted' };
    } catch (error) {
        return { error: 'Something went wrong!' };
    }
}

export async function getUser() {
    try {
        const user = await getCurrentUser();
        return user;
    } catch (error) {
        return null;
    }
}

export async function updateAvatarConfig(config: {
    gender: string;
    skinColor: string;
    hairType: string;
    clothing: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        await prisma.user.update({
            where: { id: user.id },
            data: { avatarConfig: config as any },
        });

        revalidatePath('/settings');
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update avatar' };
    }
}

export async function updateProfileVisibility(isPublic: boolean) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        await prisma.user.update({
            where: { id: user.id },
            data: { isProfilePublic: isPublic },
        });

        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update visibility' };
    }
}

export async function getAvatarConfig() {
    try {
        const user = await getCurrentUser();
        if (!user) return null;

        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                avatarConfig: true,
                isProfilePublic: true,
                name: true,
            },
        });

        return fullUser;
    } catch (error) {
        return null;
    }
}
