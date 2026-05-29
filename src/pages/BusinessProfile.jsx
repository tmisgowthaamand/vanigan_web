import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin, Phone, MessageCircle, Navigation, ChevronLeft,
    Share2, Star, LayoutGrid, Clock, Mail, Globe,
    AlertCircle, Loader2, Map as MapIcon, Send,
    Video, Play, ExternalLink, Link as LinkIcon, Info
} from 'lucide-react';
import { businessService } from '../services/api';

const BusinessProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);

    const handleShare = async () => {
        try {
            if (navigator.share) {
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
            console.error('Error sharing:', err);
        }
    };

    const cleanPhone = (p) => p ? p.replace(/\s+/g, '').replace(/[^\d+]/g, '') : '';

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                setLoading(true);
                const data = await businessService.getById(id);
                setBusiness(data);
            } catch (err) {
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-rose-600 animate-spin" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Premium Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 sm:p-12 bg-white rounded-[2rem] sm:rounded-[3rem] shadow-xl max-w-md mx-4 border border-slate-100">
                    <AlertCircle size={64} className="text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Business Not Found</h2>
                    <p className="text-slate-500 font-bold mb-8">{error || 'The business record could not be retrieved.'}</p>
                    <button
                        onClick={() => navigate('/business-list')}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all w-full"
                    >
                        Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    const {
        name, category, subCategory, phone, phone2, address,
        district, landmark, assembly, pincode, email,
        description, website, avgRating, reviewCount,
        listingCode, image, coverImage, galleryImages = [],
        services = [], fbLink, twitterLink, instaLink, googleMap, videoUrl,
        openTime, closeTime, openDays = ""
    } = business;

    const activeDays = typeof openDays === 'string' ? openDays.split(',').map(d => d.trim()) : [];

    return (
        <main className="bg-slate-50/30 min-h-screen pb-20 sm:pb-32 overflow-x-hidden">
            {/* Navigation Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 mb-6 sm:mb-10 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl sm:rounded-2xl shadow-sm hover:text-rose-600 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <button
                    onClick={handleShare}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all shadow-sm border border-slate-50 group"
                >
                    <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                </button>
            </div>

            {/* Profile Frame Center Hub */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
                <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                    {/* Hero Banner with Auto-Alignment */}
                    <div className="h-56 sm:h-80 lg:h-96 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover object-center transition-opacity duration-500"
                                style={{ imageRendering: 'auto' }}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                <LayoutGrid size={48} strokeWidth={1} />
                                <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em]">No Banner Available</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Meta Hub - Flex Column on Mobile, Row on Desktop */}
                    <div className="px-6 sm:px-10 lg:px-16 -mt-16 sm:-mt-20 lg:-mt-24 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
                                <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-44 lg:h-44 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-4 shadow-2xl border border-slate-50 flex items-center justify-center overflow-hidden shrink-0 mx-auto sm:mx-0">
                                    {image ? (
                                        <img src={image} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-4xl sm:text-5xl">🏢</div>
                                    )}
                                </div>
                                <div className="pb-2 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                            {name}
                                        </h1>
                                        <span className="mx-auto sm:mx-0 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 w-fit">
                                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill={i < (avgRating || 0) ? "currentColor" : "none"} strokeWidth={i < (avgRating || 0) ? 0 : 2} />
                                            ))}
                                            <span className="ml-1 font-black text-slate-900">{avgRating || 0}</span>
                                            <span className="text-slate-400 font-bold ml-1">({reviewCount || 0})</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 font-black text-[9px] sm:text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-slate-100">
                                            <span className="text-rose-600">{category}</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-slate-900 tracking-tighter">#{listingCode || 'LISTING'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-wrap gap-3 sm:gap-4 pb-4">
                                <a href={`https://wa.me/${cleanPhone(phone)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0f172a] text-white rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg hover:-translate-y-1">
                                    <MessageCircle size={18} /> WhatsApp
                                </a>
                                <a href={`tel:${cleanPhone(phone)}`} className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-rose-400 hover:text-rose-600 transition-all shadow-sm hover:-translate-y-1">
                                    <Phone size={18} /> Call
                                </a>
                                <button onClick={() => window.open(googleMap || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`, '_blank')} className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm hover:-translate-y-1">
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
                    <section className="bg-white p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                            About <div className="h-px bg-slate-100 flex-1"></div>
                        </h2>
                        <p className="text-slate-500 font-bold leading-[1.8] whitespace-pre-wrap text-[15px] sm:text-lg">
                            {description || `${name} is an established destination for ${category} in ${district}. We offer professional services tailored to community needs with a focus on quality and consistency.`}
                        </p>
                    </section>

                    {/* Services Grid - Dynamic auto-alignment */}
                    {(services && services.length > 0) && (
                        <section className="bg-white p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                Services & Pricing <div className="h-px bg-slate-100 flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {services.map((item, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-5 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                                        <div className="w-full sm:w-24 h-48 sm:h-24 bg-white rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                                            {item.photo ? <img src={item.photo} className="w-full h-full object-cover" alt={item.name} /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><LayoutGrid size={24} /></div>}
                                        </div>
                                        <div className="flex-1 justify-center flex flex-col">
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight mb-1 sm:mb-2">{item.name}</h4>
                                            <p className="text-rose-600 font-black text-lg sm:text-xl">₹ {item.price}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest line-clamp-2">{item.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery Hub */}
                    {(galleryImages && galleryImages.length > 0) && (
                        <section className="bg-white p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                                Gallery ({galleryImages.length}) <div className="h-px bg-slate-100 flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-50 group cursor-pointer relative shadow-sm">
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
                    <section className="bg-white p-8 sm:p-12 lg:p-16 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-4">
                            Reviews <div className="h-px bg-slate-100 flex-1"></div>
                        </h2>
                        <div className="bg-slate-50/50 rounded-[2rem] p-6 sm:p-10 border border-slate-100 mb-10">
                            <h3 className="text-lg font-black text-slate-900 mb-2">Leave a Review</h3>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Share your feedback to help others.</p>
                            <form className="space-y-6 sm:space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <input type="text" placeholder="Your Name" className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 text-sm font-bold shadow-sm outline-none focus:border-rose-300" />
                                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button key={star} type="button" onClick={() => setRating(star)} className={`transition-all ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}>
                                                <Star size={18} fill={rating >= star ? "currentColor" : "none"} strokeWidth={rating >= star ? 0 : 2} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea rows={4} placeholder="Your review..." className="w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-sm font-bold shadow-sm outline-none focus:border-rose-300 resize-none" />
                                <button type="button" className="w-full bg-slate-900 text-white p-5 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-600 transition-all shadow-xl">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </section>
                </div>

                {/* Sidebar - Stacks on mobile, sticks on desktop */}
                <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
                    <div className="bg-white p-8 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10 sm:space-y-12">
                        {/* Contact Hub */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Contact <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-4 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                                        <p className="text-sm font-black text-slate-900 tracking-widest">{phone}</p>
                                    </div>
                                </div>
                                {email && (
                                    <div className="flex items-center gap-4 sm:gap-5 overflow-hidden">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                            <Mail size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                                            <p className="text-sm font-black text-slate-900 truncate">{email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Location Details */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Location <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex items-start gap-4 sm:gap-5">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-50 shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <p className="text-[12px] sm:text-[13px] font-bold text-slate-600 leading-relaxed pt-1">{address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pl-1 animate-in fade-in slide-in-from-bottom-2">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Assembly</p>
                                        <p className="text-[12px] sm:text-sm font-black text-slate-900">{assembly}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">District</p>
                                        <p className="text-[12px] sm:text-sm font-black text-slate-900">{district}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Timing Grid */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Hours <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-6 sm:space-y-8">
                                <div className="flex flex-wrap gap-1.5">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const isChecked = activeDays.some(ad => ad.toLowerCase() === day.toLowerCase());
                                        return (
                                            <div key={day} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors border ${isChecked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50/50 border-slate-100 text-slate-300'}`}>
                                                {day}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <Clock size={16} className="text-slate-400" />
                                    <p className="text-[12px] font-black text-slate-900 tracking-widest uppercase">{openTime || '09:00'} — {closeTime || '18:00'}</p>
                                </div>
                            </div>
                        </section>

                        {/* Social Connects */}
                        <section>
                            <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 mb-6 sm:mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                                Links <div className="h-px bg-slate-100 flex-1"></div>
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
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            <Icon size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </a>
    );
};

export default BusinessProfile;
