'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMarketplaceProducts } from '@/lib/actions/marketplace';
import { useCart } from '@/components/providers/CartProvider';
import { Search, ShoppingBag, ShoppingCart, Filter, ArrowRight } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    'All',
    'Supplements',
    'Equipment',
    'Books',
    'Yoga Mats',
    'Nutrition',
    'Courses',
    'Other'
];

export function MarketplaceCatalog() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const { addToCart, cartCount, isOpen, setIsOpen } = useCart();

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        const result = await getMarketplaceProducts(category, search);
        if (result.success && result.data) {
            setProducts(result.data);
        }
        setIsLoading(false);
    }, [category, search]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Header section with fancy glassmorphism */}
            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/50 border border-white/5 p-8 md:p-12 backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Premium Health Store
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Health Journey</span>
                        </h1>
                        <p className="text-zinc-400 mt-4 text-lg font-medium">
                            Curated elite-grade supplements, equipment, and courses from certified health professionals.
                        </p>
                    </div>

                    <div className="w-full md:w-80 space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-hover:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-zinc-600 font-medium"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/[0.05] transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-white">Cart</span>
                                </div>
                                <span className="w-6 h-6 rounded-lg bg-primary-500 text-white text-[10px] font-black flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex items-center gap-2 px-4 py-2 pr-6 border-r border-white/5 shrink-0">
                    <Filter className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Filter</span>
                </div>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            "px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 border",
                            category === cat
                                ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20"
                                : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content section */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-zinc-900/50 border border-white/5 animate-pulse" />
                        ))}
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-32 flex flex-col items-center justify-center text-center space-y-6"
                    >
                        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                            <Search className="w-10 h-10 text-zinc-800" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">No items found</h3>
                            <p className="text-zinc-500 mt-2 max-w-sm">We couldn't find any products matching your search criteria. Try a different category or keywords.</p>
                        </div>
                        <button
                            onClick={() => { setCategory('All'); setSearch(''); }}
                            className="text-primary-400 font-bold hover:text-primary-300 transition-colors flex items-center gap-2 group"
                        >
                            Reset all filters <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {products.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-4 hover:bg-zinc-900 transition-all duration-500 shadow-2xl hover:shadow-primary-500/5 hover:border-primary-500/20"
                            >
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-zinc-800">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                                const fallback = document.createElement('div');
                                                fallback.className = 'w-full h-full flex items-center justify-center bg-zinc-800';
                                                fallback.innerHTML = '<svg class="w-16 h-16 text-zinc-700 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
                                                target.parentElement!.appendChild(fallback);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-16 h-16 text-zinc-700 opacity-20" />
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                                            {product.category}
                                        </div>
                                    </div>

                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                                            <span className="text-white font-black px-6 py-2 rounded-full border-2 border-red-500/50 text-xs uppercase tracking-widest bg-red-500/10">Out of Stock</span>
                                        </div>
                                    )}

                                    {/* Quick add overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black via-black/80 to-transparent">
                                        <GradientButton
                                            disabled={product.stock <= 0}
                                            onClick={() => addToCart(product)}
                                            className="w-full py-4 h-auto rounded-2xl text-xs"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Express Buy
                                        </GradientButton>
                                    </div>
                                </div>

                                <div className="px-2 space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-primary-400 transition-colors uppercase tracking-tight">{product.title}</h3>
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">by {product.seller.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                            <span className="text-xl font-black text-white">{formatCurrency(product.price)}</span>
                                        </div>
                                        {product.stock > 0 && product.stock < 5 && (
                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">Only {product.stock} left</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
