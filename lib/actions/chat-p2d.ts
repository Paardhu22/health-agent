'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getCurrentUser, getSession } from '@/lib/auth';
import { createNotification } from './notification';

export interface ChatActionResult {
    success: boolean;
    error?: string;
    data?: any;
}

// ==================== SEND MESSAGE ====================

export async function sendDoctorPatientMessage(
    recipientId: string, // Doctor ID or Patient ID depending on sender
    content: string,
    isDoctorSender: boolean
): Promise<ChatActionResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: 'Not authenticated' };
        }

        // Fetch full user for name in notification
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { id: true, name: true }
        });

        if (!user) return { success: false, error: 'User not found' };

        let doctorId, patientId, senderId;

        if (isDoctorSender) {
            // Sender is Doctor
            const doctor = await prisma.doctor.findFirst({
                where: { userId: user.id },
            });
            if (!doctor) return { success: false, error: 'Doctor profile not found' };

            doctorId = doctor.id;
            patientId = recipientId; // Recipient is Patient (User ID)
            senderId = user.id;
        } else {
            // Sender is Patient
            patientId = user.id;
            doctorId = recipientId; // Recipient is Doctor (Doctor ID)
            senderId = user.id;
        }



        // ...

        const message = await prisma.doctorPatientChat.create({
            data: {
                doctorId,
                patientId,
                senderId,
                content,
            },
        });

        // Create notification for the recipient
        const recipientUserId = isDoctorSender ? recipientId : (await prisma.doctor.findUnique({ where: { id: recipientId } }))?.userId;

        if (recipientUserId) {
            await createNotification(
                recipientUserId,
                `New message from ${isDoctorSender ? 'Dr. ' + user.name : user.name}`,
                content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                'CHAT_MESSAGE',
                message.id,
                'chat'
            );
        }

        revalidatePath('/dashboard/doctor');
        revalidatePath('/appointments');
        return { success: true, data: message };
    } catch (error) {
        console.error('Send message error:', error);
        return { success: false, error: 'Failed to send message' };
    }
}

// ==================== GET MESSAGES ====================

export async function getDoctorPatientMessages(
    otherPartyId: string, // If caller is doctor -> patientId; if patient -> doctorId
    isDoctorViewer: boolean
): Promise<ChatActionResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: 'Not authenticated' };
        }
        const user = { id: session.userId };

        let doctorId, patientId;

        if (isDoctorViewer) {
            const doctor = await prisma.doctor.findFirst({
                where: { userId: user.id },
            });
            if (!doctor) return { success: false, error: 'Doctor profile not found' };

            doctorId = doctor.id;
            patientId = otherPartyId;
        } else {
            patientId = user.id;
            doctorId = otherPartyId;
        }

        const messages = await prisma.doctorPatientChat.findMany({
            where: {
                doctorId,
                patientId,
                isDeleted: false,
            },
            orderBy: { createdAt: 'asc' },
        });

        return { success: true, data: messages };
    } catch (error) {
        console.error('Get messages error:', error);
        return { success: false, error: 'Failed to get messages' };
    }
}

// ==================== UNSEND MESSAGE ====================

export async function unsendDoctorPatientMessage(messageId: string): Promise<ChatActionResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { success: false, error: 'Not authenticated' };
        }
        const user = { id: session.userId };

        const message = await prisma.doctorPatientChat.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            return { success: false, error: 'Message not found' };
        }

        // Verify ownership
        if (message.senderId !== user.id) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.doctorPatientChat.update({
            where: { id: messageId },
            data: { isDeleted: true },
        });

        revalidatePath('/dashboard/doctor');
        revalidatePath('/appointments');
        return { success: true };
    } catch (error) {
        console.error('Unsend message error:', error);
        return { success: false, error: 'Failed to unsend message' };
    }
}

// ==================== GET CHAT PATIENTS ====================

export async function getPatientsForChat(): Promise<ChatActionResult> {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: 'Not authenticated' };
        const user = { id: session.userId };

        const doctor = await prisma.doctor.findFirst({
            where: { userId: user.id },
        });
        if (!doctor) return { success: false, error: 'Doctor profile not found' };

        // Find unique patients from appointments
        const patients = await prisma.appointment.findMany({
            where: { doctorId: doctor.id },
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    }
                }
            },
            distinct: ['userId'],
        });

        return { success: true, data: patients.map(p => p.user) };
    } catch (error) {
        console.error('Get patients error:', error);
        return { success: false, error: 'Failed to get patients' };
    }
}

// ==================== MARK AS READ ====================

export async function markMessagesAsRead(
    otherPartyId: string,
    isDoctorViewer: boolean
): Promise<ChatActionResult> {
    try {
        const session = await getSession();
        if (!session) return { success: false, error: 'Not authenticated' };
        const user = { id: session.userId };

        let doctorId, patientId;

        if (isDoctorViewer) {
            const doctor = await prisma.doctor.findFirst({
                where: { userId: user.id },
            });
            if (!doctor) return { success: false, error: 'Doctor profile not found' };

            doctorId = doctor.id;
            patientId = otherPartyId;
        } else {
            patientId = user.id;
            doctorId = otherPartyId;
        }

        // Update messages where sender is the OTHER party and recipient is ME
        // In this schema, we don't store recipientId directly, but we know who sent it.
        // If I am Doctor, I want to mark messages from Patient as read.
        // If I am Patient, I want to mark messages from Doctor's User ID as read.
        // Wait, DoctorPatientChat.senderId is the User ID of the sender.

        // So if I am Doctor (viewing Patient chat), I mark messages where:
        // doctorId = myDoctorId, patientId = patientId, senderId = patientId (User ID)

        // If I am Patient (viewing Doctor chat), I mark messages where:
        // doctorId = doctorId, patientId = myUserId, senderId != myUserId (i.e., Doctor's User ID)

        await prisma.doctorPatientChat.updateMany({
            where: {
                doctorId,
                patientId,
                senderId: { not: user.id }, // Messages sent by the other person
                isRead: false,
            },
            data: { isRead: true },
        });

        revalidatePath('/dashboard/doctor');
        revalidatePath('/appointments');
        revalidatePath('/chat'); // If exists

        return { success: true };
    } catch (error) {
        console.error('Mark read error:', error);
        return { success: false, error: "Failed to mark messages as read" };
    }
}
