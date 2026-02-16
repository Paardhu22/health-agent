'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from '@/lib/actions/auth';
import { getInitials } from '@/lib/utils';
import { Bell, ChevronDown, User, Settings, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { useRouter } from 'next/navigation';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/actions/notification';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UserCapsuleProps {
    user: {
        name: string;
        email: string;
        healthProfile?: {
            isComplete: boolean;
        } | null;
    };
}

export function UserCapsule({ user }: UserCapsuleProps) {
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const result = await getNotifications();
        if (result.success && result.data) {
            const serverNotifications = result.data.map((n: any) => ({
                ...n,
                time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: n.isRead
            }));

            setNotifications(serverNotifications);
            setUnreadCount(result.data.filter((n: any) => !n.isRead).length);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        await markAllNotificationsAsRead();
        router.refresh();
    };

    return (
        <div className="fixed top-6 right-8 z-[100] flex items-center gap-3">
            {/* Notifications Capsule */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={cn(
                        "h-12 px-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 border backdrop-blur-xl shadow-lg",
                        showNotifications
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-zinc-900/80 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                    )}
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white ring-2 ring-black">
                            {unreadCount}
                        </span>
                    )}
                </motion.button>

                <AnimatePresence>
                    {showNotifications && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/20"
                                onClick={() => setShowNotifications(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-zinc-950/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 z-50 overflow-hidden"
                            >
                                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                    <h3 className="font-bold text-white">Notifications</h3>
                                    <span className="text-xs text-primary-400 font-bold bg-primary-400/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center">
                                                <Bell className="w-6 h-6 text-zinc-700" />
                                            </div>
                                            <p className="text-zinc-500 text-sm">All clear! No new notifications.</p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => {
                                                    markNotificationAsRead(notification.id);
                                                    setShowNotifications(false);
                                                }}
                                                className={cn(
                                                    "p-4 hover:bg-white/[0.03] transition-colors border-b border-white/5 last:border-0 cursor-pointer flex gap-4",
                                                    !notification.read && "bg-primary-500/5"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                    notification.type === 'SUCCESS' ? "bg-green-500/10 text-green-500" :
                                                        notification.type === 'WARNING' ? "bg-amber-500/10 text-amber-500" :
                                                            "bg-primary-500/10 text-primary-400"
                                                )}>
                                                    {notification.type === 'SUCCESS' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h4 className={cn("text-sm font-semibold truncate", !notification.read ? "text-white" : "text-zinc-400")}>{notification.title}</h4>
                                                        <span className="text-[10px] text-zinc-600 font-medium shrink-0">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{notification.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 bg-zinc-900/50 backdrop-blur-md">
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="w-full text-center text-xs text-zinc-400 font-bold hover:text-white transition-colors py-2 bg-white/5 rounded-xl border border-white/5"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Profile Capsule */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={cn(
                        "h-12 pl-1.5 pr-4 rounded-full flex items-center gap-3 transition-all duration-300 border backdrop-blur-xl shadow-lg",
                        showUserMenu
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-zinc-900/80 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                    )}
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 p-[1px]">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-[13px] font-bold text-white">
                            {getInitials(user.name)}
                        </div>
                    </div>
                    <span className="text-sm font-bold truncate max-w-[100px] hidden sm:block">{user.name.split(' ')[0]}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showUserMenu && "rotate-180")} />
                </motion.button>

                <AnimatePresence>
                    {showUserMenu && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40 bg-black/20"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-64 bg-zinc-950/90 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/10 z-50 p-2 overflow-hidden"
                            >
                                <div className="px-5 py-4 mb-2">
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest mb-1">Account</p>
                                    <p className="font-bold text-white truncate">{user.name}</p>
                                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                                </div>

                                <div className="space-y-1 px-1">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                            <User className="w-4 h-4" />
                                        </div>
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        Settings
                                    </Link>
                                </div>

                                <div className="mt-4 p-2 bg-white/5 rounded-2xl">
                                    <form action={signOut}>
                                        <GradientButton
                                            variant="variant"
                                            className="w-full text-xs py-3 h-auto min-w-0 shadow-none hover:shadow-none"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Sign Out
                                        </GradientButton>
                                    </form>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
