'use client';

import { useState, useEffect } from 'react';
import { getDoctorAvailability, updateDoctorAvailability } from '@/lib/actions/doctor';
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

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
            // Initialize with default values if empty, or map existing
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
            setMessage({ type: 'success', text: 'Availability updated successfully' });
        } else {
            setMessage({ type: 'error', text: 'Failed to update availability' });
        }
        setIsSaving(false);
    }

    function updateDay(index: number, field: string, value: any) {
        const newAvailability = [...availability];
        newAvailability[index] = { ...newAvailability[index], [field]: value };
        setAvailability(newAvailability);
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-health-text">Weekly Schedule</h3>
                    <p className="text-sm text-health-muted">Set your available hours for appointments</p>
                </div>

                <GradientButton
                    onClick={handleSave}
                    disabled={isSaving}
                    className="min-w-[120px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </GradientButton>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                {availability.map((slot, index) => {
                    // Calculate date for this day of week
                    const today = new Date();
                    const currentDay = today.getDay();
                    const daysUntil = (index + 7 - currentDay) % 7;
                    const date = new Date(today);
                    date.setDate(today.getDate() + daysUntil);

                    const dateString = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                    const isToday = daysUntil === 0;

                    return (
                        <div key={index} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border transition-all ${slot.isActive ? 'bg-white/5 border-health-border' : 'bg-transparent border-transparent opacity-50'
                            }`}>
                            <div className="w-48 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={slot.isActive}
                                    onChange={(e) => updateDay(index, 'isActive', e.target.checked)}
                                    className="w-4 h-4 rounded border-health-border text-primary-500 focus:ring-primary-500"
                                />
                                <div>
                                    <div className={`font-medium ${slot.isActive ? 'text-health-text' : 'text-health-muted'}`}>
                                        {DAYS[index]}
                                    </div>
                                    <div className="text-xs text-health-muted font-medium">
                                        {isToday ? 'Today, ' : ''}{dateString}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-1">
                                <TimeSelect
                                    value={slot.startTime}
                                    onChange={(v) => updateDay(index, 'startTime', v)}
                                    disabled={!slot.isActive}
                                />
                                <span className="text-health-muted px-2">to</span>
                                <TimeSelect
                                    value={slot.endTime}
                                    onChange={(v) => updateDay(index, 'endTime', v)}
                                    disabled={!slot.isActive}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TimeSelect({ value, onChange, disabled }: { value: string, onChange: (v: string) => void, disabled: boolean }) {
    // Generate options: 6:00 AM to 10:00 PM in 30 min intervals
    // value is in "HH:mm" 24h format

    // Helper to format to 12h
    const format12h = (time24: string) => {
        const [h, m] = time24.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const options = [];
    for (let h = 6; h <= 22; h++) {
        for (let m = 0; m < 60; m += 30) {
            const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            options.push(time24);
        }
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="input py-1.5 px-3 text-sm bg-health-card border border-health-border rounded-md focus:ring-primary-500 focus:border-primary-500 w-full md:w-32 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {options.map(t => (
                <option key={t} value={t}>
                    {format12h(t)}
                </option>
            ))}
        </select>
    );
}
