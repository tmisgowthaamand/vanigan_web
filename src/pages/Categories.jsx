import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/categories';

// Category tile with a real business image cover and themed-icon fallback.
const CategoryTile = ({ cat, index }) => {
    const Icon = cat.icon;
    const [imgOk, setImgOk] = useState(Boolean(cat.image));

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.4) }}
        >
            <Link
                to={`/business-list?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col h-full rounded-2xl border border-rule bg-raised overflow-hidden transition-all duration-300 hover:border-kinpaku/50 hover:-translate-y-1"
            >
                <div className="relative h-32 bg-lacquer-deep overflow-hidden">
                    {imgOk ? (
                        <img
                            src={cat.image}
                            alt={cat.name}
                            loading="lazy"
                            onError={() => setImgOk(false)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: cat.accent }}>
                            <Icon size={36} />
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-lacquer-deep/70 to-transparent" />
                </div>
                <div className="p-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="text-[14px] font-semibold text-champagne leading-tight line-clamp-2 mb-1 group-hover:text-kinpaku transition-colors">
                            {cat.name}
                        </h3>
                        <p className="text-[12px] text-muted font-medium tabular-nums">
                            {cat.count.toLocaleString()} listings
                        </p>
                    </div>
                    <ChevronRight size={16} className="text-faint group-hover:text-kinpaku group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                </div>
            </Link>
        </motion.div>
    );
};

const Categories = () => {
    const [filter, setFilter] = useState('');

    const shown = categories.filter(c =>
        c.name.toLowerCase().includes(filter.trim().toLowerCase())
    );

    return (
        <main className="min-h-screen bg-lacquer pt-28 pb-24" style={{ fontFamily: 'var(--ks-font-body)' }}>
            <div className="max-w-[1320px] mx-auto px-6">

                <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-kinpaku transition-colors mb-6">
                    <ArrowLeft size={16} /> Back
                </Link>

                <div className="mb-10">
                    <p className="ks-eyebrow mb-3">Directory</p>
                    <h1 className="ks-display text-[36px] md:text-[48px] leading-[1.05] text-champagne mb-3" style={{ fontWeight: 600 }}>
                        All Categories
                    </h1>
                    <p className="text-[16px] text-muted font-normal">
                        Browse all {categories.length} business categories across Tamil Nadu.
                    </p>
                </div>

                <div className="relative max-w-md mb-12">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter categories…"
                        className="w-full bg-raised border border-rule rounded-xl py-3.5 pl-11 pr-4 text-[14px] font-medium text-champagne outline-none focus:border-kinpaku/50 focus:ring-4 focus:ring-kinpaku/10 transition-all placeholder:text-faint shadow-sm"
                    />
                </div>

                {shown.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {shown.map((cat, i) => (
                            <CategoryTile key={cat.name} cat={cat} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-raised rounded-[20px] border border-rule">
                        <p className="text-faint font-medium text-[15px]">No categories match “{filter}”.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Categories;
