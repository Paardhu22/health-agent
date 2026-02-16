const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                OR: [
                    { meetingId: null },
                    { meetingId: '' }
                ],
                status: 'CONFIRMED'
            }
        });

        console.log(`Found ${appointments.length} appointments with missing meetingId`);

        for (const appt of appointments) {
            const meetingId = Math.random().toString(36).substring(2, 12).toUpperCase();
            await prisma.appointment.update({
                where: { id: appt.id },
                data: { meetingId }
            });
            console.log(`Updated appointment ${appt.id} with meetingId: ${meetingId}`);
        }
    } catch (error) {
        console.error('Error updating appointments:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
