import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Utensils, Car, HeartPulse, GraduationCap, ShoppingBag, Bed, Monitor, Shield, Zap, DollarSign, ArrowUpRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import BusinessCard from '../components/BusinessCard';

const Home = () => {
    const categories = [
        { name: 'Transport', icon: Truck, count: '1.2k+ Listings' },
        { name: 'Restaurants', icon: Utensils, count: '3.4k+ Listings' },
        { name: 'Auto Services', icon: Car, count: '800+ Listings' },
        { name: 'Healthcare', icon: HeartPulse, count: '1.5k+ Listings' },
        { name: 'Education', icon: GraduationCap, count: '900+ Listings' },
        { name: 'Retail', icon: ShoppingBag, count: '5.6k+ Listings' },
        { name: 'Hotels', icon: Bed, count: '600+ Listings' },
        { name: 'IT Services', icon: Monitor, count: '1.1k+ Listings' },
        { name: 'Business', icon: Shield, count: '500+ Listings' },
    ];

    const featured = [
        { id: 1, name: "Golden Transport Services", category: "Transport", rating: 4.8, address: "12, GST Road, Tambaram, Chennai", icon: "G" },
        { id: 2, name: "Spice Garden Restaurant", category: "Restaurants", rating: 4.5, address: "45, Main Road, Anna Nagar, Chennai", icon: "S" },
        { id: 3, name: "Elite Auto Care", category: "Auto Services", rating: 4.2, address: "22, Industrial Estate, Guindy, Chennai", icon: "E" },
        { id: 4, name: "Aruna Multispeciality Clinic", category: "Healthcare", rating: 4.9, address: "8, Surya Avenue, Chrompet, Chennai", icon: "A" },
        { id: 5, name: "Future Tech Solutions", category: "IT Services", rating: 4.7, address: "Siruseri IT Park, Chennai", icon: "F" },
        { id: 6, name: "Oceanic Grand Hotel", category: "Hotels", rating: 4.4, address: "Marina Beach Road, Chennai", icon: "O" },
    ];

    return (
        <main className="bg-paper min-h-screen">
            <HeroSection />

            {/* Browse by Category */}
            <section className="py-20 md:py-24">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <p className="eyebrow mb-4">Explore the directory</p>
                            <h2 className="display-head text-4xl md:text-5xl text-ink">Browse by category</h2>
                        </div>
                        <p className="text-ink-2 text-sm max-w-sm md:text-right">
                            Find the right provider by exploring the categories businesses list under.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                to={`/business-list?category=${encodeURIComponent(cat.name)}`}
                                className="bg-paper p-6 md:p-8 flex items-start gap-4 group transition-colors hover:bg-paper-2"
                            >
                                <div className="w-12 h-12 rounded-xl bg-paper-2 flex items-center justify-center text-ink-2 shrink-0 transition-colors group-hover:bg-ink group-hover:text-paper">
                                    <cat.icon size={22} strokeWidth={1.6} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-ink text-base leading-tight group-hover:text-accent transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{cat.name}</h4>
                                    <p className="text-[12px] text-ink-3 mt-1">{cat.count}</p>
                                </div>
                                <ArrowUpRight size={16} className="text-ink-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Businesses */}
            <section className="py-20 md:py-24 bg-paper-2/60 border-y border-line">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <p className="eyebrow mb-4">Hand-picked</p>
                            <h2 className="display-head text-4xl md:text-5xl text-ink">Featured businesses</h2>
                        </div>
                        <Link to="/business-list" className="text-[13px] font-medium text-ink hover:text-accent transition-colors inline-flex items-center gap-2">
                            View all listings <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map(biz => (
                            <BusinessCard key={biz.id} business={biz} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Vanigan */}
            <section className="py-20 md:py-24">
                <div className="container-custom">
                    <div className="mb-14 max-w-2xl">
                        <p className="eyebrow mb-4">What you get</p>
                        <h2 className="display-head text-4xl md:text-5xl text-ink mb-4">More than a directory</h2>
                        <p className="text-ink-2">We are your local growth partner — built to help businesses get found and customers find them.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
                        {[
                            { num: '01', title: 'Verified listings', icon: Shield, desc: 'Every business listed undergoes a verification process to ensure authenticity.' },
                            { num: '02', title: 'Easy to find', icon: Zap, desc: 'Our search and filter system makes it simple to find businesses in your local area.' },
                            { num: '03', title: 'Free to list', icon: DollarSign, desc: 'We support small businesses by letting them list their basic services free of cost.' }
                        ].map((item, i) => (
                            <div key={i} className="bg-paper p-8 md:p-10 group">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-paper-2 flex items-center justify-center text-ink transition-colors group-hover:bg-accent group-hover:text-white">
                                        <item.icon size={22} strokeWidth={1.6} />
                                    </div>
                                    <span className="text-[13px] font-medium text-ink-3 tabular-nums">{item.num}</span>
                                </div>
                                <h4 className="text-xl font-medium text-ink mb-3" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h4>
                                <p className="text-ink-2 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile App CTA */}
            <section className="pb-24">
                <div className="container-custom">
                    <div className="bg-ink rounded-3xl px-8 py-14 md:p-16 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-72 h-72 bg-accent/15 rounded-full blur-3xl" />
                        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <p className="eyebrow text-paper/60 mb-5">Vanigan AI app</p>
                                <h2 className="display-head text-3xl md:text-4xl text-paper mb-4">Manage your business on the go</h2>
                                <p className="text-paper/60 text-base max-w-md">
                                    Manage listings, respond to inquiries, and track your growth from anywhere.
                                </p>
                            </div>
                            <div className="lg:justify-self-end">
                                <a
                                    href="https://play.google.com/store/apps/details?id=io.vanigan.ai&pcampaignid=web_share"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block transition-transform hover:scale-105 active:scale-95"
                                >
                                    <img
                                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                        alt="Get it on Google Play"
                                        className="h-16 w-auto"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
