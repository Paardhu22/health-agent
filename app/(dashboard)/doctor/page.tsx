'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/actions/auth';
import { getDoctorStats } from '@/lib/actions/doctor';
import { getPatientsForChat } from '@/lib/actions/chat-p2d';
import { AvailabilityManager } from '@/components/doctor/AvailabilityManager';
import { DoctorPatientChat } from '@/components/chat/DoctorPatientChat';
import { Loader2, Calendar, User, Clock, Settings, Activity, MessageSquare } from 'lucide-react';

export default function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        totalPatients: 0,
        patientsTreatedToday: 0
    });
    const [patients, setPatients] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null); // { id, name }
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoadingStats(true);
            const [statsResult, patientsResult, user] = await Promise.all([
                getDoctorStats(),
                getPatientsForChat(),
                getUser()
            ]);

            if (statsResult.success && statsResult.data) setStats(statsResult.data);
            if (patientsResult.success && patientsResult.data) setPatients(patientsResult.data);
            if (user) setCurrentUser(user);

            setIsLoadingStats(false);
        }
        loadData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto pb-20 lg:pb-6 space-y-8 animate-fadeIn relative">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-health-text">Doctor Dashboard</h1>
                <p className="text-health-muted">Manage your profile, availability, and appointments</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-health-border pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'overview' ? 'text-primary-500' : 'text-health-muted hover:text-health-text'
                        }`}
                >
                    Overview
                    {activeTab === 'overview' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('patients')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'patients' ? 'text-primary-500' : 'text-health-muted hover:text-health-text'
                        }`}
                >
                    My Patients
                    {activeTab === 'patients' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('availability')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'availability' ? 'text-primary-500' : 'text-health-muted hover:text-health-text'
                        }`}
                >
                    Availability
                    {activeTab === 'availability' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'profile' ? 'text-primary-500' : 'text-health-muted hover:text-health-text'
                        }`}
                >
                    Profile
                    {activeTab === 'profile' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-health-text">Upcoming Appointments</h3>
                                    <p className="text-2xl font-bold text-health-text">
                                        {isLoadingStats ? '-' : stats.upcomingAppointments}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-health-muted">Scheduled for future dates.</p>
                        </div>

                        <div className="card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-health-text">Total Patients</h3>
                                    <p className="text-2xl font-bold text-health-text">
                                        {isLoadingStats ? '-' : stats.totalPatients}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-health-muted">Unique patients assigned to you.</p>
                        </div>

                        <div className="card p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-purple-500/10 text-purple-500">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-health-text">Patients Treated Today</h3>
                                    <p className="text-2xl font-bold text-health-text">
                                        {isLoadingStats ? '-' : stats.patientsTreatedToday}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-health-muted">Completed appointments today.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patients.length > 0 ? (
                            patients.map(patient => (
                                <div key={patient.id} className="card p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold">
                                            {patient.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-health-text">{patient.name}</h3>
                                            <p className="text-xs text-health-muted">{patient.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveChat({ id: patient.id, name: patient.name })}
                                        className="btn-secondary text-sm py-1.5 px-3"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Chat
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-health-muted">
                                No patients found.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'availability' && (
                    <AvailabilityManager />
                )}

                {activeTab === 'profile' && (
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-health-text mb-4">Profile Settings</h3>
                        <p className="text-health-muted">Profile editing functionality coming soon.</p>
                    </div>
                )}
            </div>

            {/* Chat Interface */}
            {activeChat && currentUser && (
                <DoctorPatientChat
                    recipientId={activeChat.id}
                    recipientName={activeChat.name}
                    recipientRole="patient"
                    currentUserId={currentUser.id}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
}
