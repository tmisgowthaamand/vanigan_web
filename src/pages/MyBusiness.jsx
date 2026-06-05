import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { MessageCircle, ArrowRight, ChevronLeft, Building2, MapPin, Phone, Star, ExternalLink, Loader2, ArrowUpRight, Sparkles, TrendingUp, LayoutGrid, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessService, webAuthService, session } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const ROTATING_WORDS = ["listing", "presence", "business", "profile"];

const MyBusiness = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);
    const [ownerPhone, setOwnerPhone] = useState('');

    // Review states
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [reviewPhone, setReviewPhone] = useState('');
    const [businessReviews, setBusinessReviews] = useState({});

    const handleSearch = async (e) => {
        e.preventDefault();
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);
        setError('');
        setSearched(true);
        setProgress(0);
        try {
            const matches = await businessService.getByPhone(cleaned, (p) => setProgress(p));
            setResults(matches);
        } catch (err) {
            setError('Failed to connect to server. Please try again.');
            setResults([]);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    // On mount, hydrate the dashboard from the account session. The account
    // tells us the exact businessId, so we fetch that one record directly
    // (fast, exact from the backend) instead of scanning every page. The slow
    // phone-scan is only a last resort when there is no linked business at all.
    useEffect(() => {
        const auth = session.get();
        const sessionPhone = auth?.user?.phone || sessionStorage.getItem('vanigan_owner_phone');
        if (!sessionPhone) return;
        setOwnerPhone(sessionPhone);
        setPhoneNumber(sessionPhone);
        setSearched(true);

        // Show the linked business immediately if we already have it cached.
        if (auth?.business) {
            setResults([auth.business]);
        }

        let active = true;
        (async () => {
            try {
                // Refresh the account so we have the latest user + linked id.
                const fresh = await webAuthService.me(sessionPhone).catch(() => auth);
                if (!active) return;
                if (fresh?.user) session.set(fresh);

                // Prefer the exact record by id — one quick, authoritative call.
                const businessId = fresh?.business?._id || fresh?.user?.businessId || auth?.business?._id;
                if (businessId) {
                    try {
                        const exact = await businessService.getById(businessId);
                        const biz = exact?.business || exact;
                        if (active && biz?._id) {
                            setResults([biz]);
                            session.set({ ...(fresh || auth), business: biz });
                            return;
                        }
                    } catch {
                        // fall through to the linked copy / phone lookup
                    }
                }

                if (fresh?.business) { setResults([fresh.business]); return; }

                // No linked business — last-resort phone scan so an owner who
                // registered separately still finds their listing.
                if (!auth?.business) {
                    setLoading(true);
                    setProgress(0);
                    const matches = await businessService.getByPhone(sessionPhone, (p) => active && setProgress(p));
                    if (active) setResults(matches);
                }
            } catch {
                if (active && !auth?.business) {
                    try {
                        setLoading(true);
                        const matches = await businessService.getByPhone(sessionPhone, (p) => active && setProgress(p));
                        if (active) setResults(matches);
                    } catch {
                        if (active) { setError('Failed to load your business. Please try again.'); setResults([]); }
                    }
                }
            } finally {
                if (active) { setLoading(false); setProgress(100); }
            }
        })();
        return () => { active = false; };
    }, []);

    const handleLogout = () => {
        session.clear();
        setOwnerPhone('');
        setResults(null);
        setSearched(false);
        setPhoneNumber('');
    };

    // Load reviews for search results
    useEffect(() => {
        if (results && results.length > 0) {
            results.forEach(async (biz) => {
                try {
                    setBusinessReviews(prev => ({
                        ...prev,
                        [biz._id]: biz.reviews || []
                    }));
                } catch (err) {
                    console.error('Error fetching reviews:', err);
                }
            });
        }
    }, [results]);

    const handleReviewSubmit = async (businessId) => {
        if (reviewRating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!reviewName.trim()) {
            alert('Please enter your name');
            return;
        }

        setSubmittingReview(true);
        try {
            await businessService.submitReview({
                businessId,
                name: reviewName,
                rating: reviewRating,
                comment: reviewComment,
                phone: reviewPhone
            });
            alert('Review submitted successfully!');
            const data = await businessService.getReviews(businessId);
            setBusinessReviews(prev => ({ ...prev, [businessId]: data || [] }));

            setReviewName('');
            setReviewRating(0);
            setReviewComment('');
            setReviewPhone('');
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Typography rotation state
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Stats state
    const [stats, setStats] = useState({ total: 0, searches: '125K+', leads: '85K+' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await businessService.getStats();
                if (data && data.total) {
                    setStats(prev => ({ ...prev, total: data.total }));
                }
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    return (
        <main className="bg-raised min-h-screen" style={{ fontFamily: "'Saans', 'Inter', system-ui, sans-serif" }}>
            <Navbar />

            {/* ═══ HERO — Clean white style matching homepage ═══ */}
            <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 bg-raised overflow-hidden relative">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kinpaku/5 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-patina/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

                <div className="max-w-[1280px] mx-auto px-5 sm:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Left — heading */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="text-[13px] font-bold text-kinpaku uppercase tracking-[0.12em] flex items-center gap-2"
                            >
                                <Sparkles size={16} /> My Business Dashboard
                            </motion.p>
                            <h1 className="text-[34px] sm:text-[40px] md:text-[56px] font-extrabold text-champagne leading-[1.1] tracking-[-0.02em] min-h-[120px] sm:min-h-[140px] md:min-h-[130px]">
                                Manage your <br />
                                <span className="text-kinpaku relative inline-block whitespace-nowrap">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={wordIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="absolute left-0 top-0"
                                        >
                                            {ROTATING_WORDS[wordIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="opacity-0 pointer-events-none">presence</span>
                                </span> <br />
                                for free
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-[17px] text-muted font-normal leading-[1.7] max-w-md pt-2"
                            >
                                Access your business profile, respond to leads, and update your services. Built for modern shops, traders, and small business associates.
                            </motion.p>
                        </div>

                        {/* Right — Stats cards */}
                        <div className="w-full lg:w-1/2">
                            <div className="grid grid-cols-3 gap-2 sm:gap-6 bg-raised/80 backdrop-blur-xl p-4 sm:p-8 rounded-3xl border border-rule shadow-[0_8px_30px_rgba(232,119,34,0.06)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-1 transition-all duration-500">
                                {[
                                    { value: stats.searches, label: 'Business searches' },
                                    { value: stats.total > 0 ? stats.total.toLocaleString() + '+' : '50K+', label: 'Verified listings' },
                                    { value: stats.leads, label: 'Direct leads' }
                                ].map((m, i) => (
                                    <div key={i} className="text-center group">
                                        <div className="text-[20px] sm:text-[36px] md:text-[44px] font-extrabold text-champagne leading-none mb-2 group-hover:text-kinpaku transition-colors wrap-break-word">{m.value}</div>
                                        <p className="text-[10px] sm:text-[14px] text-muted font-medium leading-tight">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ DASHBOARD SECTION ═══ */}
            <section className="py-12 sm:py-16 bg-lacquer">
                <div className="max-w-[1280px] mx-auto px-5 sm:px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">

                        {/* ── Main: Phone lookup form ── */}
                        <div className="lg:col-span-7 space-y-8 absolute-z-10">
                            {ownerPhone ? (
                                <div className="bg-raised rounded-[20px] p-6 sm:p-8 md:p-10 border border-rule shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className="text-[12px] font-bold text-patina uppercase tracking-wider flex items-center gap-2 mb-2">
                                                <CheckCircle size={15} /> Signed in
                                            </p>
                                            <h2 className="text-[24px] font-extrabold text-champagne mb-1">Welcome back</h2>
                                            <p className="text-[15px] text-muted font-normal leading-[1.7] flex items-center gap-2">
                                                <Phone size={14} className="text-kinpaku" /> {ownerPhone}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="border border-rule text-champagne px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-graphite hover:border-kinpaku/30 transition-all"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                    {loading && (
                                        <p className="text-muted text-[14px] font-medium mt-5 flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" /> Loading your business… {progress}%
                                        </p>
                                    )}
                                    {error && <p className="text-warning text-[13px] font-medium mt-4">{error}</p>}
                                </div>
                            ) : (
                            <div className="bg-raised rounded-[20px] p-6 sm:p-8 md:p-10 border border-rule shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-tr from-kinpaku/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <h2 className="text-[24px] font-extrabold text-champagne mb-2">Access your dashboard</h2>
                                <p className="text-[15px] text-muted font-normal leading-[1.7] mb-8">
                                    Enter your registered phone number to manage your profile and view customer leads.
                                </p>

                                <form onSubmit={handleSearch} className="space-y-5">
                                    <div>
                                        <label className="text-[12px] font-bold text-champagne uppercase tracking-wider mb-2 block">Registered Mobile</label>
                                        <div className="relative group">
                                            <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-faint group-focus-within:text-kinpaku transition-colors" />
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                                                placeholder="Enter 10-digit number"
                                                className="w-full border border-rule rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium text-champagne outline-none focus:border-kinpaku/50 transition-all placeholder:text-faint"
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-warning text-[13px] font-medium mt-2">{error}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-kinpaku text-white h-[48px] rounded-xl text-[15px] font-bold hover:bg-kinpaku-rich transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <><Loader2 size={20} className="animate-spin" /> Scanning... {progress}%</>
                                        ) : (
                                            <>Access Dashboard <ArrowRight size={18} /></>
                                        )}
                                    </button>
                                </form>
                            </div>
                            )}

                            {/* Search Results */}
                            {searched && !loading && results !== null && (
                                <div className="space-y-6">
                                    {results.length === 0 ? (
                                        <div className="bg-raised rounded-[20px] p-8 border border-warning/40 text-center">
                                            <p className="text-warning font-bold text-[15px] mb-2">No listing found with this number.</p>
                                            <Link to="/add-business" className="text-kinpaku font-bold underline underline-offset-4">Register your business for free</Link>
                                        </div>
                                    ) : (
                                        results.map((biz) => (
                                            <motion.div
                                                key={biz._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="bg-raised rounded-[20px] border border-rule overflow-hidden hover:shadow-[0_20px_40px_rgba(232,119,34,0.12)] hover:-translate-y-2 hover:border-kinpaku/30 transition-all duration-500 group relative"
                                            >
                                                {/* Hover glow overlay */}
                                                <div className="absolute inset-0 bg-linear-to-t from-kinpaku/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px]" />

                                                {/* Image Banner */}
                                                <div className="h-44 bg-linear-to-br from-raised to-lacquer-deep relative overflow-hidden">
                                                    {biz.image ? (
                                                        <img src={biz.image} alt={biz.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-16 h-16 bg-raised rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(232,119,34,0.08)] text-kinpaku/40 group-hover:text-kinpaku transition-colors duration-500">
                                                                <Building2 size={32} strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        {biz.active !== false && (
                                                            <div className="bg-graphite text-patina text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-[rgba(61,177,173,0.4)] backdrop-blur-md">
                                                                <CheckCircle size={12} /> VERIFIED
                                                            </div>
                                                        )}
                                                    </div>
                                                    {biz.listingCode && (
                                                        <div className="absolute top-3 right-3 bg-lacquer-deep/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[11px] font-bold text-champagne shadow-sm border border-rule">
                                                            #{biz.listingCode}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Body */}
                                                <div className="p-6 relative z-10">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <p className="text-[11px] font-bold text-kinpaku uppercase tracking-[0.15em] mb-1">{biz.category}</p>
                                                            <h3 className="text-[20px] font-extrabold text-champagne leading-tight group-hover:text-kinpaku transition-colors line-clamp-2">{biz.name}</h3>
                                                        </div>
                                                        {biz.avgRating > 0 && (
                                                            <div className="flex items-center gap-1.5 bg-graphite px-2.5 py-1 rounded-lg border border-kinpaku/10 shrink-0">
                                                                <Star size={14} className="text-[#F59E0B] fill-[#F59E0B]" />
                                                                <span className="text-[13px] font-bold text-champagne">{biz.avgRating.toFixed(1)}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {biz.description && (
                                                        <p className="text-[13px] text-muted leading-relaxed line-clamp-2 mb-4">{biz.description}</p>
                                                    )}

                                                    <div className="space-y-2 mb-5">
                                                        {(biz.address || biz.district) && (
                                                            <div className="flex items-start gap-2.5 text-muted">
                                                                <MapPin size={14} className="text-kinpaku mt-0.5 shrink-0" />
                                                                <p className="text-[13px] font-medium line-clamp-1">{[biz.address, biz.assembly, biz.district].filter(Boolean).join(', ')}</p>
                                                            </div>
                                                        )}
                                                        {biz.phone && (
                                                            <div className="flex items-center gap-2.5 text-muted">
                                                                <Phone size={14} className="text-kinpaku shrink-0" />
                                                                <p className="text-[13px] font-bold tracking-wide">{biz.phone}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 border-t border-rule flex flex-col sm:flex-row gap-3">
                                                        <Link
                                                            to={`/business/${biz._id}`}
                                                            className="flex-1 bg-kinpaku text-white text-center px-6 py-3 rounded-xl text-[13px] font-bold hover:bg-kinpaku-rich hover:shadow-[0_8px_16px_rgba(232,119,34,0.2)] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            View Profile <ArrowRight size={16} />
                                                        </Link>
                                                        <Link
                                                            to={`/business/${biz._id}/edit`}
                                                            state={{ business: biz, ownerPhone }}
                                                            className="border border-rule text-champagne px-5 py-3 rounded-xl text-[13px] font-bold hover:bg-graphite hover:border-kinpaku/30 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <ExternalLink size={14} /> Edit
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Sidebar ── */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Why Vanigan card */}
                            <div className="bg-raised rounded-[20px] p-6 sm:p-8 md:p-10 border border-rule shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-tr from-kinpaku/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white bg-kinpaku shadow-[0_8px_16px_rgba(232,119,34,0.2)] group-hover:scale-110 transition-transform duration-500">
                                    <Star size={28} />
                                </div>
                                <h3 className="text-[20px] font-bold text-champagne mb-3 relative z-10">Grow your business</h3>
                                <p className="text-[15px] text-muted leading-[1.7] font-normal mb-6 relative z-10">
                                    Get the visibility your business deserves. Reach thousands of potential customers and traders today.
                                </p>
                                <ul className="space-y-3 relative z-10">
                                    {['Free business listing', 'Verified membership', 'WhatsApp connectivity'].map((item, j) => (
                                        <li key={j} className="flex items-start gap-3">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0 text-kinpaku" />
                                            <span className="text-[14px] font-medium text-champagne">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tips card */}
                            <div className="bg-raised rounded-[20px] p-8 border border-rule shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.1)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-kinpaku/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <h4 className="text-[12px] font-bold text-champagne uppercase tracking-wider mb-6 relative z-10">Performance Tips</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-5 bg-raised group-hover:bg-graphite transition-colors duration-500 rounded-xl border border-rule shadow-sm">
                                        <p className="text-[14px] font-bold text-champagne mb-1">Complete your profile</p>
                                        <p className="text-[13px] text-muted leading-[1.7] font-normal">
                                            Businesses with a complete description and at least 5 photos get 3x more views.
                                        </p>
                                    </div>
                                    <div className="p-5 bg-raised group-hover:bg-graphite transition-colors duration-500 rounded-xl border border-rule shadow-sm">
                                        <p className="text-[14px] font-bold text-champagne mb-1">Respond quickly</p>
                                        <p className="text-[13px] text-muted leading-[1.7] font-normal">
                                            Replying to customer reviews within 24 hours shows you care about your reputation.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="text-center pt-2">
                                <p className="text-[15px] text-muted mb-4 font-medium">Ready to get started?</p>
                                <Link
                                    to="/add-business"
                                    className="inline-flex items-center gap-2 bg-kinpaku text-white h-[48px] px-8 rounded-lg text-[15px] font-bold hover:bg-kinpaku-rich transition-colors"
                                >
                                    Join for free
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default MyBusiness;
