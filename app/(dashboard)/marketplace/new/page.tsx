'use client';

import { ProductForm } from '@/components/marketplace/ProductForm';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NewProductPage() {
    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fadeIn">
            <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>

            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 md:p-12 backdrop-blur-3xl mb-12">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">Create <span className="text-primary-400">New Product</span></h1>
                    <p className="text-zinc-500 mt-2 text-lg">Detail your health solution and share it with the community.</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl"
            >
                <ProductForm />
            </motion.div>
        </div>
    );
}
