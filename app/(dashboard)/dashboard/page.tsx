import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { YogaDashboard } from '@/components/dashboard/YogaDashboard';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Redirect Doctors/Instructors
  if (user.role === 'DOCTOR' || user.role === 'YOGA_INSTRUCTOR') {
    const { redirect } = await import('next/navigation');
    redirect('/doctor');
  }

  // Fetch upcoming appointments (PENDING or CONFIRMED, scheduled in the future)
  const upcomingAppointments = await prisma.appointment.findMany({
    where: {
      userId: user.id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      scheduledDate: { gte: new Date() },
    },
    include: {
      doctor: {
        select: {
          name: true,
          specialization: true,
        },
      },
    },
    orderBy: { scheduledDate: 'asc' },
    take: 5,
  });

  // Serialize dates for client component
  const serializedAppointments = upcomingAppointments.map((apt) => ({
    id: apt.id,
    scheduledDate: apt.scheduledDate.toISOString(),
    scheduledTime: apt.scheduledTime,
    duration: apt.duration,
    status: apt.status,
    type: apt.type,
    reason: apt.reason,
    doctorName: apt.doctor.name,
    doctorSpecialization: apt.doctor.specialization,
    meetingId: apt.meetingId,
  }));

  return (
    <div className="relative min-h-screen">
      <YogaDashboard userName={user.name.split(' ')[0]} appointments={serializedAppointments} />
    </div>
  );
}
