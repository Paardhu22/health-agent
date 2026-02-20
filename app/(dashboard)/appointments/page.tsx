'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDoctors,
  getDoctorAvailability,
  extractAppointmentFromText,
  createAppointment,
  getUserAppointments,
  cancelAppointment
} from '@/lib/actions/appointments';
import { formatDate, formatTime } from '@/lib/utils';
import {
  Calendar,
  Clock,
  User,
  Star,
  MessageCircle,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Phone,
  IndianRupee,
  AlertCircle,
  History,
  ShieldCheck,
  CalendarDays,
  Video
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { DoctorPatientChat } from '@/components/chat/DoctorPatientChat';
import { getUser } from '@/lib/actions/auth';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'book'>('book');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [category, setCategory] = useState<'all' | 'doctors' | 'instructors'>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nlInput, setNlInput] = useState('');
  const [nlExtraction, setNlExtraction] = useState<any>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [reason, setReason] = useState('');

  // Chat state
  const [activeChat, setActiveChat] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    getUser().then(user => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  const loadAvailability = useCallback(async () => {
    if (!selectedDoctor) return;
    setIsLoading(true);
    const result = await getDoctorAvailability(
      selectedDoctor.id,
      format(selectedDate, 'yyyy-MM-dd')
    );
    if (result.success) {
      setAvailableSlots(result.data?.slots || []);
    }
    setIsLoading(false);
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailability();
    }
  }, [selectedDoctor, selectedDate, loadAvailability]);

  async function loadData() {
    const [doctorsResult, appointmentsResult] = await Promise.all([
      getDoctors(),
      getUserAppointments(),
    ]);

    if (doctorsResult.success) setDoctors(doctorsResult.data || []);
    if (appointmentsResult.success) setAppointments(appointmentsResult.data || []);
  }

  async function handleNLExtraction() {
    if (!nlInput.trim()) return;
    setIsExtracting(true);
    const result = await extractAppointmentFromText(nlInput);
    if (result.success) {
      setNlExtraction(result.data);
      if (result.data.doctor) setSelectedDoctor(result.data.doctor);
      if (result.data.date) setSelectedDate(new Date(result.data.date));
      if (result.data.time) setSelectedTime(result.data.time);
    }
    setIsExtracting(false);
  }

  async function handleBookAppointment() {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('doctorId', selectedDoctor.id);
    formData.append('scheduledDate', format(selectedDate, 'yyyy-MM-dd'));
    formData.append('scheduledTime', selectedTime);
    formData.append('reason', reason);
    if (nlInput) {
      formData.append('originalQuery', nlInput);
      formData.append('extractedIntent', nlExtraction?.intent || '');
    }

    const result = await createAppointment(formData);
    if (result.success) {
      setBookingSuccess(true);
      loadData();
      setTimeout(() => {
        setView('list');
        setBookingSuccess(false);
        setSelectedDoctor(null);
        setSelectedTime(null);
        setNlInput('');
        setNlExtraction(null);
        setReason('');
      }, 2000);
    }
    setIsLoading(false);
  }

  async function handleCancelAppointment(appointmentId: string) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await cancelAppointment(appointmentId);
    loadData();
  }

  const filteredDoctors = doctors.filter(doc => {
    if (category === 'all') return true;
    if (category === 'doctors') return doc.specialization !== 'Yoga Instructor';
    if (category === 'instructors') return doc.specialization === 'Yoga Instructor';
    return true;
  });

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="max-w-7xl mx-auto pb-20 lg:pb-12 animate-fadeIn bg-black min-h-screen text-zinc-100 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Appointments</h1>
          <p className="text-zinc-500 font-medium">Book consultations with top-rated specialists</p>
        </div>

        <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setView('book')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
              view === 'book' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Book Session
          </button>
          <button
            onClick={() => setView('list')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
              view === 'list' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            My Schedule
          </button>
        </div>
      </div>

      {view === 'book' ? (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Column 1: Smart Booking */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary-600/10 text-primary-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">Smart Booking</h3>
              </div>
              <p className="text-sm text-zinc-500 mb-4">Tell us who you want to meet and when. We&apos;ll handle the rest.</p>
              <textarea
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="e.g., Book an appointment with Dr. Sharma tomorrow morning"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all resize-none mb-4"
                rows={3}
              />
              <GradientButton
                variant="variant"
                onClick={handleNLExtraction}
                disabled={!nlInput.trim() || isExtracting}
                className="w-full h-auto py-3 min-w-0"
              >
                {isExtracting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                {isExtracting ? 'Analyzing...' : 'Extract Details'}
              </GradientButton>

              {nlExtraction && (
                <div className="mt-4 p-4 rounded-2xl bg-primary-950/20 border border-primary-900/30 animate-fadeIn">
                  <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-2">Analysis Result</p>
                  <div className="space-y-1 text-sm text-zinc-300">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-400" /> {nlExtraction.date || 'TBD'}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" /> {nlExtraction.time || 'TBD'}</p>
                    <p className="flex items-center gap-2"><User className="w-4 h-4 text-primary-400" /> {nlExtraction.doctorName || 'TBD'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Doctor List / Details & Booking */}
          <div className="lg:col-span-8 space-y-6">
            {selectedDoctor ? (
              <div className="animate-slideUp space-y-6">
                {/* Back button to go back to list */}
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to specialists
                </button>

                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-0.5 shadow-2xl">
                    <div className="w-full h-full rounded-2xl bg-zinc-950 flex items-center justify-center text-3xl font-bold text-white">
                      {selectedDoctor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-3xl font-black text-white">{selectedDoctor.name}</h2>
                      <span className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{selectedDoctor.specialization}</span>
                    </div>
                    <p className="text-zinc-400 font-medium mb-4">{selectedDoctor.qualification}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <div>
                          <p className="text-lg font-bold leading-tight">{selectedDoctor.rating}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Rating</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-primary-500" />
                        <div>
                          <p className="text-lg font-bold leading-tight">₹{selectedDoctor.consultationFee}</p>
                          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Fee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary-500" />
                        Select Date
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                        return (
                          <button
                            key={day.toISOString()}
                            onClick={() => !isPast && setSelectedDate(day)}
                            disabled={isPast}
                            className={cn(
                              "h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border font-bold text-sm",
                              isSelected
                                ? "bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/20"
                                : isPast
                                  ? "bg-transparent border-transparent text-zinc-800 cursor-not-allowed"
                                  : "bg-zinc-950/30 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                            )}
                          >
                            <span className="text-[10px] uppercase font-black mb-1">{format(day, 'EEE')[0]}</span>
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                    <h3 className="font-bold flex items-center gap-2 mb-6">
                      <Clock className="w-5 h-5 text-primary-500" />
                      Available Slots
                    </h3>
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-32 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500 opacity-20" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={cn(
                              "py-3 rounded-xl text-center text-sm font-bold transition-all border",
                              selectedTime === slot.time
                                ? "bg-primary-600 border-primary-500 text-white shadow-xl"
                                : slot.available
                                  ? "bg-zinc-950/30 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50"
                                  : "bg-transparent border-zinc-900/50 text-zinc-800 line-through cursor-not-allowed"
                            )}
                          >
                            {formatTime(slot.time)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-600 text-center py-12">No available slots</p>
                    )}
                  </div>
                </div>

                {selectedTime && (
                  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 shadow-2xl animate-slideUp">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold">Booking Details</h3>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          placeholder="Reason for visit..."
                          rows={4}
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        {bookingSuccess ? (
                          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-center">
                            Booking Confirmed!
                          </div>
                        ) : (
                          <GradientButton
                            variant="default"
                            onClick={handleBookAppointment}
                            disabled={isLoading}
                            className="w-full py-4 h-auto"
                          >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Booking'}
                          </GradientButton>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Doctor List - shown when no doctor is selected */
              <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold mb-2">Select a Doctor</h3>
                <p className="text-sm text-zinc-500 mb-6">Pick a specialist to view their availability and book your session.</p>

                <div className="flex bg-zinc-950/50 rounded-xl p-1 mb-6 border border-zinc-800">
                  {['all', 'doctors', 'instructors'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat as any)}
                      className={cn(
                        "flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all",
                        category === cat ? "bg-zinc-800 text-white" : "text-zinc-600 hover:text-zinc-400"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className="w-full p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-800/30 hover:border-zinc-700 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 group-hover:bg-zinc-700 transition-colors">
                            {doctor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between gap-2 overflow-hidden">
                            <p className="font-bold text-sm truncate">{doctor.name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">₹{doctor.consultationFee}</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-medium truncate">{doctor.specialization}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          {appointments.length > 0 ? (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={appointment.status !== 'CANCELLED' ? () => handleCancelAppointment(appointment.id) : undefined}
                  onChat={appointment.status !== 'CANCELLED' ? () => setActiveChat({ id: appointment.doctor.id, name: appointment.doctor.name }) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-900/20 rounded-[40px] border border-dashed border-zinc-800">
              <Calendar className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">No Appointments Found</h3>
              <GradientButton onClick={() => setView('book')} className="mt-6 py-3 px-8 h-auto">
                Book Now
              </GradientButton>
            </div>
          )}
        </div>
      )}

      {activeChat && currentUserId && (
        <DoctorPatientChat
          recipientId={activeChat.id}
          recipientName={activeChat.name}
          recipientRole="doctor"
          currentUserId={currentUserId}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
  onChat
}: {
  appointment: any;
  onCancel?: () => void;
  onChat?: () => void;
}) {
  const statusConfig: Record<string, string> = {
    PENDING: 'text-amber-400 bg-amber-400/10',
    CONFIRMED: 'text-green-400 bg-green-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
    COMPLETED: 'text-zinc-400 bg-zinc-400/10',
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 flex items-center gap-5 transition-all hover:bg-zinc-800/40">
      <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300">
        {appointment.doctor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-white truncate">{appointment.doctor.name}</p>
          <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md", statusConfig[appointment.status] || statusConfig.PENDING)}>
            {appointment.status}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mb-3">{appointment.doctor.specialization}</p>
        <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(appointment.scheduledDate)}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatTime(appointment.scheduledTime)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {appointment.status === 'CONFIRMED' && appointment.meetingId && (
          <Link
            href={`/appointments/call/${appointment.meetingId}`}
            className="flex items-center gap-2 px-4 py-3 bg-primary-600/20 border border-primary-500/30 text-primary-400 rounded-xl hover:bg-primary-600 hover:text-white transition-all group shadow-lg shadow-primary-500/10"
          >
            <Video className="w-4 h-4 group-hover:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Join Call</span>
          </Link>
        )}
        {onChat && (
          <button onClick={onChat} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5">
            <MessageCircle className="w-4 h-4" />
          </button>
        )}
        {onCancel && (
          <button onClick={onCancel} className="p-3 bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white rounded-xl transition-all border border-white/5">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
