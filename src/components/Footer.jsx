import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MapPin, Smartphone } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand & Contact */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link to="/" className="flex items-center gap-4 group mb-6">
                            <img src="https://vanigan.org/front/images/home/tnvslogo.png" alt="Vanigan Logo" className="h-12 w-auto transition-transform group-hover:scale-105" />
                            <span className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-rose-600 transition-colors">Vanigan</span>
                        </Link>

                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-rose-600 border border-white/10 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0">
                                <PhoneCall size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">24x7 Hours Customer Support</p>
                                <p className="text-sm font-black text-white">+91 8680085737</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Address</p>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                26N, Bharathi Nagar, Near Palayapudur, Periyanaickenpalayam, Coimbatore, Tamil Nadu - 641020
                            </p>
                        </div>
                    </div>

                    {/* Know Us */}
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-rose-600/30 pb-4 inline-block">Know Us</h4>
                        <ul className="space-y-4">
                            {['About Us', 'Contact Us', 'Categories', 'Request a Listing'].map(text => (
                                <li key={text}>
                                    <Link to={`/${text.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Useful Link */}
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-rose-600/30 pb-4 inline-block">Useful Link</h4>
                        <ul className="space-y-4">
                            {['Directory Policy', 'Returns & Refunds', 'Terms & Conditions', 'Privacy Policy'].map(text => (
                                <li key={text}>
                                    <Link to={`/${text.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Circle */}
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-rose-600/30 pb-4 inline-block">Our Social Circle</h4>
                        <div className="flex gap-4 mb-10">
                            {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-600 hover:text-white transition-all border border-white/10">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">We are in Play Store</p>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://play.google.com/store/apps/details?id=io.vanigan.ai&pcampaignid=web_share"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-all hover:scale-105 active:scale-95 flex"
                                >
                                    <img
                                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                        alt="Get it on Google Play"
                                        className="h-14 w-auto object-contain -ml-2"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-8 border-b border-rose-600/30 pb-4 inline-block">Information</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">Home</Link></li>
                            <li><Link to="/my-business" className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors">My Business</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2026 Vanigan.org. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
