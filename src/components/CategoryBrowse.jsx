import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/categories';

// A single category card: real business image as the cover, themed icon as a
// graceful fallback when the image is missing or fails to load. Clicking opens
// the Business List filtered to that category only.
const CategoryCard = ({ cat, index }) => {
    const Icon = cat.icon;
    const [imgOk, setImgOk] = useState(Boolean(cat.image));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
            className="w-[230px] sm:w-[260px] shrink-0"
        >
            <Link
                to={`/business-list?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col h-full rounded-2xl border border-rule bg-raised overflow-hidden transition-all duration-300 hover:border-kinpaku/50 hover:-translate-y-1"
            >
                {/* Cover image / fallback */}
                <div className="relative h-36 bg-lacquer-deep overflow-hidden">
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
                            <Icon size={40} />
                        </div>
                    )}
                    {/* Rank badge */}
                    <span className="absolute top-3 left-3 text-[11px] font-black tabular-nums w-7 h-7 rounded-lg flex items-center justify-center bg-lacquer-deep/85 backdrop-blur-md text-kinpaku border border-rule">
                        {cat.rank}
                    </span>
                    {/* Subtle gradient so text sits well under image */}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-lacquer-deep/70 to-transparent" />
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span style={{ color: cat.accent }}><Icon size={14} /></span>
                        <h3 className="text-[14.5px] font-semibold text-champagne leading-tight line-clamp-1 group-hover:text-kinpaku transition-colors">
                            {cat.name}
                        </h3>
                    </div>
                    <p className="text-[12.5px] text-muted font-medium tabular-nums">
                        {cat.count.toLocaleString()} listings
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};

// "Browse by Category" — ranks 1–10 in a horizontal row; a button reveals
// 11–40 inline in the same row.
const CategoryBrowse = ({ initial = 10 }) => {
    const [showAll, setShowAll] = useState(false);
    const shown = showAll ? categories : categories.slice(0, initial);
    const scrollRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;
        // 1px tolerance to avoid sub-pixel rounding leaving an arrow stuck on.
        setCanLeft(el.scrollLeft > 1);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    useEffect(() => {
        updateArrows();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    // Re-evaluate when the visible set changes (Show all toggled).
    }, [showAll]);

    const scrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        // Scroll by roughly one viewport-width of cards.
        const amount = Math.max(el.clientWidth * 0.8, 280);
        el.scrollBy({ left: dir * amount, behavior: 'smooth' });
    };

    return (
        <section className="py-14 sm:py-20 md:py-28 bg-lacquer-deep border-y border-rule">
            <div className="max-w-[1320px] mx-auto px-5 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
                    <div>
                        <p className="ks-eyebrow mb-3">Most listed by traders</p>
                        <h2 className="ks-display text-[30px] sm:text-[38px] md:text-[52px] leading-[1.04] text-champagne" style={{ fontWeight: 600 }}>
                            Browse by category
                        </h2>
                        <p className="text-[17px] text-muted font-normal max-w-xl leading-[1.7] mt-3">
                            Find verified businesses in popular categories across Tamil Nadu.
                        </p>
                    </div>
                    <Link
                        to="/categories"
                        className="flex items-center gap-2 text-[14px] font-semibold text-kinpaku hover:text-kinpaku-pale transition-colors group whitespace-nowrap"
                    >
                        Show all <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Horizontal scroll row with edge arrows */}
                <div className="relative group/row">
                    {/* Left arrow — only when there's content scrolled off to the left */}
                    {canLeft && (
                        <button
                            type="button"
                            onClick={() => scrollBy(-1)}
                            aria-label="Scroll left"
                            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-rule bg-lacquer-deep/90 backdrop-blur-md items-center justify-center text-champagne hover:text-kinpaku hover:border-kinpaku/60 shadow-lg transition-all active:scale-95 -ml-2"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar scroll-smooth"
                    >
                        {shown.map((cat, i) => (
                            <CategoryCard key={cat.name} cat={cat} index={i} />
                        ))}
                    </div>

                    {/* Right arrow — only when there's more content to the right */}
                    {canRight && (
                        <button
                            type="button"
                            onClick={() => scrollBy(1)}
                            aria-label="Scroll right"
                            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-rule bg-lacquer-deep/90 backdrop-blur-md items-center justify-center text-champagne hover:text-kinpaku hover:border-kinpaku/60 shadow-lg transition-all active:scale-95 -mr-2"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>

                {/* Toggle: reveal 11–40 inline */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="ks-button ks-button-secondary min-h-12! px-10!"
                    >
                        {showAll
                            ? 'Show top 10 only'
                            : `Show all ${categories.length} categories`}
                        <ChevronDown size={16} className={`transition-transform ${showAll ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategoryBrowse;
