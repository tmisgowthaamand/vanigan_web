import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MapPin } from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-ink text-paper pt-20 pb-10">
            <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
                    {/* Brand & Contact */}
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img src="https://vanigan.org/front/images/home/tnvslogo.png" alt="Vanigan Logo" className="h-10 w-auto transition-transform group-hover:scale-105" />
                            <span className="text-2xl font-medium text-paper tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Vanigan</span>
                        </Link>

                        <p className="text-paper/50 text-sm leading-relaxed max-w-xs">
                            Tamil Nadu's complete business directory — connecting people with trusted local services.
                        </p>

                        <div className="flex items-start gap-3">
                            <PhoneCall size={16} className="text-accent mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[11px] text-paper/40 uppercase tracking-[0.18em] mb-0.5">24×7 Support</p>
                                <p className="text-sm font-medium text-paper">+91 8680085737</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                            <p className="text-[13px] text-paper/50 leading-relaxed max-w-xs">
                                26N, Bharathi Nagar, Near Palayapudur, Periyanaickenpalayam, Coimbatore, Tamil Nadu - 641020
                            </p>
                        </div>
                    </div>

                    {/* Know Us */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-paper/40 uppercase tracking-[0.2em] mb-5">Know Us</h4>
                        <ul className="space-y-3">
                            {['About Us', 'Contact Us', 'Categories', 'Request a Listing'].map(text => (
                                <li key={text}>
                                    <Link to={`/${text.toLowerCase().replace(/\s+/g, '-')}`} className="text-[13px] text-paper/60 hover:text-accent transition-colors">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Useful Link */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-paper/40 uppercase tracking-[0.2em] mb-5">Useful Links</h4>
                        <ul className="space-y-3">
                            {['Directory Policy', 'Returns & Refunds', 'Terms & Conditions', 'Privacy Policy'].map(text => (
                                <li key={text}>
                                    <Link to={`/${text.toLowerCase().replace(/\s+/g, '-')}`} className="text-[13px] text-paper/60 hover:text-accent transition-colors">
                                        {text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Information */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-paper/40 uppercase tracking-[0.2em] mb-5">Information</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-[13px] text-paper/60 hover:text-accent transition-colors">Home</Link></li>
                            <li><Link to="/my-business" className="text-[13px] text-paper/60 hover:text-accent transition-colors">My Business</Link></li>
                            <li><Link to="/business-list" className="text-[13px] text-paper/60 hover:text-accent transition-colors">Business List</Link></li>
                        </ul>
                    </div>

                    {/* Social + App */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-paper/40 uppercase tracking-[0.2em] mb-5">Connect</h4>
                        <div className="flex gap-2.5 mb-6">
                            {[
                                { Icon: FaFacebookF, url: 'https://www.facebook.com/vanigan.org' },
                                { Icon: FaXTwitter, url: 'https://x.com/vaniganconnect?lang=ar-x-fm' },
                                { Icon: FaInstagram, url: 'https://www.instagram.com/tnvs2020' },
                                { Icon: FaYoutube, url: 'https://www.youtube.com/channel/UCGGPiZyq4RAOEeohzYhfmfg' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 bg-paper/5 rounded-lg flex items-center justify-center text-paper/60 hover:bg-accent hover:text-white transition-all border border-paper/10"
                                    aria-label="social link"
                                >
                                    <social.Icon size={15} />
                                </a>
                            ))}
                        </div>
                        <a
                            href="https://play.google.com/store/apps/details?id=io.vanigan.ai&pcampaignid=web_share"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-transform hover:scale-105 active:scale-95"
                        >
                            <img
                                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                alt="Get it on Google Play"
                                className="h-12 w-auto object-contain -ml-1"
                            />
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-paper/10 flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <p className="text-[12px] text-paper/40">© 2026 Vanigan.org. All rights reserved.</p>
                    <p className="text-[12px] text-paper/40">Made in Tamil Nadu</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
