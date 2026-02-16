'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    id: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[] | string[];
    placeholder?: string;
    className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder, className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize options to object array
    const normalizedOptions: Option[] = options.map(opt =>
        typeof opt === 'string' ? { id: opt, label: opt } : opt
    );

    const selectedOption = normalizedOptions.find(opt => opt.id === value);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group inline-flex items-center gap-1 border-b-2 border-primary-300 hover:border-primary-500 text-primary-600 dark:text-primary-400 font-medium transition-colors px-1 py-0.5 focus:outline-none"
            >
                <span className="text-2xl md:text-4xl">{selectedOption?.label || placeholder || 'Select'}</span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 opacity-50 group-hover:opacity-100",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max min-w-[200px] max-w-[300px] bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 max-h-[300px] overflow-y-auto"
                        style={{ scrollbarWidth: 'thin' }} // Firefox scrollbar styling
                    >
                        {normalizedOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-base md:text-lg transition-colors flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                                    value === option.id ? "text-primary-600 font-medium bg-primary-50 dark:bg-primary-900/10" : "text-health-text"
                                )}
                            >
                                <span>{option.label}</span>
                                {value === option.id && <Check className="w-4 h-4 text-primary-600" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
