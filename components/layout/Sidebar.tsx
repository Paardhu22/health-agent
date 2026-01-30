// Sidebar Component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import {
  Heart,
  LayoutDashboard,
  MessageCircle,
  Apple,
  Dumbbell,
  Activity,
  Calendar,
  User,
  BarChart3,
  Target,
  LogOut,
  Settings,
  Stethoscope,
  Flower2,
} from 'lucide-react';

interface SidebarProps {
  user: {
    name: string;
    email: string;
    healthProfile?: {
      isComplete: boolean;
    } | null;
  };
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Health Chat', href: '/chat', icon: MessageCircle },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Diet Plan', href: '/diet', icon: Apple },
  { name: 'Exercise', href: '/exercise', icon: Dumbbell },
  { name: 'Yoga', href: '/yoga', icon: Flower2 },
  { name: 'Health Assessment', href: '/assessment', icon: BarChart3 },
  { name: 'Disease Management', href: '/conditions', icon: Stethoscope },
  { name: 'Goal Planner', href: '/goals', icon: Target },
  { name: 'Health Metrics', href: '/metrics', icon: Activity },
];

const bottomNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-health-border px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-health-text">Health Agent</span>
          </div>

          {/* Profile Completion Warning */}
          {!user.healthProfile?.isComplete && (
            <Link
              href="/profile/setup"
              className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-amber-800 text-sm hover:bg-amber-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                <User className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <div className="font-medium">Complete Profile</div>
                <div className="text-xs text-amber-600">For personalized advice</div>
              </div>
            </Link>
          )}

          {/* Main Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={isActive ? 'nav-link-active' : 'nav-link'}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Bottom Navigation */}
            <ul role="list" className="mt-auto space-y-1 border-t border-health-border pt-4">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={isActive ? 'nav-link-active' : 'nav-link'}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="nav-link w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-health-border">
        <div className="flex justify-around py-2">
          {[
            { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Chat', href: '/chat', icon: MessageCircle },
            { name: 'Diet', href: '/diet', icon: Apple },
            { name: 'Exercise', href: '/exercise', icon: Dumbbell },
            { name: 'Profile', href: '/profile', icon: User },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  isActive ? 'text-primary-600' : 'text-health-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
