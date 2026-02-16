'use client';

import { AvailabilityManager } from '@/components/doctor/AvailabilityManager';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AvailabilityPage() {
    return (
        <div className="max-w-6xl mx-auto pb-20 lg:pb-6 space-y-12 animate-fadeIn">
            {/* HUD Header */}
            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 md:p-12 backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Schedule Management
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Working <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Availability</span>
                    </h1>
                    <p className="text-zinc-500 mt-4 text-lg max-w-xl">
                        Design your weekly schedule, set appointment durations, and manage your consultation hours.
                    </p>
                </div>
            </div>

            {/* Main Manager Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Configurator</h2>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Set your global recurring hours</p>
                    </div>
                </div>

                <AvailabilityManager />
            </motion.div>

            {/* Pro Tips / Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Smart Slots", desc: "Our AI automatically buffers 5 minutes between sessions for you.", icon: Sparkles },
                    { title: "Timezones", desc: "All hours are automatically synced to your local time zone.", icon: Calendar },
                    { title: "Instant Update", desc: "Changes apply immediately to your booking page.", icon: Clock }
                ].map((tip, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                        <tip.icon className="w-6 h-6 text-primary-400 mb-4" />
                        <h4 className="font-bold text-white mb-2">{tip.title}</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed">{tip.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
