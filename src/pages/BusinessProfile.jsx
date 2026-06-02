import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Phone, MessageCircle, Navigation, ChevronLeft,
    Share2, Star, LayoutGrid, Clock, Mail,
    AlertCircle, Loader2, Map as MapIcon,
    Video, ExternalLink, Link as LinkIcon
} from 'lucide-react';
import { businessService } from '../services/api';

const BusinessProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [sharing, setSharing] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewName, setReviewName] = useState('');
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const handleReviewSubmit = async (e) => {
        if (e) e.preventDefault();
        if (rating === 0) {
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
                businessId: id,
                name: reviewName,
                rating: rating,
                comment: reviewComment,
            });
            alert('Review submitted successfully!');
            setReviewName('');
            setRating(0);
            setReviewComment('');
        } catch {
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleShare = async () => {
        if (sharing) return;

        try {
            if (navigator.share) {
                setSharing(true);
                await navigator.share({
                    title: business?.name || 'Vanigan Business',
                    text: `Check out ${business?.name} on Vanigan!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
            }
        } finally {
            setSharing(false);
        }
    };

    const getWhatsAppLink = (p) => {
        if (!p) return '#';
        let clean = p.replace(/\D/g, '');
        if (clean.length === 10) clean = '91' + clean;
        return `https://wa.me/${clean}`;
    };

    const getTelLink = (p) => {
        if (!p) return '#';
        const clean = p.replace(/[^\d+]/g, '');
        return `tel:${clean}`;
    };

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                setLoading(true);
                const data = await businessService.getById(id);
                setBusiness(data);

                setReviews(data.reviews || []);
            } catch {
                setError('Failed to load business details');
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0C0A07]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-[#E87722] animate-spin" />
                    <p className="text-sm font-black text-[var(--ks-text-faint)] uppercase tracking-widest">Loading Premium Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0C0A07]">
                <div className="text-center p-8 sm:p-12 bg-[#1C1813] rounded-4xl sm:rounded-[3rem] shadow-xl max-w-md mx-4 border border-[var(--ks-rule)]">
                    <AlertCircle size={64} className="text-[#E87722] mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-[var(--ks-champagne)] mb-2">Business Not Found</h2>
                    <p className="text-[var(--ks-text-muted)] font-bold mb-8">{error || 'The business record could not be retrieved.'}</p>
                    <button
                        onClick={() => navigate('/business-list')}
                        className="bg-[#E87722] text-[#0C0A07] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#D36B1E] transition-all w-full"
                    >
                        Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    const {
        name, category, phone, phone2, address,
        district, assembly, email,
        description, avgRating, reviewCount,
        listingCode, image, coverImage, galleryImages = [],
        services = [], fbLink, instaLink, googleMap, videoUrl,
        openTime, closeTime, openDays = ""
    } = business;

    const activeDays = typeof openDays === 'string' ? openDays.split(',').map(d => d.trim()) : [];

    return (
        <main className="bg-[#14110D] min-h-screen pb-20 sm:pb-32 overflow-x-hidden">
            {/* Main Content Hub */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 mb-12 sm:mb-16">
                {/* Unified Navigation Row */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#1C1813] border border-[var(--ks-rule)] text-[var(--ks-text-muted)] rounded-xl sm:rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 hover:text-[#E87722] font-black text-[9px] sm:text-[10px] uppercase tracking-widest group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1C1813] rounded-xl sm:rounded-2xl flex items-center justify-center text-[var(--ks-text-faint)] hover:text-[#E87722] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 border border-[var(--ks-rule)] group"
                    >
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="bg-[#1C1813] rounded-4xl sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_20px_60px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(232,119,34,0.1)] hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                    {/* Hero Banner with Auto-Alignment */}
                    <div className="h-56 sm:h-80 lg:h-96 relative overflow-hidden bg-[#252019] border-b border-[var(--ks-rule)]">
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover object-center transition-opacity duration-500"
                                style={{ imageRendering: 'auto' }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--ks-text-disabled)]">
                                <LayoutGrid size={48} strokeWidth={1} />
                                <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em]">No Banner Available</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Meta Hub - Flex Column on Mobile, Row on Desktop */}
                    <div className="px-6 sm:px-10 lg:px-16 pt-5 sm:pt-6 lg:pt-8 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                                <div className="-mt-16 sm:-mt-20 lg:-mt-24 w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 bg-[#1C1813] rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-4 shadow-2xl border border-[var(--ks-rule)] flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
                                    {image ? (
                                        <img src={image} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-4xl sm:text-5xl">🏢</div>
                                    )}
                                </div>
                                <div className="text-center sm:text-left min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--ks-champagne)] tracking-tighter uppercase leading-tight">
                                            {name}
                                        </h1>
                                        <span className="mx-auto sm:mx-0 px-4 py-1.5 bg-[#252019] text-[#3DB1AD] rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-[rgba(61,177,173,0.4)] flex items-center gap-2 w-fit">
                                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#3DB1AD] animate-pulse"></div>
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < (avgRating || 0) ? "currentColor" : "none"} strokeWidth={i < (avgRating || 0) ? 0 : 2} />
                                            ))}
                                            <span className="ml-1 font-black text-[var(--ks-champagne)]">{avgRating || 0}</span>
                                            <span className="text-[var(--ks-text-faint)] font-bold ml-1">({reviewCount || 0})</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 font-black text-[9px] sm:text-[11px] uppercase tracking-widest text-[var(--ks-text-faint)] bg-[#0C0A07] px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-[var(--ks-rule)]">
                                            <span className="text-[#E87722]">{category}</span>
                                            <div className="w-1 h-1 rounded-full bg-[var(--ks-text-faint)]" />
                                            <span className="text-[var(--ks-champagne)] tracking-tighter">#{listingCode || 'LISTING'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 sm:gap-4 pb-4">
                                <a href={getWhatsAppLink(phone || phone2)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-[#E87722] text-[#0C0A07] rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#D36B1E] transition-all shadow-lg hover:-translate-y-1">
                                    <MessageCircle size={18} /> WhatsApp
                                </a>
                                <a href={getTelLink(phone || phone2)} className="flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-[var(--ks-rule-strong)] text-[#E87722] rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-[#E87722] hover:text-[#E87722] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                    <Phone size={18} /> Call
                                </a>
                                <button onClick={() => window.open(googleMap || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`, '_blank')} className="flex items-center justify-center gap-3 px-6 py-4 bg-transparent border border-[var(--ks-rule-strong)] text-[#E87722] rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-[#E87722] hover:text-[#E87722] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                    <Navigation size={18} /> Directions
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="h-8 sm:h-10" />
                </div>
            </div>

            {/* Layout Grid - Adaptive across all sizes */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 sm:gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8 sm:space-y-12">
                    {/* About Section */}
                    <section className="bg-[#1C1813] px-6 py-10 sm:p-12 lg:p-16 rounded-4xl sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                        <h2 className="text-xl sm:text-2xl font-black text-[var(--ks-champagne)] mb-8 uppercase tracking-tighter flex items-center gap-4">
                            About <div className="h-px bg-[#252019] flex-1"></div>
                        </h2>
                        <p className="text-[var(--ks-text-muted)] font-medium sm:font-bold leading-[1.8] whitespace-pre-wrap text-[15px] sm:text-lg text-justify [text-align-last:left] wrap-break-word">
                            {description || `${name} is an established destination for ${category} in ${district}. We offer professional services tailored to community needs with a focus on quality and consistency.`}
                        </p>
                    </section>

                    {/* Services Grid - Dynamic auto-alignment */}
                    {(services && services.length > 0) && (
                        <section className="bg-[#1C1813] px-6 py-10 sm:p-12 lg:p-16 rounded-4xl sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                            <h2 className="text-xl sm:text-2xl font-black text-[var(--ks-champagne)] mb-8 uppercase tracking-tighter flex items-center gap-4">
                                Services & Pricing <div className="h-px bg-[#252019] flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {services.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-5 p-4 sm:p-6 rounded-4xl bg-[#0C0A07] border border-[var(--ks-rule)] group transition-all hover:bg-[#1C1813] hover:shadow-xl">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1C1813] rounded-2xl overflow-hidden border border-[var(--ks-rule)] shrink-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    className="w-full h-full object-contain p-2"
                                                    alt={item.name}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--ks-text-disabled)]">
                                                    <LayoutGrid size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 justify-center flex flex-col">
                                            <h4 className="font-black text-[var(--ks-champagne)] uppercase tracking-tight text-xs sm:text-sm mb-1">{item.name}</h4>
                                            <p className="text-[#E87722] font-black text-base sm:text-xl">₹ {item.price}</p>
                                            <p className="text-[9px] text-[var(--ks-text-faint)] font-bold mt-1 uppercase tracking-widest line-clamp-1">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery Hub */}
                    {(galleryImages && galleryImages.length > 0) && (
                        <section className="bg-[#1C1813] px-6 py-10 sm:p-12 lg:p-16 rounded-4xl sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                            <h2 className="text-xl sm:text-2xl font-black text-[var(--ks-champagne)] mb-8 uppercase tracking-tighter flex items-center gap-4">
                                Gallery ({galleryImages.length}) <div className="h-px bg-[#252019] flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-3xl sm:rounded-4xl overflow-hidden bg-[#252019] border border-[var(--ks-rule)] group cursor-pointer relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                        <img
                                            src={img.url || img}
                                            alt={`Gallery ${idx}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Review Form - Responsive layout */}
                    <section className="bg-[#1C1813] px-6 py-10 sm:p-12 lg:p-16 rounded-4xl sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                        <h2 className="text-xl sm:text-2xl font-black text-[var(--ks-champagne)] mb-8 uppercase tracking-tighter flex items-center gap-4">
                            Reviews <div className="h-px bg-[#252019] flex-1"></div>
                        </h2>
                        <div className="bg-[#0C0A07] rounded-4xl p-6 sm:p-10 border border-[var(--ks-rule)] mb-10">
                            <h3 className="text-lg font-black text-[var(--ks-champagne)] mb-2">Leave a Review</h3>
                            <p className="text-[10px] sm:text-xs font-bold text-[var(--ks-text-faint)] mb-8 uppercase tracking-widest">Share your feedback to help others.</p>
                            <form onSubmit={handleReviewSubmit} className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        placeholder="Your Name"
                                        className="w-full bg-[#1C1813] border border-[var(--ks-rule)] rounded-xl p-4 sm:p-5 text-sm font-bold shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 outline-none focus:border-[#E87722]"
                                        required
                                    />
                                    <div className="flex items-center gap-3 bg-[#1C1813] border border-[var(--ks-rule)] rounded-xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`transition-all ${rating >= star ? 'text-amber-400' : 'text-[var(--ks-text-disabled)]'}`}
                                            >
                                                <Star
                                                    size={18}
                                                    className={rating >= star ? "fill-amber-400" : ""}
                                                    strokeWidth={rating >= star ? 0 : 2}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-[10px] font-black text-[var(--ks-text-faint)] uppercase ml-auto">
                                            {rating > 0 ? `${rating} / 5` : 'Rate'}
                                        </span>
                                    </div>
                                </div>
                                <textarea
                                    rows={4}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Your review..."
                                    className="w-full bg-[#1C1813] border border-[var(--ks-rule)] rounded-xl p-6 sm:p-8 text-sm font-bold shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 outline-none focus:border-[#E87722] resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-[#E87722] text-[#0C0A07] p-5 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D36B1E] transition-all shadow-xl disabled:opacity-50"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>

                        {/* Recent Reviews List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between pb-4 border-b border-[var(--ks-rule)]">
                                <h3 className="text-[10px] font-black text-[#E87722] uppercase tracking-[0.3em]">Recent Feedbacks</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-[var(--ks-text-faint)] uppercase tracking-widest">{reviews.length} Total</span>
                                </div>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((r, idx) => (
                                        <div key={idx} className="p-8 bg-[#0C0A07] rounded-4xl border border-[var(--ks-rule)] hover:bg-[#1C1813] hover:shadow-xl transition-all group">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#1C1813] border border-[var(--ks-rule)] flex items-center justify-center text-[#E87722] font-black shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 group-hover:scale-110">
                                                        {(r.reviewerName || r.name || 'A').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-[var(--ks-champagne)] tracking-tight">{r.reviewerName || r.name}</p>
                                                        <p className="text-[10px] font-bold text-[var(--ks-text-faint)] uppercase tracking-widest">
                                                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[#1C1813] px-3 py-1.5 rounded-lg border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
                                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    <span className="text-[11px] font-black text-[var(--ks-champagne)]">{r.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-[var(--ks-text-muted)] font-medium leading-relaxed text-[15px] italic pl-2 border-l-2 border-[#E87722]">
                                                "{r.text || r.comment || 'Excellent service and great experience!'}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-[#14110D] rounded-4xl border border-dashed border-[var(--ks-rule)] py-16 text-center">
                                    <MessageCircle size={32} className="text-[var(--ks-text-faint)] mx-auto mb-4 opacity-50" />
                                    <p className="text-[var(--ks-text-faint)] font-bold italic text-sm">No reviews yet. Be the first to share your thoughts!</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar - Stacks on mobile, sticks on desktop */}
                <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
                    <div className="bg-[#1C1813] p-8 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 space-y-10 sm:space-y-12">
                        {/* Contact Hub */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-[var(--ks-text-faint)] mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Contact <div className="h-px bg-[#252019] flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0C0A07] rounded-xl flex items-center justify-center text-[var(--ks-text-faint)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 border border-[var(--ks-rule)]">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--ks-text-faint)] mb-1">Phone</p>
                                        <p className="text-sm font-black text-[var(--ks-champagne)] tracking-widest">{phone || 'N/A'}</p>
                                        {phone2 && <p className="text-sm font-black text-[var(--ks-champagne)] tracking-widest mt-1">{phone2}</p>}
                                    </div>
                                </div>
                                {email && (
                                    <div className="flex items-center gap-4 sm:gap-5 overflow-hidden">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0C0A07] rounded-xl flex items-center justify-center text-[var(--ks-text-faint)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 border border-[var(--ks-rule)]">
                                            <Mail size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--ks-text-faint)] mb-1">Email</p>
                                            <p className="text-sm font-black text-[var(--ks-champagne)] truncate">{email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Location Details */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-[var(--ks-text-faint)] mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Location <div className="h-px bg-[#252019] flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-start gap-4 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#252019] rounded-xl flex items-center justify-center text-[#E87722] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 border border-[#E87722] shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] font-bold text-[var(--ks-text-muted)] leading-relaxed pt-1">{address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pl-1 animate-in fade-in slide-in-from-bottom-2">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--ks-text-faint)] mb-1">Assembly</p>
                                        <p className="text-[12px] sm:text-sm font-black text-[var(--ks-champagne)]">{assembly}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-[var(--ks-text-faint)] mb-1">District</p>
                                        <p className="text-[12px] sm:text-sm font-black text-[var(--ks-champagne)]">{district}</p>
                                    </div>
                                </div>

                                {/* Interactive Map Embed */}
                                <div className="mt-8 aspect-video rounded-2xl overflow-hidden border border-[var(--ks-rule)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 bg-[#0C0A07] relative group">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(googleMap || `${name} ${address}`)}&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                        className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                    <a
                                        href={googleMap || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-3 right-3 bg-[#0C0A07]/85 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500 hover:bg-[#E87722] hover:text-[#0C0A07]"
                                    >
                                        View Large Map
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* Timing Grid */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-[var(--ks-text-faint)] mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Hours <div className="h-px bg-[#252019] flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex flex-wrap gap-1.5">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const isChecked = activeDays.some(ad => ad.toLowerCase() === day.toLowerCase());
                                        return (
                                            <div key={day} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors border ${isChecked ? 'bg-[#252019] border-[rgba(61,177,173,0.4)] text-[#3DB1AD]' : 'bg-[#0C0A07] border-[var(--ks-rule)] text-[var(--ks-text-faint)]'}`}>
                                                {day}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[#0C0A07] rounded-2xl border border-[var(--ks-rule)]">
                                    <Clock size={16} className="text-[var(--ks-text-faint)]" />
                                    <p className="text-[12px] font-black text-[var(--ks-champagne)] tracking-widest uppercase">{openTime || '09:00'} — {closeTime || '18:00'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Social Connects */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-[var(--ks-text-faint)] mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Links <div className="h-px bg-[#252019] flex-1"></div>
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <SocialButton icon={ExternalLink} label="FB" url={fbLink} />
                                <SocialButton icon={LinkIcon} label="INSTA" url={instaLink} />
                                <SocialButton icon={Video} label="VIDEO" url={videoUrl} />
                                <SocialButton icon={MapIcon} label="MAP" url={googleMap} />
                            </div>
                        </section>
                    </div>
                </aside>
            </div>
        </main>
    );
};

const SocialButton = ({ icon: Icon, label, url }) => {
    if (!url) return null;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1C1813] border border-[var(--ks-rule)] text-[var(--ks-text-muted)] rounded-xl hover:bg-[#E87722] hover:text-[#0C0A07] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(232,119,34,0.08)] hover:-translate-y-1 transition-all duration-500">
            <Icon size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </a>
    );
};

export default BusinessProfile;
