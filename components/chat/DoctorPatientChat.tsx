'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Trash2, X, RefreshCw, Check, CheckCheck, Loader2 } from 'lucide-react';
import { sendDoctorPatientMessage, getDoctorPatientMessages, unsendDoctorPatientMessage, markMessagesAsRead } from '@/lib/actions/chat-p2d';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
    recipientId: string;
    recipientName: string;
    recipientRole: 'doctor' | 'patient';
    currentUserId: string;
    onClose: () => void;
}

export function DoctorPatientChat({ recipientId, recipientName, recipientRole, currentUserId, onClose }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isDoctorViewer = recipientRole === 'patient';

    const loadMessages = useCallback(async () => {
        const result = await getDoctorPatientMessages(recipientId, isDoctorViewer);
        if (result.success && result.data) {
            setMessages(result.data);
            setIsLoading(false);
        }
    }, [recipientId, isDoctorViewer]);

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [recipientId, loadMessages]);

    useEffect(() => {
        if (messages.length > 0) {
            const hasUnread = messages.some(m => m.senderId !== currentUserId && !m.isRead);
            if (hasUnread) {
                markMessagesAsRead(recipientId, isDoctorViewer);
            }
        }
    }, [messages, recipientId, currentUserId, isDoctorViewer]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function handleSend() {
        if (!newMessage.trim() || isSending) return;
        setIsSending(true);

        const result = await sendDoctorPatientMessage(recipientId, newMessage, isDoctorViewer);
        if (result.success) {
            setNewMessage('');
            loadMessages();
        }
        setIsSending(false);
    }

    async function handleUnsend(messageId: string) {
        if (confirm('Unsend this message?')) {
            await unsendDoctorPatientMessage(messageId);
            loadMessages();
        }
    }

    function scrollToBottom() {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="flex flex-col h-[600px] w-full max-w-sm sm:max-w-md bg-zinc-950/90 border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden fixed bottom-6 right-6 z-50 backdrop-blur-3xl"
        >
            {/* HUD Header */}
            <div className="relative p-6 bg-gradient-to-b from-primary-500/20 to-transparent border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 p-0.5">
                                <div className="w-full h-full rounded-[0.9rem] bg-zinc-950 flex items-center justify-center text-primary-400 font-black">
                                    {recipientName[0].toUpperCase()}
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-zinc-950" />
                        </div>
                        <div>
                            <h3 className="font-black text-white text-sm tracking-tight">{recipientName}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                                    {recipientRole === 'doctor' ? 'Professional' : 'Patient'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadMessages}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" ref={scrollRef}>
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary-500/50" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Syncing Secure Channel</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center opacity-40">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                                <Send className="w-6 h-6 text-zinc-600" />
                            </div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Encrypted Conversation Started</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.senderId === currentUserId;
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: isMe ? 20 : -20, y: 10 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn("flex flex-col", isMe ? "items-end" : "items-start")}
                                >
                                    <div className={cn(
                                        "max-w-[85%] rounded-[1.5rem] px-5 py-4 relative group transition-all duration-300 shadow-xl",
                                        isMe
                                            ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-tr-none border border-primary-400/20"
                                            : "bg-white/[0.03] border border-white/5 text-zinc-300 rounded-tl-none backdrop-blur-xl"
                                    )}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>

                                        <div className={cn(
                                            "mt-2 flex items-center gap-2",
                                            isMe ? "justify-end text-primary-200" : "justify-start text-zinc-600"
                                        )}>
                                            <span className="text-[9px] font-black uppercase tracking-widest tabular-nums">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {isMe && (
                                                <div className="flex items-center gap-1.5 border-l border-white/20 pl-2">
                                                    {msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                                    <button
                                                        onClick={() => handleUnsend(msg.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-all hover:text-red-400 active:scale-75"
                                                        title="Unsend"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Premium Input Bar */}
            <div className="p-6 bg-zinc-950 border-t border-white/5">
                <div className="relative flex items-center gap-3">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Compose message..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-5 pr-12 py-4 text-sm text-white focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.04] transition-all placeholder:text-zinc-600 font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">AES-256</span>
                        </div>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:scale-90 disabled:opacity-30",
                            newMessage.trim()
                                ? "bg-primary-500 shadow-[0_8px_20px_-6px_rgba(59,130,246,0.5)] text-white"
                                : "bg-white/5 text-zinc-600 border border-white/5"
                        )}
                    >
                        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
