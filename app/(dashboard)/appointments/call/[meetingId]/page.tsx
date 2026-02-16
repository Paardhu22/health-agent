import { getCurrentUser } from '@/lib/auth';
import { getAppointmentByMeetingId } from '@/lib/actions/appointments';
import { VideoCall } from '@/components/appointments/VideoCall';
import { redirect } from 'next/navigation';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default async function VideoCallPage({ params }: { params: { meetingId: string } }) {
    const user = await getCurrentUser();
    if (!user) redirect('/login');

    const result = await getAppointmentByMeetingId(params.meetingId);

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-8 bg-zinc-950">
                <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Meeting Expired</h1>
                    <p className="text-zinc-500 max-w-sm mx-auto">The requested meeting room either does not exist or the session has already concluded.</p>
                </div>
                <Link href="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const appointment = result.data;

    // Check if user is part of the appointment
    const isDoctor = user.id === appointment.doctor.userId;
    const isPatient = user.id === appointment.userId;

    if (!isDoctor && !isPatient) {
        redirect('/dashboard');
    }

    const otherName = isDoctor ? appointment.user.name : appointment.doctor.name;

    return (
        <VideoCall
            appointmentId={appointment.id}
            meetingId={params.meetingId}
            userName={user.name}
            otherName={otherName}
            role={isDoctor ? 'doctor' : 'patient'}
        />
    );
}
