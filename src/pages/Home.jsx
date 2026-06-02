import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    ArrowRight, CheckCircle, BookOpen, Users2, TrendingUp,
    Calendar, MessageCircle, Wallet, ArrowUpRight, Sparkles
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import BusinessCard from '../components/BusinessCard';
import { businessService } from '../services/api';

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Section Fade-In Wrapper ─── */
const FadeIn = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        className={className}
    >
        {children}
    </motion.div>
);

const Home = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, searches: 125000, leads: 85000 });

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const data = await businessService.getAll();
                // API return format is { businesses: [], total: X }
                const list = Array.isArray(data) ? data : (data.businesses || []);
                setBusinesses(list.slice(0, 3));
            } catch (err) {
                console.error('Home: Failed to fetch featured businesses', err);
            }
            finally { setLoading(false); }
        };
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                if (data && data.total) {
                    setStats(prev => ({ ...prev, total: data.total }));
                }
            } catch (err) {
                console.error('Home: Failed to fetch stats', err);
            }
        };
        fetchFeatured();
        fetchStats();
    }, []);

    return (
        <main className="bg-lacquer min-h-screen" style={{ fontFamily: 'var(--ks-font-body)' }}>
            <HeroSection />

            {/* ════════════════════════════════════════════
                SECTION 1: "Tell us your story" — Funding CTA
               ════════════════════════════════════════════ */}
            <section className="bg-lacquer-deep py-20 md:py-28 border-y border-rule">
                <div className="max-w-[1320px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="bg-raised rounded-[8px] p-10 md:p-14 border border-rule">
                                <p className="ks-eyebrow mb-6">AI-Powered</p>
                                <h2 className="ks-display text-[34px] md:text-[44px] leading-[1.06] mb-5" style={{ fontWeight: 600 }}>
                                    Promote your listing,<br />
                                    <span className="text-kinpaku">free for all businesses</span>
                                </h2>
                                <p className="text-[16px] text-muted leading-[1.7] mb-8 max-w-md">
                                    Register your business on Tamil Nadu's fastest growing network.
                                    Reach thousands of potential customers and traders today.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link to="/add-business" className="ks-button ks-button-primary min-h-12!">
                                        Try Start right <ArrowRight size={16} />
                                    </Link>
                                    <Link to="/about" className="ks-button ks-button-ghost min-h-12!">
                                        Learn more
                                    </Link>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Impact Metrics */}
                        <FadeIn delay={0.2} className="w-full lg:w-1/2">
                            <p className="ks-eyebrow mb-3">Impact that matters</p>
                            <h3 className="ks-display text-[26px] md:text-[30px] text-champagne mb-10 leading-tight" style={{ fontWeight: 600 }}>
                                Every year, Vanigan simplifies your journey <br className="hidden md:block" />to trusted business support.
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { value: stats.searches, suffix: '+', label: 'Business searches' },
                                    { value: stats.total > 0 ? stats.total : 50000, suffix: '+', label: 'Verified listings' },
                                    { value: stats.leads, suffix: '+', label: 'Direct leads generated' }
                                ].map((m, i) => (
                                    <div key={i} className="text-center">
                                        <div className="ks-display text-[26px] sm:text-[38px] md:text-[48px] text-kinpaku leading-none mb-2" style={{ fontWeight: 400 }}>
                                            <AnimatedCounter end={m.value} suffix={m.suffix} />
                                        </div>
                                        <p className="text-[12px] sm:text-[13px] text-muted font-medium leading-tight">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: "Support for all"
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-lacquer">
                <div className="max-w-[1320px] mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="ks-display text-[38px] md:text-[52px] leading-[1.04] mb-5" style={{ fontWeight: 600 }}>
                                Business listing for all
                            </h2>
                            <p className="text-[17px] text-muted font-normal max-w-xl mx-auto leading-[1.7]">
                                No matter your industry, from retail to manufacturing, list your business and connect with the community.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Calendar size={28} />,
                                title: 'Events and workshops',
                                desc: 'Attend practical events and network with fellow founders of the community.',
                                color: '#E87722'
                            },
                            {
                                icon: <MessageCircle size={28} />,
                                title: 'Connections and advice',
                                desc: 'Make connections and share advice with other members of the small business community.',
                                color: '#3DB1AD'
                            },
                            {
                                icon: <Wallet size={28} />,
                                title: 'Funding and grants',
                                desc: 'Access financial support to take your business to the next level.',
                                color: '#E87722'
                            }
                        ].map((card, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="rounded-[6px] p-8 md:p-10 h-full border border-rule bg-raised hover:border-rule-strong hover:-translate-y-1 transition-all duration-500 group cursor-pointer">
                                    <div
                                        className="w-14 h-14 rounded-[6px] flex items-center justify-center mb-6 border"
                                        style={{ color: card.color, borderColor: 'var(--color-rule)' }}
                                    >
                                        {card.icon}
                                    </div>
                                    <h3 className="text-[20px] font-semibold text-champagne mb-3">{card.title}</h3>
                                    <p className="text-[15px] text-muted leading-[1.7] font-normal">{card.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: "Why join?" Tabs
               ════════════════════════════════════════════ */}
            <section className="bg-lacquer-deep py-20 md:py-28 border-y border-rule">
                <div className="max-w-[1320px] mx-auto px-6">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="ks-display text-[38px] md:text-[52px] leading-[1.04] mb-5" style={{ fontWeight: 600 }}>
                                Why list on Vanigan?
                            </h2>
                            <p className="text-[17px] text-muted font-normal max-w-lg mx-auto leading-[1.7]">
                                Tamil Nadu's premier business listing platform for traders and associates.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Sparkles size={24} />,
                                title: 'Register Business',
                                desc: "List your business for free on India's most trusted traders and associates platform.",
                                items: ['Free business listing', 'Verified membership', 'WhatsApp connectivity'],
                                color: '#E87722'
                            },
                            {
                                icon: <Users2 size={24} />,
                                title: 'Trader Network',
                                desc: 'Expand your network and connect with thousands of traders and associates across Tamil Nadu.',
                                items: ['Local district networks', 'B2B collaborations', 'Industry-specific groups'],
                                color: '#3DB1AD'
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: 'Business Growth',
                                desc: 'Get the visibility your business deserves. Track leads and grow your brand presence online.',
                                items: ['Lead generation', 'Verified business badge', 'SEO-friendly profile'],
                                color: '#E87722'
                            }
                        ].map((col, i) => (
                            <FadeIn key={i} delay={i * 0.12}>
                                <div className="bg-raised rounded-[6px] p-8 md:p-10 h-full border border-rule hover:border-rule-strong transition-all duration-500">
                                    <div className="w-12 h-12 rounded-[6px] flex items-center justify-center mb-6 border border-rule" style={{ color: col.color }}>
                                        {col.icon}
                                    </div>
                                    <h3 className="text-[22px] font-semibold text-champagne mb-3">{col.title}</h3>
                                    <p className="text-[15px] text-muted leading-[1.7] mb-6">{col.desc}</p>
                                    <ul className="space-y-3">
                                        {col.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: col.color }} />
                                                <span className="text-[14px] font-medium text-ink">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    <FadeIn delay={0.3}>
                        <div className="text-center mt-14">
                            <p className="text-[15px] text-muted mb-4 font-medium">Ready to get started?</p>
                            <Link to="/add-business" className="ks-button ks-button-primary min-h-12!">
                                Join for free
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: Featured Businesses
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-lacquer">
                <div className="max-w-[1320px] mx-auto px-6">
                    <FadeIn>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                            <div>
                                <h2 className="ks-display text-[38px] md:text-[52px] leading-[1.04] mb-4" style={{ fontWeight: 600 }}>
                                    Latest member stories
                                </h2>
                                <p className="text-[17px] text-muted font-normal max-w-xl leading-[1.7]">
                                    Meet the community and discover what they have achieved with membership.
                                </p>
                            </div>
                            <Link
                                to="/business-list"
                                className="flex items-center gap-2 text-[14px] font-semibold text-kinpaku hover:text-kinpaku-pale transition-colors group whitespace-nowrap"
                            >
                                More member stories <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-[380px] bg-raised border border-rule rounded-[6px] animate-pulse" />
                            ))
                        ) : businesses.length > 0 ? (
                            businesses.map(biz => <BusinessCard key={biz._id || biz.id} business={biz} />)
                        ) : (
                            <div className="col-span-3 text-center py-16 text-faint text-[16px] font-medium">
                                No featured businesses available yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 5: Final CTA
               ════════════════════════════════════════════ */}
            <section className="py-20 md:py-28 bg-lacquer-deep border-t border-rule relative overflow-hidden">
                <div className="ks-seam absolute top-0 left-0 right-0" />
                <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
                    <FadeIn>
                        <h2 className="ks-display text-[38px] md:text-[52px] leading-[1.04] mb-6" style={{ fontWeight: 600 }}>
                            Ready to join the<br />
                            <span className="text-kinpaku">Vanigan Community?</span>
                        </h2>
                        <p className="text-[17px] text-muted font-normal leading-[1.7] mb-10 max-w-lg mx-auto">
                            The first step to growing your business in Tamil Nadu is getting verified.
                            It only takes 2 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/add-business" className="ks-button ks-button-primary min-h-13! px-10! text-[16px]!">
                                Join for free
                            </Link>
                            <Link to="/about" className="ks-button ks-button-secondary min-h-13! px-10! text-[16px]!">
                                See how it works
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
};

export default Home;
