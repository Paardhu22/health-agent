// Dashboard Page
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  MessageCircle,
  Apple,
  Dumbbell,
  Calendar,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Flower2,
  Heart,
  Moon,
  Footprints,
} from 'lucide-react';
import { formatDate, formatGoal, getScoreColor, getScoreBgColor } from '@/lib/utils';
import { GradientButton } from '@/components/ui/gradient-button';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  // Redirect Doctors and Yoga Instructors to their dashboard
  if (user.role === 'DOCTOR' || user.role === 'YOGA_INSTRUCTOR') {
    // We can't use redirect() here if it's a client component, but this is a server component.
    // However, importing redirect from 'next/navigation' is required.
    // It's not imported in the original file, so we need to add it or return a redirect component.
    // The previous code had `if (!user) return null;` so it returns JSX.
    // Let's rely on middleware or client-side redirect if possible, but server redirect is better.
    // I check imports... 'next/link' is there. I need 'next/navigation'.
    // Oh wait, I can just return the redirect() result which throws an error that Next.js catches.
    const { redirect } = await import('next/navigation');
    redirect('/doctor');
  }

  // Fetch user data
  const [healthProfile, upcomingAppointments, recentMetrics, latestRecommendations] = await Promise.all([
    prisma.healthProfile.findUnique({
      where: { userId: user.id },
    }),
    prisma.appointment.findMany({
      where: {
        userId: user.id,
        status: { in: ['PENDING', 'CONFIRMED'] },
        scheduledDate: { gte: new Date() },
      },
      include: { doctor: true },
      orderBy: { scheduledDate: 'asc' },
      take: 3,
    }),
    prisma.healthMetrics.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 7,
    }),
    prisma.recommendation.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const quickActions = [
    { name: 'Chat with AI', href: '/chat', icon: MessageCircle, color: 'bg-primary-500/20 text-primary-400' },
    { name: 'Diet Plan', href: '/diet', icon: Apple, color: 'bg-green-500/20 text-green-400' },
    { name: 'Exercise', href: '/exercise', icon: Dumbbell, color: 'bg-blue-500/20 text-blue-400' },
    { name: 'Yoga', href: '/yoga', icon: Flower2, color: 'bg-purple-500/20 text-purple-400' },
    { name: 'Book Appointment', href: '/appointments', icon: Calendar, color: 'bg-orange-500/20 text-orange-400' },
    { name: 'Track Metrics', href: '/metrics', icon: Activity, color: 'bg-pink-500/20 text-pink-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-primary-100">
              {healthProfile?.isComplete
                ? 'Your personalized health dashboard is ready'
                : 'Complete your health profile for personalized recommendations'}
            </p>
          </div>
          {!healthProfile?.isComplete && (
            <GradientButton asChild className="bg-white text-primary-700 hover:bg-primary-50">
              <Link href="/profile/setup">
                Complete Profile
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </GradientButton>
          )}
        </div>
      </div>

      {/* Health Scores */}
      {healthProfile?.isComplete && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard
            icon={<Heart className="w-5 h-5" />}
            label="Overall Health"
            score={healthProfile.overallHealthScore || 0}
            color="primary"
          />
          <ScoreCard
            icon={<Activity className="w-5 h-5" />}
            label="Activity"
            score={healthProfile.activityScore || 0}
            color="blue"
          />
          <ScoreCard
            icon={<Moon className="w-5 h-5" />}
            label="Sleep"
            score={healthProfile.sleepScore || 0}
            color="purple"
          />
          <ScoreCard
            icon={<Target className="w-5 h-5" />}
            label="Stress"
            score={healthProfile.stressScore || 0}
            color="orange"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-health-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-health-muted/10 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm text-health-text text-center">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Health Profile Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-health-text">Health Profile</h2>
            <Link href="/profile" className="text-sm text-primary-600 hover:text-primary-700">
              Edit Profile
            </Link>
          </div>

          {healthProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {healthProfile.age && (
                  <ProfileItem label="Age" value={`${healthProfile.age} years`} />
                )}
                {healthProfile.gender && (
                  <ProfileItem label="Gender" value={healthProfile.gender.toLowerCase()} />
                )}
                {healthProfile.height && healthProfile.weight && (
                  <>
                    <ProfileItem label="Height" value={`${healthProfile.height} cm`} />
                    <ProfileItem label="Weight" value={`${healthProfile.weight} kg`} />
                  </>
                )}
              </div>

              {healthProfile.primaryGoal && (
                <div className="pt-4 border-t border-health-border">
                  <p className="text-sm text-health-muted mb-1">Primary Goal</p>
                  <p className="font-medium text-health-text">{formatGoal(healthProfile.primaryGoal)}</p>
                </div>
              )}

              {healthProfile.existingConditions && healthProfile.existingConditions.length > 0 && (
                <div className="pt-4 border-t border-health-border">
                  <p className="text-sm text-health-muted mb-2">Health Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {healthProfile.existingConditions.map((condition) => (
                      <span key={condition} className="badge badge-info">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-health-muted mb-4">No health profile yet</p>
              <GradientButton asChild>
                <Link href="/profile/setup">
                  Create Profile
                </Link>
              </GradientButton>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-health-text">Upcoming Appointments</h2>
            <Link href="/appointments" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-health-muted/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-health-text truncate">
                      {appointment.doctor.name}
                    </p>
                    <p className="text-sm text-health-muted">
                      {formatDate(appointment.scheduledDate)} at {appointment.scheduledTime}
                    </p>
                  </div>
                  <span className={`badge ${appointment.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'
                    }`}>
                    {appointment.status.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-health-muted mb-4">No upcoming appointments</p>
              <GradientButton asChild>
                <Link href="/appointments">
                  Book Appointment
                </Link>
              </GradientButton>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentMetrics.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-health-text">Recent Health Metrics</h2>
            <Link href="/metrics" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentMetrics[0]?.weight && (
              <MetricCard
                icon={<Activity className="w-5 h-5" />}
                label="Weight"
                value={`${recentMetrics[0].weight} kg`}
                trend={getTrend(recentMetrics, 'weight')}
              />
            )}
            {recentMetrics[0]?.sleepHours && (
              <MetricCard
                icon={<Moon className="w-5 h-5" />}
                label="Sleep"
                value={`${recentMetrics[0].sleepHours} hrs`}
                trend={getTrend(recentMetrics, 'sleepHours')}
              />
            )}
            {recentMetrics[0]?.stepsCount && (
              <MetricCard
                icon={<Footprints className="w-5 h-5" />}
                label="Steps"
                value={recentMetrics[0].stepsCount.toLocaleString()}
                trend={getTrend(recentMetrics, 'stepsCount')}
              />
            )}
            {recentMetrics[0]?.waterIntake && (
              <MetricCard
                icon={<Activity className="w-5 h-5" />}
                label="Water"
                value={`${recentMetrics[0].waterIntake} L`}
                trend={getTrend(recentMetrics, 'waterIntake')}
              />
            )}
          </div>
        </div>
      )}

      {/* AI Assistant CTA */}
      <div className="card bg-gradient-to-r from-accent-600 to-accent-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white">
            <h2 className="text-xl font-bold mb-1">Need Health Advice?</h2>
            <p className="text-accent-100">
              Chat with our AI health assistant for personalized guidance
            </p>
          </div>
          <GradientButton asChild className="bg-white text-accent-700 hover:bg-accent-50">
            <Link href="/chat">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chat
            </Link>
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  icon,
  label,
  score,
  color
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} bg-opacity-10 flex items-center justify-center`}>
          <span className={`${colorMap[color].replace('bg-', 'text-')}`}>{icon}</span>
        </div>
        <span className="text-sm text-health-muted">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-health-text">{Math.round(score)}</span>
        <span className="text-sm text-health-muted mb-1">/100</span>
      </div>
      <div className="mt-2 progress-bar">
        <div
          className={`progress-fill ${colorMap[color]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-health-muted">{label}</p>
      <p className="font-medium text-health-text capitalize">{value}</p>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable' | null;
}) {
  return (
    <div className="p-4 rounded-lg bg-health-muted/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-health-muted">{icon}</span>
        {trend && (
          <span className={`${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'
            }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
              trend === 'down' ? <TrendingDown className="w-4 h-4" /> :
                <Minus className="w-4 h-4" />}
          </span>
        )}
      </div>
      <p className="text-lg font-semibold text-health-text">{value}</p>
      <p className="text-sm text-health-muted">{label}</p>
    </div>
  );
}

function getTrend(metrics: any[], field: string): 'up' | 'down' | 'stable' | null {
  const values = metrics.map(m => m[field]).filter(v => v !== null && v !== undefined);
  if (values.length < 2) return null;

  const diff = values[0] - values[values.length - 1];
  if (Math.abs(diff) < 0.01 * values[0]) return 'stable';
  return diff > 0 ? 'up' : 'down';
}
