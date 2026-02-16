'use client';

import { useState, useEffect } from 'react';
import { getUser } from '@/lib/actions/auth';
import { Loader2, User, Settings, Shield, Award, MapPin, Mail, Phone, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientButton } from '@/components/ui/gradient-button';

export default function DoctorProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const userData = await getUser();
            setUser(userData);
            setIsLoading(false);
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    const labelClasses = "text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block ml-1";
    const infoBoxClasses = "bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4 group hover:border-primary-500/30 transition-all";

    return (
        <div className="max-w-6xl mx-auto pb-20 lg:pb-6 space-y-12 animate-fadeIn">
            {/* HUD Header */}
            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 md:p-12 backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-primary-500 to-primary-700 p-1">
                            <div className="w-full h-full rounded-[2.3rem] bg-zinc-950 flex items-center justify-center text-5xl font-black text-primary-500">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Verified Professional
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            {user?.name}
                        </h1>
                        <p className="text-zinc-500 mt-2 text-xl font-medium">
                            {user?.role === 'DOCTOR' ? 'Medical Practitioner' : 'Yoga & Wellness Instructor'}
                        </p>
                    </div>

                    <div className="flex-1" />

                    <GradientButton className="h-14 px-10 rounded-2xl">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Public Profile
                    </GradientButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Stats & Badges */}
                <div className="space-y-8">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                            <Shield className="w-4 h-4 text-primary-400" /> Professional Status
                        </h3>

                        <div className="space-y-4">
                            <div className={infoBoxClasses}>
                                <Briefcase className="w-5 h-5 text-zinc-500 group-hover:text-primary-400" />
                                <div>
                                    <span className="text-xs font-bold text-white">License Verified</span>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Active Status</p>
                                </div>
                            </div>
                            <div className={infoBoxClasses}>
                                <Award className="w-5 h-5 text-zinc-500 group-hover:text-primary-400" />
                                <div>
                                    <span className="text-xs font-bold text-white">Senior Practitioner</span>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">5+ Years Exp.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact & Details */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3 mb-10">
                            <User className="w-4 h-4 text-primary-400" /> Identity Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Full Name</label>
                                <div className="text-lg font-bold text-white px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl capitalize">
                                    {user?.name}
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Professional Role</label>
                                <div className="text-lg font-bold text-white px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    {user?.role}
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Primary Contact</label>
                                <div className="flex items-center gap-3 text-lg font-bold text-white px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    {user?.email}
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Practice Location</label>
                                <div className="flex items-center gap-3 text-lg font-bold text-white px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <MapPin className="w-4 h-4 text-zinc-500" />
                                    Global Digital Practice
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10 text-primary-400">
                            <p className="text-sm font-medium leading-relaxed">
                                <strong>Professional Note:</strong> Your profile is currently visible to assigned patients and the marketplace administration. Public directory listing is pending license re-verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
