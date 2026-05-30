import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { MessageCircle, ArrowRight, ChevronLeft, Building2, MapPin, Phone, Star, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { businessService } from '../services/api';

const MyBusiness = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

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

    // Load reviews for search results
    useEffect(() => {
        if (results && results.length > 0) {
            results.forEach(async (biz) => {
                try {
                    // Reviews are already embedded in each business object
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
            // Reload reviews
            const data = await businessService.getReviews(businessId);
            setBusinessReviews(prev => ({ ...prev, [businessId]: data || [] }));

            // Clear form
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

    return (
        <div className="min-h-screen bg-slate-50/50 pt-28 pb-0">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-20 flex flex-col items-center">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-rose-600 transition-colors mb-12 self-center">
                    <ChevronLeft size={14} />
                    <span>Back to Home</span>
                </Link>

                <div className="max-w-2xl w-full mb-16 text-center">
                    {/* Header Section */}
                    <div className="mb-14 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-rose-600 mb-8 shadow-xl shadow-rose-600/5 border border-rose-100/50">
                            <Building2 size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">My <span className="text-rose-600">Business</span></h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg mx-auto">
                            Enter your registered phone number to view and manage your business listing.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 space-y-10 text-left">
                        <div className="space-y-2 text-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Find Your Business</h3>
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Use the same number you registered with.</p>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-rose-600 pl-1">
                                    <MessageCircle size={16} />
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Registered Phone Number</label>
                                </div>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="10-digit mobile number"
                                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-8 py-6 outline-none focus:border-rose-500/20 focus:bg-white transition-all text-slate-900 text-xl font-bold placeholder:text-slate-400"
                                    required
                                />
                                {error && <p className="text-rose-600 text-sm font-bold pl-2">{error}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-6 rounded-2xl text-[14px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-rose-600 shadow-2xl shadow-slate-900/10 hover:shadow-rose-600/20 transition-all active:scale-95 group disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        SCANNING DATABASE... {progress}%
                                    </>
                                ) : (
                                    <>
                                        FIND MY BUSINESS
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                {searched && !loading && results !== null && (
                    <div className="w-full mt-12 max-w-5xl mx-auto">
                        {results.length === 0 ? (
                            <div className="max-w-2xl mx-auto text-center py-24 bg-slate-50/50 rounded-[3rem] border border-slate-100">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100">
                                    <Building2 size={40} className="text-slate-300" strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">No Business Found</h3>
                                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                                    We couldn't find any business registered with <span className="text-rose-600 font-bold">{phoneNumber}</span>.
                                </p>
                                <Link to="/add-business" className="inline-flex items-center gap-4 px-10 py-5 bg-rose-600 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-rose-600/30 hover:bg-rose-500 transition-all active:scale-95">
                                    Register Now <ArrowRight size={18} />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-24">
                                {results.map((biz) => (
                                    <div key={biz._id} className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                                        {/* Profile Card Header */}
                                        <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 mb-12">
                                            <div className="h-64 md:h-80 relative">
                                                <img
                                                    src={biz.coverImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1500"}
                                                    className="w-full h-full object-cover"
                                                    alt="Cover"
                                                />
                                                <div className="absolute inset-0 bg-black/5"></div>
                                                <div className="absolute top-6 left-6">
                                                    <button onClick={() => setResults(null)} className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black/60 transition-all">
                                                        <ChevronLeft size={14} /> Back
                                                    </button>
                                                </div>
                                                <div className="absolute -bottom-16 left-10">
                                                    <div className="w-32 h-32 bg-white rounded-3xl p-1.5 shadow-2xl shadow-black/10 border border-slate-100">
                                                        <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                                                            <img
                                                                src={biz.image || "https://vanigan.org/front/images/categories/Agriculture.png"}
                                                                className="w-full h-full object-cover"
                                                                alt="Avatar"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-20 px-10 pb-10">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{biz.name}</h2>
                                                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                            <Star size={10} fill="currentColor" /> {biz.active ? 'Active' : 'Pending'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} size={14} className={s <= (biz.avgRating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400">{biz.reviewCount || 0} reviews</span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-400">
                                                        <span className="text-rose-600">{biz.category || 'Business'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                        <span>{biz.district}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                        <span className="text-slate-900 tracking-tighter">#{biz.listingCode}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-4 mt-10 border-t border-slate-50 pt-10">
                                                    {(biz.phone || biz.phone2) && (
                                                        <a href={`tel:${biz.phone || biz.phone2}`} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl active:scale-95">
                                                            <Phone size={16} /> Call Business
                                                        </a>
                                                    )}
                                                    <button className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-rose-600 hover:text-rose-600 transition-all active:scale-95">
                                                        <ExternalLink size={16} /> Profile Link
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashboard Body */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            <div className="lg:col-span-2 space-y-16">
                                                {/* Gallery Section */}
                                                <div className="space-y-8">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight border-l-4 border-rose-600 pl-4">Gallery ({biz.galleryImages?.length || 0})</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                        {biz.galleryImages?.map((img, idx) => (
                                                            <div key={idx} className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                                                                <img src={img.url} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                                                            </div>
                                                        ))}
                                                        {(!biz.galleryImages || biz.galleryImages.length === 0) && (
                                                            <div className="col-span-full py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                                                <p className="text-slate-400 font-medium italic">No gallery images available.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Review and Rating Section */}
                                                <div className="space-y-10">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight border-l-4 border-rose-600 pl-4">Reviews & Feedbacks</h3>

                                                    {/* Write Review Form */}
                                                    <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Name *</label>
                                                                <input
                                                                    type="text"
                                                                    value={reviewName}
                                                                    onChange={(e) => setReviewName(e.target.value)}
                                                                    placeholder="e.g. John Doe"
                                                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none focus:bg-white focus:border-rose-300 transition-all"
                                                                />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rating *</label>
                                                                <div className="flex items-center gap-2 h-[58px]">
                                                                    {[1, 2, 3, 4, 5].map(s => (
                                                                        <Star
                                                                            key={s}
                                                                            size={24}
                                                                            className={`cursor-pointer transition-all ${reviewRating >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                                                                            onClick={() => setReviewRating(s)}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Your Feedback</label>
                                                            <textarea
                                                                rows={4}
                                                                value={reviewComment}
                                                                onChange={(e) => setReviewComment(e.target.value)}
                                                                placeholder="Share your experience..."
                                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-8 text-sm font-bold outline-none focus:bg-white focus:border-rose-300 transition-all resize-none"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleReviewSubmit(biz._id)}
                                                            disabled={submittingReview}
                                                            className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all disabled:opacity-50"
                                                        >
                                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                                        </button>
                                                    </div>

                                                    {/* Real Reviews List */}
                                                    <div className="space-y-6">
                                                        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Feedbacks</h4>
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {(businessReviews[biz._id] || []).length} Total
                                                            </span>
                                                        </div>

                                                        {(businessReviews[biz._id] || []).length > 0 ? (
                                                            (businessReviews[biz._id] || []).map((rev, rIdx) => (
                                                                <div key={rIdx} className="p-8 bg-white rounded-3xl border border-slate-100 space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-rose-600 font-black">
                                                                                {(rev.reviewerName || rev.name || 'A').charAt(0).toUpperCase()}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-black text-slate-900">{rev.reviewerName || rev.name}</p>
                                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-1 pb-4">
                                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                                <Star key={s} size={12} className={s <= rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-rose-100 pl-4">"{rev.text || rev.comment}"</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                                                <p className="text-slate-400 font-bold italic">No public reviews available yet.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Sidebar */}
                                            <div className="space-y-8">
                                                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-8">
                                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Business Information</h4>
                                                    <div className="space-y-6">
                                                        <div className="flex gap-4">
                                                            <MapPin size={18} className="text-rose-500 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Location</p>
                                                                <p className="text-xs font-bold text-slate-700 leading-relaxed">{biz.address}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Phone size={18} className="text-slate-400 shrink-0" />
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Primary Phone</p>
                                                                <p className="text-sm font-black text-slate-900">{biz.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="pt-6 border-t border-slate-50 space-y-4">
                                                            <div className="flex justify-between">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase">District</span>
                                                                <span className="text-xs font-bold text-slate-900">{biz.district}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase">Assembly</span>
                                                                <span className="text-xs font-bold text-slate-900">{biz.assembly}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 shadow-2xl shadow-slate-900/20">
                                                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Operational Status</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold opacity-60">Status</span>
                                                            <span className="text-xs font-black uppercase text-emerald-400">Online</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold opacity-60">Timings</span>
                                                            <span className="text-xs font-black">{biz.openTime || '09:00'} - {biz.closeTime || '21:00'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBusiness;
