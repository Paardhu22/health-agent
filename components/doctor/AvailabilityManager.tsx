'use client';

import { useState, useEffect, useRef } from 'react';
import { getDoctorAvailability, updateDoctorAvailability } from '@/lib/actions/doctor';
import { Loader2, Save, CheckCircle2, AlertCircle, Clock, ChevronDown, Check, Calendar } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

function PremiumToggle({ checked, onChange, label, sublabel }: { checked: boolean, onChange: (v: boolean) => void, label: string, sublabel: string }) {
    return (
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => onChange(!checked)}>
            <div className={cn(
                "relative w-14 h-8 rounded-full transition-all duration-500 p-1 flex items-center",
                checked ? "bg-primary-500/20 border border-primary-500/30" : "bg-zinc-800/50 border border-white/5"
            )}>
                <motion.div
                    layout
                    className={cn(
                        "w-6 h-6 rounded-full shadow-lg transition-colors duration-500",
                        checked ? "bg-primary-400" : "bg-zinc-600"
                    )}
                    animate={{ x: checked ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            </div>
            <div className="flex flex-col">
                <span className={cn(
                    "font-black uppercase tracking-widest text-xs transition-colors transition-all duration-300",
                    checked ? "text-white" : "text-zinc-600"
                )}>
                    {label}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    {sublabel}
                </span>
            </div>
        </div>
    );
}

function TimePicker({ value, onChange, disabled }: { value: string, onChange: (v: string) => void, disabled: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const format12h = (time24: string) => {
        const [h, m] = time24.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const options = [];
    for (let h = 6; h <= 22; h++) {
        for (let m = 0; m < 60; m += 30) {
            options.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 min-w-[160px]",
                    disabled
                        ? "bg-transparent border-white/5 opacity-20 cursor-not-allowed"
                        : "bg-white/[0.03] border-white/10 hover:border-primary-500/50 hover:bg-white/[0.05] text-white"
                )}
            >
                <div className="flex items-center gap-3">
                    <Clock className={cn("w-4 h-4", disabled ? "text-zinc-800" : "text-primary-400")} />
                    <span className="text-sm font-black tracking-tight tabular-nums">
                        {format12h(value)}
                    </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-zinc-600 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-4 left-0 right-0 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-[100] backdrop-blur-2xl"
                    >
                        <div className="max-h-[240px] overflow-y-auto no-scrollbar py-2">
                            {options.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => {
                                        onChange(t);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-6 py-3 text-left transition-all flex items-center justify-between",
                                        value === t
                                            ? "bg-primary-500/10 text-primary-400 font-black"
                                            : "text-zinc-500 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <span className="text-xs uppercase tracking-widest">{format12h(t)}</span>
                                    {value === t && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function AvailabilityManager() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [availability, setAvailability] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadAvailability();
    }, []);

    async function loadAvailability() {
        setIsLoading(true);
        const result = await getDoctorAvailability();

        if (result.success && result.data) {
            const initialAvailability = DAYS.map((day, index) => {
                const existing = result.data.find((a: any) => a.dayOfWeek === index);
                return existing || {
                    dayOfWeek: index,
                    startTime: '09:00',
                    endTime: '17:00',
                    isActive: false,
                };
            });
            setAvailability(initialAvailability);
        }
        setIsLoading(false);
    }

    async function handleSave() {
        setIsSaving(true);
        setMessage(null);

        const activeSlots = availability.filter(a => a.isActive);
        const result = await updateDoctorAvailability(activeSlots);

        if (result.success) {
            setMessage({ type: 'success', text: 'Operational schedule synchronized' });
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: 'Synchronization failed' });
        }
        setIsSaving(false);
    }

    function updateDay(index: number, field: string, value: any) {
        setAvailability(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Accessing Schedule...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Hours Configuration</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Toggle your active sessions for each day</p>
                </div>

                <div className="flex items-center gap-6">
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={cn(
                                    "px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                                    message.type === 'success' ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <GradientButton
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-14 px-10 rounded-2xl min-w-[180px]"
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="uppercase tracking-widest text-xs font-black">Syncing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Save className="w-4 h-4" />
                                <span className="uppercase tracking-widest text-xs font-black">Sync Schedule</span>
                            </div>
                        )}
                    </GradientButton>
                </div>
            </div>

            {/* Schedule Grid */}
            <div className="grid grid-cols-1 gap-4">
                {availability.map((slot, index) => {
                    const today = new Date();
                    const currentDay = today.getDay();
                    const daysUntil = (index + 7 - currentDay) % 7;
                    const date = new Date(today);
                    date.setDate(today.getDate() + daysUntil);
                    const isToday = daysUntil === 0;

                    return (
                        <motion.div
                            key={index}
                            initial={false}
                            animate={{ opacity: slot.isActive ? 1 : 0.4 }}
                            className={cn(
                                "flex flex-col lg:flex-row lg:items-center gap-8 p-8 rounded-[2.5rem] border transition-all duration-500",
                                slot.isActive
                                    ? "bg-white/[0.03] border-white/10 shadow-2xl shadow-primary-500/5 translate-x-1"
                                    : "bg-transparent border-white/5 grayscale"
                            )}
                        >
                            <div className="flex items-center gap-4 lg:w-72">
                                <PremiumToggle
                                    checked={slot.isActive}
                                    onChange={(v) => updateDay(index, 'isActive', v)}
                                    label={DAYS[index]}
                                    sublabel={isToday ? "Operational Today" : "Recurring Weekly"}
                                />
                            </div>

                            <div className="flex-1 flex items-center gap-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Start Interval</span>
                                    <TimePicker
                                        value={slot.startTime}
                                        onChange={(v) => updateDay(index, 'startTime', v)}
                                        disabled={!slot.isActive}
                                    />
                                </div>
                                <div className="pt-6">
                                    <span className="text-zinc-700 font-bold text-xs uppercase tracking-widest px-2">to</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">End Interval</span>
                                    <TimePicker
                                        value={slot.endTime}
                                        onChange={(v) => updateDay(index, 'endTime', v)}
                                        disabled={!slot.isActive}
                                    />
                                </div>
                            </div>

                            <div className="lg:ml-auto">
                                <div className={cn(
                                    "px-4 py-2 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                                    slot.isActive ? "bg-primary-500/10 text-primary-400 border border-primary-500/20" : "bg-white/5 text-zinc-600 border border-white/5"
                                )}>
                                    <Calendar className="w-3 h-3" />
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
