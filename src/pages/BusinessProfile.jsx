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
                <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl max-w-md border border-slate-100">
                    <AlertCircle size={64} className="text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Business Not Found</h2>
                    <p className="text-slate-500 font-bold mb-8">{error || 'The business record could not be retrieved.'}</p>
                    <button
                        onClick={() => navigate('/business-list')}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all"
                    >
                        Return to Directory
                    </button>
                </div>
            </div>
        );
    }

    // Mapping actual API fields to local variables
    const {
        name, category, subCategory, phone, phone2, address,
        district, landmark, assembly, pincode, email,
        description, website, avgRating, reviewCount,
        listingCode, image, coverImage, galleryImages = [],
        services = [], fbLink, twitterLink, instaLink, googleMap, videoUrl,
        openTime, closeTime, openDays = ""
    } = business;

    // Convert comma-separated string to array for opening days
    const activeDays = typeof openDays === 'string' ? openDays.split(',').map(d => d.trim()) : [];

    return (
        <main className="bg-slate-50/30 min-h-screen pb-32">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 pt-24 mb-10 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-600 rounded-2xl shadow-sm hover:text-rose-600 transition-all font-black text-[10px] uppercase tracking-widest group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleShare}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all shadow-sm border border-slate-50 group"
                        title="Share Profile"
                    >
                        <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Profile Frame (Aligning with 2nd & 3rd screenshot) */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
                    {/* Hero Banner */}
                    <div className="h-80 lg:h-96 relative overflow-hidden bg-slate-50 border-b border-slate-100">
                        {coverImage ? (
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-200">
                                <LayoutGrid size={64} strokeWidth={1} />
                                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]">No Banner Available</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>

                    {/* Logo Hub */}
                    <div className="px-10 lg:px-16 -mt-20 lg:-mt-24 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="flex flex-col lg:flex-row lg:items-end gap-10">
                                <div className="w-36 h-36 lg:w-44 lg:h-44 bg-white rounded-[2.5rem] p-4 shadow-2xl border border-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                    {image ? (
                                        <img src={image} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-5xl">🏢</div>
                                    )}
                                </div>
                                <div className="pb-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                                            {name}
                                        </h1>
                                        <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={18} fill={i < (avgRating || 0) ? "currentColor" : "none"} strokeWidth={i < (avgRating || 0) ? 0 : 2} />
                                            ))}
                                            <span className="ml-2 font-black text-slate-900">{avgRating || 0}</span>
                                            <span className="text-slate-400 font-bold ml-1">({reviewCount || 0} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-black text-[11px] uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                            <span className="text-rose-600">{category}</span>
                                            {subCategory && <><div className="w-1 h-1 rounded-full bg-slate-300" /> <span>{subCategory}</span></>}
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span className="text-slate-900 tracking-tighter">#{listingCode || `LIST${id.substring(0, 6).toUpperCase()}`}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 pb-4">
                                <a href={`https://wa.me/${cleanPhone(phone)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-10 py-5 bg-[#0f172a] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-xl hover:-translate-y-1">
                                    <MessageCircle size={20} /> WhatsApp
                                </a>
                                <a href={`tel:${cleanPhone(phone)}`} className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:border-rose-400 hover:text-rose-600 transition-all shadow-sm hover:-translate-y-1">
                                    <Phone size={20} /> Call
                                </a>
                                <button onClick={() => window.open(googleMap || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`, '_blank')} className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm hover:-translate-y-1">
                                    <Navigation size={20} /> Directions
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-10" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
                {/* Main Content (8 cols) */}
                <div className="lg:col-span-8 space-y-12">
                    {/* About section */}
                    <section className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                            About <div className="h-px bg-slate-100 flex-1"></div>
                        </h2>
                        <p className="text-slate-500 font-bold leading-[1.8] whitespace-pre-wrap text-lg">
                            {description || `${name} is an established destination for ${category} in ${district}. We offer professional services tailored to community needs with a focus on quality and consistency.`}
                        </p>
                    </section>

                    {/* Services Section */}
                    {(services && services.length > 0) && (
                        <section className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                                Services & Pricing <div className="h-px bg-slate-100 flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {services.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-100 group transition-all hover:bg-white hover:shadow-2xl hover:border-rose-100">
                                        <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                                            {item.photo ? <img src={item.photo} className="w-full h-full object-cover" alt={item.name} /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><LayoutGrid size={24} /></div>}
                                        </div>
                                        <div className="flex-1 justify-center flex flex-col">
                                            <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2">{item.name}</h4>
                                            <p className="text-rose-600 font-black text-xl">₹ {item.price}</p>
                                            <p className="text-[10px] text-slate-400 font-black mt-3 uppercase tracking-widest leading-relaxed">{item.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Gallery Section - Using Correct DB Field galleryImages */}
                    {(galleryImages && galleryImages.length > 0) && (
                        <section className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                                Gallery ({galleryImages.length}) <div className="h-px bg-slate-100 flex-1"></div>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-50 group cursor-pointer relative shadow-sm">
                                        <img src={img.url || img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Review Section */}
                    <section className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-5">
                            Reviews & Ratings <div className="h-px bg-slate-100 flex-1"></div>
                        </h2>

                        <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 mb-12 shadow-inner">
                            <h3 className="text-xl font-black text-slate-900 mb-2">Write a Review</h3>
                            <p className="text-sm font-bold text-slate-400 mb-10">Share your experience with this business. Your review helps others make better decisions.</p>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-2">Your Name *</label>
                                        <input type="text" placeholder="e.g. John Doe" className="w-full bg-white border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-900 outline-none focus:border-rose-400 shadow-sm" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-2">Rating *</label>
                                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} type="button" onClick={() => setRating(star)} className={`transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-slate-200'}`}>
                                                    <Star size={24} fill={rating >= star ? "currentColor" : "none"} strokeWidth={rating >= star ? 0 : 2} />
                                                </button>
                                            ))}
                                            <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest">Select rating</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-2">Review Text (Optional)</label>
                                    <textarea rows={4} placeholder="Tell us what you liked or how they can improve..." className="w-full bg-white border border-slate-200 rounded-2xl p-8 text-sm font-bold text-slate-900 outline-none focus:border-rose-400 shadow-sm resize-none" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 pl-2">Your Phone (Optional)</label>
                                    <input type="text" value={phone || ''} readOnly placeholder="e.g. 9876543210" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-5 text-sm font-bold text-slate-400 outline-none cursor-not-allowed" title="System uses registered phone for verification" />
                                </div>

                                <button type="button" className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-rose-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95">
                                    Submit Review
                                </button>
                            </form>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Reviews</h3>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-5 py-2 rounded-full">{reviewCount || 0} TOTAL</span>
                        </div>
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">No reviews yet. Be the first to write a review!</p>
                        </div>
                    </section>
                </div>

                {/* Sidebar area (4 cols) */}
                <aside className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-28">
                    {/* Primary Sidebar Card */}
                    <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
                        {/* Contact */}
                        <section>
                            <h4 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
                                Contact <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Primary Phone</p>
                                        <p className="text-sm font-black text-slate-900 tracking-widest">{phone}</p>
                                    </div>
                                </div>
                                {phone2 && (
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                            <Phone size={18} strokeWidth={1} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Alt Phone</p>
                                            <p className="text-sm font-black text-slate-900 tracking-widest">{phone2}</p>
                                        </div>
                                    </div>
                                )}
                                {email && (
                                    <div className="flex items-center gap-5 overflow-hidden">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Address</p>
                                            <p className="text-sm font-black text-slate-900 truncate lowercase">{email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Location */}
                        <section>
                            <h4 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
                                Location <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-50 shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Address</p>
                                        <p className="text-[13px] font-bold text-slate-600 leading-relaxed">{address}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10 pl-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Assembly</p>
                                        <p className="text-sm font-black text-slate-900">{assembly}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">District</p>
                                        <p className="text-sm font-black text-slate-900">{district}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pincode</p>
                                        <p className="text-sm font-black text-slate-900 tracking-widest">{pincode}</p>
                                    </div>
                                </div>

                                <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`, '_blank')} className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10">
                                    <MapIcon size={18} /> Open in Maps
                                </button>
                            </div>
                        </section>

                        {/* Hours */}
                        <section>
                            <h4 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
                                Business Hours <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="space-y-8">
                                <div className="flex flex-wrap gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                                        const isChecked = activeDays.some(ad => ad.toLowerCase() === day.toLowerCase());
                                        return (
                                            <div key={day} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors ${isChecked ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50/50 border-slate-100 text-slate-300'}`}>
                                                {day}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                                    <Clock size={20} className="text-slate-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Timing</p>
                                        <p className="text-[13px] font-black text-slate-900 tracking-widest uppercase">{openTime || '09:00'} — {closeTime || '18:00'}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Social Media */}
                        <section>
                            <h4 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-4">
                                Social & Media <div className="h-px bg-slate-100 flex-1"></div>
                            </h4>
                            <div className="flex flex-wrap gap-4">
                                <SocialButton icon={ExternalLink} label="Facebook" url={fbLink} />
                                <SocialButton icon={ExternalLink} label="Twitter" url={twitterLink} />
                                <SocialButton icon={LinkIcon} label="Instagram" url={instaLink} />
                                <SocialButton icon={Video} label="Video" url={videoUrl} />
                                <SocialButton icon={MapIcon} label="G Map" url={googleMap} />
                            </div>
                        </section>
                    </div>
                </aside>
            </div>
        </main>
    );
};

const SocialButton = ({ icon: Icon, label, url }) => {
    if (!url) {
        return (
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50/50 text-slate-300 rounded-2xl border border-slate-100 opacity-50 grayscale cursor-not-allowed">
                <Icon size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
        );
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all group shadow-sm flex-1 min-w-[45%]">
            <Icon size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </a>
    );
};

export default BusinessProfile;
