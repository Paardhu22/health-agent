'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/actions/auth';
import { getPatientsForChat } from '@/lib/actions/chat-p2d';
import { DoctorPatientChat } from '@/components/chat/DoctorPatientChat';
import { Loader2, User, MessageSquare, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MyPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const [patientsResult, user] = await Promise.all([
                getPatientsForChat(),
                getUser()
            ]);

            if (patientsResult.success && patientsResult.data) setPatients(patientsResult.data);
            if (user) setCurrentUser(user);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto pb-20 lg:pb-6 space-y-12 animate-fadeIn">
            {/* HUD Header */}
            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 md:p-12 backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Patient Management
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Patients</span>
                        </h1>
                        <p className="text-zinc-500 mt-4 text-lg">
                            Monitor and communicate with your assigned patients.
                        </p>
                    </div>

                    <div className="w-full md:w-80 space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-hover:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-zinc-600 font-medium"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Patients Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing Patients...</p>
                </div>
            ) : filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={patient.id}
                            className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 hover:bg-zinc-900 transition-all duration-500 shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/20"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 text-2xl font-black border border-primary-500/20">
                                    {patient.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-white truncate">{patient.name}</h3>
                                    <p className="text-sm text-zinc-500 truncate">{patient.email}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setActiveChat({ id: patient.id, name: patient.name })}
                                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl py-4 flex items-center justify-center gap-3 group hover:bg-primary-500 hover:border-primary-500 transition-all duration-300"
                                >
                                    <MessageSquare className="w-5 h-5 text-primary-400 group-hover:text-white transition-colors" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Connect</span>
                                </button>
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                                    <User className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                        <User className="w-10 h-10 text-zinc-800" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white">No patients found</h3>
                        <p className="text-zinc-500 mt-2 max-w-sm">No patients are currently assigned to your roster or match your search.</p>
                    </div>
                </div>
            )}

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
