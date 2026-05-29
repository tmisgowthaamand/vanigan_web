import React, { useState } from 'react';
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
                    <div className="mt-12">
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
                                        {/* Reference-Perfect Header (Matching Image 1) */}
                                        <div className="relative rounded-[2rem] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 mb-12">
                                            {/* Top Banner */}
                                            <div className="h-64 md:h-80 relative">
                                                <img
                                                    src={biz.coverImage || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1500"}
                                                    className="w-full h-full object-cover"
                                                    alt="Cover"
                                                />
                                                <div className="absolute inset-0 bg-black/5"></div>

                                                {/* Back Button on Banner */}
                                                <div className="absolute top-6 left-6">
                                                    <button onClick={() => setResults(null)} className="flex items-center gap-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black/60 transition-all">
                                                        <ChevronLeft size={14} /> Back
                                                    </button>
                                                </div>

                                                {/* Profile Avatar (Overlapping) */}
                                                <div className="absolute -bottom-16 left-10">
                                                    <div className="w-32 h-32 bg-white rounded-3xl p-1.5 shadow-2xl shadow-black/10">
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

                                            {/* Header Info Row */}
                                            <div className="pt-20 px-10 pb-10">
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{biz.name}</h2>
                                                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                                                <Star size={10} fill="currentColor" /> Active
                                                            </div>
                                                        </div>

                                                        {/* Ratings Row */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-slate-200" />)}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-300">No ratings yet</span>
                                                        </div>

                                                        {/* Category & Code */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                                                                <span className="text-rose-600">{biz.category}</span>
                                                                {biz.subCategory && (
                                                                    <>
                                                                        <span>&rsaquo;</span>
                                                                        <span>{biz.subCategory}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {biz.listingCode && (
                                                                <div className="text-[11px] font-black text-rose-500 uppercase tracking-widest">
                                                                    # {biz.listingCode}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Bar (Pill Buttons) */}
                                                <div className="flex flex-wrap gap-4 mt-10 border-t border-slate-50 pt-10">
                                                    {biz.whatsappNo && (
                                                        <a href={`https://wa.me/${biz.whatsappNo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-900 text-white px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl active:scale-95">
                                                            <MessageCircle size={16} /> WhatsApp
                                                        </a>
                                                    )}
                                                    {biz.phone && (
                                                        <a href={`tel:${biz.phone}`} className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-rose-600 hover:text-rose-600 transition-all active:scale-95">
                                                            <Phone size={16} /> Call
                                                        </a>
                                                    )}
                                                    <button className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-rose-600 hover:text-rose-600 transition-all active:scale-95">
                                                        <MapPin size={16} /> Directions
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dashboard Body - 2 Columns */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            {/* Left Column */}
                                            <div className="lg:col-span-2 space-y-16">
                                                {/* Gallery */}
                                                <div className="space-y-8">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight border-l-4 border-rose-600 pl-4">Gallery ({(biz.image ? 1 : 0) + (biz.galleryImages?.length || 0)})</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                        {biz.image && (
                                                            <div className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                                                                <img
                                                                    src={biz.image}
                                                                    className="w-full h-full object-cover"
                                                                    alt="Gallery"
                                                                />
                                                            </div>
                                                        )}
                                                        {biz.galleryImages?.map((img, idx) => (
                                                            <div key={idx} className="aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                                                                <img
                                                                    src={img.url}
                                                                    className="w-full h-full object-cover"
                                                                    alt={`Gallery ${idx + 1}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Reviews & Ratings Form */}
                                                <div className="space-y-10">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight border-l-4 border-rose-600 pl-4">Reviews & Ratings</h3>
                                                    <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-8">
                                                        <div className="space-y-2">
                                                            <h4 className="text-lg font-black text-slate-900">Write a Review</h4>
                                                            <p className="text-xs font-medium text-slate-400">Share your experience with this business. Your review helps others make better decisions.</p>
                                                        </div>
                                                        <form className="space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name *</label>
                                                                    <input type="text" placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white focus:border-rose-200 transition-all" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating *</label>
                                                                    <div className="flex items-center gap-3 pt-2">
                                                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} className="text-slate-200 cursor-pointer hover:text-rose-400 transition-colors" />)}
                                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Select rating</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review Text (Optional)</label>
                                                                <textarea placeholder="Tell us what you liked or how they can improve..." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-rose-200 min-h-[120px] transition-all"></textarea>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Phone (Optional)</label>
                                                                <input type="tel" placeholder={phoneNumber} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-bold outline-none" />
                                                            </div>
                                                            <button type="button" className="bg-slate-900 text-white px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95">
                                                                Submit Review
                                                            </button>
                                                        </form>
                                                    </div>

                                                    {/* Recent Reviews (Empty State) */}
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between items-center">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Reviews</h4>
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">0 total</span>
                                                        </div>
                                                        <div className="h-px bg-slate-100"></div>
                                                        <p className="text-slate-400 font-medium italic text-sm">No reviews yet. Be the first to write a review!</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column (Sidebar) */}
                                            <div className="space-y-6">
                                                {/* Contact Card */}
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
                                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Contact Info</h4>
                                                    <div className="space-y-6">
                                                        {biz.phone && (
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                                    <Phone size={16} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</p>
                                                                    <p className="text-sm font-bold text-slate-900">{biz.phone}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {biz.whatsappNo && (
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500 border border-slate-100">
                                                                    <MessageCircle size={16} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">WhatsApp</p>
                                                                    <p className="text-sm font-bold text-slate-900">{biz.whatsappNo}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Location Card */}
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
                                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Location</h4>
                                                    <div className="space-y-6">
                                                        {biz.address && (
                                                            <div className="flex gap-4">
                                                                <MapPin size={16} className="text-slate-300 mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Address</p>
                                                                    <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                                                        {biz.address}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="space-y-4">
                                                            {biz.assembly && (
                                                                <div className="flex justify-between border-b border-slate-50 pb-3">
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Assembly</p>
                                                                    <p className="text-[11px] font-bold text-slate-900">{biz.assembly}</p>
                                                                </div>
                                                            )}
                                                            {biz.district && (
                                                                <div className="flex justify-between border-b border-slate-50 pb-3">
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">District</p>
                                                                    <p className="text-[11px] font-bold text-slate-900">{biz.district}</p>
                                                                </div>
                                                            )}
                                                            {biz.pincode && (
                                                                <div className="flex justify-between">
                                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Pincode</p>
                                                                    <p className="text-[11px] font-bold text-slate-900">{biz.pincode}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-rose-600 hover:text-rose-600 transition-all">
                                                            <ExternalLink size={14} /> Open in Maps
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Business Hours Card */}
                                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6">
                                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Business Hours</h4>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Open Days</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(typeof biz.openDays === 'string'
                                                                    ? biz.openDays.split(',')
                                                                    : (Array.isArray(biz.openDays) && biz.openDays.length > 0 ? biz.openDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
                                                                ).map(day => (
                                                                    <span key={day} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black">{day.trim()}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {biz.openTime && (
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Timings</p>
                                                                <div className="text-sm font-bold text-slate-900">{biz.openTime} — {biz.closeTime}</div>
                                                            </div>
                                                        )}
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

                {/* Footer Link */}
                {(!searched || (results && results.length === 0)) && !loading && (
                    <div className="mt-16 text-center space-y-6 max-w-2xl mx-auto">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Don't have a listing yet?</p>
                        <Link
                            to="/add-business"
                            className="inline-flex items-center px-10 py-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] text-slate-900 hover:border-rose-600 hover:text-rose-600 transition-all shadow-xl hover:shadow-2xl shadow-slate-900/5"
                        >
                            Add Your Business
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBusiness;
