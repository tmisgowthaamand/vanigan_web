import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Utensils, Car, HeartPulse, GraduationCap, ShoppingBag, Bed, Monitor, Shield, Zap, DollarSign, Smartphone } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import BusinessCard from '../components/BusinessCard';
import SectionTitle from '../components/SectionTitle';

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
        <main className="bg-white min-h-screen">
            <HeroSection />

            {/* Browse by Category */}
            <section className="py-24 bg-white">
                <div className="container-custom px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-slate-900">Browse by <span className="text-rose-600">Category</span></h2>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Find the right service provider by exploring our top categories.</p>
                        <div className="w-12 h-1 bg-rose-600 mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((cat, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:shadow-2xl hover:border-rose-500/20 group cursor-pointer">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 transition-all group-hover:bg-rose-600 group-hover:text-white group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-rose-600/20">
                                    <cat.icon size={36} strokeWidth={1.5} />
                                </div>
                                <h4 className="font-black text-slate-900 mb-1 uppercase text-sm tracking-tight">{cat.name}</h4>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Businesses */}
            <section className="py-24 bg-slate-50/50">
                <div className="container-custom px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-slate-900">Featured <span className="text-rose-600">Businesses</span></h2>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Hand-picked verified businesses that offer premium services.</p>
                        <div className="w-12 h-1 bg-rose-600 mx-auto mt-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {featured.map(biz => (
                            <BusinessCard key={biz.id} business={biz} />
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/business-list" className="inline-flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10">
                            View All Directory Listings
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Vanigan */}
            <section className="py-24">
                <div className="container-custom">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black mb-4">Why Choose Vanigan?</h2>
                        <p className="text-slate-500">We are more than just a directory; we are your local growth partner.</p>
                        <div className="w-12 h-1 bg-primary mx-auto mt-4" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: 'Verified Listings', icon: Shield, desc: 'Every business listed on our platform undergoes a verification process to ensure authenticity.' },
                            { title: 'Easy to Find', icon: Zap, desc: 'Our advanced filter and search system makes it incredibly easy to find businesses in your local area.' },
                            { title: 'Free to List', icon: DollarSign, desc: 'We support small businesses by allowing them to list their basic services absolutely free of cost.' }
                        ].map((item, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-20 h-20 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mx-auto mb-8 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                    <item.icon size={36} />
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile App CTA Section */}
            <section className="py-20 mb-20">
                <div className="container-custom">
                    <div className="bg-[#1e293b] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Manage Your Business On The Go</h2>
                        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">Download the Vanigan AI app to manage your listings, respond to inquiries, and track your business growth from anywhere.</p>

                        <div className="flex justify-center">
                            <a
                                href="https://play.google.com/store/apps/details?id=io.vanigan.ai&pcampaignid=web_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-all hover:scale-110 active:scale-95"
                            >
                                <img
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                    alt="Get it on Google Play"
                                    className="h-20 w-auto"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
