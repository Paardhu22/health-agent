import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Utensils,
  Dumbbell,
  MoveRight,
  Activity
} from 'lucide-react';

import { ProfileSidebar } from '@/components/dashboard/ProfileSidebar';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Redirect Doctors/Instructors
  if (user.role === 'DOCTOR' || user.role === 'YOGA_INSTRUCTOR') {
    const { redirect } = await import('next/navigation');
    redirect('/doctor');
  }

  // Fetch data
  const [healthProfile, upcomingAppointments, recentMetrics, activeRecommendations] = await Promise.all([
    prisma.healthProfile.findUnique({ where: { userId: user.id } }),
    prisma.appointment.findMany({
      where: {
        userId: user.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledDate: { gte: new Date() },
      },
      include: { doctor: true },
      orderBy: { scheduledDate: 'asc' },
      take: 2,
    }),
    prisma.healthMetrics.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 1,
    }),
    prisma.recommendation.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeOfDay = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  // Calculate Focus Metric (Fallback to 0 if incomplete)
  const healthScore = healthProfile?.overallHealthScore || 0;

  return (
    <div className="relative pb-24">
      {/* 2-Column Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* Left Column: Feed (Span 2) */}
        <div className="lg:col-span-2 space-y-12">

          {/* 1. Header & AI Input */}
          <div className="space-y-6">
            <div>
              <p className="text-zinc-500 font-medium text-sm uppercase tracking-wider mb-1">{today}</p>
              <h1 className="text-3xl font-light text-health-text">
                {timeOfDay}, <span className="font-semibold">{user.name.split(' ')[0]}</span>.
              </h1>
            </div>

            {/* Minimalist AI Input Trigger */}
            <Link href="/chat" className="block group">
              <div className="bg-white/5 border border-zinc-200/20 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-primary-500/50 transition-all shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-zinc-400 font-light">How are you feeling today?</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  <MoveRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* 2. Focus Metrics (Row) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-zinc-500">Daily Score</span>
                <Activity className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-4xl font-bold text-health-text">{Math.round(healthScore)}</div>
                <div className="text-xs text-zinc-500 mt-1">
                  {healthScore > 80 ? 'Excellent' : 'Keep going'}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-zinc-500">Active Calories</span>
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-4xl font-bold text-health-text">
                  {recentMetrics[0]?.activeCalories || 0}
                </div>
                <div className="text-xs text-zinc-500 mt-1">kcal burned</div>
              </div>
            </div>
          </div>

          {/* 3. The Feed (Timeline) */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-health-text">Up Next</h2>

            <div className="relative border-l-2 border-zinc-100 dark:border-zinc-800 ml-3 space-y-8 pl-8 py-2">

              {/* Appointments */}
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-white dark:border-black flex items-center justify-center">
                    <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                      {new Date(apt.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <h3 className="text-base font-medium text-health-text">{apt.doctor.name}</h3>
                    <p className="text-sm text-zinc-500">{apt.type} Appointment</p>
                  </div>
                </div>
              ))}

              {/* Recommendations (Diet/Exercise) - Formatting Fixed */}
              {activeRecommendations.map((rec, i) => {
                const { details, title } = parseRecommendation(rec.content, rec.type);

                return (
                  <div key={rec.id} className="relative">
                    <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-2 border-white dark:border-black flex items-center justify-center
                                    ${rec.type === 'DIET' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
                      {rec.type === 'DIET' ?
                        <Utensils className="w-3 h-3 text-green-600 dark:text-green-400" /> :
                        <Dumbbell className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      }
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide
                                        ${rec.type === 'DIET' ? 'text-green-500' : 'text-purple-500'}`}>
                        {rec.type === 'DIET' ? 'Meal Plan' : 'Workout'}
                      </span>

                      {/* Clean Card Display */}
                      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
                        <h4 className="font-medium text-health-text mb-2 text-sm">{title}</h4>
                        <div className="space-y-1">
                          {details.map((line, idx) => (
                            <p key={idx} className="text-xs text-zinc-500 flex items-start gap-2">
                              <span className="opacity-50">•</span> {line}
                            </p>
                          ))}
                        </div>
                        <Link href={rec.type === 'DIET' ? '/diet' : '/exercise'} className="text-xs font-medium text-primary-600 mt-3 inline-block hover:underline">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* "Log Steps" Generic Prompt */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-black flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-zinc-400" />
                </div>
                <div className="flex flex-col gap-1 opacity-60">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Anytime</span>
                  <h3 className="text-base font-medium text-health-text">Log your steps</h3>
                  <Link href="/metrics" className="text-xs text-primary-600 hover:underline">
                    Add data +
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Profile Sidebar (Span 1) */}
        <div className="hidden lg:block">
          <ProfileSidebar user={user} healthProfile={healthProfile} />
        </div>

      </div>

    </div>
  );
}

// Helper to clean up the unstructured data
function parseRecommendation(content: any, type: string) {
  let rawString = '';

  // Handle if content is object or string
  if (typeof content === 'string') {
    rawString = content;
  } else if (typeof content === 'object') {
    // Try to find meaningful string in object
    rawString = JSON.stringify(content);
  }

  // Default Fallback
  let title = type === 'DIET' ? 'Daily Nutrition Plan' : 'Recommended Activity';
  let details = ['View details for full plan'];

  // Heuristic Parsing for "dietPlan:macros:..." style strings
  if (rawString.includes('dietPlan') || rawString.includes('macros')) {
    const parts = rawString.split(',');
    details = parts.slice(0, 3).map(p => p.replace(/"/g, '').replace(/[{}]/g, '').trim());
  }

  // Heuristic for Workout objects
  if (type === 'EXERCISE' && rawString.includes('exercises')) {
    try {
      // Attempt to extract exercise names if JSON
      const obj = typeof content === 'object' ? content : JSON.parse(rawString);
      if (obj.workoutName) title = obj.workoutName;
      if (Array.isArray(obj.exercises)) {
        details = obj.exercises.slice(0, 3).map((e: any) => `${e.name} (${e.sets}x${e.reps})`);
      }
    } catch (e) {
      // Fallback
      details = rawString.split(',').slice(0, 3).map(s => s.replace(/["{}]/g, '').trim());
    }
  }

  // Clean up ugly prefixes like "dietPlan:macros:"
  details = details.map(d => d.replace(/dietPlan:|macros:|calories:/gi, '').trim());

  return { title, details };
}
